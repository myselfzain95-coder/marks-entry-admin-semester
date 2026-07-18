"""
Pure password-hashing helpers with no dependency on environment variables.
Kept separate from auth.py so that generate_admin_credentials.py can import
this safely *before* .env has been set up (auth.py requires .env to already
contain valid credentials, which would be a chicken-and-egg problem for the
generator script).
"""

import hashlib
import hmac
import secrets


def hash_password(password: str, salt: str | None = None) -> str:
    if salt is None:
        salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000)
    return f"{salt}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, _ = stored_hash.split("$", 1)
    except ValueError:
        return False
    candidate = hash_password(password, salt)
    return hmac.compare_digest(candidate, stored_hash)
