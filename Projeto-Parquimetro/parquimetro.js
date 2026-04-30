class Parquimetro {
    constructor (){
        this.valorMinimo = 1.00;
    }
    processarPagamento(valor){
        if (valor < this.valorMinimo){
            return { sucesso: false, mensagem: "Valor mínimo é R$ 1,00"};
        }

        let tempo = 0;
        let troco = 0;

        if (valor >= 3.00){
            tempo = 120;
            troco = valor - 3.00;
        } else if (valor >= 1.75){
            tempo = 60;
            troco = valor - 1.75;
        } else {
            tempo = 30;
            troco = valor -1.00;
        }
        return {
            sucesso: true,
            tempoAprovado: tempo,
            valorTroco: troco.toFixed(2),
            mensagem: "Pagamento realizado com sucesso!"
        };
    }
}

const minhaMaquina = new Parquimetro();
const formulario = document.getElementById('form-pagamento');
const campoTempo = document.getElementById('tempo-desejado');
const campoDinheiro = document.getElementById('valor-moeda');
const visorTempo = document.getElementById('visor-tempo');
const textoStatus = document.getElementById('mensagem-status');
const containerRecibo = document.getElementById('recibo-final');
const botaoLimpar = document.getElementById('btn-limpar');
const botaoNovoTicket = document.getElementById('btn-novo-ticket');

function limparTela() {
    formulario.reset();
    textoStatus.textContent = 'Aguardando Valor...';
    visorTempo.textContent = '00:00';
    containerRecibo.hidden = true;

    const reciboValor = document.getElementById('recibo-valor');
    const reciboTempo = document.getElementById('recibo-tempo');
    const reciboTroco = document.getElementById('recibo-troco');
    if (reciboValor) reciboValor.textContent = '0,00';
    if (reciboTempo) reciboTempo.textContent = '0';
    if (reciboTroco) reciboTroco.textContent = '0,00';

    campoDinheiro.focus();
}

function formatarMoedaBRL(valor) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valor);
}

function obterTarifaPorMinutos(minutos) {
    const tabela = {
        30: 1.00,
        60: 1.75,
        120: 3.00,
    };
    return tabela[minutos] ?? null;
}

function formatarTempo(minutosTotais) {
    const minutos = Math.max(0, Math.floor(minutosTotais));
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
}

botaoLimpar?.addEventListener('click', limparTela);
botaoNovoTicket?.addEventListener('click', limparTela);

formulario.addEventListener('submit', function(evento){
    evento.preventDefault();
    const valorPuro = String(campoDinheiro.value ?? '').trim().replace(',', '.');
    const valorConvertido = parseFloat(valorPuro);
    const tempoSelecionado = String(campoTempo?.value ?? 'auto');

    if (Number.isNaN(valorConvertido)) {
        textoStatus.textContent = 'Informe um valor válido.';
        visorTempo.textContent = '00:00';
        containerRecibo.hidden = true;
        return;
    }

    let resultado;

    if (tempoSelecionado === 'auto') {
        resultado = minhaMaquina.processarPagamento(valorConvertido);
    } else {
        const minutosDesejados = parseInt(tempoSelecionado, 10);
        const tarifa = obterTarifaPorMinutos(minutosDesejados);

        if (!tarifa) {
            textoStatus.textContent = 'Selecione um tempo válido.';
            visorTempo.textContent = '00:00';
            containerRecibo.hidden = true;
            return;
        }

        if (valorConvertido < tarifa) {
            textoStatus.textContent = `Valor insuficiente. Para ${minutosDesejados} minutos, deposite R$ ${formatarMoedaBRL(tarifa)}.`;
            visorTempo.textContent = '00:00';
            containerRecibo.hidden = true;
            return;
        }

        const troco = valorConvertido - tarifa;
        resultado = {
            sucesso: true,
            tempoAprovado: minutosDesejados,
            valorTroco: troco.toFixed(2),
            mensagem: 'Pagamento realizado com sucesso!',
        };
    }

    if(resultado.sucesso) {
        textoStatus.textContent = resultado.mensagem;

        document.getElementById('recibo-valor').textContent = formatarMoedaBRL(valorConvertido);
        document.getElementById('recibo-tempo').textContent = resultado.tempoAprovado;
        document.getElementById('recibo-troco').textContent = formatarMoedaBRL(Number(resultado.valorTroco));
        visorTempo.textContent = formatarTempo(resultado.tempoAprovado);
        containerRecibo.hidden = false;
    } else {
        textoStatus.textContent = resultado.mensagem;
        visorTempo.textContent = '00:00';
        containerRecibo.hidden = true;
    }
    campoDinheiro.value = "";
});
