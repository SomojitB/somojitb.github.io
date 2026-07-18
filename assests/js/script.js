$(document).ready(function(){

    $('#menu').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load',function(){
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if(window.scrollY>60){
            document.querySelector('#scroll-top').classList.add('active');
        }else{
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function(){
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if(top>offset && top<offset+height){
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click',function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop : $($(this).attr('href')).offset().top,
        },500, 'linear')
    })
});

document.addEventListener('visibilitychange',
function(){
    if(document.visibilityState === "visible"){
        document.title = "Portfolio | Somojit Banerjee";
        $("#favicon").attr("href","assests/images/favicon.jpg");
    }
    else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href","assests/images/favhand.png");
    }
});


// <!-- typed js effect starts -->
    var typed = new Typed(".typing-text", {
        strings: ["cloud security architecture", "DevSecOps automation", "multi-cloud security", "policy-as-code", "vulnerability management"],
        loop: true,
        typeSpeed: 50,
		backSpeed: 25,
		backDelay: 500,
      });
// <!-- typed js effect ends -->

// <!-- anime.js dynamic motion starts -->
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function runPortfolioAnimations() {
    if (prefersReducedMotion || typeof anime === 'undefined') {
        document.querySelectorAll('.count').forEach((item) => {
            item.textContent = item.dataset.count;
        });
        return;
    }

    anime.timeline({ easing: 'easeOutExpo' })
        .add({
            targets: 'header',
            translateY: [-40, 0],
            opacity: [0, 1],
            duration: 700
        })
        .add({
            targets: '.home .content h3, .home .content p, .hero-summary, .hero-actions, .social-icons li',
            translateY: [35, 0],
            opacity: [0, 1],
            delay: anime.stagger(90),
            duration: 900
        }, '-=350')
        .add({
            targets: '.home .image img',
            scale: [.86, 1],
            rotate: [-4, 0],
            opacity: [0, 1],
            duration: 900
        }, '-=700');

    anime({
        targets: '.hero-stats div',
        translateY: [24, 0],
        opacity: [0, 1],
        delay: anime.stagger(140, { start: 500 }),
        duration: 850,
        easing: 'easeOutCubic'
    });

    document.querySelectorAll('.count').forEach((item) => {
        const target = Number(item.dataset.count || 0);
        anime({
            targets: item,
            innerHTML: [0, target],
            round: 1,
            delay: 650,
            duration: 1600,
            easing: 'easeOutExpo'
        });
    });

    anime({
        targets: '.about-tags span',
        scale: [.92, 1],
        opacity: [0, 1],
        delay: anime.stagger(70, { start: 250 }),
        duration: 600,
        easing: 'easeOutBack'
    });

    document.querySelectorAll('.work .box, .experience .content, .skills .bar').forEach((card) => {
        card.addEventListener('mouseenter', () => {
            anime.remove(card);
            anime({
                targets: card,
                translateY: -6,
                duration: 260,
                easing: 'easeOutQuad'
            });
        });
        card.addEventListener('mouseleave', () => {
            anime.remove(card);
            anime({
                targets: card,
                translateY: 0,
                duration: 320,
                easing: 'easeOutQuad'
            });
        });
    });
}

window.addEventListener('load', runPortfolioAnimations);
// <!-- anime.js dynamic motion ends -->

// <!-- tilt js effect starts -->
      VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
      });
// <!-- tilt js effect ends -->


// pre loader start
function loader(){
    document.querySelector('.loader-container').classList.add('fade-out');
}
function fadeOut(){
    setTimeout(loader,500);
}
window.onload = fadeOut;
// pre loader end

// Start of Tawk.to Live Chat
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
  (function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/60f70460649e0a0a5ccd22a7/1fb2ei71o';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
  })();
// End of Tawk.to Live Chat



/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3',{delay: 200}); 
srtop.reveal('.home .content p',{delay: 200}); 
srtop.reveal('.home .hero-summary',{delay: 250});
srtop.reveal('.home .hero-stats div',{interval: 120});
srtop.reveal('.home .content .btn',{delay: 200}); 

srtop.reveal('.home .image',{delay: 400}); 
srtop.reveal('.home .linkedin',{interval: 600}); 
srtop.reveal('.home .github',{interval: 800}); 
srtop.reveal('.home .twitter',{interval: 1000});
srtop.reveal('.home .telegram',{interval: 600}); 
srtop.reveal('.home .instagram',{interval: 600}); 
srtop.reveal('.home .dev',{interval: 600}); 



/* SCROLL ABOUT */
srtop.reveal('.about .content h3',{delay: 300});
srtop.reveal('.about .content .tag',{delay: 400}); 
srtop.reveal('.about .content p',{delay: 300}); 
srtop.reveal('.about .content .box-container',{delay: 300}); 
srtop.reveal('.about .content .about-tags span',{interval: 100});
srtop.reveal('.about .content .resumebtn',{delay: 300}); 


/* SCROLL SKILLS */
srtop.reveal('.skills .container',{interval: 200}); 
srtop.reveal('.skills .container .bar',{delay: 400}); 

/* SCROLL EDUCATION */
srtop.reveal('.education .box',{interval: 200}); 

/* SCROLL PROJECTS */
srtop.reveal('.work .box',{interval: 200}); 

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline',{delay: 400});
srtop.reveal('.experience .timeline .container',{interval: 400}); 

/* SCROLL CONTACT */
srtop.reveal('.contact .container',{delay: 400});
srtop.reveal('.contact .container .form-group',{delay: 400});
