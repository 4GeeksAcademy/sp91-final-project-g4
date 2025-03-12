"""empty message

Revision ID: 8e339cfedfe7
Revises: de706a124f6d
Create Date: 2025-03-12 16:18:51.691639

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8e339cfedfe7'
down_revision = 'de706a124f6d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('origin_contact', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('origin_phone', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('destiny_contact', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('destiny_phone', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_column('destiny_phone')
        batch_op.drop_column('destiny_contact')
        batch_op.drop_column('origin_phone')
        batch_op.drop_column('origin_contact')

    # ### end Alembic commands ###
