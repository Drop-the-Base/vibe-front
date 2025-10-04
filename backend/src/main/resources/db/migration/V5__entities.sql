-- V5__entities_and_reports.sql
-- Entities (Supervised entities) and Reports

-- ===========================
-- TABLE: Entities
-- ===========================
CREATE TABLE Entities (
    EntityID INT IDENTITY(1,1) PRIMARY KEY,
    UknfCode NVARCHAR(50),                     -- Kod UKNF
    Name NVARCHAR(200) NOT NULL,               -- Nazwa podmiotu
    NIP NVARCHAR(20) UNIQUE,                   -- NIP
    KRS NVARCHAR(20),                          -- KRS
    LEI NVARCHAR(50),                          -- LEI
    Street NVARCHAR(150),
    BuildingNumber NVARCHAR(20),
    ApartmentNumber NVARCHAR(20),
    PostalCode NVARCHAR(10),
    City NVARCHAR(100),
    Phone NVARCHAR(50),
    Email NVARCHAR(150),
    RegistryNumber NVARCHAR(50),               -- Numer wpisu UKNF
    Status NVARCHAR(50) DEFAULT 'Active',      -- Wpisany / Niewpisany
    Category NVARCHAR(150),                    -- instytucje kredytowe / RIP
    CrossBorder BIT DEFAULT 0,                 -- Podmiot transgraniczny
    Type NVARCHAR(100),                        -- Typ podmiotu (np. Podmioty DORA)
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- ===========================
-- TABLE: Reports
-- ===========================
CREATE TABLE Reports (
    ReportID INT IDENTITY PRIMARY KEY,
    ReportCode NVARCHAR(50) NOT NULL UNIQUE,
    Title NVARCHAR(200) NOT NULL,
    EntityID INT NOT NULL,
    Category NVARCHAR(100),
    Status NVARCHAR(100) DEFAULT 'Pending Validation',
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    Deadline DATETIME2,
    AssignedTo NVARCHAR(150),
    LastModified DATETIME2 DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (EntityID) REFERENCES Entities(EntityID)
);

-- ===========================
-- INSERT: Entities (sample data)
-- ===========================

INSERT INTO Entities (Type, UknfCode, Name, NIP, KRS, LEI, Street, BuildingNumber, ApartmentNumber, PostalCode, City, Phone, Email, RegistryNumber, Status, Category, CrossBorder)
VALUES
(N'Podmioty DORA', N'UPN1000038391', N'mBank Spółka Akcyjna', N'5260215088', N'0000025237', N'259400DZXF7UJKK2AY35', N'UL. PROSTA', N'18', NULL, N'00-850', N'Warszawa', N'+48222222222', N'test@test.pl', NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000036482', N'SANTANDER CONSUMER BANK SPÓŁKA AKCYJNA', N'5272046102', N'0000040562', N'549300PXHEWNAGPV0398', N'UL. LEGNICKA', N'48 B', NULL, N'54-202', N'Wrocław', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000038785', N'BNP PARIBAS BANK POLSKA SPÓŁKA AKCYJNA', N'5261008546', N'0000011571', N'NMH2KF074RKAGTH4CM63', N'UL. MARCINA KASPRZAKA', N'2', NULL, N'01-211', N'Warszawa', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000035488', N'ABS BANK SPÓŁDZIELCZY', N'5510014311', N'0000124716', N'259400M5PYXTOBEZ5D78', N'UL. KRAKOWSKA', N'112', NULL, N'34-120', N'Andrychów', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000060468', N'BANK MILLENNIUM SPÓŁKA AKCYJNA', N'5260212931', N'0000010186', N'259400OFDZ9KPZEO8K78', N'UL. STANISŁAWA ŻARYNA', N'2A', NULL, N'02-593', N'Warszawa', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000060110', N'MAZOVIA BANK SPÓŁDZIELCZY', N'1230005183', N'0000073346', N'259400A8WSOCKAXELC26', N'UL. PIJARSKA', N'25', NULL, N'05-530', N'Góra Kalwaria', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000035381', N'BANK POCZTOWY SPÓŁKA AKCYJNA', N'5540314271', N'0000010821', N'259400DAAAR5M4A6SI23', N'UL. JAGIELLOŃSKA', N'17', NULL, N'85-959', N'Bydgoszcz', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000024045', N'VELOBANK SPÓŁKA AKCYJNA', N'7011105189', N'0000991173', N'2594000ZNGGQZXZKXH36', N'RONDO IGNACEGO DASZYŃSKIEGO', N'2C', NULL, N'00-843', N'Warszawa', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000035403', N'BANK SPÓŁDZIELCZY W SKOCZOWIE', N'5480077004', N'0000085240', N'259400DJGT5UJ9309W49', N'UL. OBJAZDOWA', N'10', NULL, N'43-430', N'Skoczów', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),
(N'Podmioty DORA', N'UPN1000046999', N'BANK POLSKA KASA OPIEKI - SPÓŁKA AKCYJNA', N'5260006841', N'0000014843', N'5493000LKS7B3UTF7H35', N'UL. ŻUBRA', N'1', NULL, N'01-066', N'Warszawa', NULL, NULL, NULL, N'Wpisany', N'instytucje kredytowe', 0),

-- Instytucje Pożyczkowe (RIP)
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000001579', N'MERCEDES-BENZ FINANCIAL SERVICES SP. Z O.O.', N'5223155133', N'0000777243', NULL, N'UL. GOTTLIEBA DAIMLERA', N'1', NULL, N'02-460', N'Warszawa', NULL, NULL, N'RIP000624', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000056250', N'SWISS CREDIT SUPPORT SP. Z O.O.', N'5833177937', N'0000552023', NULL, N'Aleja Grunwaldzka', N'82', NULL, N'80-244', N'Gdańsk', NULL, NULL, N'RIP000623', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000057598', N'ZWW SP. Z O.O.', N'8992830593', N'0000698437', NULL, N'UL. JURIJA GAGARINA', N'4', NULL, N'54-620', N'Wrocław', NULL, NULL, N'RIP000622', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000004262', N'JK INVESTMENT GROUP SP. Z O.O.', N'8172184680', N'0000693280', NULL, N'UL. ZAZAMCZE', N'56', NULL, N'33-200', N'Dąbrowa Tarnowska', NULL, NULL, N'RIP000619', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000001824', N'SZYBKI KREDYT SP. Z O.O.', N'5213861214', N'0000778360', NULL, N'UL. TYTUSA CHAŁUBIŃSKIEGO', N'8', NULL, N'00-613', N'Warszawa', NULL, NULL, N'RIP000618', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000002313', N'OREON SP. Z O.O.', N'5272776556', N'0000630857', NULL, N'UL. CHŁODNA', N'51', NULL, N'00-867', N'Warszawa', NULL, NULL, N'RIP000617', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000056523', N'MINICREDIT SP. Z O.O.', N'5252494263', N'0000371165', NULL, N'UL. MIGDAŁOWA', N'4', NULL, N'02-796', N'Warszawa', NULL, NULL, N'RIP000616', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000057642', N'NG PARTNERS SP. Z O.O.', N'9591964609', N'0000574341', NULL, N'UL. STEFANA ŻEROMSKIEGO', N'25', N'4', N'25-370', N'Kielce', NULL, NULL, N'RIP000615', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000058284', N'LENDER24 SP. Z O.O.', N'5273086836', N'0001071532', NULL, N'UL. ŻYTNIA', N'15', N'14', N'01-014', N'Warszawa', NULL, NULL, N'RIP000613', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000058292', N'DIGITALFIN SP. Z O.O.', N'5252819162', N'0000834880', NULL, N'UL. MODLIŃSKA', N'10', N'317', N'05-870', N'Błonie', NULL, NULL, N'RIP000612', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000000057', N'POLSKI STANDARD PŁATNOŚCI SP. AKCYJNA', N'5213664494', N'0001141221', NULL, N'UL. CZERNIAKOWSKA', N'87A', NULL, N'00-718', N'Warszawa', NULL, NULL, N'RIP000611', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000000020', N'SMARTNEY GRUPA ONEY SP. AKCYJNA', N'5272429317', N'0000204413', NULL, N'UL. KRAKOWIAKÓW', N'44', NULL, N'02-255', N'Warszawa', NULL, NULL, N'RIP000610', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000000036', N'RELIANCE CAPITAL SP. AKCYJNA', N'7011162603', N'0001055799', NULL, N'UL. ŻURAWIA', N'22', N'609', N'00-515', N'Warszawa', NULL, NULL, N'RIP000609', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000000004', N'FINTOPIA TECHNOLOGY SP. Z O.O.', N'5214009892', N'0001024410', NULL, N'UL. ANTONIEGO EDWARDA ODYŃCA', N'7', N'13', N'02-606', N'Warszawa', NULL, NULL, N'RIP000608', N'Wpisany', NULL, 0),
(N'Instytucja Pożyczkowa (RIP)', N'UPN1000000012', N'SAP TECHNOLOGY SP. Z O.O.', N'7010905982', N'0000770732', NULL, N'UL. NOWOGRODZKA', N'56A', N'306', N'00-695', N'Warszawa', NULL, NULL, N'RIP000606', N'Wpisany', NULL, 0);

-- ===========================
-- INSERT: Example report for testing
-- ===========================
INSERT INTO Reports (ReportCode, Title, EntityID, Category, Status, Deadline, AssignedTo)
SELECT
    N'RPT-2025-002',
    N'Raport adekwatności kapitałowej',
    EntityID,
    N'Raport regulacyjny',
    N'W trakcie walidacji',
    '2025-10-10T23:59:00',
    N'Tomasz Nowak'
FROM Entities
WHERE Name = N'mBank Spółka Akcyjna';
