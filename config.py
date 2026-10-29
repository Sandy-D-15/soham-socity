import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    data_dir = os.getenv("DATA_DIR", BASE_DIR)
    if not os.path.isabs(data_dir):
        data_dir = os.path.join(BASE_DIR, data_dir)
    DATA_DIR = os.path.abspath(data_dir)

    database_path = os.getenv(
        "DATABASE_PATH",
        os.path.join(DATA_DIR, "database", "society.db")
    )
    if not os.path.isabs(database_path):
        database_path = os.path.join(BASE_DIR, database_path)

    os.makedirs(os.path.dirname(database_path), exist_ok=True)

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{database_path}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOADS_DIR = os.path.join(DATA_DIR, "uploads")
    PERSISTENT_STATIC_DIR = os.path.join(DATA_DIR, "static")

    flask_env = os.getenv("FLASK_ENV", "development")
    secret_key = os.getenv("SECRET_KEY")

    if flask_env == "production" and (not secret_key or secret_key.startswith("change-this")):
        raise RuntimeError("CRITICAL: SECRET_KEY must be properly set in production environment!")

    SECRET_KEY = secret_key or "society-maintenance-secret-key-2026-dev"

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = (flask_env == "production")
    PERMANENT_SESSION_LIFETIME = timedelta(days=30)