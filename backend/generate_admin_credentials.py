"""
Run this once to generate the ADMIN_USERNAME / ADMIN_PASSWORD_HASH values
for your .env file:

    python generate_admin_credentials.py

It will prompt you for a username and password, then print lines you can
paste directly into backend/.env. Your plaintext password is never stored
anywhere - only the resulting hash goes into .env.
"""

import getpass
import secrets
from security import hash_password

def main():
    username = input("Choose an admin username: ").strip()
    password = getpass.getpass("Choose an admin password: ").strip()
    confirm = getpass.getpass("Confirm password: ").strip()

    if password != confirm:
        print("Passwords did not match. Please run the script again.")
        return
    if len(password) < 8:
        print("Please choose a password of at least 8 characters.")
        return

    password_hash = hash_password(password)
    jwt_secret = secrets.token_hex(32)

    print("\nAdd (or replace) these lines in backend/.env:\n")
    print(f"ADMIN_USERNAME={username}")
    print(f"ADMIN_PASSWORD_HASH={password_hash}")
    print(f"JWT_SECRET={jwt_secret}")
    print()

if __name__ == "__main__":
    main()
