"""empty message

Revision ID: 46a90417edf7
Revises: 
Create Date: 2025-02-18 17:41:24.585603

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '46a90417edf7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('locations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('region', sa.String(length=120), nullable=False),
    sa.Column('city', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('region')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('phone', sa.String(), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=False),
    sa.Column('is_customer', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('vehicles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('plate', sa.String(), nullable=False),
    sa.Column('brand', sa.String(length=120), nullable=False),
    sa.Column('model', sa.String(length=80), nullable=False),
    sa.Column('vehicle_type', sa.Enum('Turism', 'Motorcylce', 'SUV', '4x4', 'Van', 'Extra van', name='vehicles_type'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('brand'),
    sa.UniqueConstraint('model'),
    sa.UniqueConstraint('plate')
    )
    op.create_table('customers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('company_name', sa.String(), nullable=False),
    sa.Column('contact_name', sa.String(length=120), nullable=False),
    sa.Column('phone', sa.String(), nullable=False),
    sa.Column('address', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('distance_km', sa.Float(), nullable=False),
    sa.Column('estimated_date_end', sa.Date(), nullable=False),
    sa.Column('base_cost', sa.Float(), nullable=False),
    sa.Column('corrector_cost', sa.Float(), nullable=False),
    sa.Column('final_cost', sa.Float(), nullable=False),
    sa.Column('total_customer_price', sa.Float(), nullable=False),
    sa.Column('status_order', sa.Enum('Order created', 'Order acepted', 'In transit', 'Delivered', 'Cancel', name='status_order_type'), nullable=False),
    sa.Column('order_created_date', sa.Date(), nullable=False),
    sa.Column('order_acepted_date', sa.Date(), nullable=False),
    sa.Column('in_transit_date', sa.Date(), nullable=False),
    sa.Column('delivered_date', sa.Date(), nullable=False),
    sa.Column('cancel_date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('vehicle_id', sa.Integer(), nullable=True),
    sa.Column('destiny_id', sa.Integer(), nullable=True),
    sa.Column('origin_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['destiny_id'], ['locations.id'], ),
    sa.ForeignKeyConstraint(['origin_id'], ['locations.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['vehicle_id'], ['vehicles.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('final_cost')
    )
    op.create_table('providers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('company_name', sa.String(), nullable=False),
    sa.Column('contact_name', sa.String(length=120), nullable=False),
    sa.Column('phone', sa.String(), nullable=False),
    sa.Column('address', sa.String(), nullable=False),
    sa.Column('tariff', sa.Float(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('company_name'),
    sa.UniqueConstraint('user_id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('comment', sa.String(), nullable=True),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('order_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('order_document',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('document_type', sa.Enum('Init', 'End', name='document_type'), nullable=False),
    sa.Column('document_url', sa.String(length=120), nullable=True),
    sa.Column('created_date', sa.Date(), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('document_url')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('order_document')
    op.drop_table('comments')
    op.drop_table('providers')
    op.drop_table('orders')
    op.drop_table('customers')
    op.drop_table('vehicles')
    op.drop_table('users')
    op.drop_table('locations')
    # ### end Alembic commands ###
