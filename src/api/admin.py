import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Vehicles, Comments, Customers, Order_document, Providers, Locations, Orders

# ✅ Personalizar la vista del modelo Users para ocultar `password_hash`
class UsersAdmin(ModelView):
    column_exclude_list = ["password_hash"]  # Oculta `password_hash` en la vista de lista
    form_excluded_columns = ["password_hash"]  # Evita que se pueda editar `password_hash`
    can_create = True  # Permite crear usuarios
    can_edit = True  # Permite editar usuarios
    can_delete = True  # Permite eliminar usuarios

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # ✅ Agregar la vista personalizada para Users
    admin.add_view(UsersAdmin(Users, db.session))

    # Agregar los demás modelos normalmente
    admin.add_view(ModelView(Vehicles, db.session))
    admin.add_view(ModelView(Comments, db.session))
    admin.add_view(ModelView(Customers, db.session))
    admin.add_view(ModelView(Order_document, db.session))
    admin.add_view(ModelView(Providers, db.session))
    admin.add_view(ModelView(Locations, db.session))
    admin.add_view(ModelView(Orders, db.session))
 
