
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const headershrink = document.querySelector('.header-container');

    header.classList.toggle('sticky', window.scrollY > 0);
    headershrink.classList.toggle('sticky', window.scrollY > 0);
})
