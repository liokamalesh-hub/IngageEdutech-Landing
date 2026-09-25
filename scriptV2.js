tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        title: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        script: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sf: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"San Francisco"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
        },
        ingage: {
          green: '#10B981',
          darkBlue: '#1E3A8A',
          navy: '#0F172A',
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 15px 35px -8px rgba(30, 58, 138, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'glow-blue': '0 0 25px rgba(66, 133, 244, 0.25)',
      }
    }
  }
};

// Interactive SVG Line Connectors between Central Hub and Course Cards (Desktop only)
function drawDiagramConnections() {
  const container = document.getElementById('diagram-canvas-container');
  const svg = document.getElementById('diagram-svg');
  const hub = document.getElementById('hub-node');
  if (!container || !svg || !hub) return;

  // Only render connection lines on desktop/tablet (md breakpoint >= 768px)
  if (window.innerWidth < 768) {
    svg.innerHTML = '';
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const hubRect = hub.getBoundingClientRect();
  const hubCenter = {
    x: (hubRect.left + hubRect.width / 2) - containerRect.left,
    y: (hubRect.top + hubRect.height / 2) - containerRect.top
  };
  
  // Exact visual radius of the hub node including outer border
  const hubRadius = (hubRect.width / 2);

  const connections = [
    { cardId: 'card-cloud', color: '#10b981', strokeDash: '4,4', side: 'left' },
    { cardId: 'card-genai', color: '#9333ea', strokeDash: '4,4', side: 'left' },
    { cardId: 'card-software', color: '#f59e0b', strokeDash: '4,4', side: 'left' },
    { cardId: 'card-data', color: '#16a34a', strokeDash: '4,4', side: 'right' },
    { cardId: 'card-cyber', color: '#2563eb', strokeDash: '4,4', side: 'right' },
    { cardId: 'card-badge', color: '#6366f1', strokeDash: '4,4', side: 'right' }
  ];

  let svgContent = '';

  connections.forEach((conn) => {
    const card = document.getElementById(conn.cardId);
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    let cardAnchorX, cardAnchorY;

    if (conn.side === 'left') {
      cardAnchorX = cardRect.right - containerRect.left;
      cardAnchorY = (cardRect.top + cardRect.height / 2) - containerRect.top;
    } else {
      cardAnchorX = cardRect.left - containerRect.left;
      cardAnchorY = (cardRect.top + cardRect.height / 2) - containerRect.top;
    }

    // Exact angle from central hub towards card connection point
    const angle = Math.atan2(cardAnchorY - hubCenter.y, cardAnchorX - hubCenter.x);
    const hubAnchorX = hubCenter.x + Math.cos(angle) * hubRadius;
    const hubAnchorY = hubCenter.y + Math.sin(angle) * hubRadius;

    // Smooth organic bezier curvature
    const dx = Math.abs(cardAnchorX - hubAnchorX) * 0.5;
    const cp1X = conn.side === 'left' ? hubAnchorX - dx : hubAnchorX + dx;
    const cp2X = conn.side === 'left' ? cardAnchorX + dx : cardAnchorX - dx;
    const pathD = `M ${hubAnchorX} ${hubAnchorY} C ${cp1X} ${hubAnchorY}, ${cp2X} ${cardAnchorY}, ${cardAnchorX} ${cardAnchorY}`;

    svgContent += `
      <!-- Animated Line Path -->
      <path d="${pathD}" fill="none" stroke="${conn.color}" stroke-width="2.5" stroke-dasharray="${conn.strokeDash}" class="branch-line-dashed" opacity="0.95"/>
      
      <!-- Anchor Dot on Hub Circle Edge (flush against the white hub perimeter) -->
      <circle cx="${hubAnchorX}" cy="${hubAnchorY}" r="4" fill="${conn.color}" stroke="#ffffff" stroke-width="2" />
      
      <!-- Anchor Dot on Card Edge -->
      <circle cx="${cardAnchorX}" cy="${cardAnchorY}" r="4" fill="${conn.color}" stroke="#ffffff" stroke-width="2" />
    `;
  });

  svg.innerHTML = svgContent;
}

window.addEventListener('DOMContentLoaded', () => {
  drawDiagramConnections();
  setTimeout(drawDiagramConnections, 100);
  setTimeout(drawDiagramConnections, 300);
  setTimeout(drawDiagramConnections, 700);
});
window.addEventListener('load', () => {
  drawDiagramConnections();
  setTimeout(drawDiagramConnections, 200);
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    drawDiagramConnections();
  });
}

