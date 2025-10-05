-- V9: Add metadata columns to files table (category, version, uploaded_by, tags)

IF OBJECT_ID('dbo.files', 'U') IS NOT NULL
BEGIN
    ALTER TABLE files ADD
        category NVARCHAR(255) NULL,
        version NVARCHAR(100) NULL,
        uploaded_by NVARCHAR(255) NULL,
        tags NVARCHAR(1000) NULL;
END
ELSE
BEGIN
    CREATE TABLE files (
        id BIGINT IDENTITY PRIMARY KEY,
        filename NVARCHAR(255) NOT NULL UNIQUE,
        path NVARCHAR(2000) NULL,
        size BIGINT NULL,
        category NVARCHAR(255) NULL,
        version NVARCHAR(100) NULL,
        uploaded_by NVARCHAR(255) NULL,
        tags NVARCHAR(1000) NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END
