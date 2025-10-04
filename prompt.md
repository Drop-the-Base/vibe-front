## generate layout (figma)
W erze sztucznej inteligencji proces wytwarzania oprogramowania przechodzi fundamentalną
transformację. Tradycyjne podejście do pisania kodu linia po linii ustępuje miejsca nowej
metodologii, w której deweloperzy stają się prompt inżynierami, a kod jest generowany przy
użyciu odpowiednio zaprojektowanych instrukcji dla dużych modeli językowych.
Zadanie ma na celu stworzenie demo systemu, z maksymalnym wsparciem modeli AI podczas
procesu wytwórczego. Oprócz dostarczenia działającej aplikacji, zespoły muszą
udokumentować proces pracy z modelami do generowania kodu. Celem jest pokazanie, jak
poprzez odpowiednie konstruowanie i iterowanie promptów udało się uzyskać finalny efekt.
UKNF w zakresie wymiany informacji związanych z realizowaniem obowiązków nadzorczych
potrzebuje aplikacji do bezpiecznej i szybkiej komunikacji z Podmiotami nadzorowanymi.
Demo systemu powinno składać się z trzech głównych modułów: Modułu Uwierzytelnienia i
Autoryzacji, Modułu Komunikacyjnego oraz Modułu Administracji systemem.
Zależy nam na funkcjonalności preferowanych. Ale są również innowacje, usprawnienia,
funkcjonalności dodatkowe – które będą dodatkowym punktem w ocenie.
Funkcjonalności preferowane
Moduł Komunikacyjny, który ma umożliwiać:
• obsługę przyjmowania sprawozdań przekazywanych przez podmioty nadzorowane
z komunikacją zwrotną,
• obsługę wiadomości z możliwością dołączania załączników zapewniającą
dwukierunkową komunikację pomiędzy użytkownikami wewnętrznym a zewnętrznymi,
• utrzymanie lokalnego repozytorium plików realizującego funkcję biblioteki,
• obsługę i prowadzenie spraw dotyczących podmiotów nadzorowanych,
• obsługę komunikatów w formie tablicy ogłoszeń, z opcją do wszystkich albo do
wybranych grup podmiotów, z potwierdzeniem odczytania przez użytkowników
podmiotów,
• obsługę adresatów, grup kontaktów i kontaktów,
• prowadzenie bazy pytań i odpowiedzi dającej możliwość zadawania pytań i
przeglądania odpowiedzi w konwencji FAQ,
• obsługę kartoteki podmiotów i aktualizację informacji o podmiotach
nadzorowanych.
Funkcjonalności dodatkowe
Moduł Uwierzytelnienia i Autoryzacji ma umożliwiać:
• rejestrację użytkowników zewnętrznych poprzez formularz online,
• obsługę wniosków o dostęp z przypisywaniem uprawnień dla użytkowników
zewnętrznym,
• wybór podmiotu reprezentowanego w ramach sesji przez uwierzytelnionego
użytkownika zewnętrznego.
Moduł Administracyjny ma umożliwiać:
• zarządzanie kontami użytkowników wewnętrznych i zewnętrznych przez
pracowników UKNF z rolą administratora systemu,
• zarządzanie polityką haseł w systemie,
• zarządzanie rolami użytkowników wewnętrznych i zewnętrznych.


