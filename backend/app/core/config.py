from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Sports Club AI"
    API_V1_STR: str = "/api"

    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    POSTGRES_USER: str = "sportsclub"
    POSTGRES_PASSWORD: str = "sportsclub"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "sportsclub"

    SECRET_KEY: str = "change-me-in-production-this-is-a-dev-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID: str = "366511984845-db5vr24h4tjnql2chkdqpre7e1ac8mph.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET: str = ""

    @property
    def DATABASE_URL(self) -> str:
        # Switch to SQLite to allow the MVP to run instantly without Postgres
        return "sqlite:///./sportsclub.db"


settings = Settings()
