# House Burguer Grill

Projeto front-end de uma hamburgueria, feito com HTML, CSS e JavaScript puro.
O foco e ser simples, organizado e facil de entender para estudo (nivel 3o/4o periodo).

## Contexto do projeto

Este projeto foi desenvolvido para uma hamburgueria real, pertencente a um amigo do autor.
O desenvolvimento e uso deste material foram autorizados por ele.

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## Estrutura de arquivos

- `index.html`: estrutura da pagina e popup de checkout
- `style.css`: estilos visuais, responsividade e modal
- `script.js`: carrinho, regras do checkout e envio para WhatsApp

## Como executar

1. Abra a pasta do projeto.
2. Clique duas vezes no `index.html` (ou abra com Live Server no VS Code).
3. O site roda localmente, sem dependencias externas complexas.

## Funcionalidades atuais

- Header com logo e navegacao
- Hero section com botoes de acao
- Cardapio organizado por categorias
- Carrinho com:
  - adicionar item
  - remover 1 unidade
  - limpar carrinho
  - total de itens e valor total
- Popup de checkout ao concluir pedido, com campos de cliente
- Opcao de tipo de pedido:
  - Retirada
  - Entrega
- Regra de retirada:
  - esconde campos de endereco
  - esconde forma de pagamento (resolve no local)
- Forma de pagamento na entrega:
  - PIX
  - Cartao de credito
  - Dinheiro
- Se escolher Dinheiro:
  - aparece bloco "Necessario troco?"
  - campo "Troco para quanto"
- Envio automatico do pedido pelo WhatsApp com mensagem formatada

## Configuracoes importantes

### Numero do WhatsApp

No arquivo `script.js`, altere a constante:

```js
const WHATSAPP_NUMBER = "5581989543788";
```

Use formato internacional, sem `+`, sem espacos e sem simbolos.

### Instagram no rodape

O link do Instagram esta no `index.html`, na secao de redes sociais.

## Contribuicoes

Este repositorio e publico e aceita colaboracao de outros devs.

- Abra uma `Issue` para bugs, sugestoes e melhorias.
- Envie `Pull Request` com descricao clara do que foi alterado.
- Mantenha o codigo simples e didatico, seguindo a proposta do projeto.

## Observacao

Este projeto foi feito para aprendizado e pode ser expandido aos poucos (ex.: persistencia com localStorage, painel admin, etc.).
