class Ride:
    def __init__(self, db, user_email, pickup_location, drop_location, ride_time, seats):
        self.db = db
        self.user_email = user_email
        self.pickup_location = pickup_location
        self.drop_location = drop_location
        self.ride_time = ride_time
        self.seats = seats

    def save(self):
        self.db.rides.insert_one({
            "user_email": self.user_email,
            "pickup_location": self.pickup_location,
            "drop_location": self.drop_location,
            "ride_time": self.ride_time,
            "seats": self.seats,
            "status": "pending"
        })
