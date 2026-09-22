import { getSceneFrame, getEntryFrame, getApproachStage } from './motion.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
});
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true); });
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();

// Content is visible by default. Motion is progressive enhancement.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('is-pending');
      revealObserver.observe(element);
    }
  });
  document.documentElement.classList.add('motion-enabled');
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
      revealObserver.disconnect();
    }
  });
}

const storyStages = [
  { center: 'CONTEXT', nodes: ['People', 'Problem', 'Constraints', 'Outcomes'], caption: 'Understand the whole before designing the parts.' },
  { center: 'CLARITY', nodes: ['Boundaries', 'Contracts', 'Resilience', 'Feedback'], caption: 'Make the trade-offs explicit. Make the system legible.' },
  { center: 'OWNERSHIP', nodes: ['Direction', 'Autonomy', 'Mentorship', 'Trust'], caption: 'A system is only as strong as the people who own it.' },
];
const chapters = [...document.querySelectorAll('.story-chapter')];
const diagram = document.querySelector('.system-diagram');
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
const progress = document.querySelector('.reading-progress');
const scene = document.querySelector('.scene-stage');
const hero = document.querySelector('.hero');
const cards = [...document.querySelectorAll('.project-card')];
const approachTabs = [...document.querySelectorAll('.approach-tabs [role="tab"]')];
const approach = document.querySelector('.approach');
const approachTrack = document.querySelector('.approach-scroll-track');
const approachLayout = document.querySelector('.story-layout');
let currentStage = -1;
let scrollScheduled = false;
let selectedByUser = false;
let manualScrollPosition = window.scrollY;

function selectApproachTab(index) {
  selectedByUser = true;
  manualScrollPosition = window.scrollY;
  activateStage(index);
}

function configureApproachScroll() {
  approach.classList.toggle('scroll-approach', !reducedMotion.matches);
  approachTrack.style.setProperty('--panel-height', `${approachLayout.offsetHeight}px`);
  document.querySelector('.approach-instructions').hidden = reducedMotion.matches;
}

function activateStage(index) {
  if (currentStage === index) return;
  currentStage = index;
  diagram.dataset.stage = String(index);
  document.querySelector('.diagram-center-text').textContent = storyStages[index].center;
  document.querySelector('.diagram-caption').textContent = storyStages[index].caption;
  document.querySelector('.diagram-index').textContent = `0${index + 1} — 03`;
  diagram.querySelectorAll('.node-label').forEach((label, i) => { label.textContent = storyStages[index].nodes[i]; });
  document.querySelectorAll('.diagram-dots i').forEach((dot, i) => dot.classList.toggle('active', i === index));
  chapters.forEach((chapter, i) => chapter.classList.toggle('is-active', i === index));
  chapters.forEach((chapter, i) => { chapter.hidden = i !== index; });
  approachTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
}

document.querySelector('.approach-tabs').hidden = false;
document.querySelector('.approach').classList.add('approach-interactive');
chapters.forEach((chapter, i) => {
  chapter.setAttribute('role', 'tabpanel');
  chapter.setAttribute('aria-labelledby', `approach-tab-${i}`);
  chapter.tabIndex = 0;
});
approachTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectApproachTab(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % approachTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + approachTabs.length) % approachTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = approachTabs.length - 1;
    else return;
    event.preventDefault();
    selectApproachTab(next);
    approachTabs[next].focus({ preventScroll: true });
  });
});
activateStage(0);
configureApproachScroll();
if ('ResizeObserver' in window) new ResizeObserver(configureApproachScroll).observe(approachLayout);

