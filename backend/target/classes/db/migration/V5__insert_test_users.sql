/* ===== Roles ===== */
IF NOT EXISTS (SELECT 1 FROM roles WHERE name = N'admin')
    INSERT INTO roles (name, description) VALUES (N'admin', N'Full system access');
IF NOT EXISTS (SELECT 1 FROM roles WHERE name = N'uknf_employee')
    INSERT INTO roles (name, description) VALUES (N'uknf_employee', N'UKNF staff role');
IF NOT EXISTS (SELECT 1 FROM roles WHERE name = N'supervised_entity')
    INSERT INTO roles (name, description) VALUES (N'supervised_entity', N'Regulated entity users');

/* ===== Permissions ===== */
DECLARE @perms TABLE(name NVARCHAR(100), description NVARCHAR(255));
INSERT INTO @perms(name, description) VALUES
                                          (N'user_read',         N'Can read users'),
                                          (N'user_write',        N'Can modify users'),
                                          (N'role_read',         N'Can read roles'),
                                          (N'role_write',        N'Can modify roles'),
                                          (N'permission_read',   N'Can read permissions'),
                                          (N'permission_write',  N'Can modify permissions'),
                                          (N'entity_read',       N'Can read entities'),
                                          (N'entity_write',      N'Can modify entities'),
                                          (N'report_read',       N'Can read reports'),
                                          (N'report_write',      N'Can create/modify reports'),
                                          (N'report_assign',     N'Can assign reports'),
                                          (N'report_validate',   N'Can validate reports');

INSERT INTO permissions(name, description)
SELECT p.name, p.description
FROM @perms p
WHERE NOT EXISTS (SELECT 1 FROM permissions x WHERE x.name = p.name);

/* ===== Role → Permissions mapping ===== */

/* admin → wszystkie */
INSERT INTO role_permissions(role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
         JOIN permissions p ON 1=1
WHERE r.name = N'admin'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
);

/* uknf_employee → zestaw operacyjny */
INSERT INTO role_permissions(role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
         JOIN permissions p ON p.name IN (
                                          N'user_read',
                                          N'entity_read', N'entity_write',
                                          N'report_read', N'report_write', N'report_assign', N'report_validate',
                                          N'role_read', N'permission_read'
    )
WHERE r.name = N'uknf_employee'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
);

/* supervised_entity → tylko praca nad własnymi raportami (tu bez zakresu, same prawa) */
INSERT INTO role_permissions(role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
         JOIN permissions p ON p.name IN (N'report_read', N'report_write')
WHERE r.name = N'supervised_entity'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
);

/* ===== Test users ===== */
/* hasła w plain text na DEV – pod auth z SELECT email AND password */
IF NOT EXISTS (SELECT 1 FROM users WHERE email = N'admin@example.com')
INSERT INTO users (full_name, email, password, organization, role_id, status)
SELECT N'Admin User', N'admin@example.com', N'admin123', N'UKNF', r.role_id, N'active'
FROM roles r WHERE r.name = N'admin';

IF NOT EXISTS (SELECT 1 FROM users WHERE email = N'employee@example.com')
INSERT INTO users (full_name, email, password, organization, role_id, status)
SELECT N'Employee User', N'employee@example.com', N'employee123', N'UKNF', r.role_id, N'active'
FROM roles r WHERE r.name = N'uknf_employee';

IF NOT EXISTS (SELECT 1 FROM users WHERE email = N'entity@example.com')
INSERT INTO users (full_name, email, password, organization, role_id, status)
SELECT N'Entity User', N'entity@example.com', N'entity123', N'ACME S.A.', r.role_id, N'active'
FROM roles r WHERE r.name = N'supervised_entity';
