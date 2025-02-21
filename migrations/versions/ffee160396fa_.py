"""empty message

Revision ID: ffee160396fa
Revises: 355f5543bc1f
Create Date: 2025-02-20 17:45:33.498198

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ffee160396fa'
down_revision = '355f5543bc1f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('plate', sa.String(), nullable=False))
        batch_op.create_unique_constraint(None, ['plate'])

    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.drop_constraint('vehicles_plate_key', type_='unique')
        batch_op.drop_column('plate')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vehicles', schema=None) as batch_op:
        batch_op.add_column(sa.Column('plate', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.create_unique_constraint('vehicles_plate_key', ['plate'])

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('plate')

    # ### end Alembic commands ###
