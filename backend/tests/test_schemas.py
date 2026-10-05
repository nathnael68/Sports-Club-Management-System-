import pytest
from datetime import date, timedelta
from pydantic import ValidationError
from app.schemas.athletes import AthleteCreate

def test_athlete_create_valid():
    athlete = AthleteCreate(
        email="test@example.com",
        full_name="John Doe",
        password="secure",
        jersey_number=10,
        height_cm=180.5,
        weight_kg=75.0,
        date_of_birth=date.today() - timedelta(days=365*20)
    )
    assert athlete.email == "test@example.com"
    assert athlete.jersey_number == 10

def test_athlete_create_invalid_height():
    with pytest.raises(ValidationError):
        AthleteCreate(
            email="test@example.com",
            full_name="John Doe",
            password="secure",
            height_cm=300  # Above 250 bound
        )

def test_athlete_create_future_dob():
    with pytest.raises(ValidationError):
        AthleteCreate(
            email="test@example.com",
            full_name="John Doe",
            password="secure",
            date_of_birth=date.today() + timedelta(days=1)
        )
