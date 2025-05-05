#!/usr/bin/python3
import cgi
import cgitb
import json
import os

cgitb.enable()

print("Content-Type: application/json\n")

form = cgi.FieldStorage()

try:
    name = form.getvalue('name')
    price = form.getvalue('price')
    image = form.getvalue('image')
    category = form.getvalue('category')
    description = form.getvalue('description')

    if not all([name, price, image, category, description]):
        raise ValueError("All fields are required")

    try:
        price = float(price)
        if price <= 0:
            raise ValueError("Price must be greater than 0")
    except ValueError:
        raise ValueError("Invalid price format")

    with open('../products.json', 'r+') as f:
        data = json.load(f)
        new_id = max(p['id'] for p in data['products']) + 1 if data['products'] else 1
        new_product = {
            "id": new_id,
            "name": name,
            "price": price,
            "image": image,
            "category": category,
            "description": description
        }
        data['products'].append(new_product)
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

    print(json.dumps({"status": "success", "message": "Item posted successfully!"}))

except Exception as e:
    print(json.dumps({"status": "error", "message": str(e)}))