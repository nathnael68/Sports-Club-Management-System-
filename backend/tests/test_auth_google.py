import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.auth import GoogleLoginRequest
from app.core.config import settings

client = TestClient(app)

def test_google_login_request_schema():
    req = GoogleLoginRequest(id_token="sample-jwt-token")
    assert req.id_token == "sample-jwt-token"

def test_google_login_unconfigured_client_id():
    # If the default placeholder is still in place, should return 500 with helpful message
    with patch.object(settings, "GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"):
        response = client.post("/api/auth/google", json={"id_token": "some-token"})
        assert response.status_code == 500
        assert "Google Client ID is not configured" in response.json()["detail"]

def test_google_login_invalid_token():
    with patch.object(settings, "GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com"):
        with patch("google.oauth2.id_token.verify_oauth2_token", side_effect=ValueError("Token invalid")):
            response = client.post("/api/auth/google", json={"id_token": "invalid-token"})
            assert response.status_code == 401
            assert "Invalid Google ID token" in response.json()["detail"]

def test_google_login_success_and_provision():
    mock_payload = {
        "email": "newgoogleuser@example.com",
        "name": "Google Athlete",
        "email_verified": True,
        "sub": "1234567890",
    }
    with patch.object(settings, "GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com"):
        with patch("google.oauth2.id_token.verify_oauth2_token", return_value=mock_payload):
            response = client.post("/api/auth/google", json={"id_token": "valid-google-id-token"})
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert data["token_type"] == "bearer"

def test_google_login_new_user_pending_approval():
    import uuid
    random_email = f"pending_athlete_{uuid.uuid4().hex[:6]}@example.com"
    mock_payload = {
        "email": random_email,
        "name": "Pending Approval Athlete",
        "email_verified": True,
        "sub": "9876543210",
    }
    with patch.object(settings, "GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com"):
        with patch("google.oauth2.id_token.verify_oauth2_token", return_value=mock_payload):
            # First attempt: new user is provisioned with is_active=False and receives 403 pending approval
            response = client.post("/api/auth/google", json={"id_token": "pending-token"})
            assert response.status_code == 403
            assert "pending administrator approval" in response.json()["detail"]
