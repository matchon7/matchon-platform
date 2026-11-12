const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', '메뉴 열기');
}));

document.querySelectorAll('.inquiry-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.category = form.dataset.category;
    payload.title = form.dataset.title;
    status.className = 'form-status';
    status.textContent = '문의 내용을 보내고 있습니다…';
    submit.disabled = true;
    try {
      payload._subject = `[오모가리 전국 취급점] ${form.dataset.title}`;
      payload._url = window.location.href;
      payload._honey = payload.website || '';
      delete payload.website;
      const response = await fetch('https://formsubmit.co/ajax/matchon7@daum.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || result.error || '전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      status.className = 'form-status success';
      status.textContent = '문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.';
      form.reset();
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = error.message || '문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
      submit.disabled = false;
    }
  });
});

