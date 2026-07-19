/* ================================================
   THE LADY'S CLOSET — Botão Voltar ao Topo
   Mostra o botão após rolagem e leva o utilizador
   suavemente até ao topo da página.
   ================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var botao = document.getElementById('botaoTopo');
    if (!botao) return;

    function verificarScroll() {
      if (window.scrollY > 420) {
        botao.classList.add('visivel');
      } else {
        botao.classList.remove('visivel');
      }
    }

    window.addEventListener('scroll', verificarScroll, { passive: true });
    verificarScroll();

    botao.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
