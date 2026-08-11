/* Mobile Menu Toggle */
const mobileMenuBtn = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

/* Scroll Reveal Animation using Intersection Observer */
const observerOptions = {
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

/* Contact Form Submission via Formspree (AJAX) */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdenkayr';

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('contactSubmitBtn');
const btnText = document.getElementById('contactBtnText');
const successToast = document.getElementById('successToast');
const errorToast = document.getElementById('errorToast');
const errorToastMsg = document.getElementById('errorToastMsg');

const fieldErrorEls = {
  name: document.getElementById('name-error'),
  email: document.getElementById('email-error'),
  message: document.getElementById('message-error')
};

function showToast(toastEl) {
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 4000);
}

function clearFieldErrors() {
  Object.entries(fieldErrorEls).forEach(([name, el]) => {
    el.textContent = '';
    contactForm.elements[name].classList.remove('field-error');
  });
}

function showFieldErrors(errors) {
  errors.forEach(err => {
    const field = err.field;
    if (field && fieldErrorEls[field]) {
      fieldErrorEls[field].textContent = err.message;
      contactForm.elements[field].classList.add('field-error');
    }
  });
}

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  clearFieldErrors();

  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    });

    if (response.ok) {
      showToast(successToast);
      contactForm.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      if (data.errors && data.errors.length) {
        showFieldErrors(data.errors);
        errorToastMsg.textContent = 'Please fix the highlighted fields.';
      } else {
        errorToastMsg.textContent = 'Something went wrong. Please try again.';
      }
      showToast(errorToast);
    }
  } catch (err) {
    errorToastMsg.textContent = 'Network error. Please check your connection.';
    showToast(errorToast);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
  }
});