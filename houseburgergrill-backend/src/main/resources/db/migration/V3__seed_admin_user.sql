CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (
    full_name,
    email,
    password_hash,
    role,
    active
) VALUES (
    '${admin_name}',
    '${admin_email}',
    crypt('${admin_password}', gen_salt('bf', 12)),
    'ADMIN',
    TRUE
)
ON CONFLICT (email) DO NOTHING;
