# Communication Platform Demo

Demo system wspierający komunikację UKNF z podmiotami nadzorowanymi. Projekt zawiera aplikację frontendową (React + Vite) oraz backend w Spring Boot obsługujący REST API i migracje bazy SQL Server.

## Funkcjonalności

### Backend
* zarządzanie sprawami administracyjnymi (`/cases`), w tym aktualizacja statusu i priorytetu,
* tablica ogłoszeń z potwierdzeniem odczytu (`/announcements`),
* repozytorium plików, FAQ, użytkownicy – istniejące moduły z wcześniejszych iteracji,
* migracje Flyway (`backend/src/main/resources/db/migration`) z przykładowymi danymi.

### Frontend
* pulpit i moduły komunikacyjne z tabelami inspirowanymi PrimeNG (`DataTable`),
* podstrona **Sprawy** pobierająca dane z API i obsługująca fallback do danych demo,
* tablica **Ogłoszenia** z dynamicznym potwierdzeniem odczytu,
* dokumentacja procesu promptowania (`prompts.md`).

## Wymagania wstępne

* Node.js 20+
* JDK 21
* Docker (do uruchomienia SQL Servera przez `compose.yaml`)

## Uruchomienie środowiska

### 1. Baza danych
```bash
cd docker
docker compose up -d
```

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run   # lub mvn spring-boot:run, jeśli mvnw nie jest dostępny
```

Aplikacja startuje na porcie `8080`. Dokumentacja OpenAPI jest dostępna pod `/swagger-ui/index.html`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Domyślny adres frontendowy: `http://localhost:5173`. Zmienne środowiskowe (np. `VITE_API_URL`) można ustawić w pliku `.env`.

## Kluczowe endpointy REST

| Metoda | Ścieżka | Opis |
| ------ | ------ | ---- |
| `GET`  | `/cases` | Lista spraw administracyjnych |
| `POST` | `/cases` | Rejestracja nowej sprawy |
| `PATCH`| `/cases/{id}` | Aktualizacja metadanych sprawy |
| `PATCH`| `/cases/{id}/status` | Zmiana statusu i notatki |
| `GET`  | `/announcements` | Lista komunikatów tablicy ogłoszeń |
| `POST` | `/announcements/{id}/acknowledgements` | Potwierdzenie odczytu |

## Struktura repozytorium

```
backend/     # Spring Boot + Flyway
frontend/    # Aplikacja Vite/React
docker/      # docker compose z MSSQL
prompts.md   # Dokumentacja wykorzystanych promptów AI
```

## Testowe loginy

Frontend zawiera fikcyjne dane logowania opisane w `frontend/src/features/auth/services/demo-auth.ts`. W razie problemów aplikacja wyświetli dane demonstracyjne oparte na `frontend/src/lib/mock-data.ts`.
