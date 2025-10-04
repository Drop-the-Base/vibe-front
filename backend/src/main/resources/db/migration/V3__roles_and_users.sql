-- V3__roles_and_users.sql
-- Roles, Permissions, and Users

CREATE TABLE Roles (
                       RoleID INT IDENTITY PRIMARY KEY,
                       Name NVARCHAR(100) NOT NULL UNIQUE,
                       Description NVARCHAR(255)
);

CREATE TABLE Permissions (
                             PermissionID INT IDENTITY PRIMARY KEY,
                             Name NVARCHAR(100) NOT NULL UNIQUE,
                             Description NVARCHAR(255)
);

CREATE TABLE RolePermissions (
                                 RoleID INT NOT NULL,
                                 PermissionID INT NOT NULL,
                                 PRIMARY KEY (RoleID, PermissionID),
                                 FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
                                 FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID)
);

CREATE TABLE Users (
                       UserID INT IDENTITY PRIMARY KEY,
                       FullName NVARCHAR(150) NOT NULL,
                       Email NVARCHAR(150) NOT NULL UNIQUE,
                       Organization NVARCHAR(150),
                       RoleID INT NOT NULL,
                       Status NVARCHAR(50) DEFAULT 'Active',
                       LastLogin DATETIME2,
                       CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
                       FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Sample data
INSERT INTO Roles (Name, Description)
VALUES
    (N'Admin', N'Full system access'),
    (N'UKNF_Employee', N'UKNF staff role'),
    (N'Supervised_Entity', N'Regulated entity user');
