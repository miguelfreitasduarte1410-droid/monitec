(() => {
  'use strict';
  const sidebar = document.getElementById('siteSidebar');
  const toggle = document.getElementById('menuToggle');
  const scrim = document.getElementById('navScrim');
  const closeMenu = () => {
    if (!sidebar || !toggle || !scrim) return;
    sidebar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    scrim.hidden = true;
  };
  if (sidebar && toggle && scrim) {
    toggle.addEventListener('click', () => {
      const opening = !sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open', opening);
      scrim.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
    });
    scrim.addEventListener('click', closeMenu);
    sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (innerWidth > 820) closeMenu(); });
  }

  const product = document.getElementById('productImg');
  const variation = document.getElementById('variantTag');
  const zoomBtn = document.getElementById('openZoom');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeZoom = document.getElementById('closeZoom');
  let lastFocus = null;
  const variants = {
    azul: { src: 'assets/fone-azul.webp', name: 'azul', label: 'AZUL' },
    branco: { src: 'assets/fone-branco.webp', name: 'branca', label: 'BRANCO' },
  };
  if (product && variation) {
    document.querySelectorAll('.swatch[data-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const choice = variants[button.dataset.choice];
        if (!choice) return;
        product.src = choice.src;
        product.alt = `Fones Monitec na versão ${choice.name} com estojo e microfone`;
        if (zoomBtn) zoomBtn.setAttribute('aria-label', `Ampliar foto do conceito Monitec na versão ${choice.name}`);
        variation.textContent = choice.label;
        document.querySelectorAll('.swatch[data-choice]').forEach(option => {
          const active = option === button;
          option.classList.toggle('active', active);
          option.setAttribute('aria-pressed', String(active));
        });
      });
    });
  }
  const hideModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    lastFocus?.focus();
  };
  if (zoomBtn && modal && modalImg && closeZoom && product) {
    zoomBtn.addEventListener('click', () => {
      lastFocus = document.activeElement;
      modalImg.src = product.src;
      modalImg.alt = product.alt;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      closeZoom.focus();
    });
    closeZoom.addEventListener('click', hideModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) hideModal(); });
    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      closeZoom.focus();
    });
  }

  const search = document.getElementById('faqSearch');
  const items = [...document.querySelectorAll('.faq-item')];
  const empty = document.getElementById('emptyFaq');
  const normalize = text => (text || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (search && items.length && empty) {
    search.addEventListener('input', () => {
      const query = normalize(search.value.trim());
      let matches = 0;
      items.forEach(item => {
        const hit = normalize(item.textContent).includes(query);
        item.hidden = !hit;
        matches += hit ? 1 : 0;
      });
      empty.hidden = matches > 0;
    });
  }
  const question = document.getElementById('customQuestion');
  const copy = document.getElementById('copyQuestion');
  const feedback = document.getElementById('copyFeedback');
  if (question && copy && feedback) {
    copy.addEventListener('click', async () => {
      const value = question.value.trim();
      if (!value) {
        feedback.textContent = 'Escreva sua dúvida primeiro.';
        question.focus();
        return;
      }
      const fullText = `Olá, Monitec EDU! Gostaria de saber: ${value}`;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(fullText);
        } else {
          const helper = document.createElement('textarea');
          helper.value = fullText;
          helper.style.position = 'fixed';
          helper.style.opacity = '0';
          document.body.appendChild(helper);
          helper.select();
          if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
          helper.remove();
        }
        feedback.textContent = 'Pergunta copiada. Abra o Instagram e cole na mensagem.';
      } catch (_) {
        feedback.textContent = 'Não foi possível copiar automaticamente. Selecione e copie seu texto.';
        question.focus();
        question.select();
      }
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modal && !modal.hidden) hideModal();
      closeMenu();
    }
  });
})();
