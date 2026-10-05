"""initial schema

Revision ID: f80b6406a8de
Revises: 
Create Date: 2026-07-21 00:57:06.521538

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f80b6406a8de'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('admin', 'coach', 'athlete', 'physiotherapist', 'staff', name='role'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table('athletes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('jersey_number', sa.Integer(), nullable=True),
        sa.Column('playing_position', sa.Enum('GK', 'DEF', 'MID', 'FWD', name='playingposition'), nullable=True),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('height_cm', sa.Float(), nullable=True),
        sa.Column('weight_kg', sa.Float(), nullable=True),
        sa.Column('nationality', sa.String(length=100), nullable=True),
        sa.Column('joined_date', sa.Date(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_athletes_id'), 'athletes', ['id'], unique=False)

    op.create_table('facilities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('facility_type', sa.String(length=100), nullable=False),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('capacity', sa.Integer(), nullable=True),
        sa.Column('is_available', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_facilities_id'), 'facilities', ['id'], unique=False)

    op.create_table('equipment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('facility_id', sa.Integer(), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=True),
        sa.Column('last_maintenance', sa.Date(), nullable=True),
        sa.CheckConstraint("condition IN ('good', 'fair', 'broken')"),
        sa.ForeignKeyConstraint(['facility_id'], ['facilities.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_equipment_id'), 'equipment', ['id'], unique=False)

    op.create_table('training_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('coach_id', sa.Integer(), nullable=False),
        sa.Column('facility_id', sa.Integer(), nullable=True),
        sa.Column('scheduled_at', sa.DateTime(), nullable=False),
        sa.Column('duration_min', sa.Integer(), nullable=True),
        sa.Column('intensity', sa.String(length=50), nullable=True),
        sa.Column('focus', sa.String(length=100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['coach_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['facility_id'], ['facilities.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_training_sessions_id'), 'training_sessions', ['id'], unique=False)

    op.create_table('attendances',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('athlete_id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('minutes_late', sa.Integer(), nullable=True),
        sa.Column('rpe', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['athlete_id'], ['athletes.id'], ),
        sa.ForeignKeyConstraint(['session_id'], ['training_sessions.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('athlete_id', 'session_id', name='uq_attendance')
    )
    op.create_index(op.f('ix_attendances_id'), 'attendances', ['id'], unique=False)

    op.create_table('competitions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('opponent', sa.String(length=255), nullable=True),
        sa.Column('match_date', sa.DateTime(), nullable=False),
        sa.Column('venue', sa.String(length=255), nullable=True),
        sa.Column('result', sa.String(length=20), nullable=True),
        sa.Column('our_score', sa.Integer(), nullable=True),
        sa.Column('opponent_score', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_competitions_id'), 'competitions', ['id'], unique=False)

    op.create_table('performance_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('athlete_id', sa.Integer(), nullable=False),
        sa.Column('recorded_at', sa.Date(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=True),
        sa.Column('competition_id', sa.Integer(), nullable=True),
        sa.Column('distance_km', sa.Float(), nullable=True),
        sa.Column('top_speed_kmh', sa.Float(), nullable=True),
        sa.Column('sprint_count', sa.Integer(), nullable=True),
        sa.Column('avg_heart_rate', sa.Float(), nullable=True),
        sa.Column('max_heart_rate', sa.Float(), nullable=True),
        sa.Column('training_load', sa.Float(), nullable=True),
        sa.Column('vo2max_est', sa.Float(), nullable=True),
        sa.Column('fitness_score', sa.Float(), nullable=True),
        sa.Column('match_rating', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['athlete_id'], ['athletes.id'], ),
        sa.ForeignKeyConstraint(['competition_id'], ['competitions.id'], ),
        sa.ForeignKeyConstraint(['session_id'], ['training_sessions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_performance_records_id'), 'performance_records', ['id'], unique=False)

    op.create_table('injury_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('athlete_id', sa.Integer(), nullable=False),
        sa.Column('injury_type', sa.String(length=100), nullable=False),
        sa.Column('body_part', sa.String(length=100), nullable=True),
        sa.Column('severity', sa.String(length=50), nullable=True),
        sa.Column('occurred_on', sa.Date(), nullable=False),
        sa.Column('returned_on', sa.Date(), nullable=True),
        sa.Column('cause', sa.String(length=100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['athlete_id'], ['athletes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_injury_records_id'), 'injury_records', ['id'], unique=False)

    op.create_table('memberships',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('athlete_id', sa.Integer(), nullable=False),
        sa.Column('plan', sa.String(length=100), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('amount_paid', sa.Float(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.ForeignKeyConstraint(['athlete_id'], ['athletes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_memberships_id'), 'memberships', ['id'], unique=False)

    op.create_table('ml_models',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('model_type', sa.String(length=50), nullable=False),
        sa.Column('version', sa.String(length=20), nullable=False),
        sa.Column('metrics', sa.Text(), nullable=True),
        sa.Column('trained_at', sa.DateTime(), nullable=True),
        sa.Column('artifact_path', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ml_models_id'), 'ml_models', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('ml_models')
    op.drop_table('memberships')
    op.drop_table('injury_records')
    op.drop_table('performance_records')
    op.drop_table('competitions')
    op.drop_table('attendances')
    op.drop_table('training_sessions')
    op.drop_table('equipment')
    op.drop_table('facilities')
    op.drop_table('athletes')
    op.drop_table('users')
    sa.Enum('GK', 'DEF', 'MID', 'FWD', name='playingposition').drop(op.get_bind())
    sa.Enum('admin', 'coach', 'athlete', 'physiotherapist', 'staff', name='role').drop(op.get_bind())
