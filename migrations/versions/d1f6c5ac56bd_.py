"""empty message

Revision ID: d1f6c5ac56bd
Revises: 00495a28a109
Create Date: 2025-02-19 08:12:01.978151

"""
from alembic import op
import sqlalchemy as sa
from werkzeug.security import generate_password_hash
from sqlalchemy.orm import sessionmaker
from sqlalchemy import table, column, update


# revision identifiers, used by Alembic.
revision = 'd1f6c5ac56bd'
down_revision = '00495a28a109'
branch_labels = None
depends_on = None


def upgrade():
    # 1️⃣ Agregar la nueva columna `password_hash` temporalmente con `nullable=True`
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.String(length=256), nullable=True))

    # 2️⃣ Migrar los valores de `password` a `password_hash`
    bind = op.get_bind()
    Session = sessionmaker(bind=bind)
    session = Session()

    users_table = table('users', column('id'), column('password_hash'), column('password'))

    for user in session.execute(sa.select(users_table.c.id, users_table.c.password)):
        hashed_password = generate_password_hash(user.password if user.password else "defaultpassword")
        session.execute(update(users_table).where(users_table.c.id == user.id).values(password_hash=hashed_password))

    session.commit()

    # 3️⃣ Ahora hacer `password_hash` obligatorio y eliminar `password`
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('password_hash', nullable=False)
        batch_op.drop_column('password')


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.VARCHAR(length=80), autoincrement=False, nullable=False))
        batch_op.drop_column('password_hash')

