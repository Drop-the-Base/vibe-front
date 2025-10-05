#!/bin/bash
set -euo pipefail

echo "Waiting for SQL Server to be ready..."
ready=0
for attempt in {1..60}; do
  if /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" >/dev/null 2>&1; then
    ready=1
    echo "SQL Server is ready."
    break
  fi
  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "SQL Server did not become ready in time." >&2
  exit 1
fi

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'uknf')
BEGIN
  CREATE DATABASE uknf;
  PRINT N'Created database uknf';
END
ELSE
  PRINT N'Database uknf already exists';
"