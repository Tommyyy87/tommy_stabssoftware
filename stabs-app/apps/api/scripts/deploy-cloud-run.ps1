param(
  [string]$ProjectId = "tommys-stabssoftware",
  [string]$Region = "europe-west4",
  [string]$Service = "stabs-api"
)

$ErrorActionPreference = "Stop"

$gcloud = "C:\Users\thbro\tools\google-cloud-sdk\bin\gcloud.cmd"

if (-not (Test-Path $gcloud)) {
  throw "gcloud wurde nicht unter $gcloud gefunden."
}

& $gcloud run deploy $Service `
  --source . `
  --project $ProjectId `
  --region $Region `
  --allow-unauthenticated `
  --format "value(status.url)"
