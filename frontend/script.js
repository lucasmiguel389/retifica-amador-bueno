// ===========================
// RETÍFICA AMADOR BUENO - JS
// ===========================

// --- Mobile Menu ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- Navbar shrink on scroll ---
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.style.boxShadow = window.scrollY > 40
    ? '0 2px 20px rgba(0,0,0,.5)'
    : 'none';
});

// --- Scroll reveal animation ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.servico-card, .stat-item, .info-item, .gal-img').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// --- Contact Form ---
const form = document.getElementById('contatoForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  btnText.textContent = 'Enviando...';
  formMsg.className = 'form-message';
  formMsg.style.display = 'none';

  const data = {
    nome: form.nome.value.trim(),
    telefone: form.telefone.value.trim(),
    email: form.email.value.trim(),
    servico: form.servico.value,
    mensagem: form.mensagem.value.trim(),
  };

  try {
    const response = await fetch('http://localhost:3000/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      formMsg.textContent = '✔ Mensagem enviada! Entraremos em contato em breve.';
      formMsg.className = 'form-message success';
      form.reset();
    } else {
      throw new Error(result.error || 'Erro ao enviar.');
    }
  } catch (err) {
    formMsg.textContent = '✖ ' + (err.message || 'Não foi possível enviar. Tente novamente.');
    formMsg.className = 'form-message error';
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Enviar Mensagem';
  }
});

// --- Phone mask ---
document.getElementById('telefone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
  }
  this.value = v;
});

// ---- CARROSSEL ----
const carrosselTrack = document.querySelector('.carrossel-track');
const carrosselSlides = document.querySelectorAll('.carrossel-slide');
const carrosselPrev = document.getElementById('carrosselPrev');
const carrosselNext = document.getElementById('carrosselNext');
let carrosselIndice = 0;

function irParaSlideCarrossel(indice) {
  carrosselTrack.style.transform = `translateX(-${indice * 100}%)`;
}

if (carrosselNext && carrosselPrev) {
  carrosselNext.addEventListener('click', () => {
    carrosselIndice = (carrosselIndice + 1) % carrosselSlides.length;
    irParaSlideCarrossel(carrosselIndice);
  });

  carrosselPrev.addEventListener('click', () => {
    carrosselIndice = (carrosselIndice - 1 + carrosselSlides.length) % carrosselSlides.length;
    irParaSlideCarrossel(carrosselIndice);
  });
}