-- V8: Add FileStorage table to store file blobs and metadata
CREATE TABLE FileStorage (
    FileID INT IDENTITY PRIMARY KEY,
    FileName NVARCHAR(255),
    FileData VARBINARY(MAX),
    UploadedAt DATETIME DEFAULT GETDATE()
);
