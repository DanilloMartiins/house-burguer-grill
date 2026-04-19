# House Burguer Grill

Aplicacao frontend da House Burguer Grill com migracao incremental de React para Angular.

## Estrutura atual

- `src/` (React + Vite): versao ativa em producao.
- `frontend-angular/` (Angular standalone): nova versao em migracao.

A estrategia atual e migracao incremental: React continua operando enquanto a cobertura do Angular aumenta.

## Como rodar

### React (base atual)

```bash
npm install
npm run dev:react
```

### Angular (nova base)

```bash
npm run install:angular
npm run dev:angular
```

### Builds

```bash
npm run build:react
npm run build:angular
```

## Modo incremental no Angular

- O Angular usa configuracao runtime no `frontend-angular/src/index.html`.
- `useMockPublicData: true` ativa fallback local para menu e status da loja.
- Quando o backend estiver pronto para endpoints publicos, troque para `useMockPublicData: false`.

## Objetivo da migracao

1. Manter React estavel ate paridade funcional.
2. Evoluir Angular com fluxos publicos, auth, pedidos e admin.
3. Mudar trafego para Angular somente apos validacao completa.

## Observacoes

- O backend esta fora deste fluxo por enquanto (foco exclusivo em frontend).
- O lint da raiz ignora `dist/` e `frontend-angular/` para evitar ruido entre stacks.
