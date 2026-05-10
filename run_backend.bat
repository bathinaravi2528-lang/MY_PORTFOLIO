@echo off
echo Starting Python Portfolio Backend...
cd backend
python -m pip install -r requirements.txt
python -m uvicorn server:app --reload --host [IP_ADDRESS] --port 8000
pause
