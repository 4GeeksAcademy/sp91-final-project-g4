import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Vehicles, Comments, Customers, Order_document, Providers, Locations, Order_history, Orders


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(Vehicles, db.session))  
    admin.add_view(ModelView(Comments, db.session))  
    admin.add_view(ModelView(Customers, db.session))  
    admin.add_view(ModelView(Order_document, db.session))  
    admin.add_view(ModelView(Providers, db.session))  
    admin.add_view(ModelView(Locations, db.session))  
    admin.add_view(ModelView(Order_history, db.session))  
    admin.add_view(ModelView(Orders, db.session))  
