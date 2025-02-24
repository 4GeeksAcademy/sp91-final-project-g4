"""empty message

Revision ID: 7300275afc72
Revises: 495569071a8b
Create Date: 2025-02-22 12:04:49.859501

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7300275afc72'
down_revision = '495569071a8b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('locations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('postal_code', sa.String(length=120), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('locations', schema=None) as batch_op:
        batch_op.drop_column('postal_code')

    # ### end Alembic commands ###
