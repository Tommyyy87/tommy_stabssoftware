# Deployment-Status

Stand: `2026-05-14`

## Live-Systeme

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend: `https://stabs-api-1059988621010.europe-west4.run.app`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`

## Projektzuordnung

- Firebase-Projekt: `tommys-stabssoftware`
- App-Hosting-Backend: `stabsbackend`
- Cloud-Run-Service: `stabs-api`
- Region: `europe-west4`

## Repo-Pfade

- Repo-Root: `D:\Dropbox\dev\Stabsarbeit\stabs-app`
- Frontend-Quellstand: `stabs-app/apps/web`
- Frontend-Deploy-Ordner: `stabs-app/firebase-web`
- Backend: `stabs-app/apps/api`

## Bekannte Zugriffe

- Demo-Benutzer: `admin`
- Demo-Passwort: `demo`

## Was aktuell sichtbar funktionieren muss

- Frontend ist online erreichbar
- Backend-Health liefert `status: ok`
- Frontend zeigt einen Live-Bereich fuer Backend-Status und die erste Lage

## Relevante Deploy-Dateien

- Frontend-Deploy-Konfiguration: `firebase-web/apphosting.yaml`
- Backend-Containerbuild: `apps/api/Dockerfile`
- Lokaler Cloud-Run-Deploy-Weg: `apps/api/scripts/deploy-cloud-run.ps1`