przygotowaniu demo systemu w środowisku kontenerowym wraz z dostarczeniem pliku
docker-compose.yml/compose.yml,
− zaimplementowaniu portalu zgodnie z nowoczesnymi standardami programistycznymi
jako aplikacja typu SPA (Single Page Application) z architekturą backend opartą o
REST API,
− wykorzystaniu oprogramowania typu OpenSource.
implementację frontendu systemu w Angular
− implementację backendu systemu w OpenJDK lub .NET
− wykorzystanie relacyjnej bazy danych (preferowany MSSQL)
Cechy UI
Ogólne cechy całego UI:
− spójna nawigacja – główne menu z podziałem na moduły z zastosowaniem
breadcrumbs,
− personalizacja – widoki dostosowane do roli użytkownika (pracownik urzędu,
administrator podmiotu, przedstawiciel podmiotu).
Cechy UI dla Modułu Komunikacyjnego:
− dashboard komunikacyjny – skróty do sprawozdań, wiadomości, spraw, powiadomień
i tablicy ogłoszeń,
− obsługa sprawozdań – zestawienie sprawozdań ze statusami w formie etykiet (np.
„przyjęte”, „w trakcie walidacji”, „odrzucone”), z możliwością podglądu szczegółów,
business Architektura logiczna - Platforma Komunikacyjna
PLATFORMA KOMUNIKACYJNA
Moduł Komunikacyjny
Sprawozdania
Sprawy
Komunikaty
Biblioteka
Moduł Uwierzytelniania i Autoryzacji
Uwierzytelnienie Wnioski
Autoryzacja
Formularz kontaktowy
Moduł Adminstracyjny
Zarządzanie
użytkownikami
Polityka haseł
Role i uprawnienia
Baza Podmiotów
Aktualizator danych podmiotu
Użytkownik
zewnętrzny
Użytkownik
wewnętrzny
− wiadomości dwukierunkowe – przypominające pocztę elektroniczną, z opcją
załączników i filtrowania po wątku / podmiocie,
− repozytorium plików – biblioteka z możliwością wyszukiwania, filtrowania, oznaczania
wersji i uprawnień dostępu,
− obsługa spraw administracyjnych – widok w formie „teczki sprawy”, z etapami procesu
i przypisanymi dokumentami,
− aktualizacja danych podmiotów – formularze z walidacją pól i historią zmian.
Cechy UI dla Modułu Uwierzytelnienia i Autoryzacji:
− ekran rejestracji – prosty intuicyjny formularz rejestracji online,
− logowanie – poprzez konto zewnętrzne,
− panel zarządzania dostępami – status wniosków o dostęp widoczny dla użytkowników
i administratorów,
− wybór roli / podmiotu reprezentowanego – rozwijane menu podczas sesji, przyjazny
przełącznik kontekstu użytkownika.
Cechy UI dla Modułu Administracyjnego:
− panel administracyjny – widok tabelaryczny z listą użytkowników, podmiotów i
przypisanych ról,
− zarządzanie kontami – funkcje aktywacji/dezaktywacji kont, reset haseł, blokady
konta i nadawania ról,
− polityka haseł – panel ustawień (siła hasła, długość).
Zawartość przykładowej strony głównej
Nagłówek i nawigacja:
− pasek główny z logo instytucji, nazwą systemu, opcją wylogowania,
− widoczne aktualnie obsługiwane konto/rola/podmiot oraz szybkie przełączanie
reprezentowanego podmiotu.
Panel powitalny (górny panel):
− informacja o zalogowanym użytkowniku (imię, nazwisko, rola, nazwa podmiotu),
Pulpit główny z kafelkami (przykładowy układ)
Kafelek lub sekcja Funkcja
Dostępne podmioty Lista dostępnych podmiotów
Status wniosków o dostęp Liczba oczekujących i rozpatrzonych wniosków
Nowe wiadomości i
powiadomienia
Liczba nowych/oczekujących wiadomości z możliwością
szybkiego podglądu
Statusy sprawozdań Lista kilku ostatnich sprawozdań z etykietami: do przesłania, w
trakcie walidacji, odrzucone, zaakceptowane
Tablica ogłoszeń
(komunikaty)
Ostatnie komunikaty z opcją potwierdzenia odczytu
Panel zadań/aktywności „do
zrobienia”
Powiadomienia o nowych zdarzeniach
Sekcje szczegółowe (rozwijane/kontekstowe panele)
Sekcja/panel Funkcja
Ostatnie sprawy Lista ostatnich spraw administracyjnych z możliwością
filtrowania po podmiocie/statusie
Ostatnie zdarzenia Oś czasu (timeline) głównych zdarzeń: sprawozdania, zmiany
w kontach, działania administracyjne np.:
- 10.09.2025, 11:00: Nowy komunikat w tablicy ogłoszeń
- 10.09.2025, 09:45: Złożono sprawozdanie "XYZ"
- 09.09.2025, 17:30: Zmieniono uprawnienia użytkownika
Wskaźniki bezpieczeństwa Np. ostatnie udane logowanie, ostatnia zmiana hasła,
aktywność na koncie
Powiadomienia i alerty:
− panel powiadomień z ikoną i licznikiem (dostępny z każdego ekranu).
UI widoków zestawień i list
Podstrony prezentujące zestawienia i listy np. spraw, wiadomości, sprawozdań, zdarzeń oraz
komunikatów powinny opierać się na interaktywnych, konfigurowalnych tabelach, które
zapewniają efektywne zarządzanie dużą liczbą rekordów poprzez intuicyjne wyszukiwanie,
sortowanie, filtrowanie i eksport danych do różnych formatów
Kluczowe cechy UI list i tabel:
− widoczne pole wyszukiwania nad tabelą, umożliwiające szybkie filtrowanie rekordów
po dowolnym ciągu znaków (np. tytuł sprawy, ID, nazwisko użytkownika),
− możliwość sortowania każdej kolumny przez kliknięcie nagłówka (strzałki
rosnąco/malejąco; podwójne kliknięcie resetuje do domyślnej kolejności),
− zaawansowane filtrowanie:
o filtry kontekstowe w nagłówkach (np. wybór parametru z listy rozwijanej,
zakres dat, statusy, typy dokumentów),
o możliwość nakładania wielu filtrów naraz i ich szybkiego resetowania,
− stronicowanie (paginacja) dla dużych tabel, z możliwością wyboru liczby rekordów na
stronie oraz przejściem do wybranego numeru strony.
Funkcje eksportu danych:
− dedykowany przycisk „Eksportuj” nad lub pod tabelą, rozwijający menu wyboru
formatu: XLSX, CSV, JSON,
− eksport z zachowaniem bieżących filtrów, sortowania i wyselekcjonowanych kolumn,
− Informacja o limicie eksportowanych rekordów (jeśli taki istnieje),
− komunikat zwrotny po udanej lub nieudanej próbie eksportu.
Funkcje użytkowe:
− każdy wiersz zawiera akcje kontekstowe (np. „Podgląd”, „Edytuj”, „Pobierz”, „Usuń”)
w formie ikon lub menu hamburgera,
− nagłówki tabel pozostają przyklejone przy przewijaniu (sticky header),
− każda z funkcjonalności powinna być jasno oznaczona, łatwo dostępna i reagować
natychmiast (dynamiczne zawężanie wyświetlanej listy wyników, animacje ładowania,
wyraźne przyciski).

dodaj stronę logowania i zapisu nowych użytkowaników. niech twardo zapisanym użytkownikiem będzie login kowalski password: kowalski

stronę wiadomości, tak, żeby naciśnięcie wiadomości powodowało jej wyświetlenie

## add modals
Update the Entities table to display all the values and also add modal to create new entities

stwórz dodawanie nowych wiadomości 
powinno być miejsce na temat maila, adresata, treść maila i załączniki. strona powinna pojawiać się tak jak otwieranie wiadomości czyli poprzez modal