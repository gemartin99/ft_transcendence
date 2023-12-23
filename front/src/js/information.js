function toggleAccordion(index) {
    const content = document.getElementsByClassName('accordion-content')[index - 1];
    content.classList.toggle('active');
  }