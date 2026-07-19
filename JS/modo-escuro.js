/* ================================================
   THE LADY'S CLOSET — Modo Escuro
   Alterna entre tema claro e escuro e guarda a
   preferência do utilizador no localStorage.
   ================================================ */
(function () {
  var CHAVE = 'ladyscloset-tema';

  function aplicarTema(tema) {
    if (tema === 'escuro') {
      document.documentElement.setAttribute('data-theme', 'escuro');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Aplica o tema guardado imediatamente (evita flash de tema errado)
  var temaGuardado = localStorage.getItem(CHAVE);
  if (temaGuardado) {
    aplicarTema(temaGuardado);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('escuro');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var botoes = document.querySelectorAll('.toggle-escuro');
    if (!botoes.length) return;

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        var atual = document.documentElement.getAttribute('data-theme');
        var novo = atual === 'escuro' ? 'claro' : 'escuro';
        aplicarTema(novo);
        localStorage.setItem(CHAVE, novo);
      });
    });
  });
})();
