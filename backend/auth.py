"""
Authentication for the Admin Semester Management module.

Uses a single admin account defined via environment variables (this is an
internal admin tool, not a multi-user system). Passwords are never stored
or compared in plaintext - see security.py for the hashing implementation.

Sessions are stateless JWTs sent as a Bearer token and verified on every
protected request.

Note: required .env values are checked lazily (inside the functions that
need them), not at import time. This lets other scripts - like
generate_admin_credentials.py - import this module before .env is fully
configured, without crashing.
"""

import os
import hmac
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

from security import hash_password, verify_password  # re-exported for convenience

load_dotenv()

JWT_ALGORITHM = "HS256"

bearer_scheme = HTTPBearer(auto_error=False)


def _get_jwt_secret() -> str:
    secret = os.getenv("JWT_SECRET", "")
    if not secret:
        raise RuntimeError(
            "JWT_SECRET is not set in .env. Run `python generate_admin_credentials.py` "
            "to generate one, then add it to backend/.env."
        )
    return secret


def _get_admin_credentials() -> tuple[str, str]:
    username = os.getenv("ADMIN_USERNAME", "")
    password_hash = os.getenv("ADMIN_PASSWORD_HASH", "")
    if not username or not password_hash:
        raise RuntimeError(
            "ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not set in .env. "
            "Run `python generate_admin_credentials.py` to create them."
        )
    return username, password_hash


def _get_token_expiry_minutes() -> int:
    return int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))


# ---------------------------------------------------------------------------
# JWT session tokens
# ---------------------------------------------------------------------------

def create_access_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=_get_token_expiry_minutes())
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, _get_jwt_secret(), algorithm=JWT_ALGORITHM)


def authenticate_admin(username: str, password: str) -> str | None:
    """Returns an access token if credentials are valid, else None."""
    admin_username, admin_password_hash = _get_admin_credentials()
    if not hmac.compare_digest(username, admin_username):
        return None
    if not verify_password(password, admin_password_hash):
        return None
    return create_access_token(username)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """FastAPI dependency: raises 401 unless a valid Bearer token is present."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(credentials.credentials, _get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise ValueError("missing subject")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