// Dynamic Zoom & Window Resize Listeners
window.addEventListener('resize', () => {
  requestAnimationFrame(drawDiagramConnections);
});

// Detect browser zoom in / zoom out (devicePixelRatio changes)
let dprMediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
function handleZoomChange() {
  requestAnimationFrame(drawDiagramConnections);
  dprMediaQuery.removeEventListener('change', handleZoomChange);
  dprMediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  dprMediaQuery.addEventListener('change', handleZoomChange);
}
if (dprMediaQuery && dprMediaQuery.addEventListener) {
  dprMediaQuery.addEventListener('change', handleZoomChange);
}

// Observe container and cards resizing for smooth zoom and responsive scaling
if (window.ResizeObserver) {
  const resizeObs = new ResizeObserver(() => {
    requestAnimationFrame(drawDiagramConnections);
  });
  const containerElem = document.getElementById('diagram-canvas-container');
  if (containerElem) {
    resizeObs.observe(containerElem);
  }
  const hubElem = document.getElementById('hub-node');
  if (hubElem) {
    resizeObs.observe(hubElem);
  }
}

window.addEventListener('orientationchange', () => {
  setTimeout(drawDiagramConnections, 200);
});

// =========================================================================
// COURSE DETAILS DATA & INTERACTIVE MODAL (Mobile Responsive)
// =========================================================================
const COURSE_DETAILS_DATA = {
  'genai': {
    title: 'Google Generative AI Program',
    subtitle: 'Industry-Aligned Training • Certification • Career Readiness',
    barGradient: 'from-purple-600 to-indigo-600',
    price: '₹499',
    points: [
      {
        icon: 'fa-wand-magic-sparkles',
        bg: 'bg-purple-600',
        title: 'Prompt Design & Optimization',
        desc: 'Master context handling & prompt design to generate accurate real-world results'
      },
      {
        icon: 'fa-brain',
        bg: 'bg-blue-600',
        title: 'Foundation & Multimodal AI',
        desc: 'Hands-on experience with Foundation Models, Google AI Tools & LLMs'
      },
      {
        icon: 'fa-robot',
        bg: 'bg-emerald-600',
        title: 'APIs, RAG & Automation',
        desc: 'Build and deploy production Generative AI applications and workflows'
      },
      {
        icon: 'fa-shield-halved',
        bg: 'bg-amber-500',
        title: 'AI Governance & Ethics',
        desc: 'Ethical practices, model evaluation & safety in practical business scenarios'
      }
    ]
  },
  'gccf': {
    title: 'Google Cloud Computing Foundations (GCCF)',
    subtitle: 'Cloud Fundamentals • Practical Labs • Certification',
    barGradient: 'from-emerald-600 to-teal-600',
    price: '₹499',
    points: [
      {
        icon: 'fa-cloud',
        bg: 'bg-emerald-600',
        title: 'Google Cloud Services',
        desc: 'Core infrastructure, storage, compute & networking capabilities on GCP'
      },
      {
        icon: 'fa-flask',
        bg: 'bg-teal-600',
        title: 'Real-world Cloud Labs',
        desc: 'Hands-on interactive lab sessions and deployment practices in cloud environments'
      },
      {
        icon: 'fa-shield',
        bg: 'bg-blue-600',
        title: 'Security, IAM & Network',
        desc: 'Cloud identity and access management with enterprise governance best practices'
      },
      {
        icon: 'fa-briefcase',
        bg: 'bg-amber-500',
        title: 'Job-ready Cloud Skills',
        desc: 'Essential architecture and engineering practices for modern cloud career tracks'
      }
    ]
  },
  'cloud-eng': {
    title: 'Google Cloud Engineering Program',
    subtitle: 'Kubernetes • CI/CD Pipelines • Production Architecture',
    barGradient: 'from-blue-600 to-indigo-600',
    price: '₹499',
    points: [
      {
        icon: 'fa-server',
        bg: 'bg-blue-600',
        title: 'Infrastructure Architecture',
        desc: 'Design & deploy scalable, resilient cloud applications'
      },
      {
        icon: 'fa-cubes',
        bg: 'bg-indigo-600',
        title: 'Kubernetes & Containers',
        desc: 'Containerized microservices on Google Kubernetes Engine (GKE)'
      },
      {
        icon: 'fa-code-branch',
        bg: 'bg-emerald-600',
        title: 'DevOps & CI/CD Pipelines',
        desc: 'Automated testing, continuous deployment & cloud workflow orchestration'
      },
      {
        icon: 'fa-shield-halved',
        bg: 'bg-amber-500',
        title: 'Site Reliability & Monitoring',
        desc: 'Google Cloud Operations suite, logging, tracing & performance metrics'
      }
    ]
  },
  'data-analytics': {
    title: 'Google Data Analytics Program',
    subtitle: 'Industry-Aligned Training • Certification • Career Readiness',
    barGradient: 'from-teal-600 to-emerald-700',
    price: '₹499',
    points: [
      {
        icon: 'fa-chart-line',
        bg: 'bg-emerald-600',
        title: 'Data Analysis & Visualization',
        desc: 'Exploratory data analysis, statistical insights & modern storytelling with data'
      },
      {
        icon: 'fa-chart-pie',
        bg: 'bg-teal-600',
        title: 'Interactive Dashboards & Reports',
        desc: 'Design intuitive business intelligence reports using industry tools'
      },
      {
        icon: 'fa-database',
        bg: 'bg-blue-600',
        title: 'Data Pipelines & Workflow Management',
        desc: 'Querying, transforming & structuring data for high-performance workflows'
      },
      {
        icon: 'fa-brain',
        bg: 'bg-amber-500',
        title: 'Job-ready Analytics Skills',
        desc: 'Hands-on practical capstone project solving real business problems'
      }
    ]
  },
  'cyber-security': {
    title: 'Google Cyber Security Program',
    subtitle: 'Threat Detection • SIEM & SOC • Zero-Trust Security',
    barGradient: 'from-blue-700 to-indigo-800',
    price: '₹499',
    points: [
      {
        icon: 'fa-shield-virus',
        bg: 'bg-blue-600',
        title: 'Threat Defense & SIEM',
        desc: 'Incident detection, log analysis & security operations (SOC)'
      },
      {
        icon: 'fa-network-wired',
        bg: 'bg-indigo-600',
        title: 'Network & Cloud Security',
        desc: 'Zero-Trust architecture, firewalls & secure infrastructure'
      },
      {
        icon: 'fa-bug-slash',
        bg: 'bg-amber-500',
        title: 'Vulnerability Assessment',
        desc: 'Penetration testing methodologies & mitigation protocols'
      },
      {
        icon: 'fa-file-shield',
        bg: 'bg-emerald-600',
        title: 'Compliance & Governance',
        desc: 'Industry standards, risk management & enterprise security'
      }
    ]
  }
};

