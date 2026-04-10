from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()


# ==================== MODELS ====================

# User Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    user: User
    token: str

# Category Models
class CategoryCreate(BaseModel):
    name_en: str
    name_hi: str
    icon: str

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_hi: str
    icon: str

# Product Models
class ProductCreate(BaseModel):
    name_en: str
    name_hi: str
    description_en: str
    description_hi: str
    price: float
    category_id: str
    image: str
    stock: int = 100

class ProductUpdate(BaseModel):
    name_en: Optional[str] = None
    name_hi: Optional[str] = None
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    image: Optional[str] = None
    stock: Optional[int] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_hi: str
    description_en: str
    description_hi: str
    price: float
    category_id: str
    image: str
    stock: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Cart Models
class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    quantity: int
    added_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItemWithProduct(BaseModel):
    cart_item: CartItem
    product: Product

# Order Models
class OrderCreate(BaseModel):
    items: List[dict]  # [{product_id, quantity, price}]
    total_amount: float
    shipping_address: str
    payment_method: str = "mock"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[dict]
    total_amount: float
    shipping_address: str
    payment_method: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    """Create a JWT token for a user"""
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "exp": expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> str:
    """Verify a JWT token and return user_id"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency to get current user from JWT token"""
    token = credentials.credentials
    user_id = verify_jwt_token(token)
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_id

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency to verify admin user"""
    token = credentials.credentials
    user_id = verify_jwt_token(token)
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.get('is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user_id


# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Krishi Kala API"}

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email
    )
    
    # Hash password and store
    user_doc = user.model_dump()
    user_doc['password'] = hash_password(user_data.password)
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    
    # Create token
    token = create_jwt_token(user.id)
    
    return UserResponse(user=user, token=token)

@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create user object (without password)
    user_doc.pop('password')
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    user = User(**user_doc)
    
    # Create token
    token = create_jwt_token(user.id)
    
    return UserResponse(user=user, token=token)

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(user_id: str = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)


# ==================== CATEGORY ROUTES ====================

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category_data: CategoryCreate, user_id: str = Depends(get_admin_user)):
    category = Category(**category_data.model_dump())
    await db.categories.insert_one(category.model_dump())
    return category

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, user_id: str = Depends(get_admin_user)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}


# ==================== PRODUCT ROUTES ====================

@api_router.get("/products", response_model=List[Product])
async def get_products(category_id: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    if search:
        query["$or"] = [
            {"name_en": {"$regex": search, "$options": "i"}},
            {"name_hi": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings to datetime objects
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, user_id: str = Depends(get_admin_user)):
    product = Product(**product_data.model_dump())
    product_doc = product.model_dump()
    product_doc['created_at'] = product_doc['created_at'].isoformat()
    await db.products.insert_one(product_doc)
    return product

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate, user_id: str = Depends(get_admin_user)):
    # Get existing product
    existing_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in product_data.model_dump().items() if v is not None}
    
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    # Get updated product
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated_product.get('created_at'), str):
        updated_product['created_at'] = datetime.fromisoformat(updated_product['created_at'])
    
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user_id: str = Depends(get_admin_user)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# ==================== CART ROUTES ====================

@api_router.get("/cart", response_model=List[CartItemWithProduct])
async def get_cart(user_id: str = Depends(get_current_user)):
    cart_items = await db.cart.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    if not cart_items:
        return []
    
    # Extract all product IDs
    product_ids = [item['product_id'] for item in cart_items]
    
    # Fetch all products in one query (optimization: reduces N+1 queries to 2 queries)
    products = await db.products.find({"id": {"$in": product_ids}}, {"_id": 0}).to_list(1000)
    
    # Create product lookup dictionary for O(1) access
    product_map = {p['id']: p for p in products}
    
    # Build result with cart items and their products
    result = []
    for item in cart_items:
        if isinstance(item.get('added_at'), str):
            item['added_at'] = datetime.fromisoformat(item['added_at'])
        
        cart_item = CartItem(**item)
        
        # Get product from map
        product_doc = product_map.get(item['product_id'])
        if product_doc:
            if isinstance(product_doc.get('created_at'), str):
                product_doc['created_at'] = datetime.fromisoformat(product_doc['created_at'])
            product = Product(**product_doc)
            result.append(CartItemWithProduct(cart_item=cart_item, product=product))
    
    return result

@api_router.post("/cart", response_model=CartItem)
async def add_to_cart(item_data: CartItemCreate, user_id: str = Depends(get_current_user)):
    # Check if product exists
    product = await db.products.find_one({"id": item_data.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already in cart
    existing_item = await db.cart.find_one({
        "user_id": user_id,
        "product_id": item_data.product_id
    }, {"_id": 0})
    
    if existing_item:
        # Update quantity
        new_quantity = existing_item['quantity'] + item_data.quantity
        await db.cart.update_one(
            {"id": existing_item['id']},
            {"$set": {"quantity": new_quantity}}
        )
        existing_item['quantity'] = new_quantity
        if isinstance(existing_item.get('added_at'), str):
            existing_item['added_at'] = datetime.fromisoformat(existing_item['added_at'])
        return CartItem(**existing_item)
    else:
        # Create new cart item
        cart_item = CartItem(
            user_id=user_id,
            product_id=item_data.product_id,
            quantity=item_data.quantity
        )
        cart_doc = cart_item.model_dump()
        cart_doc['added_at'] = cart_doc['added_at'].isoformat()
        await db.cart.insert_one(cart_doc)
        return cart_item

@api_router.put("/cart/{cart_item_id}", response_model=CartItem)
async def update_cart_item(cart_item_id: str, update_data: CartItemUpdate, user_id: str = Depends(get_current_user)):
    result = await db.cart.update_one(
        {"id": cart_item_id, "user_id": user_id},
        {"$set": {"quantity": update_data.quantity}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    updated_item = await db.cart.find_one({"id": cart_item_id}, {"_id": 0})
    if isinstance(updated_item.get('added_at'), str):
        updated_item['added_at'] = datetime.fromisoformat(updated_item['added_at'])
    
    return CartItem(**updated_item)

@api_router.delete("/cart/{cart_item_id}")
async def remove_from_cart(cart_item_id: str, user_id: str = Depends(get_current_user)):
    result = await db.cart.delete_one({"id": cart_item_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@api_router.delete("/cart")
async def clear_cart(user_id: str = Depends(get_current_user)):
    await db.cart.delete_many({"user_id": user_id})
    return {"message": "Cart cleared"}


# ==================== ORDER ROUTES ====================

@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, user_id: str = Depends(get_current_user)):
    order = Order(
        user_id=user_id,
        items=order_data.items,
        total_amount=order_data.total_amount,
        shipping_address=order_data.shipping_address,
        payment_method=order_data.payment_method,
        status="completed"  # Mock payment always succeeds
    )
    
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()
    await db.orders.insert_one(order_doc)
    
    # Clear cart after order
    await db.cart.delete_many({"user_id": user_id})
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(user_id: str = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, user_id: str = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": user_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return Order(**order)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
