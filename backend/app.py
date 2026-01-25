from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)  # allow React frontend
jwt = JWTManager(app)

# ---------- DATABASE ----------
client = MongoClient(app.config["MONGO_URI"])
db = client["rideshare"]
users = db["users"]
rides = db["rides"]
bookings = db["bookings"]

# Ensure unique users
users.create_index([("email", ASCENDING)], unique=True)

# ---------- HELPERS ----------
def is_valid_object_id(id):
    return ObjectId.is_valid(id)

# ---------- AUTH ----------
@app.post("/api/signup")
def signup():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    if users.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 409

    users.insert_one({
        "email": email,
        "password": generate_password_hash(password)
    })

    return jsonify({"msg": "Account created"}), 201


@app.post("/api/login")
def login():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    user = users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=email)
    return jsonify({"access_token": token})


# ---------- RIDES ----------
@app.post("/api/rides")
@jwt_required()
def create_ride():
    user = get_jwt_identity()
    data = request.json or {}

    required_fields = ["pickup", "destination", "time", "seats"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing ride details"}), 400

    rides.insert_one({
        "posted_by": user,
        "pickup": data["pickup"],
        "destination": data["destination"],
        "time": data["time"],
        "seats": int(data["seats"])
    })

    return jsonify({"msg": "Ride created"}), 201


@app.get("/api/rides")
@jwt_required()
def get_rides():
    response = []
    for ride in rides.find():
        ride["_id"] = str(ride["_id"])
        response.append(ride)
    return jsonify(response)


@app.post("/api/book/<ride_id>")
@jwt_required()
def book_ride(ride_id):
    user = get_jwt_identity()

    if not ObjectId.is_valid(ride_id):
        return jsonify({"msg": "Invalid ride ID"}), 400

    ride = rides.find_one({"_id": ObjectId(ride_id)})

    if not ride:
        return jsonify({"msg": "Ride not found"}), 404

    # 🚫 Prevent booking own ride
    if ride["posted_by"] == user:
        return jsonify({"msg": "You cannot book your own ride"}), 403

    if ride["seats"] <= 0:
        return jsonify({"msg": "No seats available"}), 400

    bookings.insert_one({
        "ride_id": ride["_id"],
        "user": user
    })

    rides.update_one(
        {"_id": ride["_id"]},
        {"$inc": {"seats": -1}}
    )

    return jsonify({"msg": "Ride booked"}), 200



# ---------- HEALTH ----------
@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run()
