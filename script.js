/* ============================================================
   SCRIPT.JS — DR ANKITA CLINIC
   Part 1: Header, Mobile Menu, Smooth Scroll
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. initHeader()
   Adds "scrolled" class to header when user scrolls > 30px
   ---------------------------------------------------------- */
function initHeader() {
  var header = document.getElementById('site-header');
  if (!header) return;

  function handleHeaderScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();
}

/* ----------------------------------------------------------
   2. initMobileMenu()
   Opens/closes fullscreen mobile nav overlay
   ---------------------------------------------------------- */
function initMobileMenu() {
  var hamburger   = document.getElementById('hamburger');
  var mobileMenu  = document.getElementById('mobileMenu');
  var menuClose   = document.getElementById('menuClose');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu || !menuClose) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuClose.addEventListener('click', function () {
    closeMenu();
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------------
   3. initSmoothScroll()
   Smooth scroll for all anchor links with header offset
   ---------------------------------------------------------- */
function initSmoothScroll() {
  var headerHeight = 76;

  function getHeaderHeight() {
    var h = document.getElementById('site-header');
    return h ? h.offsetHeight : headerHeight;
  }

  function scrollToTarget(targetId) {
    if (!targetId || targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    var cleanId = targetId.replace('#', '');
    var target  = document.getElementById(cleanId);

    if (target) {
      var offsetTop  = target.getBoundingClientRect().top + window.pageYOffset;
      var scrollTo   = offsetTop - getHeaderHeight() - 8;

      window.scrollTo({
        top:      Math.max(0, scrollTo),
        behavior: 'smooth'
      });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '') return;

      e.preventDefault();
      scrollToTarget(href);

      if (history.pushState && href !== '#') {
        history.pushState(null, null, href);
      }
    });
  });

  var footerBackTop = document.getElementById('footerBackTop');
  if (footerBackTop) {
    footerBackTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
        }
/* ============================================================
   SCRIPT.JS — DR ANKITA CLINIC
   Part 2: Scroll Reveal, Active Nav, Back To Top
   ============================================================ */

/* ----------------------------------------------------------
   4. initScrollReveal()
   Animates elements with class .reveal into view
   ---------------------------------------------------------- */
function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:   0.1,
      rootMargin: '0px 0px -36px 0px'
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* ----------------------------------------------------------
   5. initActiveNav()
   Highlights the nav link matching the current visible section
   ---------------------------------------------------------- */
function initActiveNav() {
  var sections = document.querySelectorAll('main section[id], section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  var headerH = 80;

  function getActiveSection() {
    var scrollY = window.scrollY + headerH + 60;
    var active  = null;

    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        active = section.id;
      }
    });

    if (!active && window.scrollY < 200) {
      active = 'home';
    }

    return active;
  }

  function updateNav() {
    var activeId = getActiveSection();

    navLinks.forEach(function (link) {
      link.classList.remove('active');

      var href = link.getAttribute('href');
      if (href) {
        var sectionId = href.replace('#', '');
        if (sectionId === activeId) {
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ----------------------------------------------------------
   6. initBackToTop()
   Shows/hides the back-to-top button based on scroll
   ---------------------------------------------------------- */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  function handleScroll() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
    }
/* ============================================================
   SCRIPT.JS — DR ANKITA CLINIC
   Part 3: Form Validation, Error Handling, Toast
   ============================================================ */

/* ----------------------------------------------------------
   showError()
   Adds error styling to a field and shows error message
   ---------------------------------------------------------- */
function showError(fieldEl, errEl) {
  if (fieldEl) fieldEl.classList.add('error');
  if (errEl)   errEl.classList.add('show');
}

/* ----------------------------------------------------------
   clearError()
   Removes error styling from a single field and its span
   ---------------------------------------------------------- */
function clearError(fieldEl, errEl) {
  if (fieldEl) fieldEl.classList.remove('error');
  if (errEl)   errEl.classList.remove('show');
}

/* ----------------------------------------------------------
   clearErrors()
   Removes all errors from passed arrays of fields and spans
   ---------------------------------------------------------- */
function clearErrors(fields, spans) {
  fields.forEach(function (f) {
    if (f) f.classList.remove('error');
  });
  spans.forEach(function (s) {
    if (s) s.classList.remove('show');
  });
}

/* ----------------------------------------------------------
   showToast()
   Shows a floating toast notification message
   ---------------------------------------------------------- */
function showToast(msg, type) {
  var existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  var toast    = document.createElement('div');
  toast.className = 'toast-notification ' + (type || 'success');

  var icon = document.createElement('span');
  if (type === 'error') {
    icon.innerHTML = '&#10007;';
  } else {
    icon.innerHTML = '&#10003;';
  }

  var text     = document.createElement('span');
  text.textContent = msg;

  toast.appendChild(icon);
  toast.appendChild(text);
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.style.animation = 'slide-out-right 0.4s ease forwards';
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 420);
  }, 3500);
}

/* ----------------------------------------------------------
   validateName()
   Returns true if name is not empty
   ---------------------------------------------------------- */
function validateName(val) {
  return val.trim().length >= 2;
}

/* ----------------------------------------------------------
   validateMobile()
   Returns true if mobile has 7-15 digits, optional +
   ---------------------------------------------------------- */
function validateMobile(val) {
  var clean = val.trim();
  return /^\+?[0-9]{7,15}$/.test(clean);
}

/* ----------------------------------------------------------
   validateTreatment()
   Returns true if a non-default option is selected
   ---------------------------------------------------------- */
function validateTreatment(val) {
  return val && val.trim().length > 0;
}

/* ----------------------------------------------------------
   initLiveValidation()
   Clears errors as the user types or changes fields
   ---------------------------------------------------------- */
function initLiveValidation() {
  var fName      = document.getElementById('fName');
  var fMobile    = document.getElementById('fMobile');
  var fTreatment = document.getElementById('fTreatment');
  var errName    = document.getElementById('errName');
  var errMobile  = document.getElementById('errMobile');
  var errTreat   = document.getElementById('errTreat');

  if (fName) {
    fName.addEventListener('input', function () {
      if (validateName(fName.value)) {
        clearError(fName, errName);
      }
    });
  }

  if (fMobile) {
    fMobile.addEventListener('input', function () {
      if (validateMobile(fMobile.value)) {
        clearError(fMobile, errMobile);
      }
    });
  }

  if (fTreatment) {
    fTreatment.addEventListener('change', function () {
      if (validateTreatment(fTreatment.value)) {
        clearError(fTreatment, errTreat);
      }
    });
  }
                          }
/* ============================================================
   SCRIPT.JS — DR ANKITA CLINIC
   Part 4: submitAppointment() & DOMContentLoaded Init
   ============================================================ */

/* ----------------------------------------------------------
   submitAppointment()
   Validates form, builds WhatsApp message, opens wa.me URL
   ---------------------------------------------------------- */
function submitAppointment() {
  var fName      = document.getElementById('fName');
  var fMobile    = document.getElementById('fMobile');
  var fTreatment = document.getElementById('fTreatment');
  var fMsg       = document.getElementById('fMsg');
  var errName    = document.getElementById('errName');
  var errMobile  = document.getElementById('errMobile');
  var errTreat   = document.getElementById('errTreat');

  if (!fName || !fMobile || !fTreatment) {
    showToast('Form fields not found. Please refresh the page.', 'error');
    return;
  }

  clearErrors(
    [fName, fMobile, fTreatment],
    [errName, errMobile, errTreat]
  );

  var nameVal      = fName.value;
  var mobileVal    = fMobile.value;
  var treatmentVal = fTreatment.value;
  var msgVal       = fMsg ? fMsg.value : '';

  var hasError = false;

  if (!validateName(nameVal)) {
    showError(fName, errName);
    if (errName) errName.textContent = 'Please enter your full name (at least 2 characters).';
    hasError = true;
  }

  if (!validateMobile(mobileVal)) {
    showError(fMobile, errMobile);
    if (errMobile) errMobile.textContent = 'Please enter a valid mobile number (7-15 digits).';
    hasError = true;
  }

  if (!validateTreatment(treatmentVal)) {
    showError(fTreatment, errTreat);
    if (errTreat) errTreat.textContent = 'Please select a treatment or case type.';
    hasError = true;
  }

  if (hasError) {
    var firstError = document.querySelector('.form-input.error, .form-select.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
    return;
  }

  var message = 'Hello Doctor,\nI want to book an appointment.\n\n';
  message += 'Name: ' + nameVal.trim() + '\n';
  message += 'Mobile: ' + mobileVal.trim() + '\n';
  message += 'Treatment/Case: ' + treatmentVal.trim() + '\n';

  if (msgVal && msgVal.trim().length > 0) {
    message += 'Message: ' + msgVal.trim() + '\n';
  }

  var waNumber = '917568394979';
  var waURL    = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message);

  window.open(waURL, '_blank', 'noopener,noreferrer');

  setTimeout(function () {
    var form = document.getElementById('appointmentForm');
    if (form) form.reset();

    clearErrors(
      [fName, fMobile, fTreatment],
      [errName, errMobile, errTreat]
    );

    showToast('Your appointment request has been sent via WhatsApp!', 'success');
  }, 400);
}

/* ----------------------------------------------------------
   DOMContentLoaded — Initialise all functions
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initSmoothScroll();
  initBackToTop();
  initLiveValidation();

  var heroSection = document.querySelector('.hero-section');
  if (heroSection && !heroSection.id) {
    heroSection.closest('main') && (heroSection.closest('main').id = heroSection.closest('main').id || 'home');
  }

  document.querySelectorAll('img').forEach(function (img) {
    var src = img.getAttribute('src') || '';
    var isPlaceholder = src === src.toUpperCase() && src.indexOf('_') !== -1 && src.indexOf('.') === -1;

    if (isPlaceholder) {
      img.style.display = 'none';
    }

    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });

  var year = new Date().getFullYear();
  var copyEl = document.querySelector('.footer-copy');
  if (copyEl) {
    copyEl.textContent = '© ' + year + ' Dr Ankita Clinic. All rights reserved.';
  }
});
