#!/usr/bin/env python3.10
from http.server import HTTPServer, CGIHTTPRequestHandler

# Set the port
PORT = 8000

# Create the server
server = HTTPServer(('', PORT), CGIHTTPRequestHandler)

# Start the server
print(f"Server running on port {PORT}")
print(f"Open http://localhost:{PORT} in your browser")
server.serve_forever() 