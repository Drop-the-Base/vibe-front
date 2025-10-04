-- V3__roles_and_users.sql
-- roles, permissions, role_permissions, users (snake_case)

CREATE TABLE roles (
                       role_id INT IDENTITY PRIMARY KEY,
                       name NVARCHAR(100) NOT NULL UNIQUE,
                       description NVARCHAR(255)
);

CREATE TABLE permissions (
                             permission_id INT IDENTITY PRIMARY KEY,
                             name NVARCHAR(100) NOT NULL UNIQUE,
                             description NVARCHAR(255)
);

CREATE TABLE role_permissions (
                                  role_id INT NOT NULL,
                                  permission_id INT NOT NULL,
                                  PRIMARY KEY (role_id, permission_id),
                                  FOREIGN KEY (role_id) REFERENCES roles(role_id),
                                  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
);

CREATE TABLE users (
                       user_id INT IDENTITY PRIMARY KEY,
                       full_name NVARCHAR(150) NOT NULL,
                       email NVARCHAR(150) NOT NULL UNIQUE,
                       password NVARCHAR(255),
                       organization NVARCHAR(150),
                       role_id INT NOT NULL,
                       status NVARCHAR(50) DEFAULT 'active',
                       last_login DATETIME2,
                       created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
                       FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Sample data
INSERT INTO roles (name, description)
VALUES
    (N'admin', N'Full system access'),
    (N'uknf_employee', N'UKNF staff role'),
    (N'supervised_entity', N'Regulated entity users');
