# Loads Railway Postgres public URL into process env without printing secrets.
# Usage: . .\engineering\v2\deployment\scripts\set-prod-db-public.ps1
$ErrorActionPreference = "Stop"
$raw = railway variables --service Postgres --kv 2>&1 | Out-String
if ($raw -notmatch '(?m)^DATABASE_PUBLIC_URL=(.+)$') {
  throw "DATABASE_PUBLIC_URL not found on Postgres service"
}
$url = $Matches[1].Trim()
$env:DATABASE_URL = $url
$env:DATABASE_PUBLIC_URL = $url
$fp = [System.BitConverter]::ToString(
  [System.Security.Cryptography.SHA256]::Create().ComputeHash(
    [Text.Encoding]::UTF8.GetBytes($url)
  )
).Replace("-", "").Substring(0, 16).ToLower()
Write-Output "DATABASE_URL set from DATABASE_PUBLIC_URL (fp=$fp)"
