#!/bin/bash
set -e

echo "⏳ Czekam na gotowość SQL Servera..."
# Pętlą czekamy aż zacznie odpowiadać (max ~2 min)
for i in {1..10}; do
  if /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'uknf')
BEGIN
  CREATE DATABASE uknf;
  PRINT N'✅ Utworzono bazę danych uknf';
END
ELSE
  PRINT N'ℹ️ Baza danych uknf już istnieje';
"
