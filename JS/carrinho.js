/* ================================================
   THE LADY'S CLOSET — Carrinho de Compras
   Adiciona produtos ao carrinho, guarda tudo no
   localStorage e envia o pedido para o WhatsApp
   no momento do checkout.
   ================================================ */
(function () {
  var CHAVE_CARRINHO = 'ladyscloset-carrinho';

  /* ATENÇÃO: substitua pelo número de WhatsApp real da loja,
     no formato internacional, sem espaços nem símbolos. */
  var NUMERO_WHATSAPP = '244954251078';

  function obterCarrinho() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    atualizarContador();
  }

  function formatarPreco(valor) {
    return valor.toLocaleString('pt-PT', { minimumFractionDigits: 0 }) + ' Kz';
  }

  function adicionarItem(produto) {
    var carrinho = obterCarrinho();
    var existente = carrinho.find(function (item) { return item.id === produto.id; });
    if (existente) {
      existente.quantidade += 1;
    } else {
      produto.quantidade = 1;
      carrinho.push(produto);
    }
    guardarCarrinho(carrinho);
    abrirCarrinho();
    renderizarCarrinho();
  }

  function removerItem(id) {
    var carrinho = obterCarrinho().filter(function (item) { return item.id !== id; });
    guardarCarrinho(carrinho);
    renderizarCarrinho();
  }

  function alterarQuantidade(id, delta) {
    var carrinho = obterCarrinho();
    var item = carrinho.find(function (i) { return i.id === id; });
    if (!item) return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(function (i) { return i.id !== id; });
    }
    guardarCarrinho(carrinho);
    renderizarCarrinho();
  }

  function calcularTotal(carrinho) {
    return carrinho.reduce(function (soma, item) { return soma + item.preco * item.quantidade; }, 0);
  }

  function atualizarContador() {
    var carrinho = obterCarrinho();
    var total = carrinho.reduce(function (soma, item) { return soma + item.quantidade; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  }

  function renderizarCarrinho() {
    var lista = document.getElementById('carrinhoItens');
    var totalEl = document.getElementById('carrinhoTotal');
    if (!lista) return;
    var carrinho = obterCarrinho();

    if (!carrinho.length) {
      lista.innerHTML = '<div class="carrinho-vazio">O seu carrinho está vazio.<br>Explore a nossa coleção e adicione as suas peças favoritas.</div>';
      if (totalEl) totalEl.textContent = formatarPreco(0);
      return;
    }

    lista.innerHTML = carrinho.map(function (item) {
      return (
        '<div class="carrinho-item" data-id="' + item.id + '">' +
          '<img src="' + item.imagem + '" alt="' + item.nome + '">' +
          '<div class="carrinho-item-info">' +
            '<h4>' + item.nome + '</h4>' +
            '<span class="preco">' + formatarPreco(item.preco) + '</span>' +
            '<div class="qtd-control">' +
              '<button type="button" data-acao="menos" aria-label="Diminuir quantidade">–</button>' +
              '<span>' + item.quantidade + '</span>' +
              '<button type="button" data-acao="mais" aria-label="Aumentar quantidade">+</button>' +
            '</div>' +
            '<button type="button" class="remover-item">Remover</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    if (totalEl) totalEl.textContent = formatarPreco(calcularTotal(carrinho));

    lista.querySelectorAll('.carrinho-item').forEach(function (el) {
      var id = el.getAttribute('data-id');
      el.querySelector('[data-acao="mais"]').addEventListener('click', function () { alterarQuantidade(id, 1); });
      el.querySelector('[data-acao="menos"]').addEventListener('click', function () { alterarQuantidade(id, -1); });
      el.querySelector('.remover-item').addEventListener('click', function () { removerItem(id); });
    });
  }

  function abrirCarrinho() {
    var drawer = document.getElementById('carrinhoDrawer');
    var overlay = document.getElementById('carrinhoOverlay');
    if (drawer) drawer.classList.add('aberto');
    if (overlay) overlay.classList.add('aberto');
    document.body.style.overflow = 'hidden';
  }

  function fecharCarrinho() {
    var drawer = document.getElementById('carrinhoDrawer');
    var overlay = document.getElementById('carrinhoOverlay');
    if (drawer) drawer.classList.remove('aberto');
    if (overlay) overlay.classList.remove('aberto');
    document.body.style.overflow = '';
  }

  function irParaWhatsApp() {
    var carrinho = obterCarrinho();
    if (!carrinho.length) return;

    var mensagem = 'Olá, The Lady\'s Closet! Gostaria de finalizar o seguinte pedido:%0A%0A';
    carrinho.forEach(function (item) {
      mensagem += '• ' + item.nome + ' — Qtd: ' + item.quantidade + ' — ' + formatarPreco(item.preco * item.quantidade) + '%0A';
    });
    mensagem += '%0ATotal: ' + formatarPreco(calcularTotal(carrinho));
    mensagem += '%0A%0AAguardo confirmação da disponibilidade e da forma de entrega. Obrigada!';

    var url = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + mensagem;
    window.open(url, '_blank');
  }

  document.addEventListener('DOMContentLoaded', function () {
    atualizarContador();
    renderizarCarrinho();

    document.querySelectorAll('.add-carrinho').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var produto = {
          id: botao.getAttribute('data-id'),
          nome: botao.getAttribute('data-nome'),
          preco: parseFloat(botao.getAttribute('data-preco')),
          imagem: botao.getAttribute('data-imagem')
        };
        adicionarItem(produto);
      });
    });

    document.querySelectorAll('[data-abrir-carrinho]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        renderizarCarrinho();
        abrirCarrinho();
      });
    });
    document.querySelectorAll('[data-fechar-carrinho]').forEach(function (el) {
      el.addEventListener('click', fecharCarrinho);
    });

    var overlay = document.getElementById('carrinhoOverlay');
    if (overlay) overlay.addEventListener('click', fecharCarrinho);

    var botaoFinalizar = document.getElementById('finalizarPedido');
    if (botaoFinalizar) botaoFinalizar.addEventListener('click', irParaWhatsApp);
  });
})();