function openCourseModal(courseId) {
  const data = COURSE_DETAILS_DATA[courseId];
  if (!data) return;

  const modal = document.getElementById('course-modal');
  const titleEl = document.getElementById('modal-course-title');
  const subtitleEl = document.getElementById('modal-course-subtitle');
  const pointsContainer = document.getElementById('modal-course-points');
  const priceEl = document.getElementById('modal-course-price');
  const barEl = document.getElementById('modal-course-bar');
  const enrollBtn = document.getElementById('modal-enroll-btn');

  if (titleEl) titleEl.textContent = data.title;
  if (subtitleEl) subtitleEl.textContent = data.subtitle;
  if (priceEl) priceEl.textContent = data.price;
  if (barEl) barEl.className = `w-12 h-1 bg-gradient-to-r ${data.barGradient} rounded-full mt-2`;

  if (pointsContainer) {
    pointsContainer.innerHTML = data.points.map((pt) => `
      <div class="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl ${pt.bg} text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <i class="fa-solid ${pt.icon} text-xs"></i>
        </div>
        <div>
          <h5 class="text-xs font-bold text-slate-900 leading-tight">${pt.title}</h5>
          <p class="text-[11px] text-slate-600 leading-snug mt-0.5">${pt.desc}</p>
        </div>
      </div>
    `).join('');
  }

  if (enrollBtn) {
    enrollBtn.onclick = () => {
      if (courseId === 'genai') {
        window.location.href = 'GenAI_Reg/index.html#registration-section';
        return;
      }
      if (courseId === 'gccf') {
        window.location.href = 'GCCF_Reg/index.html#registration-section';
        return;
      }
      if (courseId === 'cloud-eng' || courseId === 'gce') {
        window.location.href = 'GCE_Reg/index.html#registration-section';
        return;
      }
      closeCourseModal();
      scrollToRegistration();
    };
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('modal-open');
  }
}

