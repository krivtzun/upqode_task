$(document).ready(function(){

  //header
  window.addEventListener("scroll", function() {
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  $('img.img-svg').each(function(){
    const $img = $(this);
    const imgClass = $img.attr('class');
    const imgURL = $img.attr('src');
    $.get(imgURL, function(data) {
      let $svg = $(data).find('svg');
      if(typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass+' replaced-svg');
      }
      $svg = $svg.removeAttr('xmlns:a');
      if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }
      $img.replaceWith($svg);
    }, 'xml');
  });
// Menu active
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.menu__link-header').forEach((link) => {
          link.classList.toggle('menu_link--active', link.getAttribute('href').replace('#', '') === entry.target.id )
        })
      }
    })
  }, {
    threshold: 0.7,
  })
  
  document.querySelectorAll('section').forEach((section) => observer.observe(section));

// Slider
  let slideWrapper = $(".banner"),
  iframes = slideWrapper.find('.embed-player');

  // POST commands to YouTube or Vimeo API
  function postMessageToPlayer(player, command){
    if (player == null || command == null) return;
    player.contentWindow.postMessage(JSON.stringify(command), "*");
  }

// When the slide is changing
  function playPauseVideo(slick, control){
    let currentSlide, player;

    currentSlide = slick.find(".slick-current");
    player = currentSlide.find("iframe").get(0);

      switch (control) {
        case "play":
          postMessageToPlayer(player, {
            "event": "command",
            "func": "mute"
          });
          postMessageToPlayer(player, {
            "event": "command",
            "func": "playVideo"
          });
          break;
        case "pause":
          postMessageToPlayer(player, {
            "event": "command",
            "func": "pauseVideo"
          });
          break;
      }
  }

  

// Resize player
  function resizePlayer(iframes, ratio = 16/9) {
    if (!iframes[0]) return;
    let win = $(".banner"),
        width = win.width(),
        playerWidth,
        height = win.height(),
        playerHeight;

    iframes.each(function(){
      let current = $(this);
      if (width / ratio < height) {
        playerWidth = Math.ceil(height * ratio);
        current.width(playerWidth).height(height).css({
          left: (width - playerWidth) / 2,
          top: 0
          });
      } else {
        playerHeight = Math.ceil(width / ratio);
        current.width(width).height(playerHeight).css({
          left: 0,
          top: (height - playerHeight) / 2
        });
      }
    });
  }

  // Initialize
    slideWrapper.on("init", function(slick){
      slick = $(slick.currentTarget);
      setInterval(function(){
        playPauseVideo(slick,"play");
      }, 1000);
      resizePlayer(iframes, 16/9);
    });
    slideWrapper.on("beforeChange", function(event, slick) {
      slick = $(slick.$slider);
      playPauseVideo(slick,"pause");
    });
    slideWrapper.on("afterChange", function(event, slick) {
      slick = $(slick.$slider);
      playPauseVideo(slick,"play");
    });

    //start the banner
    slideWrapper.slick({
      lazyLoad:"progressive",
      speed:600,
      dots: true,
      cssEase:"cubic-bezier(0.87, 0.03, 0.41, 0.9)",
      arrows: true,
      nextArrow: '<i class="fas fa-chevron-right"></i>',
      prevArrow: '<i class="fas fa-chevron-left"></i>',
    });

// Resize event
  $(window).on("resize.slickVideoPlayer", function(){  
    resizePlayer(iframes, 16/9);
  });

// services
  gsap.registerPlugin(MotionPathPlugin);

  // The start and end positions in terms of the page scroll
  const offsetFromTop = innerHeight * 0.25;
  const pathBB = document.querySelector("#path").getBoundingClientRect();
  const startY = pathBB.top - innerHeight + offsetFromTop;
  const finishDistance = startY + pathBB.height - offsetFromTop;

  // the animation to use
  let tween = gsap.to("#servives__animation-circle", {
    duration: 5, 
    paused: true,
    ease: "none",
    motionPath: {
      path: "#path",
      align: "#path",
      autoRotate: true,
      alignOrigin: [0.5, 0.5]
    }    
  }).pause(0.001);

  // Listen to the scroll event
  document.addEventListener("scroll", function() {
    // Prevent the update from happening too often (throttle the scroll event)
    if (!requestId) {
      requestId = requestAnimationFrame(update);
    }
  });

  update();

  function update() {
    // Update our animation
    tween.progress((scrollY - startY) / finishDistance);
    
    // Let the scroll event fire again
    requestId = null;
  }


  //pageup
  $(window).scroll(function() {
    if ($(this).scrollTop() > 1200) {
      $('.pageup').fadeIn();
    } else {
      $('.pageup').fadeOut();
    }
  })

  $("a[href^='#']").click(function(){
    const _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
    return false;
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > 1200) {
      $('.pageup').fadeIn();
    } else {
      $('.pageup').fadeOut();
    }
  })

 


//hamburger

  
    const menu = document.querySelector('.header__menu'),
    menuItem = document.querySelectorAll('.menu__list-item'),
    hamburger = document.querySelector('.header__hamburger');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('menu_active');
        })
})


// Map info

  const items = document.querySelectorAll('.contacts__items'),
        contactsInfo = document.querySelectorAll('.contacts__info'),
        itemsParent =  document.querySelector('.contacts__items-wrapper');
        
  function hideTabContent() {
      contactsInfo.forEach (item => {
          item.style.display = 'none';
      });

      items.forEach(item => {
          item.classList.remove('contacts__items-active');
      });
  }  
   
  function showTabContent(i = 0) {
      contactsInfo[i].style.display = 'block';
      items[i].classList.add('contacts__items-active');
  }  

  hideTabContent();
  showTabContent();

  itemsParent.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.classList.contains('.contacts__items'.slice(1)) || target.parentElement.classList.contains('.contacts__items'.slice(1))) {
          items.forEach((item, i) => {
              if (target == item || target.parentElement == item) {
                  hideTabContent();
                  showTabContent(i);
              }
          });
      }
  }, true);

});
// Map

const markers = [
  {
    "title": 'Los Angeles',
      "lat": '34.05543946643254',
      "lng": '-118.24286512921447',  
  },
  {
      "title": 'New York',
      "lat": '40.73859206881524',
      "lng": '-73.9812225658063'
  },
  {
      "title": 'Boston',
      "lat": '42.34624479390479',
      "lng": '-71.06917160917789'
  },
  {
      "title": 'Detroit',
      "lat": '42.339430940818374',
      "lng": '-83.04909052876437',
  }
  ];

let map;
let marker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
    zoom: 11,
    mapId: '9a7daf522b264e1'
  });
  SetMarker(0);
}

function SetMarker(position) {
  //Remove previous Marker.
  if (marker != null) {
      marker.setMap(null);
  }

  //Set Marker on Map.
  let data = markers[position];
  let myLatlng = new google.maps.LatLng(data.lat, data.lng);
  marker = new google.maps.Marker({
      position: myLatlng,
      map,

  });

  map.setCenter(myLatlng);
};

$(".contacts__items-losangeles").click(function() {
  SetMarker(0)
});

$(".contacts__items-newyork").click(function() {
  SetMarker(1)
});

$(".contacts__items-boston").click(function() {
  SetMarker(2)
});

$(".contacts__items-detroit").click(function() {
  SetMarker(3)
});



