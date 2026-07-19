/* ================================================
   THE LADY'S CLOSET — Carrossel
   Controla os carrosséis de imagens (ex: hero da
   homepage), com troca automática, setas e pontos.
   ================================================ */
(function () {
  function iniciarCarrossel(container) {
    var slides = Array.prototype.slice.call(container.querySelectorAll('.carrossel-slide'));
    var dotsContainer = container.querySelector('.carrossel-dots');
    var setaPrev = container.querySelector('.carrossel-seta.prev');
    var setaNext = container.querySelector('.carrossel-seta.next');
    var atual = 0;
    var intervalo;
    var duracao = parseInt(container.getAttribute('data-intervalo'), 10) || 4500;

    if (!slides.length) return;

    // Cria os pontos de navegação
    if (dotsContainer) {
      slides.forEach(function (_, indice) {
        var ponto = document.createElement('button');
        ponto.setAttribute('aria-label', 'Ir para slide ' + (indice + 1));
        if (indice === 0) ponto.classList.add('ativo');
        ponto.addEventListener('click', function () {
          irPara(indice);
          reiniciarAutoplay();
        });
        dotsContainer.appendChild(ponto);
      });
    }

    function atualizarPontos() {
      if (!dotsContainer) return;
      Array.prototype.forEach.call(dotsContainer.children, function (ponto, indice) {
        ponto.classList.toggle('ativo', indice === atual);
      });
    }

    function irPara(indice) {
      slides[atual].classList.remove('ativo');
      atual = (indice + slides.length) % slides.length;
      slides[atual].classList.add('ativo');
      atualizarPontos();
    }

    function proximo() { irPara(atual + 1); }
    function anterior() { irPara(atual - 1); }

    function iniciarAutoplay() {
      intervalo = setInterval(proximo, duracao);
    }
    function reiniciarAutoplay() {
      clearInterval(intervalo);
      iniciarAutoplay();
    }

    if (setaNext) setaNext.addEventListener('click', function () { proximo(); reiniciarAutoplay(); });
    if (setaPrev) setaPrev.addEventListener('click', function () { anterior(); reiniciarAutoplay(); });

    container.addEventListener('mouseenter', function () { clearInterval(intervalo); });
    container.addEventListener('mouseleave', iniciarAutoplay);

    slides[0].classList.add('ativo');
    iniciarAutoplay();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-carrossel]').forEach(iniciarCarrossel);
  });
})();
