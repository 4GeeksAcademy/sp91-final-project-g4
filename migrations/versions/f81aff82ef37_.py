"""empty message

Revision ID: f81aff82ef37
Revises: 7300275afc72
Create Date: 2025-02-27 09:50:45.410793

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f81aff82ef37'
down_revision = '7300275afc72'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('prov_base_tariff', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('cust_base_tariff', sa.Float(), nullable=False))
        batch_op.drop_column('total_customer_price')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_customer_price', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))
        batch_op.drop_column('cust_base_tariff')
        batch_op.drop_column('prov_base_tariff')

    # ### end Alembic commands ###
