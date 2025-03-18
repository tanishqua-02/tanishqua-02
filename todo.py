import mysql.connector as mysql

# Establishing Connection
con = mysql.connect(host="localhost", user="root", passwd="wws")
cursor = con.cursor()

# Create Database and Table
cursor.execute("CREATE DATABASE IF NOT EXISTS TODOAPP")
cursor.execute("USE TODOAPP")
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS tb_todo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(50) NOT NULL,
        status ENUM('pending', 'completed') DEFAULT 'pending'
    )
    """
)
print("Database and Table setup complete.")

# Task Management System
while True:
    print("\nTask Management")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        task = input("Enter task: ")
        cursor.execute("INSERT INTO tb_todo (task) VALUES (%s)", (task,))
        con.commit()
        print("✅ Task added successfully!")

    elif choice == "2":
        cursor.execute("SELECT * FROM tb_todo")
        for task in cursor.fetchall():
            print(f"ID: {task[0]}, Task: {task[1]}, Status: {task[2]}")

    elif choice == "3":
        task_id = input("Enter task ID to update: ")
        new_status = input("Enter new status (pending/completed): ")
        cursor.execute("UPDATE tb_todo SET status = %s WHERE id = %s", (new_status, task_id))
        con.commit()
        print("✅ Task updated successfully!")

    elif choice == "4":
        task_id = input("Enter task ID to delete: ")
        cursor.execute("DELETE FROM tb_todo WHERE id = %s", (task_id,))
        con.commit()
        print("✅ Task deleted successfully!")

    elif choice == "5":
        print("Exiting Task Management...")
        break

    else:
        print("Invalid choice. Please try again.")

con.close()
