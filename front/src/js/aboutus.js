async function aboutUs() {
   var randomSlideIndex = Math.floor(Math.random() * 5);
   var swiper = new Swiper(".mySwiper", {
    direction: "horizontal",
     effect: "coverflow",
     grabCursor: true,
     centeredSlides: true,
     slidesPerView: "auto",
     loop: false,
     coverflowEffect: {
       depth: 500,
       modifier: 1,
       slideShadows: true,
       rotate: 0,
       stretch: 0
     },
     initialSlide: randomSlideIndex // Establece el slide inicial en el div del medio (índice 2)
   });

   swiper.slideTo(2, 0, false); // Centra el carrusel en el div del medio
 };
