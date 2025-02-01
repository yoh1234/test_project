#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting Django Backend Build Process..."

# Install dependencies
echo "Installing Python packages..."
pip install -r requirements.txt

# Apply migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Django Backend Build Completed Successfully!"