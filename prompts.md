# Dokumentacja promptów

Poniżej zebrano chronologicznie najważniejsze prompty wykorzystane podczas rozwoju demonstracyjnego systemu komunikacji UKNF. Dla każdego promptu zapisano jego treść, skrócone podsumowanie odpowiedzi modelu oraz ocenę efektywności. Na końcu znajduje się krótka informacja o podziale pracy pomiędzy generowaniem kodu a edycją ręczną.

## 1. Szkic funkcjonalny nowych modułów
- **Czas**: 2025-01-08 10:05
- **Prompt**:
  > „Potrzebuję rozszerzyć istniejące API Spring Boot o moduł spraw administracyjnych i tablicę ogłoszeń. Podaj strukturę encji, wymagane relacje oraz przykładowe payloady REST dla listowania i aktualizacji rekordów. Baza: SQL Server.”
- **Odpowiedź modelu (skrót)**: Model zaproponował encję `Case` z polami status/priorytet, schemat encji `Announcement` z listą czytelników oraz przykładowe endpointy (`GET /cases`, `PATCH /announcements/{id}/ack`).
- **Efektywność**: ★★★★☆ – odpowiedź dała kompletny szkic i nazewnictwo pól, które po niewielkich korektach zostały wykorzystane w implementacji.

## 2. Implementacja warstwy serwisowej
- **Czas**: 2025-01-08 11:20
- **Prompt**:
  > „Na podstawie poprzedniego szkicu wygeneruj klasę serwisu Spring (`CaseService`) z metodami `findAll`, `create`, `update`, `updateStatus`. Uwzględnij walidację statusu i priorytetu oraz generowanie numeru sprawy.”
- **Odpowiedź modelu (skrót)**: Otrzymano kompletny szkielet klasy z metodami transakcyjnymi i helperami do walidacji enumeracji. Wymagał tylko uzupełnienia o obsługę null i dopasowanie typów ID.
- **Efektywność**: ★★★★★ – kod posłużył jako bezpośrednia baza implementacji, wprowadzono jedynie kosmetyczne poprawki.

## 3. Integracja frontendu z API
- **Czas**: 2025-01-08 12:15
- **Prompt**:
  > „Napisz komponent React dla strony ‘Sprawy’, który pobiera dane z endpointu `/cases`, obsługuje błąd połączenia (fallback do danych demo) oraz wyświetla informację o filtrach statusu i priorytetu.”
- **Odpowiedź modelu (skrót)**: Model przygotował komponent z `useEffect`, stanami `loading` i `error`, a także przykładowym filtrowaniem. Konieczna była integracja z istniejącym komponentem `DataTable` i dopasowanie typów.
- **Efektywność**: ★★★☆☆ – wskazał właściwy kierunek i obsługę błędów, jednak trzeba było ręcznie dopasować do struktury projektu.

## Najbardziej efektywny prompt
Prompt nr 2 okazał się najcenniejszy – dostarczył niemal kompletną klasę serwisu z poprawnie przygotowaną logiką transakcyjną. Dzięki temu implementacja backendu ograniczyła się do drobnych poprawek.

## Podział pracy
Kod backendu powstał głównie na bazie wygenerowanych fragmentów (prompt 1 i 2), natomiast warstwa frontendowa wymagała większej ingerencji manualnej – zaadaptowano wygenerowany kod (prompt 3), rozbudowano obsługę błędów i dostosowano go do komponentów istniejącej aplikacji. Dodatkowe prace manualne objęły przygotowanie migracji SQL oraz dokumentacji.