function updateScroll() {
  scrollScheduled = false;
  const page = document.documentElement;
  const total = page.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0})`;
  const heroOffset = Math.max(0, -hero.getBoundingClientRect().top);
  const frame = getSceneFrame(heroOffset, window.innerHeight, reducedMotion.matches);
  scene.style.setProperty('--scene-x', `${frame.rotateX.toFixed(2)}deg`);
  scene.style.setProperty('--scene-y', `${frame.rotateY.toFixed(2)}deg`);
  scene.style.setProperty('--scene-z', `${frame.rotateZ.toFixed(2)}deg`);
  scene.style.setProperty('--scene-scale', frame.scale.toFixed(3));
  scene.style.setProperty('--scene-spread', frame.spread.toFixed(3));
  for (const card of cards) {
    const entry = getEntryFrame(card.getBoundingClientRect().top, window.innerHeight, reducedMotion.matches);
    card.style.setProperty('--entry-x', `${entry.rotateX.toFixed(2)}deg`);
    card.style.setProperty('--entry-y', `${entry.offset.toFixed(2)}px`);
  }
  if (!reducedMotion.matches) {
    const distance = parseFloat(getComputedStyle(approachTrack).getPropertyValue('--tab-scroll-distance')) || 240;
    const stickyTop = parseFloat(getComputedStyle(approachLayout).top) || 0;
    const scrollStage = getApproachStage(approachTrack.getBoundingClientRect().top, stickyTop, distance, chapters.length);
    const focusedPanel = chapters.some(panel => panel.contains(document.activeElement));
    if (selectedByUser && Math.abs(window.scrollY - manualScrollPosition) > 32) selectedByUser = false;
    if (scrollStage !== currentStage && !selectedByUser && !focusedPanel) activateStage(scrollStage);
  }
  let selected = -1;
  navSections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180 && rect.bottom > 180) selected = i;
  });
  navLinks.forEach((link, i) => {
    if (selected === i) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleScroll() { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScroll); } }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
window.addEventListener('load', scheduleScroll);
reducedMotion.addEventListener('change', () => { configureApproachScroll(); scheduleScroll(); });
updateScroll();

const caseStudies = {
  platform: {
    title: 'Scale the system. Keep the clarity.',
    sections: [
      { title: 'THE SCENARIO', text: 'Imagine a growing product with tightly coupled services. A small change requires several teams to coordinate a release, failures cross service boundaries, and ownership is unclear. This concept explores how to create independence without turning the platform into an unmanageable collection of services.' },
      { title: 'THE ARCHITECTURAL APPROACH', items: ['Map business capabilities and data ownership before choosing service boundaries. Keep strongly related operations together.', 'Introduce versioned contracts and asynchronous events where eventual consistency is acceptable. Use idempotent consumers, bounded retries, and dead-letter handling.', 'Make observability part of the platform contract: trace context, structured logs, service-level objectives, and clear operational ownership.'] },
      { title: 'THE TRADE-OFF', text: 'Service independence creates operational overhead. Begin with a modular design and extract only the boundaries justified by scaling needs or team ownership. Strong consistency stays where the business requires it; events serve the places that can tolerate delayed updates.' },
      { title: 'HOW I WOULD VALIDATE IT', items: ['Measure lead time and cross-team coordination before and after a small, reversible migration.', 'Exercise consumer failures, duplicate messages, and delayed events in staging.', 'Review whether a new engineer can identify ownership, trace a request, and safely change one capability.'] },
      { title: 'WHAT SUCCESS WOULD MEAN', text: 'Teams can ship independently, diagnose failures locally, and understand the system they operate. These are proposed success criteria; no production results or numerical improvements are claimed here.' },
    ],
  },
  ai: {
    title: 'Beyond the demo. Into the real world.',
    sections: [
      { title: 'THE SCENARIO', text: 'Imagine an internal assistant answering questions across a large knowledge base. A convincing demo is easy. Consistently useful answers, correct permissions, and trustworthy behavior under uncertainty require a different level of engineering.' },
      { title: 'THE ARCHITECTURAL APPROACH', items: ['Build retrieval around document permissions, provenance, freshness, and citations. Enforce access before any context reaches the model.', 'Keep the workflow explicit: retrieve, assess context, generate, and validate. Use a bounded graph rather than an unrestricted agent loop.', 'Create an evaluation set from representative tasks. Track retrieval quality, factual grounding, abstention behavior, latency, and cost.', 'Add human review for consequential actions, clear uncertainty in answers, and a safe fallback when the evidence is insufficient.'] },
      { title: 'THE TRADE-OFF', text: 'More retrieval and validation can improve answer quality while increasing latency and cost. Start with the simplest workflow that meets the evaluation criteria. Add model routing, caching, or agents only when measured evidence justifies the complexity.' },
      { title: 'HOW I WOULD VALIDATE IT', items: ['Test missing, contradictory, stale, and access-restricted source documents.', 'Evaluate prompt injection in retrieved content and verify that tools preserve user permissions.', 'Use staged releases and trace reviews to compare failure modes with the original baseline.'] },
      { title: 'WHAT SUCCESS WOULD MEAN', text: 'The assistant helps people complete real tasks and makes its limitations visible. This is a proposed architecture, not a deployed product; it includes no invented adoption, accuracy, or savings metrics.' },
    ],
  },
};
const dialog = document.querySelector('.case-dialog');
let dialogTrigger;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const study = caseStudies[button.dataset.project];
    dialogTrigger = button;
    document.querySelector('#case-title').textContent = study.title;
    const content = document.querySelector('#case-content');
    content.replaceChildren();
    for (const section of study.sections) {
      const wrapper = document.createElement('section');
      wrapper.className = 'dialog-section';
      const heading = document.createElement('h3');
      heading.textContent = section.title;
      wrapper.append(heading);
      if (section.text) {
        const paragraph = document.createElement('p');
        paragraph.textContent = section.text;
        wrapper.append(paragraph);
      } else {
        const list = document.createElement('ul');
        for (const item of section.items) { const li = document.createElement('li'); li.textContent = item; list.append(li); }
        wrapper.append(list);
      }
      content.append(wrapper);
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    dialog.querySelector('.dialog-close').focus();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); dialogTrigger?.focus({ preventScroll: true }); });

const copyButton = document.querySelector('.copy-email');
let copyTimeout;
copyButton.addEventListener('click', async () => {
  clearTimeout(copyTimeout);
  try {
    await navigator.clipboard.writeText('saurabh.cse04@gmail.com');
    document.querySelector('.copy-label').textContent = 'Copied!';
    document.querySelector('#copy-status').textContent = 'Email address copied to clipboard.';
  } catch {
    document.querySelector('.copy-label').textContent = 'Select email to copy';
    document.querySelector('#copy-status').textContent = 'Clipboard access is unavailable. You can select and copy the email address shown beside this button.';
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.contact-email').firstChild);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  copyTimeout = setTimeout(() => { document.querySelector('.copy-label').textContent = 'Copy email'; }, 3000);
});
