# Frontend Angular - House Burguer Grill

Frontend novo (Angular standalone) preparado para integrar com backend REST em `/api/v1`.

## Rodar local

```bash
npm install
npm start
```

Build:

```bash
npm run build
```

## Configuracao de API

A URL da API e lida em runtime por `window.__HOUSE_BURGUER_CONFIG__.apiBaseUrl`.

Arquivo: `src/index.html`

Exemplo:

```html
<script>
  window.__HOUSE_BURGUER_CONFIG__ = {
    apiBaseUrl: 'http://localhost:8080/api/v1',
    useMockPublicData: true,
  };
</script>
```

`useMockPublicData` em `true` usa fallback local para cardapio e status da loja (modo migracao).

## Contratos esperados (backend)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Publico
- `GET /public/menu`
- `GET /public/store-settings`

### Cliente autenticado
- `POST /orders`
- `GET /orders/me`

### Admin
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/{id}`
- `DELETE /admin/products/{id}`
- `POST /admin/products/image` (multipart)
- `GET /admin/store-settings`
- `PUT /admin/store-settings`
- `GET /admin/orders`
- `PATCH /admin/orders/{id}/status`

## Funcionalidades implementadas

- Home com cardapio e status da loja.
- Carrinho persistente em `localStorage`.
- Login e cadastro.
- Guard de autenticacao e guard de admin.
- Interceptor para `Authorization: Bearer`.
- Interceptor de refresh token em `401`.
- Checkout com pedido interno e link opcional para WhatsApp apos criar pedido.
- Historico de pedidos do cliente.
- Painel admin: produtos, loja e pedidos.
