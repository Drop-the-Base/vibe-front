-- Tables supporting administrative cases and bulletin board announcements

CREATE TABLE case_records (
    case_id            BIGINT IDENTITY(1,1) PRIMARY KEY,
    case_number        NVARCHAR(50)  NOT NULL UNIQUE,
    title              NVARCHAR(200) NOT NULL,
    category           NVARCHAR(100),
    entity_id          INT           NOT NULL,
    status             NVARCHAR(50)  NOT NULL,
    priority           NVARCHAR(20)  NOT NULL,
    assigned_to        NVARCHAR(150),
    description        NVARCHAR(MAX),
    created_at         DATETIME2     NOT NULL,
    updated_at         DATETIME2     NOT NULL,
    due_at             DATETIME2,
    CONSTRAINT fk_case_entity FOREIGN KEY (entity_id) REFERENCES entities(entity_id)
);

CREATE INDEX ix_case_records_entity ON case_records (entity_id);
CREATE INDEX ix_case_records_status ON case_records (status);
CREATE INDEX ix_case_records_priority ON case_records (priority);

CREATE TABLE announcements (
    announcement_id             BIGINT IDENTITY(1,1) PRIMARY KEY,
    title                       NVARCHAR(200) NOT NULL,
    content                     NVARCHAR(MAX) NOT NULL,
    priority                    NVARCHAR(20)  NOT NULL,
    target_type                 NVARCHAR(20)  NOT NULL,
    requires_acknowledgement    BIT           NOT NULL DEFAULT 0,
    published_at                DATETIME2     NOT NULL,
    expires_at                  DATETIME2,
    total_recipients            INT,
    created_at                  DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE announcement_target_groups (
    announcement_id BIGINT NOT NULL,
    group_name      NVARCHAR(200) NOT NULL,
    CONSTRAINT pk_announcement_target_groups PRIMARY KEY (announcement_id, group_name),
    CONSTRAINT fk_announcement_group FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id) ON DELETE CASCADE
);

CREATE TABLE announcement_readers (
    reader_entry_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    announcement_id BIGINT NOT NULL,
    reader_id       NVARCHAR(100)  NOT NULL,
    reader_name     NVARCHAR(200)  NOT NULL,
    reader_entity   NVARCHAR(200),
    read_at         DATETIME2      NOT NULL,
    CONSTRAINT uq_announcement_reader UNIQUE (announcement_id, reader_id, reader_entity),
    CONSTRAINT fk_announcement_reader FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id) ON DELETE CASCADE
);

-- Demo data
INSERT INTO case_records (case_number, title, category, entity_id, status, priority, assigned_to, description, created_at, updated_at, due_at)
SELECT
    'CASE-2025-001',
    N'Zmiana danych rejestrowych',
    N'Zmiana danych rejestrowych',
    e.entity_id,
    'IN_PROGRESS',
    'HIGH',
    N'Magdalena Lis',
    N'Podmiot zgłosił zmianę adresu siedziby. Konieczna weryfikacja dokumentów rejestrowych.',
    DATEADD(day, -10, SYSUTCDATETIME()),
    SYSUTCDATETIME(),
    DATEADD(day, 5, SYSUTCDATETIME())
FROM entities e
WHERE e.name = N'mBank Spółka Akcyjna';

INSERT INTO case_records (case_number, title, category, entity_id, status, priority, assigned_to, description, created_at, updated_at, due_at)
SELECT
    'CASE-2025-002',
    N'Uprawnienia do systemu',
    N'Uprawnienia do Systemu',
    e.entity_id,
    'NEW',
    'MEDIUM',
    N'Paweł Wrona',
    N'Wniosek o nadanie dostępu dla nowego administratora zewnętrznego.',
    DATEADD(day, -4, SYSUTCDATETIME()),
    DATEADD(day, -4, SYSUTCDATETIME()),
    DATEADD(day, 10, SYSUTCDATETIME())
FROM entities e
WHERE e.name = N'Bank Polska Kasa Opieki - Spółka Akcyjna';

INSERT INTO case_records (case_number, title, category, entity_id, status, priority, assigned_to, description, created_at, updated_at)
SELECT
    'CASE-2025-003',
    N'Wezwanie do podmiotu',
    N'Wezwanie do Podmiotu Nadzorowanego',
    e.entity_id,
    'CLOSED',
    'LOW',
    N'Joanna Marek',
    N'Przekazanie informacji o konieczności uzupełnienia sprawozdania kwartalnego. Zadanie wykonane.',
    DATEADD(day, -20, SYSUTCDATETIME()),
    DATEADD(day, -2, SYSUTCDATETIME())
FROM entities e
WHERE e.name = N'SANTANDER CONSUMER BANK SPÓŁKA AKCYJNA';

INSERT INTO announcements (title, content, priority, target_type, requires_acknowledgement, published_at, expires_at, total_recipients)
VALUES
    (
        N'Nowa wersja szablonu sprawozdania kwartalnego',
        N'Udostępniliśmy zaktualizowany szablon sprawozdania kwartalnego obowiązujący od raportowania za Q4 2025. Prosimy o pobranie nowego pliku z biblioteki dokumentów.',
        'HIGH',
        'GROUP',
        1,
        DATEADD(day, -1, SYSUTCDATETIME()),
        DATEADD(day, 14, SYSUTCDATETIME()),
        128
    ),
    (
        N'Planowana przerwa techniczna',
        N'W najbliższą sobotę (od 22:00 do 02:00) system będzie niedostępny z powodu prac serwisowych. Przepraszamy za utrudnienia.',
        'MEDIUM',
        'ALL',
        0,
        DATEADD(day, -3, SYSUTCDATETIME()),
        NULL,
        412
    );

-- target groups for first announcement
INSERT INTO announcement_target_groups (announcement_id, group_name)
SELECT a.announcement_id, g.group_name
FROM (VALUES (N'Instytucje kredytowe'), (N'Instytucje Pożyczkowe (RIP)')) AS g(group_name)
CROSS JOIN announcements a
WHERE a.title = N'Nowa wersja szablonu sprawozdania kwartalnego';

-- readers acknowledging the high priority announcement
INSERT INTO announcement_readers (announcement_id, reader_id, reader_name, reader_entity, read_at)
SELECT a.announcement_id, v.reader_id, v.reader_name, v.reader_entity, DATEADD(hour, -3, SYSUTCDATETIME())
FROM announcements a
JOIN (VALUES
    ('U-1001', N'Anna Lewandowska', N'mBank Spółka Akcyjna'),
    ('U-1033', N'Piotr Wiśniewski', N'SANTANDER CONSUMER BANK SPÓŁKA AKCYJNA')
) AS v(reader_id, reader_name, reader_entity)
    ON a.title = N'Nowa wersja szablonu sprawozdania kwartalnego';

INSERT INTO announcement_readers (announcement_id, reader_id, reader_name, reader_entity, read_at)
SELECT a.announcement_id, 'U-2001', N'Marcin Zawadzki', N'UKNF', DATEADD(hour, -6, SYSUTCDATETIME())
FROM announcements a
WHERE a.title = N'Planowana przerwa techniczna';
