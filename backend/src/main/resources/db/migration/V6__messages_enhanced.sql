IF OBJECT_ID('dbo.message_attachments', 'U') IS NOT NULL
    DROP TABLE dbo.message_attachments;

IF OBJECT_ID('dbo.messages', 'U') IS NOT NULL
    DROP TABLE dbo.messages;

CREATE TABLE dbo.messages (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    thread_id UNIQUEIDENTIFIER NOT NULL,
    entity_ref NVARCHAR(100) NULL,
    subject NVARCHAR(200) NOT NULL,
    body NVARCHAR(MAX) NOT NULL,
    sender NVARCHAR(200) NOT NULL,
    sender_role NVARCHAR(100) NULL,
    sender_type NVARCHAR(50) NOT NULL,
    recipient NVARCHAR(200) NOT NULL,
    recipient_role NVARCHAR(100) NULL,
    recipient_type NVARCHAR(50) NOT NULL,
    direction NVARCHAR(20) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    has_attachments BIT NOT NULL DEFAULT 0,
    reply_to_id BIGINT NULL,
    read_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.message_attachments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    message_id BIGINT NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    content_type NVARCHAR(100) NULL,
    file_size BIGINT NOT NULL,
    storage_path NVARCHAR(500) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_message_attachments_message FOREIGN KEY (message_id)
        REFERENCES dbo.messages (id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_thread ON dbo.messages(thread_id);
CREATE INDEX idx_messages_entity ON dbo.messages(entity_ref);
CREATE INDEX idx_messages_status ON dbo.messages(status);
CREATE INDEX idx_messages_direction ON dbo.messages(direction);
CREATE INDEX idx_message_attachments_message ON dbo.message_attachments(message_id);

INSERT INTO dbo.messages (
    thread_id,
    entity_ref,
    subject,
    body,
    sender,
    sender_role,
    sender_type,
    recipient,
    recipient_role,
    recipient_type,
    direction,
    status,
    has_attachments
) VALUES
    (NEWID(), 'entity-001', 'Welcome to the communication portal', 'Welcome to the UKNF communication portal. This channel supports secure two-way messaging.', 'UKNF Support', 'Supervisor', 'internal', 'All Administrators', 'Entity Administrator', 'external', 'outbound', 'sent', 0),
    (NEWID(), 'entity-002', 'Missing quarterly report data', 'Please provide the missing records for the Q2 report package. Attach the corrected file to this conversation.', 'UKNF Support', 'Supervisor', 'internal', 'Entity XYZ Admin', 'Entity Administrator', 'external', 'outbound', 'sent', 1);

INSERT INTO dbo.message_attachments (
    message_id,
    file_name,
    content_type,
    file_size,
    storage_path
)
SELECT id, 'report-checklist.pdf', 'application/pdf', 24576, '/attachments/report-checklist.pdf'
FROM dbo.messages WHERE has_attachments = 1;
