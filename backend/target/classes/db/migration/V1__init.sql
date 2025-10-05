CREATE TABLE test (
                      id INT IDENTITY(1,1) PRIMARY KEY,
                      name NVARCHAR(100) NOT NULL,
                      created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

INSERT INTO test (name) VALUES (N'Pierwszy rekord'), (N'Drugi rekord');