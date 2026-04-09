import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.products.delete_many({})
    await db.users.delete_many({})
    await db.cart.delete_many({})
    await db.orders.delete_many({})
    print("Cleared existing data")
    
    # Seed Categories
    categories = [
        {
            "id": "cat-1",
            "name_en": "Seeds",
            "name_hi": "बीज",
            "icon": "🌱"
        },
        {
            "id": "cat-2",
            "name_en": "Tools",
            "name_hi": "औजार",
            "icon": "🔧"
        },
        {
            "id": "cat-3",
            "name_en": "Fertilizers",
            "name_hi": "उर्वरक",
            "icon": "🌾"
        },
        {
            "id": "cat-4",
            "name_en": "Pesticides",
            "name_hi": "कीटनाशक",
            "icon": "🛡️"
        },
        {
            "id": "cat-5",
            "name_en": "Irrigation",
            "name_hi": "सिंचाई",
            "icon": "💧"
        },
        {
            "id": "cat-6",
            "name_en": "Machinery",
            "name_hi": "मशीनरी",
            "icon": "🚜"
        },
        {
            "id": "cat-7",
            "name_en": "Organic",
            "name_hi": "जैविक",
            "icon": "🌿"
        }
    ]
    
    await db.categories.insert_many(categories)
    print(f"Seeded {len(categories)} categories")
    
    # Seed Products
    products = [
        # Seeds
        {
            "id": "prod-1",
            "name_en": "Wheat Seeds Premium",
            "name_hi": "गेहूं के बीज प्रीमियम",
            "description_en": "High-quality wheat seeds with 95% germination rate. Suitable for all soil types.",
            "description_hi": "95% अंकुरण दर के साथ उच्च गुणवत्ता वाले गेहूं के बीज। सभी प्रकार की मिट्टी के लिए उपयुक्त।",
            "price": 450.00,
            "category_id": "cat-1",
            "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
            "stock": 100,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        {
            "id": "prod-2",
            "name_en": "Rice Seeds Basmati",
            "name_hi": "बासमती चावल के बीज",
            "description_en": "Premium Basmati rice seeds. Aromatic long grain variety.",
            "description_hi": "प्रीमियम बासमती चावल के बीज। सुगंधित लंबे दाने की किस्म।",
            "price": 850.00,
            "category_id": "cat-1",
            "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
            "stock": 75,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        {
            "id": "prod-3",
            "name_en": "Tomato Seeds Hybrid",
            "name_hi": "टमाटर के बीज संकर",
            "description_en": "Hybrid tomato seeds resistant to diseases. High yield variety.",
            "description_hi": "रोग प्रतिरोधी संकर टमाटर के बीज। उच्च उपज वाली किस्म।",
            "price": 120.00,
            "category_id": "cat-1",
            "image": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80",
            "stock": 150,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        # Tools
        {
            "id": "prod-4",
            "name_en": "Garden Hoe Premium",
            "name_hi": "बगीचा फावड़ा प्रीमियम",
            "description_en": "Durable steel garden hoe with comfortable wooden handle.",
            "description_hi": "आरामदायक लकड़ी के हैंडल के साथ टिकाऊ स्टील गार्डन फावड़ा।",
            "price": 350.00,
            "category_id": "cat-2",
            "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
            "stock": 50,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        {
            "id": "prod-5",
            "name_en": "Pruning Shears Professional",
            "name_hi": "छंटाई कैंची पेशेवर",
            "description_en": "Professional grade pruning shears for clean cuts. Rust resistant.",
            "description_hi": "साफ कट के लिए पेशेवर ग्रेड छंटाई कैंची। जंग प्रतिरोधी।",
            "price": 450.00,
            "category_id": "cat-2",
            "image": "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&q=80",
            "stock": 60,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        # Fertilizers
        {
            "id": "prod-6",
            "name_en": "NPK Fertilizer 10kg",
            "name_hi": "एनपीके उर्वरक 10 किलो",
            "description_en": "Balanced NPK fertilizer for all crops. 10kg pack.",
            "description_hi": "सभी फसलों के लिए संतुलित एनपीके उर्वरक। 10 किलो पैक।",
            "price": 650.00,
            "category_id": "cat-3",
            "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
            "stock": 200,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        {
            "id": "prod-7",
            "name_en": "Organic Compost 20kg",
            "name_hi": "जैविक खाद 20 किलो",
            "description_en": "100% organic compost made from natural ingredients.",
            "description_hi": "प्राकृतिक सामग्री से बनी 100% जैविक खाद।",
            "price": 350.00,
            "category_id": "cat-7",
            "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
            "stock": 100,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        # Pesticides
        {
            "id": "prod-8",
            "name_en": "Organic Pesticide 1L",
            "name_hi": "जैविक कीटनाशक 1 लीटर",
            "description_en": "Natural pesticide safe for organic farming. 1 liter bottle.",
            "description_hi": "जैविक खेती के लिए सुरक्षित प्राकृतिक कीटनाशक। 1 लीटर की बोतल।",
            "price": 280.00,
            "category_id": "cat-4",
            "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
            "stock": 80,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        # Irrigation
        {
            "id": "prod-9",
            "name_en": "Drip Irrigation Kit",
            "name_hi": "ड्रिप सिंचाई किट",
            "description_en": "Complete drip irrigation kit for 1000 sq ft area.",
            "description_hi": "1000 वर्ग फुट क्षेत्र के लिए पूर्ण ड्रिप सिंचाई किट।",
            "price": 2500.00,
            "category_id": "cat-5",
            "image": "https://images.unsplash.com/photo-1625246296503-6c14a3d4b03d?w=800&q=80",
            "stock": 30,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        {
            "id": "prod-10",
            "name_en": "Garden Sprinkler",
            "name_hi": "बगीचा छिड़काव",
            "description_en": "Adjustable garden sprinkler with 360-degree rotation.",
            "description_hi": "360 डिग्री रोटेशन के साथ समायोज्य बगीचा छिड़काव।",
            "price": 450.00,
            "category_id": "cat-5",
            "image": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
            "stock": 40,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        # Machinery
        {
            "id": "prod-11",
            "name_en": "Power Tiller 5HP",
            "name_hi": "पावर टिलर 5 एचपी",
            "description_en": "5HP power tiller for small to medium farms. Fuel efficient.",
            "description_hi": "छोटे से मध्यम खेतों के लिए 5 एचपी पावर टिलर। ईंधन कुशल।",
            "price": 45000.00,
            "category_id": "cat-6",
            "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
            "stock": 10,
            "created_at": "2024-01-01T00:00:00+00:00"
        },
        {
            "id": "prod-12",
            "name_en": "Grass Cutter Machine",
            "name_hi": "घास काटने की मशीन",
            "description_en": "Electric grass cutter for gardens and fields.",
            "description_hi": "बगीचों और खेतों के लिए इलेक्ट्रिक घास काटने की मशीन।",
            "price": 8500.00,
            "category_id": "cat-6",
            "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            "stock": 15,
            "created_at": "2024-01-01T00:00:00+00:00"
        }
    ]
    
    await db.products.insert_many(products)
    print(f"Seeded {len(products)} products")
    
    # Create test user
    test_user = {
        "id": "user-test-1",
        "name": "Test User",
        "email": "test@krishikala.com",
        "password": hash_password("Test@123"),
        "created_at": "2024-01-01T00:00:00+00:00"
    }
    
    await db.users.insert_one(test_user)
    print("Created test user: test@krishikala.com / Test@123")
    
    print("Database seeding completed!")


if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()
