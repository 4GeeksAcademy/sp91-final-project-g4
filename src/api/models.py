from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False) 
    role = db.Column(db.String(20), nullable=False, default="customer")  # Puede ser "admin", "customer" o "provider"

    def __repr__(self):
        return f'<User: {self.id} - {self.email} - Role: {self.role}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role}
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)  # Encripta la contraseña

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)  # Verifica la contraseña


class Vehicles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    brand = db.Column(db.String(120), unique=False, nullable=False)
    model = db.Column(db.String(80), unique=False, nullable=False)
    vehicle_type = db.Column(db.Enum('Turism', 'Motorcylce', 'SUV','4x4','Van','Extra van', name='vehicles_type'), unique=False, nullable=False)

    def __repr__(self):
        return f'<User: {self.id} - {self.model}>'

    def serialize(self):
        return {"id": self.id,
                "brand": self.brand,
                "model": self.model,
                "vehicle_type": self.vehicle_type}


class Comments(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    comment = db.Column(db.String(), unique=False, nullable=True)
    date = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('comment_to', lazy='select'))
    order_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    order_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('comment_to', lazy='select'))

    def __repr__(self):
            return f'<Comment: {self.id} - {self.comment}>'
    
    def serialize(self):
        return {'id': self.id,
                'comment': self.comment,
                'date': self.date,
                'user_id': self.user_id,
                'order_id ': self.order_id}
    

class Customers(db.Model):  # Poner precio de cliente
    id = db.Column(db.Integer(), primary_key=True)
    company_name = db.Column(db.String(), unique=False, nullable=False)
    contact_name = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    cust_base_tariff = db.Column(db.Float(), unique=False, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), unique=True)
    user_customer_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_customer_to', lazy='select'))
    
    def __repr__(self):
        return f'<User: {self.id} - {self.contact_name}>'

    def serialize(self):
        return {"id": self.id,
                "company_name": self.company_name,
                "contact_name": self.contact_name,
                "phone": self.phone,
                "address": self.address,
                "cust_base_tariff": self.cust_base_tariff,
                "user_id": self.user_id}
    

class Order_document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_type = db.Column(db.Enum('Init', 'End', name='document_type'), unique=False, nullable=False)
    document_url = db.Column(db.String(120), unique=True, nullable=True)
    created_date = db.Column(db.Date, unique=False, nullable=False, default=datetime.utcnow)
    order_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    order_document_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('order_document_to', lazy='select'))

    def __repr__(self):
        return f'<User: {self.id} - {self.order_id}>'

    def serialize(self):
        return {"id": self.id,
                "document_type": self.document_type,
                "document_url": self.document_url,
                "created_date": self.created_date,
                "order_id": self.order_id,}
    

class Providers(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    company_name = db.Column(db.String(), unique=True, nullable=False)
    contact_name = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    prov_base_tariff = db.Column(db.Float(), unique=False, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), unique=True)
    user_providers_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_providers_to', lazy='select'))
    

    def __repr__(self):
        return f'<User: {self.id} - {self.contact_name}>'

    def serialize(self):
        return {"id": self.id,
                "company_name": self.company_name,
                "contact_name": self.contact_name,
                "phone": self.phone,
                "address": self.address,
                "prov_base_tariff": self.prov_base_tariff,
                "user_id": self.user_id}


class Locations(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    region = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(120), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    country = db.Column(db.String(120), nullable=True)  

    def __repr__(self):
        return f'<Location: {self.id} - {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "region": self.region,
            "city": self.city,
            "postal_code": self.postal_code,
            "latitude": self.latitude,
            "longitude": self.longitude, 
            "country": self.country}


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate = db.Column(db.String(), unique=False, nullable=False)
    distance_km = db.Column(db.Float(), unique=False, nullable=False)
    estimated_date_end = db.Column(db.Date(), unique=False, nullable=False)
    corrector_cost = db.Column(db.Float(), unique=False, nullable=False)
    final_cost = db.Column(db.Float(), unique=False, nullable=False)
    prov_base_tariff = db.Column(db.Float(), unique=False, nullable=False)
    cust_base_tariff = db.Column(db.Float(), unique=False, nullable=False)
    status_order = db.Column(db.Enum('Order created', 'Order acepted', 'In transit', 'Delivered', 'Cancel', name='status_order_type'), unique=False, nullable=False)
    order_created_date = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    order_acepted_date = db.Column(db.Date(), unique=False, nullable=True)
    in_transit_date = db.Column(db.Date(), unique=False, nullable=True)
    delivered_date = db.Column(db.Date(), unique=False, nullable=True)
    cancel_date = db.Column(db.Date(), unique=False, nullable=True)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customers.id'))
    customer_to = db.relationship('Customers', foreign_keys=[customer_id], backref=db.backref('customer_order_to', lazy='select'))
    provider_id = db.Column(db.Integer(), db.ForeignKey('providers.id'))
    provider_to = db.relationship('Providers', foreign_keys=[provider_id], backref=db.backref('provider_order_to', lazy='select'))
    vehicle_id = db.Column(db.Integer(), db.ForeignKey('vehicles.id'))
    vehicle_to = db.relationship('Vehicles', foreign_keys=[vehicle_id], backref=db.backref('vehicle_to', lazy='select'))
    destiny_id = db.Column(db.Integer(), db.ForeignKey('locations.id'))
    location_destiny_to = db.relationship('Locations', foreign_keys=[destiny_id], backref=db.backref('location_destiny_to', lazy='select'))
    origin_id = db.Column(db.Integer(), db.ForeignKey('locations.id'))
    location_origin_to = db.relationship('Locations', foreign_keys=[origin_id], backref=db.backref('location_origin_to', lazy='select'))
  
    def __repr__(self):
        return f'<User: {self.id} - {self.user_id}>' 

    def serialize(self):
        return {"id": self.id,
                "plate": self.plate,
                "distance_km": self.distance_km,
                "estimated_date_end": self.estimated_date_end,
                "corrector_cost": self.corrector_cost,
                "final_cost": self.final_cost,
                "prov_base_tariff": self.prov_base_tariff,
                "cust_base_tariff": self.cust_base_tariff,
                "status_order": self.status_order,
                "order_created_date": self.order_created_date,
                "order_acepted_date": self.order_acepted_date,
                "in_transit_date": self.in_transit_date,
                "delivered_date": self.delivered_date,
                "cancel_date": self.cancel_date,
                "customer_id": self.customer_id,
                "provider_id": self.provider_id,
                "vehicle_id": self.vehicle_id,
                "origin_id": self.origin_id,
                "destiny_id": self.destiny_id}
    
