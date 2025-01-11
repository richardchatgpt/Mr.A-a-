// Evento do formulário para confirmar o pedido
document.getElementById('acaiForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    let pedido = {};
    pedido.nome = document.getElementById('nome').value;  // Coleta o nome completo
    pedido.tamanho = document.getElementById('tamanho').value;
    pedido.adicionais = [];
    pedido.frutas = [];
    pedido.contato = document.getElementById('contato').value;
    pedido.total = 0; // Inicia o total do pedido

    // Preço do Tamanho
    const tamanho = document.getElementById('tamanho');
    const tamanhoPreco = parseFloat(tamanho.options[tamanho.selectedIndex].getAttribute('data-preco'));
    pedido.total += tamanhoPreco; // Soma o preço do tamanho ao total

    // Coleta adicionais
    const adicionais = document.querySelectorAll('input[name="adicional"]:checked');
    adicionais.forEach(function(adicional) {
        pedido.adicionais.push(adicional.parentElement.textContent.trim());
        pedido.total += parseFloat(adicional.getAttribute('data-preco')); // Soma o preço do adicional
    });

    // Coleta frutas
    const frutas = document.querySelectorAll('input[name="fruta"]:checked');
    frutas.forEach(function(fruta) {
        pedido.frutas.push(fruta.parentElement.textContent.trim());
        pedido.total += parseFloat(fruta.getAttribute('data-preco')); // Soma o preço da fruta
    });

    // Recupera os pedidos do localStorage ou cria um array vazio se não houver
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Verifica se o pedido já foi adicionado (evitar duplicação)
    let existePedido = pedidos.some(function(p) {
        return JSON.stringify(pedido) === JSON.stringify(p);
    });

    if (!existePedido) {
        // Adiciona o novo pedido à lista de pedidos
        pedidos.push(pedido);
        // Salva os pedidos no localStorage
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    // Exibe a mensagem de confirmação
    exibirMensagemConfirmacao();

    // Limpa o formulário após o pedido ser feito
    document.getElementById('acaiForm').reset();

    // Atualiza o total para 0
    document.getElementById('total').innerText = '0,00';

    // Chama a função para exibir os pedidos no painel
    exibirPedidos();
});

// Função para exibir a mensagem de confirmação
function exibirMensagemConfirmacao() {
    // Cria uma div de mensagem
    let mensagem = document.createElement('div');
    mensagem.classList.add('mensagem-confirmacao');
    mensagem.innerHTML = 'Seu pedido foi confirmado! Em breve entraremos em contato.';

    // Adiciona a mensagem ao body
    document.body.appendChild(mensagem);

    // Remove a mensagem após 5 segundos (opcional)
    setTimeout(function() {
        mensagem.remove();
    }, 5000);
}

// Função para exibir os pedidos no painel
function exibirPedidos() {
    // Recupera os pedidos armazenados no localStorage
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    let pedidoList = document.getElementById('pedidoList');
    pedidoList.innerHTML = ''; // Limpa a lista antes de adicionar novos pedidos

    if (pedidos.length === 0) {
        pedidoList.innerHTML = "<p>Não há pedidos no momento.</p>";
    }

    // Exibe apenas o último pedido
    let pedido = pedidos[pedidos.length - 1]; // Pega o último pedido
    let div = document.createElement('div');
    div.classList.add('pedido');
    
    let html = `<strong>Pedido #${pedidos.length}</strong><br>`;
    html += `<strong>Nome:</strong> ${pedido.nome} <br>`;  // Exibe o nome completo
    html += `<strong>Tamanho:</strong> ${pedido.tamanho} - R$ ${pedido.total.toFixed(2)}<br>`;

    if (pedido.adicionais.length > 0) {
        html += `<div class="adicionais"><strong>Adicionais:</strong> ${pedido.adicionais.join(', ')}</div>`;
    }

    if (pedido.frutas.length > 0) {
        html += `<div class="frutas"><strong>Frutas:</strong> ${pedido.frutas.join(', ')}</div>`;
    }

    html += `<strong>Contato:</strong> ${pedido.contato}<br>`;
    html += `<strong>Total:</strong> R$ ${pedido.total.toFixed(2)}`; // Exibe o total do pedido

    div.innerHTML = html;
    pedidoList.appendChild(div);
}

// Função para calcular o preço total dinamicamente (ao alterar o formulário)
document.getElementById('acaiForm').addEventListener('change', function() {
    calcularPreco();
});

// Função para calcular o preço
function calcularPreco() {
    let total = 0;

    // Preço do tamanho
    const tamanho = document.getElementById('tamanho');
    total += parseFloat(tamanho.options[tamanho.selectedIndex].getAttribute('data-preco'));

    // Adicionais
    const adicionais = document.querySelectorAll('input[name="adicional"]:checked');
    adicionais.forEach(function(adicional) {
        total += parseFloat(adicional.getAttribute('data-preco'));
    });

    // Frutas
    const frutas = document.querySelectorAll('input[name="fruta"]:checked');
    frutas.forEach(function(fruta) {
        total += parseFloat(fruta.getAttribute('data-preco'));
    });

    // Atualiza o preço total
    document.getElementById('total').innerText = total.toFixed(2);
}
