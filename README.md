# Student Ride-Sharing Platform 🚗

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.2%2B-black?style=for-the-badge&logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green?style=for-the-badge&logo=mongodb)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

A full-featured web application built to connect students for safe and convenient carpooling. This platform allows users to offer available seats in their vehicle or find rides shared by others, fostering a community-driven transportation solution.

</div>

---

## 🌟 Key Features

* **Secure User Authentication**: Robust user registration and login system with persistent sessions.
* **Dynamic Ride Management**:
    * **Offer Rides**: Users can post ride offers with details like destination, and number of available seats.
    * **Request Rides**: Users can post ride requests specifying pickup, drop-off, and time.
* **Centralized Ride Board**: A comprehensive dashboard to view, search, and filter all available ride offers and requests.
* **One-Click Booking**: Seamlessly book an available seat on any offered ride.
* **User-Centric Dashboard**: A personalized space for users to manage their activities.

---

## 💻 Technology Stack

This project leverages a modern and powerful tech stack for a robust and scalable application.

* **Backend**: **Python** with the **Flask** micro-framework.
* **Database**: **MongoDB**, a NoSQL database for flexible and scalable data storage, accessed via **PyMongo**.
* **Authentication**: **Flask-Login** for handling user sessions and route protection.
* **Frontend**: Dynamic HTML rendered with the **Jinja2** templating engine.



---

## 🚀 Getting Started Guide

Follow these steps to set up the project locally for development and testing.

### Prerequisites

* Python 3.9+
* Git Version Control
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account or a local MongoDB server instance.

### Installation & Configuration

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/shaikhaseeb-dev/Student-ride-sharing-web.git](https://github.com/shaikhaseeb-dev/Student-ride-sharing-web.git)
    cd Student-ride-sharing-web
    ```

2.  **Set Up a Python Virtual Environment**
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies**
    A `requirements.txt` file is included to streamline installation.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**
    For security, the application configuration is managed through environment variables. Create a file named `.env` in the project's root directory.

    Copy the contents of `.env.example` (if provided) or use the template below:
    ```ini
    # .env file
    SECRET_KEY='generate-a-strong-random-secret-key-here'
    MONGO_URI='your-mongodb-atlas-connection-string'
    ```

    <details>
    <summary>Click here for help finding your MONGO_URI</summary>

    1.  Log into your MongoDB Atlas account.
    2.  Navigate to your cluster and click the **"Connect"** button.
    3.  Select **"Connect your application"**.
    4.  Choose the **Python** driver and the latest version.
    5.  Copy the connection string provided.
    6.  **Important**: Replace `<password>` in the string with your database user's password and ensure your database name is included. Also, make sure your current IP is whitelisted under "Network Access".
    </details>

### ▶️ Launch the Application

Once your `.env` file is configured, you can start the Flask development server:
```bash
flask run
# Or use: python app.py

