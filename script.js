'use strict';

///////////////////////////////////////
///////////// ELEMENT
// Modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Header
const header = document.querySelector('.header');

// Navigation
const nav = document.querySelector('.nav');
const logo = document.querySelector('.nav__logo');
const navLink = document.querySelectorAll('.nav__link');
const navLinkContainer = document.querySelector('.nav__links');

// Hero link
const learnMore = document.querySelector('.btn--scroll-to');

// Section
const sections = document.querySelectorAll('.section');

// Image
const imgLazy = document.querySelectorAll('img[data-src]');

// Operation tab
const tabOp = document.querySelectorAll('.operations__tab');
const tabOpContainer = document.querySelector('.operations__tab-container');
const contentOP = document.querySelectorAll('.operations__content');

// Slider
const sliderContainer = document.querySelector('.slider');
const sliders = document.querySelectorAll('.slide');
const btnNext = document.querySelector('.slider__btn--right');
const btnPrev = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
///////////// MODAL WINDOW
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(el => el.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
///////////// NAVIGATION ANIMATION
const navAnim = function (e) {
  if (!e.target.classList.contains('nav__link')) return;
  // Hovered link
  const link = e.target;

  // Hovered link Sibling
  const linkSibling = e.target
    .closest('.nav__links')
    .querySelectorAll('.nav__link');

  linkSibling.forEach(sib => {
    if (!(sib !== link)) return;
    sib.style.opacity = this;
  });

  logo.style.opacity = this;
};

nav.addEventListener('mouseover', navAnim.bind('0.3'));
nav.addEventListener('mouseout', navAnim.bind('1'));

///////////////////////////////////////
///////////// NAVIGATION SMOOTH SCROLL
nav.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;

  const link = e.target;

  // Target element ID
  const elID = link.getAttribute('href');

  document.querySelector(elID).scrollIntoView({ behaviour: 'smooth' });
});

///////////////////////////////////////
///////////// STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;

const navSticky = function (entries) {
  entries[0].isIntersecting === false
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

navObserver.observe(header);

///////////////////////////////////////
///////////// LEARN MORE LINK SCROLL
learnMore.addEventListener('click', function () {
  document.querySelector('#section--1').scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
///////////// SECTION SLIDING ANIMATION
const sectionAnim = function (entries, observer) {
  entries[0].isIntersecting === true
    ? entries[0].target.classList.remove('section--hidden')
    : entries[0].target.classList.add('section--hidden');
};

const sectionObserver = new IntersectionObserver(sectionAnim, {
  root: null,
  threshold: 0.2,
});

sections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

///////////////////////////////////////
///////////// LAZY IMG LOADING
const imgLazyCallback = function (entries, observer) {
  if (!(entries[0].isIntersecting === true)) return;

  const img = entries[0].target;

  img.setAttribute('src', `${img.dataset.src}`);

  img.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(imgLazyCallback, {
  root: null,
  threshold: 0.5,
});

imgLazy.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
///////////// OPERATION TAB
tabOpContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('operations__tab')) return;

  tabOp.forEach(t => t.classList.remove('operations__tab--active'));
  contentOP.forEach(c => c.classList.remove('operations__content--active'));

  e.target.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${e.target.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
///////////// SLIDER
// Initial condition
let currentSlide = 0;
const lastSlide = sliders.length - 1;
const toSlide = function (slide) {
  sliders.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

// Creating dots
sliders.forEach((_, i) => {
  dotsContainer.insertAdjacentHTML(
    'beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`
  );
});

// Dot active
const dots = document.querySelectorAll('.dots__dot');

const dotActive = function (slide) {
  // Remove active dot
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));

  // Add active dot
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
dotActive(0);
toSlide(0);

// Button
const nextSlide = function () {
  currentSlide === lastSlide ? (currentSlide = 0) : currentSlide++;

  toSlide(currentSlide);
  dotActive(currentSlide);
};

const prevSlide = function () {
  currentSlide === 0 ? (currentSlide = lastSlide) : currentSlide--;

  toSlide(currentSlide);
  dotActive(currentSlide);
};

sliderContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('slider__btn--right')) {
    nextSlide();
  }

  if (e.target.classList.contains('slider__btn--left')) {
    prevSlide();
  }
});

// Keyboard event slide
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

// Dot clicked event
dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;

  currentSlide = e.target.dataset.slide;
  toSlide(currentSlide);
  dotActive(currentSlide);
});
