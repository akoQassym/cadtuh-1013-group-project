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

# Hash password for comparison
hashed_password = hashlib.sha256(password.encode()).hexdigest()

try:
    with open(file_path, 'r') as f:
        users = f.readlines()
    
    for user in users:
        stored_username, stored_hash = user.strip().split(':')
        if username == stored_username and hashed_password == stored_hash:
            print(f'{{"status": "success", "message": "Welcome {username}!"}}')
            break
    else:
        print('{"status": "error", "message": "Invalid credentials."}')
except Exception as e:
    print(f'{{"status": "error", "message": "{str(e)}"}}')
