window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 0);
   
});

//Slow appear Event
var headerContent = document.querySelectorAll(".content-heading__foreground  .slow-appear");
var time;
var i = 0;
function slowShowHero() {
    if (headerContent[i].length > 1){
        time = 50;
    }else{
        time = 300;
    }
    setTimeout(function() {
        headerContent[i].style.display = "flex";
        headerContent[i].style.opacity = "1"; 
        i++;
        if (i < headerContent.length){
          slowShowHero();
        }
  }, time)
}
slowShowHero();

