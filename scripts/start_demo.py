"""
SatQuery AI - Unified Demo Launcher
"""

import sys
import subprocess
import os

def main():
    print("🛰️ Starting SatQuery AI (SIH26167)...")
    print("  1. Interactive Web Interface (Streamlit): http://localhost:8501")
    print("  2. Orbit IQ WebGL App: index.html")
    print("  3. FastAPI Backend: http://localhost:8000/docs")

    app_path = os.path.join("satquery", "app.py")
    subprocess.run([sys.executable, "-m", "streamlit", "run", app_path])

if __name__ == "__main__":
    main()
