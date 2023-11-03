$(document).ready(function(){
  $('.tour-slider').slick({
    slidesToShow: 5,
    slidesToScroll:1,
    infinite: false,
    arrows: true,
    prevArrow:
    "<button type='button' class='slick-prev slick-arrow'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
    nextArrow:
    "<button type='button' class='slick-next slick-arrow'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
    // draggable:false,
    // autoplay: true,
    // autoplaySpeed: 1000,
    dots :true,
  });

});

$(document).ready(function(){
  $('.content-says-group').slick({
    slidesToShow: 1,
    prevArrow:
    "<button type='button' class='slick-prev__says slick-arrow_'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
    nextArrow:
    "<button type='button' class='slick-next__says slick-arrow'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
  });

});