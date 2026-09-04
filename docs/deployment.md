# 🚀 Deployment Guide

## 1. Local Python Environment
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Or on Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI Backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# Run Streamlit Web Application
streamlit run satquery/app.py

# Or launch Orbit IQ 3D WebGL Web App:
python -m http.server 8000
# Open index.html
```

## 2. Docker & Docker Compose
```bash
# Build and run containers
docker-compose up --build -d

# Check service logs
docker-compose logs -f
```
- Backend API Docs: `http://localhost:8000/docs`
- Interactive Dashboard: `http://localhost:8501`
