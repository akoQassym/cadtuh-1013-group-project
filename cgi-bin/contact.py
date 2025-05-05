#!/usr/bin/python3
import cgi
import cgitb
import json
from datetime import datetime
import os

# Enable CGI error reporting
cgitb.enable()

# Set the content type to JSON
print("Content-Type: application/json")
print()

# Get form data
form = cgi.FieldStorage()

try:
    # Get form values
    name = form.getvalue('name', '')
    netid = form.getvalue('netid', '')
    email = form.getvalue('email', '')
    subject = form.getvalue('subject', '')
    message = form.getvalue('message', '')
    
    # Validate required fields
    if not all([name, netid, email, subject, message]):
        print(json.dumps({
            'status': 'error',
            'message': 'All fields are required.'
        }))
        exit()
    
    # Define the path to store contact messages
    contacts_dir = os.path.join(os.path.dirname(__file__), '../contacts')
    
    # Create the directory if it doesn't exist
    if not os.path.exists(contacts_dir):
        os.makedirs(contacts_dir)
    
    # Generate a unique filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f"{timestamp}_{netid}.txt"
    file_path = os.path.join(contacts_dir, filename)
    
    # Save the contact message to a file
    with open(file_path, 'w') as f:
        f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Name: {name}\n")
        f.write(f"NetID: {netid}\n") 
        f.write(f"Email: {email}\n")
        f.write(f"Subject: {subject}\n")
        f.write(f"Message:\n{message}\n")
    
    # Create response
    response = {
        'status': 'success',
        'message': 'Contact message submitted successfully',
        'contact': {
            'name': name,
            'netid': netid,
            'email': email,
            'subject': subject,
            'timestamp': datetime.now().isoformat()
        }
    }
    
    # Print JSON response
    print(json.dumps(response))

except Exception as e:
    # Handle errors
    print(json.dumps({
        'status': 'error',
        'message': str(e)
    }))