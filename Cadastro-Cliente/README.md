# Cadastro de Mensalista (ViaCEP + Web Storage)

Aplicação em **HTML/CSS/JavaScript** que realiza **cadastro de usuário/mensalista** com:

- **Preenchimento automático de endereço pelo CEP** usando **Fetch API** e a API do **ViaCEP**
- **Persistência dos dados do formulário** com **Web Storage API (localStorage)**, mantendo os campos preenchidos após recarregar a página

## Como executar

1. Baixe/clone o repositório.
2. Abra o arquivo `Cadastro-Cliente/cadastro.html` no navegador.

Recomendado: usar um servidor local (ex.: extensão **Live Server** no VS Code) para recarregar automaticamente e evitar limitações do `file://`.

## Como usar

1. Preencha os dados do mensalista.
2. Digite o **CEP** (somente números ou com hífen). Ao completar **8 dígitos**, o sistema consulta o ViaCEP e preenche:
   - `logradouro`, `bairro`, `localidade` (cidade) e `uf`
3. Recarregue a página: os dados continuam preenchidos (persistência no `localStorage`).
4. Clique em **Limpar** para apagar o formulário e remover o rascunho salvo.

## Persistência (localStorage)

- Chave usada: `rascunho_mensalista`
- Para verificar:
  - Abra o DevTools (F12) → aba **Application** → **Local Storage**
  - Procure a chave `rascunho_mensalista`

## Estrutura

- `Cadastro-Cliente/cadastro.html` — interface do formulário
- `Cadastro-Cliente/cadastro.css` — estilos
- `Cadastro-Cliente/cadastro.js` — regras de:
  - salvar/restaurar dados do formulário (Web Storage)
  - consulta ViaCEP (Fetch API)
  - máscaras de CPF e telefones
  - alternância das abas (Novo Cadastro / Clientes)

## Observações

- O preenchimento do endereço depende de conexão com a internet para consultar o ViaCEP.
- O campo de CEP é normalizado para apenas números antes da consulta (remove `-` e outros caracteres).

