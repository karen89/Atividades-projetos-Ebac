const form = document.getElementById('form-cadastro');
const btnLimpar = document.getElementById('btn-limpar');
const msgSucesso = document.getElementById('msg-sucesso');

const inputCep = document.getElementById('cep');
const cepStatus = document.getElementById('cep-status');

const STORAGE_KEY = 'cadastro_usuario_v1';

let debounceId = null;

function salvarDados() {
    const dados = new FormData(form);
    const objeto = Object.fromEntries(dados.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objeto));
}

function restaurarDados() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    let objeto;
    try {
        objeto = JSON.parse(raw);
    } catch {
        return;
    }

    Object.keys(objeto).forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.value = objeto[id];
    });
}

function limparEndereco() {
    document.getElementById('logradouro').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('localidade').value = '';
    document.getElementById('uf').value = '';
}

function mostrarSucesso() {
    msgSucesso.hidden = false;
    window.clearTimeout(mostrarSucesso._t);
    mostrarSucesso._t = window.setTimeout(() => {
        msgSucesso.hidden = true;
    }, 2500);
}

function buscarCep(cepLimpo) {
    cepStatus.textContent = 'Buscando...';

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((response) => response.json())
        .then((data) => {
            if (data.erro) {
                cepStatus.textContent = 'CEP não encontrado';
                limparEndereco();
                salvarDados();
                return;
            }

            document.getElementById('logradouro').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('localidade').value = data.localidade || '';
            document.getElementById('uf').value = data.uf || '';
            cepStatus.textContent = 'OK';
            salvarDados();
        })
        .catch((erro) => {
            console.error('Erro ao buscar o CEP:', erro);
            cepStatus.textContent = 'Erro';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    restaurarDados();
});

form.addEventListener('input', () => {
    salvarDados();
});

form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    salvarDados();
    mostrarSucesso();
});

btnLimpar.addEventListener('click', () => {
    form.reset();
    limparEndereco();
    cepStatus.textContent = '';
    localStorage.removeItem(STORAGE_KEY);
});

inputCep.addEventListener('input', (evento) => {
    const cepLimpo = evento.target.value.replace(/\D/g, '');

    if (debounceId) window.clearTimeout(debounceId);

    if (cepLimpo.length < 8) {
        cepStatus.textContent = '';
        limparEndereco();
        salvarDados();
        return;
    }

    if (cepLimpo.length !== 8) return;

    debounceId = window.setTimeout(() => buscarCep(cepLimpo), 400);
});

inputCep.addEventListener('blur', (evento) => {
    const cepLimpo = evento.target.value.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        cepStatus.textContent = '';
        limparEndereco();
        salvarDados();
        return;
    }

    buscarCep(cepLimpo);
});