function closeCourseModal() {
  const modal = document.getElementById('course-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('modal-open');
  }
}

function scrollToRegistration() {
  const regSection = document.getElementById('registration-process');
  if (regSection) {
    regSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Attach listeners for interactive buttons
function initInteractiveButtons() {
  // Wire up Enroll Now buttons
  document.querySelectorAll('button').forEach(btn => {
    const text = btn.innerText.trim();
    if (text.includes('Enroll Now')) {
      const card = btn.closest('[data-course="genai"]') || btn.closest('[data-course="gccf"]') || btn.closest('[data-course="cloud-eng"]') || btn.closest('article');
      if (card && (card.getAttribute('data-course') === 'genai' || card.innerText.includes('Google Generative AI Program'))) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'GenAI_Reg/index.html#registration-section';
        });
        return;
      }
      if (card && (card.getAttribute('data-course') === 'gccf' || card.innerText.includes('Google Cloud Computing Foundations') || card.innerText.includes('GCCF'))) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'GCCF_Reg/index.html#registration-section';
        });
        return;
      }
      if (card && (card.getAttribute('data-course') === 'cloud-eng' || card.getAttribute('data-course') === 'gce' || card.innerText.includes('Google Cloud Engineering') || card.innerText.includes('Cloud Engineering'))) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'GCE_Reg/index.html#registration-section';
        });
        return;
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToRegistration();
      });
    }
  });

  // Wire up View Detail buttons
  document.querySelectorAll('[data-action="view-detail"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = btn.getAttribute('data-course');
      if (courseId === 'genai') {
        window.location.href = 'GenAI_Reg/index.html';
        return;
      }
      if (courseId === 'gccf') {
        window.location.href = 'GCCF_Reg/index.html';
        return;
      }
      if (courseId === 'cloud-eng' || courseId === 'gce') {
        window.location.href = 'GCE_Reg/index.html';
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (courseId) {
        openCourseModal(courseId);
      }
    });
  });

  // Wire up modal close button and backdrop
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCourseModal);
  }

  const modalBackdrop = document.getElementById('course-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeCourseModal);
  }

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCourseModal();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initInteractiveButtons();
  initGenAIFlipCard();
});

// Initialize 3D Swap Card for All Course Cards (Laptop and Desktop)
function initGenAIFlipCard() {
  const flipCards = document.querySelectorAll('.course-flip-card, #genai-flip-card');
  if (!flipCards.length) return;

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  flipCards.forEach(flipCard => {
    const flipBadgeTrigger = flipCard.querySelector('.flip-badge-trigger');
    if (flipBadgeTrigger) {
      flipBadgeTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) return;
        e.preventDefault();
        e.stopPropagation();
        flipCard.classList.toggle('is-flipped');
      });
    }

    const flipBackTrigger = flipCard.querySelector('.flip-back-trigger');
    if (flipBackTrigger) {
      flipBackTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) return;
        e.preventDefault();
        e.stopPropagation();
        flipCard.classList.remove('is-flipped');
      });
    }

    // Support tap-to-flip on touch laptops/tablets on the card body only (min-width > 768px)
    if (isTouch) {
      const cardBody = flipCard.querySelector('.course-flip-card-body, .genai-flip-card-body');
      if (cardBody) {
        cardBody.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) return;
          if (e.target.closest('a') || e.target.closest('button')) return;
          flipCard.classList.toggle('is-flipped');
        });
      }
    }
  });
}

// Redraw SVG diagram connections on window resize (debounced)
(function() {
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (typeof drawDiagramConnections === 'function') {
        drawDiagramConnections();
      }
    }, 150);
  });
})();
