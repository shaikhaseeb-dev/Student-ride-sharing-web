from flask import Flask, render_template, request, redirect, session, url_for, flash
from pymongo import MongoClient
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from bson import ObjectId

# Initialize Flask app
app = Flask(__name__)

# MongoDB connection
client = MongoClient('mongodb+srv://Rahul:rahul12345@student-ride-sharing.ljvb9.mongodb.net/?retryWrites=true&w=majority&appName=student-ride-sharing')
db = client['rideshare']
users_collection = db['users']
rides_collection = db['rides']

app.secret_key = 'your_secret_key'  # CHANGE THIS SECRET KEY in production

# Flask-Login configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User Class
class User(UserMixin):
    def __init__(self, email, password):
        self.id = email
        self.password = password

@login_manager.user_loader
def load_user(user_id):
    user = users_collection.find_one({"email": user_id})
    if user:
        return User(user['email'], user['password'])
    return None

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users_collection.find_one({"email": email})

        if user and user['password'] == password:
            login_user(User(user['email'], user['password']))
            return redirect(url_for('dashboard'))
        
        flash('Invalid credentials, please try again.')
        return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if users_collection.find_one({"email": email}):
            flash('Email already exists.')
            return redirect(url_for('signup'))

        users_collection.insert_one({"email": email, "password": password})
        flash('Account created successfully. Please log in.')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/request_ride', methods=['GET', 'POST'])
@login_required
def request_ride():
    if request.method == 'POST':
        pickup_location = request.form['pickup_location']
        drop_location = request.form['drop_location']
        ride_time = request.form['ride_time']
        seats = int(request.form.get('seats'))

        ride = {
            'user_email': current_user.id,
            'pickup_location': pickup_location,
            'drop_location': drop_location,
            'ride_time': ride_time,
            'seats': seats,
            'status': 'pending'
        }
        rides_collection.insert_one(ride)

        flash('Ride request submitted successfully!')
        return redirect(url_for('dashboard'))

    return render_template('request_ride.html')

@app.route('/requests')
@login_required
def view_requests():
    ride_requests = list(rides_collection.find())
    return render_template('requests.html', requests=ride_requests)

@app.route('/offer_ride')
@login_required
def offer_ride_form():
    return render_template('offer_ride.html')

@app.route('/submit_offer_ride', methods=['POST'])
@login_required
def submit_offer_ride():
    destination = request.form['destination']
    seats_available = int(request.form['seats_available'])
    
    ride_offer = {
        'posted_by': current_user.id,
        'destination': destination,
        'seats_available': seats_available,
        'type': 'offer'  # mark this ride as an offered ride
    }
    rides_collection.insert_one(ride_offer)

    flash('Ride offer submitted successfully!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/book_ride/<ride_id>', methods=['POST'])
@login_required
def book_ride(ride_id):
    ride = rides_collection.find_one({"_id": ObjectId(ride_id)})
    if ride:
        # Handle both offered rides and requested rides properly
        if 'seats_available' in ride and int(ride['seats_available']) > 0:
            rides_collection.update_one(
                {"_id": ObjectId(ride_id)},
                {"$inc": {"seats_available": -1}}
            )
            flash('Successfully booked the ride!')
        elif 'seats' in ride and int(ride['seats']) > 0:
            rides_collection.update_one(
                {"_id": ObjectId(ride_id)},
                {"$inc": {"seats": -1}}
            )
            flash('Successfully booked the ride!')
        else:
            flash('Sorry, no seats available.')
    else:
        flash('Ride not found.')

    return redirect(url_for('view_requests'))

@app.route('/create_ride')
@login_required
def create_ride():
    return render_template('create_ride.html')

if __name__ == '__main__':
    app.run(debug=True)
