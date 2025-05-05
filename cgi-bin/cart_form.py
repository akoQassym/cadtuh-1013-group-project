#!/usr/bin/python3
import cgi
import cgitb
import json
from datetime import datetime

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
    payment = form.getvalue('payment', '')
    delivery = form.getvalue('delivery', '')
    
    # Create response
    response = {
        'status': 'success',
        'message': 'Order received successfully',
        'order': {
            'name': name,
            'netid': netid,
            'payment': payment,
            'delivery': delivery,
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