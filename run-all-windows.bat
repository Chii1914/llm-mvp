@echo off
REM run-all-windows.bat — launch backend, frontend, docker, and locust in new cmd windows
SETLOCAL ENABLEDELAYEDEXPANSION









































































ENDLOCAL
necho All commands issued. Check opened windows for logs/output.
necho Press any key to close this launcher window (services will keep running in their own windows).
npause >nul)  echo locustfile.py not found; skipping Locust step.) else (  )    echo Locust not found; skipping Locust step.  ) else (    start "Locust" cmd /k "cd /d "%ROOT%\ms-nosql-ecommerce" && locust -f locustfile.py --host http://localhost:3000"    echo Starting Locust UI...  if %ERRORLEVEL%==0 (  where locust >nul 2>&1if exist "%ROOT%\ms-nosql-ecommerce\locustfile.py" (
nREM Start Locust UI (if present))  echo Frontend folder not found: %ROOT%\frontend) else (  )    echo npm not found; cannot start frontend automatically.  ) else (    start "Frontend" cmd /k "cd /d "%ROOT%\frontend" && npm run dev"    echo Starting frontend (dev)...  if %ERRORLEVEL%==0 (  where npm >nul 2>&1if exist "%ROOT%\frontend" (
nREM Start frontend)  echo Backend folder not found: %ROOT%\ms-nosql-ecommerce) else (  )    echo No pnpm/npm found; cannot start backend automatically.  ) else (    start "Backend" cmd /k "cd /d "%ROOT%\ms-nosql-ecommerce" && npm run start:dev"    echo Starting backend with npm...  ) else if "%PKG%"=="npm" (    start "Backend" cmd /k "cd /d "%ROOT%\ms-nosql-ecommerce" && pnpm run start:dev"    echo Starting backend with pnpm...  if "%PKG%"=="pnpm" (if exist "%ROOT%\ms-nosql-ecommerce" (
nREM Start backend)  echo No docker-compose file found, skipping docker step.) else (  )    echo Docker not found, skipping docker-compose  ) else (    start "Docker" cmd /k "cd /d "%ROOT%\docker" && docker compose up -d && echo Docker up -d finished & pause"    echo Starting docker-compose in detached mode...  if %ERRORLEVEL%==0 (  where docker >nul 2>&1if exist "%ROOT%\docker\docker-compose.yml" (
nREM Docker-compose (if present)echo Detected package manager: %PKG%)  )    set "PKG="  ) else (    set "PKG=npm"  if %ERRORLEVEL%==0 (  where npm >nul 2>&1) else (  set "PKG=pnpm"where pnpm >nul 2>&1
nif %ERRORLEVEL%==0 (
nREM detect package managerecho Root: %ROOT%if not exist "%LOGS%" mkdir "%LOGS%"set "LOGS=%ROOT%\logs"set "ROOT=%ROOT:~0,-1%"set "ROOT=%~dp0"nREM Script root