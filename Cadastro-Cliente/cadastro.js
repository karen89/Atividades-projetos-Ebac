const formulario = document.getElementById('form-cadastro');
const secaoCadastro = document.getElementById('secao-cadastro');
const secaoLista = document.getElementById('secao-lista');

const btnAbaCadastro = document.getElementById('aba-cadastro');
const btnAbaLista = document.getElementById('aba-lista');

const msgSucesso = document.getElementById('msg-sucesso');
const inputCep = document.getElementById('cep');
const cepStatus = document.getElementById('cep-status');

const STORAGE_KEY = 'rascunho_mensalista';

let cepDebounceId = null;

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

//FormaData = captura todos os campos do formulário de uma vez
//Storage_key = constante que guarda o nome da chave do localStorage, em vez de escrever a string direto toda vez
//Object.fromEntries = transforma essa lista em objeto
function salvarDados() {
    const dados = new FormData(formulario);
    const objeto = Object.fromEntries(dados.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objeto));
}

function buscarCepPreencher(cepLimpo) {
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

formulario.addEventListener('input', () => {
    salvarDados();
});

inputCep.addEventListener('input', (evento) => {
    evento.target.value = evento.target.value.replace(/\D/g, '');
    const cepLimpo = evento.target.value.replace(/\D/g, '');

    // Debouce = tempo de espera para fazer o requerimento a API em uma única chamada
    if (cepDebounceId) clearTimeout(cepDebounceId);

    if (cepLimpo.length < 8) {
        cepStatus.textContent = '';
        limparEndereco();
        salvarDados();
        return;
    }
    if (cepLimpo.length !== 8) return;

    cepDebounceId = setTimeout(() => buscarCepPreencher(cepLimpo), 400);
});

document.getElementById('btn-limpar').addEventListener('click', () => {
    formulario.reset();
    cepStatus.textContent = '';
    limparEndereco();
    localStorage.removeItem(STORAGE_KEY);
});

btnAbaLista.addEventListener('click', () => {
    secaoCadastro.hidden = true;
    secaoLista.hidden = false;
});

document.getElementById('numero').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Máscara CPF: 000.000.000-00
document.getElementById('cpf').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9)      v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    this.value = v;
});

// Máscara telefone 1: (11) 99999-9999
document.getElementById('telefone').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)     v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    this.value = v;
});

// Máscara telefone 2 — mesmo padrão
document.getElementById('telefone2').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)     v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    this.value = v;
});

btnAbaCadastro.addEventListener('click', () => {
    secaoCadastro.hidden = false;
    secaoLista.hidden = true;
});

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!(formulario.checkValidity())){
        formulario.reportValidity();
        return;
    }

    salvarDados();

    msgSucesso.hidden = false;
    setTimeout(() => {
        msgSucesso.hidden = true;
    }, 2500);
});
