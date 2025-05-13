class UserDB:
    def __init__(self, db):
        self.db = db

    def create_user(self, name, email, password):
        self.db.users.insert_one({
            "name": name,
            "email": email,
            "password": password
        })

    def find_user_by_email(self, email):
        return self.db.users.find_one({"email": email})
