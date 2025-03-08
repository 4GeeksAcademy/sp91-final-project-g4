from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Users(db.Model):  # Incluir Customer y Provider para creacion de contactos?
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False) 
    role = db.Column(db.String(20), nullable=False, default="customer")  # Puede ser "admin", "customer" o "provider"
    is_active = db.Column(db.Boolean, default=True)
    customer_id = db.Column(db.Integer(), db.ForeignKey('customers.id'))
    provider_id = db.Column(db.Integer(), db.ForeignKey('providers.id'))
    customer_to = db.relationship("Customers", foreign_keys=[customer_id], backref="user_to")
    provider_to = db.relationship("Providers", foreign_keys=[provider_id], backref="user_to")

    def __repr__(self):
        return f'<User: {self.id} - {self.email} - Role: {self.role}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "is_active": self.is_active,
            "customer_id": self.customer_id,
            "provider_id": self.provider_id}
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)  # Encripta la contraseña

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)  # Verifica la contraseña


class Vehicles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    brand = db.Column(db.String(120), nullable=False)
    model = db.Column(db.String(80), nullable=False)
    vehicle_type = db.Column(db.Enum('Turism', 'Motorcycle', 'SUV', '4x4', 'Van', 'Extra van', name='vehicles_type'), nullable=False)
    corrector_cost = db.Column(db.Float(), nullable=False)

    def __init__(self, brand, model, vehicle_type):
        self.brand = brand
        self.model = model
        self.vehicle_type = vehicle_type
        self.corrector_cost = self.calculate_corrector_cost()

    def calculate_corrector_cost(self):
        corrector_values = {
                            "Turism": 0.0,
                            "Motorcylce": 0.0,
                            "SUV": 0.2,
                            "4x4": 0.3,
                            "Van": 0.5,
                            "Extra van": 0.7}
        return corrector_values.get(self.vehicle_type, 0.0)

    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "vehicle_type": self.vehicle_type,
            "corrector_cost": self.corrector_cost}


class Customers(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    company_name = db.Column(db.String(), unique=False, nullable=False)
    contact_name = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    cust_base_tariff = db.Column(db.Float(), unique=False, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    users = db.relationship("Users", backref="customer", lazy="dynamic")  # Relación inversa con Users
    # user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), unique=True)
    # user_customer_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_customer_to', lazy='select'))
    
    def __repr__(self):
        return f'<Customer: {self.id} - {self.company_name}>'

    def serialize(self):
        return {"id": self.id,
                "company_name": self.company_name,
                "contact_name": self.contact_name,
                "phone": self.phone,
                "address": self.address,
                "cust_base_tariff": self.cust_base_tariff,
                "is_active": self.is_active}
    

class Providers(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    company_name = db.Column(db.String(), unique=True, nullable=False)
    contact_name = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    prov_base_tariff = db.Column(db.Float(), unique=False, nullable=False)   
    is_active = db.Column(db.Boolean, default=True)
    # user_providers_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_providers_to', lazy='select'))
    # user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), unique=True)

    def __repr__(self):
        return f'<Provider: {self.id} - {self.company_name}>'

    def serialize(self):
        return {"id": self.id,
                "company_name": self.company_name,
                "contact_name": self.contact_name,
                "phone": self.phone,
                "address": self.address,
                "prov_base_tariff": self.prov_base_tariff,
                "is_active": self.is_active}


class Locations(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    region = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(120), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    country = db.Column(db.String(120), nullable=True)  

    def __repr__(self):
        return f'<Location: {self.id} - {self.city}>'

    def serialize(self):
        return {
            "id": self.id,
            "region": self.region,
            "city": self.city,
            "postal_code": self.postal_code,
            "latitude": self.latitude,
            "longitude": self.longitude, 
            "country": self.country}


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate = db.Column(db.String(), unique=False, nullable=False)
    distance_km = db.Column(db.Float(), unique=False, nullable=True)
    estimated_date_end = db.Column(db.Date(), unique=False, nullable=False)
    corrector_cost = db.Column(db.Float(), unique=False, nullable=True)
    final_cost = db.Column(db.Float(), unique=False, nullable=True)
    prov_base_tariff = db.Column(db.Float(), unique=False, nullable=True)
    cust_base_tariff = db.Column(db.Float(), unique=False, nullable=True)
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
    comment = db.Column(db.String(), unique=False, nullable=True)
  
    def __repr__(self):
        return f'<Order: {self.id} - Customer: {self.customer_id} - Provider: {self.provider_id}>'

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
                "destiny_id": self.destiny_id,
                "comment": self.comment}


class OrderDocuments(db.Model):
    __tablename__ = "order_documents"
    id = db.Column(db.Integer, primary_key=True)
    document_type = db.Column(db.Enum('Init', 'End', name='document_type'))
    document_url = db.Column(db.String(120), unique=True, nullable=True)
    created_date = db.Column(db.Date, unique=False, nullable=False, default=datetime.utcnow)
    order_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    order_document_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('order_document_to', lazy='select'))

    def __repr__(self):
        return f'<Order document: {self.id} - {self.order_id}>'

    def serialize(self):
        return {"id": self.id,
                "document_type": self.document_type,
                "document_url": self.document_url,
                "created_date": self.created_date,
                "order_id": self.order_id,}  
    

class Contact(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.String(50), unique=False, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    comments = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Contact: {self.id} - {self.name} {self.last_name}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "last_name": self.last_name,
                "phone": self.phone,
                "email": self.email,
                "comments": self.comments,
                "created_at": self.created_at}
    