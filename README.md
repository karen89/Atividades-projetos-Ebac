# Projeto Parquímetro

Aplicação simples (HTML/CSS/JS) que simula um parquímetro: você informa o valor depositado e o sistema calcula o tempo liberado e o troco. Ao final, gera um “ticket” pronto para impressão.

## Funcionalidades

- Cálculo automático de tempo pelo valor depositado (R$ 1,00 / 1,75 / 3,00)
- Opção de escolher o tempo (30/60/120 min) e validar valor mínimo
- Cálculo e exibição de troco
- Geração de ticket com botão de imprimir e botão “Gerar Novo Ticket”
- Estilo de impressão com cara de ticket

## Como executar

1. Baixe/clone o repositório.
2. Abra o arquivo `Projeto-Parquimetro/parquimetro.html` no navegador.

Opcional (recomendado): use uma extensão/servidor local, como “Live Server” (VS Code), para recarregar automaticamente.

## Como usar

1. Selecione o tempo desejado (ou deixe em **Automático**).
2. Digite o valor em reais (aceita vírgula ou ponto como decimal, ex: `1,75`).
3. Clique em **Confirmar e Estacionar**.
4. Confira o ticket e clique em **Imprimir Ticket** (ou **Gerar Novo Ticket** para reiniciar).

## Estrutura

- `Projeto-Parquimetro/parquimetro.html` — interface
- `Projeto-Parquimetro/parquimetro.css` — estilos (inclui `@media print`)
- `Projeto-Parquimetro/parquimetro.js` — regras de tarifa, cálculo e interação

## Licença

Este projeto está sob a licença MIT. Veja `LICENSE`.
