#!/usr/bin/python3
import cgi
import cgitb
import hashlib
import os

cgitb.enable()

print("Content-Type: application/json\n")

form = cgi.FieldStorage()

file_path = os.path.join(os.path.dirname(__file__), '../users.txt')

username = form.getvalue('username', '').strip()
password = form.getvalue('password', '').strip()

if not username or not password:
    print('{"status": "error", "message": "Username and password required."}')
    exit()

# Hash the password
hashed_password = hashlib.sha256(password.encode()).hexdigest()

# Store the user
try:
    with open(file_path, 'a') as f:
        f.write(f"{username}:{hashed_password}\n")
    print('{"status": "success", "message": "Account created successfully."}')
except Exception as e:
    print(f'{{"status": "error", "message": "{str(e)}"}}')
