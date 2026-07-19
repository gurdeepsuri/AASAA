// Enable scroll-reveal styling only when JS is available
document.documentElement.classList.add('js');

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close the mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

// Reveal sections as they scroll into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Contact form — submit via Web3Forms, no page reload
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  const status = document.getElementById('formStatus');

  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'form-status';

    // Require the reCAPTCHA "I'm not a robot" check to be solved
    const captchaToken = (typeof grecaptcha !== 'undefined') ? grecaptcha.getResponse() : '';
    if (!captchaToken) {
      status.classList.add('err');
      status.textContent = "Please tick the “I'm not a robot” box before sending.";
      return;
    }

    status.textContent = 'Sending…';

    // Web3Forms' free tier does not verify captcha tokens, so drop the
    // reCAPTCHA field before sending (the checkbox is enforced above).
    const data = new FormData(enquiryForm);
    data.delete('g-recaptcha-response');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        status.textContent = "Thank you — your enquiry is on its way. We'll be in touch soon.";
        status.classList.add('ok');
        enquiryForm.reset();
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
      } else {
        status.textContent = result.message || 'Something went wrong — please try again.';
        status.classList.add('err');
      }
    } catch (err) {
      status.textContent = 'Network error — please email us directly at aasaastudio@gmail.com.';
      status.classList.add('err');
    }
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
