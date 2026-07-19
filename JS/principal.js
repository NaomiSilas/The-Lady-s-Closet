/* ================================================
   THE LADY'S CLOSET — Interações Gerais
   Menu móvel, acordeão de FAQ, animações de
   entrada ao rolar e formulários (newsletter/contacto).
   ================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', function () {

    /* ---- menu móvel ---- */
    var burger = document.querySelector('.nav-burger');
    var navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
      function abrirMenu() {
        navLinks.classList.add('aberto');
        burger.classList.add('aberto');
        burger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-aberto');
      }
      function fecharMenu() {
        navLinks.classList.remove('aberto');
        burger.classList.remove('aberto');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-aberto');
      }
      burger.addEventListener('click', function () {
        if (navLinks.classList.contains('aberto')) { fecharMenu(); } else { abrirMenu(); }
      });
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', fecharMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') fecharMenu();
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1080) fecharMenu();
      });
    }

    /* ---- acordeão FAQ ---- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var pergunta = item.querySelector('.faq-pergunta');
      var resposta = item.querySelector('.faq-resposta');
      if (!pergunta || !resposta) return;
      pergunta.addEventListener('click', function () {
        var jaAberto = item.classList.contains('aberto');
        document.querySelectorAll('.faq-item.aberto').forEach(function (outro) {
          outro.classList.remove('aberto');
          outro.querySelector('.faq-resposta').style.maxHeight = null;
        });
        if (!jaAberto) {
          item.classList.add('aberto');
          resposta.style.maxHeight = resposta.scrollHeight + 'px';
        }
      });
    });

    /* ---- animação de entrada ao rolar ---- */
    var elementosRevelados = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && elementosRevelados.length) {
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.15 });
      elementosRevelados.forEach(function (el) { observador.observe(el); });
    } else {
      elementosRevelados.forEach(function (el) { el.classList.add('visivel'); });
    }

    /* ---- formulário de newsletter ---- */
    document.querySelectorAll('.newsletter-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = form.querySelector('.newsletter-msg') || form.parentElement.querySelector('.newsletter-msg');
        var email = form.querySelector('input[type="email"]').value;
        if (msg) msg.textContent = 'Obrigada! ' + email + ' foi inscrito com sucesso na nossa newsletter.';
        form.reset();
      });
    });

    /* ---- formulário de contacto ---- */
    var formContacto = document.getElementById('formContacto');
    if (formContacto) {
      formContacto.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('contactoMsg');
        if (msg) msg.textContent = 'Mensagem enviada com sucesso! A nossa equipa entrará em contacto em breve.';
        formContacto.reset();
      });
    }

  });
})();
