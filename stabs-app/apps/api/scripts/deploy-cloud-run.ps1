param(
  [string]$ProjectId = "tommys-stabssoftware",
  [string]$Region = "europe-west4",
  [string]$Service = "stabs-api",
  [string]$CloudSqlInstance = "tommys-stabssoftware:europe-west4:stabs-db",
  [string]$DatabaseUrlSecret = "stabs-api-database-url"
)

$ErrorActionPreference = "Stop"

$gcloud = "C:\Users\thbro\tools\google-cloud-sdk\bin\gcloud.cmd"

if (-not (Test-Path $gcloud)) {
  throw "gcloud wurde nicht unter $gcloud gefunden."
}

$databaseSecretBinding = "DATABASE_URL=$($DatabaseUrlSecret):latest"

& $gcloud run deploy $Service `
  --source . `
  --project $ProjectId `
  --region $Region `
  --allow-unauthenticated `
  --add-cloudsql-instances $CloudSqlInstance `
  --set-secrets $databaseSecretBinding `
  --format "value(status.url)"
