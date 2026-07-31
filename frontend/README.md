# Frontend LUERP

Interface Angular para conversar com o assistente de IA do backend Spring Boot.

O frontend envia mensagens para `http://localhost:8080/chat` e exibe as respostas formatadas no chat.

## Tecnologias

- Angular 21
- TypeScript
- CSS
- Vitest para testes

## Pré-requisitos

- Node.js compatível com Angular 21
- npm
- Backend rodando em `http://localhost:8080`

## Instalação

Na pasta `frontend`, instale as dependências:

```bash
npm install
```

## Rodar em desenvolvimento

Inicie o servidor local:

```bash
npm start
```

Depois acesse:

```text
http://localhost:4200
```

A aplicação recarrega automaticamente quando os arquivos do frontend são alterados.

## Rodar o backend

Em outro terminal, a partir da raiz do projeto:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

## Build de produção

Para gerar a versão de build:

```bash
npm run build
```

Os arquivos gerados ficam em `dist/frontend`.

## Testes

Para executar os testes:

```bash
npm test -- --watch=false
```

## Estrutura principal

```text
frontend/
  src/
    app/
      app.ts
      app.html
      app.css
    styles.css
```
