INSERT INTO categories (name, description, active)
SELECT 'Artesanais', 'Hamburgueres artesanais da casa', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = LOWER('Artesanais')
);

INSERT INTO categories (name, description, active)
SELECT 'Tradicionais e Lanches', 'Lanches tradicionais e hamburgueres populares', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = LOWER('Tradicionais e Lanches')
);

INSERT INTO categories (name, description, active)
SELECT 'Bebidas', 'Bebidas para acompanhar seu pedido', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = LOWER('Bebidas')
);

INSERT INTO categories (name, description, active)
SELECT 'Acompanhamentos', 'Complementos e porcoes para compartilhar', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE LOWER(name) = LOWER('Acompanhamentos')
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Classic Burguer',
    'Hamburguer artesanal 100g, queijo mussarela, alface, tomate e maionese da casa.',
    17.00,
    '/assets/images/classic_burguer.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Artesanais')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Classic Burguer') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Bacon Burguer',
    'Hamburguer artesanal 100g, bacon crocante, queijo mussarela, cebola caramelizada e molho barbecue.',
    19.00,
    '/assets/images/bacon_burguer.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Artesanais')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Bacon Burguer') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Burguer da Casa',
    'Hamburguer artesanal 100g, cream cheese, queijo coalho, cebola caramelizada e tomate.',
    15.00,
    '/assets/images/burguer_da_asa.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Artesanais')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Burguer da Casa') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Cupim Burguer',
    'Hamburguer, cupim desfiado, queijo cheddar, bacon, cebola caramelizada e alface.',
    28.00,
    '/assets/images/houseBurguerAlberto.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Artesanais')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Cupim Burguer') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Frango Burguer',
    'Frango desfiado, batata palha, molho barbecue, cenoura, queijo mussarela e alface.',
    18.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Tradicionais e Lanches')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Frango Burguer') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Tradicional Carpina',
    'Hamburguer, queijo mussarela, alface, cebola e tomate.',
    8.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Tradicionais e Lanches')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Tradicional Carpina') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Chicken Burguer',
    'Empanado de frango, cream cheese, cebola, alface e tomate.',
    8.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Tradicionais e Lanches')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Chicken Burguer') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Refrigerante lata',
    'Bebida gelada em lata.',
    6.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Bebidas')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Refrigerante lata') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Agua Mineral',
    'Agua mineral sem gas.',
    3.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Bebidas')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Agua Mineral') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Suco copo 300ml',
    'Suco natural em copo de 300ml.',
    4.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Bebidas')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Suco copo 300ml') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Batata Frita (P)',
    'Porcao pequena de batata frita crocante.',
    8.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Acompanhamentos')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Batata Frita (P)') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Batata cheddar e bacon',
    'Batata frita coberta com cheddar e bacon.',
    15.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Acompanhamentos')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Batata cheddar e bacon') AND p.category_id = c.id
);

INSERT INTO products (name, description, price, image_url, available, category_id)
SELECT
    'Aneis de cebola',
    'Porcao de aneis de cebola empanados.',
    8.00,
    '/assets/images/product_placeholder.png',
    TRUE,
    c.id
FROM categories c
WHERE LOWER(c.name) = LOWER('Acompanhamentos')
  AND NOT EXISTS (
    SELECT 1 FROM products p
    WHERE LOWER(p.name) = LOWER('Aneis de cebola') AND p.category_id = c.id
);

INSERT INTO store_settings (
    id,
    store_open,
    opening_message,
    closing_message,
    whatsapp_number,
    delivery_fee,
    minimum_order_value
) VALUES (
    1,
    TRUE,
    'Loja aberta. Seu pedido sera preparado com carinho!',
    'Loja fechada no momento. Voltamos no proximo horario de atendimento.',
    '5581989543788',
    0.00,
    10.00
)
ON CONFLICT (id) DO NOTHING;
