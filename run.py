"""
SatQuery AI - Launcher Script
Runs the Streamlit interactive dashboard.
"""

import os
import subprocess
import sys

def main():
    app_path = os.path.join(os.path.dirname(__file__), "satquery", "app.py")
    print(f"🛰️ Launching SatQuery AI on {app_path}...")
    subprocess.run([sys.executable, "-m", "streamlit", "run", app_path])

if __name__ == "__main__":
    main()
