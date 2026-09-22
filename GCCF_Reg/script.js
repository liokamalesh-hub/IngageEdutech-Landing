/**
 * Google Cloud Computing Foundations - inGage Edutech
 * 100% Pure Vanilla JavaScript (Zero Frameworks, Zero Dependencies)
 */

// Course title mappings
const courseNames = {
  'data-analytics': 'Google Data Analytics Program',
  'cyber-security': 'Google Cyber Security Program'
};

/**
 * Display toast notification with custom message
 * @param {string} message
 */
function showToast(message) {
  const toast = document.getElementById('course-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  // Clear existing timer if any
  if (window._toastTimeout) {
    clearTimeout(window._toastTimeout);
  }

  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Open course comparison modal dialog
 */
function openCourseModal() {
  const modal = document.getElementById('course-details-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close course comparison modal dialog
 */
function closeCourseModal() {
  const modal = document.getElementById('course-details-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Select a free course by ID and synchronize all UI components
 * @param {'data-analytics' | 'cyber-security'} courseId
 */
function selectCourse(courseId) {
  // Sync native select dropdown
  const selectElem = document.getElementById('free-course');
  if (selectElem) {
    selectElem.value = courseId;
  }

  // Update selectable cards
  const cards = ['data-analytics', 'cyber-security'];
  cards.forEach((id) => {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;

    const actionBtn = card.querySelector('.action-btn');

    if (id === courseId) {
      card.classList.add('selected');
      if (actionBtn) {
        actionBtn.textContent = 'Selected ✓';
      }
    } else {
      card.classList.remove('selected');
      if (actionBtn) {
        actionBtn.textContent = 'Select Course';
      }
    }
  });

  // Update selected course confirmation pill
  const pill = document.getElementById('selected-confirmation-pill');
  const titleSpan = document.getElementById('selected-course-title');
  if (pill && titleSpan) {
    titleSpan.textContent = courseNames[courseId] || courseId;
    pill.classList.remove('hidden');
  }

  // Show user notification toast
  showToast(`Added: ${courseNames[courseId]} (100% Free Bonus)`);
}

/**
 * Select course and close modal
 * @param {'data-analytics' | 'cyber-security'} courseId
 */
function selectCourseAndClose(courseId) {
  selectCourse(courseId);
  closeCourseModal();
}

/**
 * Sync course selection when dropdown changes
 * @param {string} val
 */
function syncFromDropdown(val) {
  if (val) {
    selectCourse(val);
  }
}

/**
 * Handle form submission validation and user confirmation
 */
function handleFormSubmit() {
  const courseSelect = document.getElementById('free-course');
  if (!courseSelect || !courseSelect.value) {
    alert('Please select your free course to complete your registration.');
    openCourseModal();
    return;
  }

  const selectedName = courseNames[courseSelect.value] || courseSelect.value;
  alert(`Form verified successfully!\n\nProceeding to secure checkout for ₹499.\nYou will receive instant enrollment access to Google Cloud Computing Foundations + complimentary access to ${selectedName}.`);
}

// Bind functions to window object for inline HTML handlers
window.showToast = showToast;
window.openCourseModal = openCourseModal;
window.closeCourseModal = closeCourseModal;
window.selectCourse = selectCourse;
window.selectCourseAndClose = selectCourseAndClose;
window.syncFromDropdown = syncFromDropdown;
window.handleFormSubmit = handleFormSubmit;

/**
 * Initialize IntersectionObserver for scroll-reveal animations
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // Fallback safety to ensure content is visible
  setTimeout(() => {
    document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }, 1000);
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', function () {
  // Initialize scroll reveal effects
  initScrollAnimations();

  // If page loaded with hash (e.g. #registration-section), ensure target is visible
  if (window.location.hash) {
    try {
      const hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        hashTarget.classList.add('is-revealed');
        hashTarget.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));
        setTimeout(() => {
          hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } catch (e) {}
  }

  // Close modal on Escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeCourseModal();
    }
  });

  // Close modal when clicking on backdrop
  const modal = document.getElementById('course-details-modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        closeCourseModal();
      }
    });
  }

  // Enable keyboard accessibility for selectable cards
  const courseCards = document.querySelectorAll('.free-course-card');
  courseCards.forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Touch / Mobile Flip Support for course cards
  const flipCards = document.querySelectorAll('.course-flip-card');
  flipCards.forEach(card => {
    const cardBody = card.querySelector('.course-flip-card-body');
    if (!cardBody) return;
    cardBody.addEventListener('click', (e) => {
      if (e.target.closest('.card-fixed-buttons')) return;
      if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) {
        card.classList.toggle('is-swapped');
      }
    });
  });
});
