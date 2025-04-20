# NYUAD Marketplace

A web-based marketplace platform for NYUAD students to buy and sell items.

## Features

- Product listing with images and prices
- Shopping cart functionality
- Order form with validation
- Receipt generation
- CGI-based form processing

## Setup Instructions

1. Clone the repository:
```bash
git clone [your-repository-url]
cd cadtuh-1013-group-project
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install Python 3.10 (required for CGI support):
```bash
# On macOS:
brew install python@3.10

# On Ubuntu/Debian:
sudo apt-get install python3.10

# On Windows:
# Download and install Python 3.10 from python.org
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Make the Python scripts executable:
```bash
chmod +x server.py
chmod +x cgi-bin/cart_form.py
```

## Running the Server

1. Start the server:
```bash
python3.10 server.py
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

## Project Structure

```
.
├── cgi-bin/
│   └── cart_form.py      # CGI script for form processing
├── css/
│   └── styles.css        # Stylesheet
├── images/               # Product images
├── js/
│   └── main.js          # JavaScript functionality
├── products.json         # Product data
├── server.py            # Local development server
├── requirements.txt     # Project dependencies
└── README.md           # This file
```

## Notes

- The server runs on port 8000 by default
- The CGI script requires Python 3.10 for the cgi module
- Product images should be placed in the images/ directory
- The cart data is stored in the browser's localStorage

## Troubleshooting

If you encounter the "No module named 'cgi'" error:
1. Make sure you have Python 3.10 installed
2. Verify that you're using Python 3.10 to run the server
3. Check that the virtual environment is activated

For any other issues, please check the browser's developer console for error messages.