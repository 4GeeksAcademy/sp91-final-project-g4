from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False, default=False)  # Preguntar por roles
    is_customer = db.Column(db.Boolean(), unique=False, nullable=True) 

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "last_name": self.last_name,
                "email": self.email,
                "phone": self.phone}
    

class Vehicles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    plate = db.Column(db.String(), unique=True, nullable=False)
    brand = db.Column(db.String(120), unique=True, nullable=False)
    model = db.Column(db.String(80), unique=True, nullable=False)
    vehicle_type = db.Column(db.Enum('Turism', 'Motorcylce', 'SUV','4x4','Van','Extra van', name='vehicles_type'), unique=False, nullable=False)

    def __repr__(self):
        return f'<User: {self.id} - {self.plate}>'

    def serialize(self):
        return {"id": self.id,
                "plate": self.plate,
                "brand": self.brand,
                "model": self.model,
                "vehicle_type": self.vehicle_type}


class Comments(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    comment = db.Column(db.String(), unique=False, nullable=True)
    date = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_to', lazy='select'))
    order_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    order_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('order_to', lazy='select'))

    
    def __repr__(self):
            return f'<Comment: {self.id} - {self.comment}>'
    
    def serialize(self):
        return {'id': self.id,
                'comment': self.comment,
                'date': self.date,
                'user_id': self.user_id,
                'order_id ': self.order_id}
    

class Customers(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    company_name = db.Column(db.String(), unique=True, nullable=False)
    contact_name = db.Column(db.String(120), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    user_customer_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_customer_to', lazy='select'))
    

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "company_name": self.company_name,
                "contact_name": self.contact_name,
                "phone": self.phone,
                "email": self.email,
                "address": self.email,
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
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    tariff = db.Column(db.Float(), unique=False, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    user_providers_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_providers_to', lazy='select'))
    

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "company_name": self.company_name,
                "contact_name": self.contact_name,
                "phone": self.phone,
                "email": self.email,
                "address": self.email,
                "tariff": self.tariff,
                "user_id": self.user_id}


class Locations(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    region = db.Column(db.String(120), unique=True, nullable=False)
    city = db.Column(db.String(120), unique=False, nullable=False)
    origin_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    location_origin_to = db.relationship('Orders', foreign_keys=[origin_id], backref=db.backref('location_origin_to', lazy='select'))
    destiny_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    location_destiny_to = db.relationship('Orders', foreign_keys=[destiny_id], backref=db.backref('location_destiny_to', lazy='select'))

    def __repr__(self):
        return f'<User: {self.id} - {self.name}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "region": self.region,
                "city": self.city,
                "origin_id": self.origin_id,
                "destiny_id": self.destiny_id}
    

class Order_history(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status_order = db.Column(db.Enum('Pending', 'In progress', 'Init', 'End', 'Cancel', name='status_order_type'), unique=False, nullable=False)
    change_date = db.Column(db.Date, unique=False, nullable=False, default=datetime.utcnow)
    order_id = db.Column(db.Integer(), db.ForeignKey('orders.id'))
    order_history_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('order_history_to', lazy='select'))

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "status_order": self.status_order,
                "change_date": self.change_date}


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    distance_km = db.Column(db.Float(), unique=False, nullable=False)
    estimated_date_end = db.Column(db.Date(), unique=False, nullable=False)
    base_price = db.Column(db.Float(), unique=False, nullable=False)
    corrector = db.Column(db.Float(), unique=False, nullable=False)
    final_price = db.Column(db.Float(), unique=True, nullable=False)
    tariff_validity = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    total_customer_price = db.Column(db.Float(), unique=False, nullable=False)
    created_date = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    init_date = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.Date(), unique=False, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
    order_user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('order_user_to', lazy='select'))
    vehicle_id = db.Column(db.Integer(), db.ForeignKey('vehicles.id'))
    vehicle_to = db.relationship('Vehicles', foreign_keys=[vehicle_id], backref=db.backref('vehicle_to', lazy='select'))
    origin_id = db.Column(db.Integer(), db.ForeignKey('locations.id'))
    origin_to = db.relationship('Locations', foreign_keys=[origin_id], backref=db.backref('origin_to', lazy='select'))
    destiny_id = db.Column(db.Integer(), db.ForeignKey('locations.id'))
    destiny_to = db.relationship('Locations', foreign_keys=[destiny_id], backref=db.backref('destiny_to', lazy='select'))


    
    def __repr__(self):
        return f'<User: {self.id} - {self.user_id}>' 

    def serialize(self):
        return {"id": self.id,
                "distance_km": self.distance_km,
                "estimated_date_end": self.estimated_date_end,
                "base_price": self.base_price,
                "init_date": self.init_date,
                "end_date": self.end_date,
                "corrector": self.corrector,
                "final_price": self.final_price,
                "created_date": self.created_date,
                "user_id": self.user_id,
                "vehicle_id": self.vehicle_id,
                "origin_id": self.origin_id,
                "destiny_id": self.destiny_id}
    
