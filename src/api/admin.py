import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import SecureForm
from wtforms import PasswordField
from werkzeug.security import generate_password_hash
from .models import db, Users, Vehicles, Customers, OrderDocuments, Providers, Locations, Orders, Contact

# Clase personalizada para Users en Flask-Admin
class UsersAdmin(ModelView):
    form_base_class = SecureForm  # Protege contra ataques CSRF en formularios
    form_excluded_columns = ('password_hash',)  # Oculta el campo password_hash en el formulario
    column_exclude_list = ('password_hash',)  # Oculta password_hash en la lista de usuarios
    form_extra_fields = {
        'password': PasswordField('Password')}  # Permite ingresar una nueva contraseña

    def on_model_change(self, form, model, is_created):
        """Convierte la contraseña en hash antes de guardarla en la base de datos."""
        if form.password.data:
            model.password_hash = generate_password_hash(form.password.data)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    admin.add_view(UsersAdmin(Users, db.session))  # Usa la clase personalizada
    admin.add_view(ModelView(Vehicles, db.session))
    admin.add_view(ModelView(Customers, db.session))
    admin.add_view(ModelView(OrderDocuments, db.session))
    admin.add_view(ModelView(Providers, db.session))
    admin.add_view(ModelView(Locations, db.session))
    admin.add_view(ModelView(Orders, db.session))
    admin.add_view(ModelView(Contact, db.session))