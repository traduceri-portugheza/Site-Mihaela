/* 
    FILE CONTENTS:

    1. Cache objects
    2. On document ready
    3. On window load
    4. On window scroll
    5. On window resize
    6. Functions

*/

(function($) {
    "use strict";

    /* ==============================================
    1. Cache objects
    ================================================= */
    // 1.1 Global
    var $win = $(window);
    var $doc = $(document);
    var $preloader = $("#preloader");
    var $header = $(".mastHead");
    var $menu = $("#MenuBar > ul");
    var $mobileMenuLink = $("#mobileTrigger");

    // 1.2 Gallery & Images   
    var $imageLink = $('.image-link');
    var $isotopeContainer = $(".isotope");
    var $filterIsotope = $("#filterPortfolio");
    var $projectCarousel = $("#projectCarousel");
    
    // 1.3 Contact  
    var $mapCanvas = $("#map_canvas");
    var $contactForm = $("#contactform");
    var $successFeedback = $("#successContact");
    var $errorFeedback = $("#errorContact");

    // 1.4 Shortcodes
    var $timer = $(".timer");
    var $iconTabs = $("#iconTabs");
    var $simpleTabs = $("#simpleTabs");
    var $accordion = $("#accordion");
    var $progressBar = $(".progressBar .wrap");
    var $clients = $("#clients");
    var $testimonials = $("#testimonials");
    
    /* ==============================================
    2. On document ready
    ================================================= */
    $(function(){
        retinajs();
        windowWidth();
        stickyHeader();
        showMobileMenu();
        toggleMobileMenu();
        mainSlideshow();
        testimonialsCarousel();
        clientsCarousel();
        projectCarousel(); 
        $accordion.smoothAccordion();
        $simpleTabs.organicTabs();
        $iconTabs.organicTabs();
        $imageLink.magnificPopup({type:"image"});
        numberCounter();
        animateProgressBar();
        AOS.init({once: true, disable: 'mobile'});
        initializeGMap();
        submitContactForm();
    });

    /* ==============================================
    3. On window load
    ================================================= */
    $win.on("load", function () {
        preloadAll();
        isotopeGallery();
    });

    /* ==============================================
    4. On window scroll
    ================================================= */
    $win.on("scroll", function() {
       stickyHeader();
    });

    /* ==============================================
    5. On window resize
    ================================================= */
    $win.on("resize", function() {
        windowWidth();
        showMobileMenu();
        isotopeGallery();
        stickyHeader();
    });


    /* ==============================================
    6. Functions
    ================================================= */
    // Site Preloader ----------------------------------
    function preloadAll() {
        if($preloader.length) {
            var $loading = $preloader.find(".loading");
            $loading.fadeOut();
            $preloader.delay(100).fadeOut(300);
        }
    }

    // Sticky Header ------------------------------
    function stickyHeader() {
        var stickPoint = "150";
        if (width >= 992){
            if ($win.scrollTop() >= stickPoint) {
                $header.addClass("fixed");
            }
            else {
                $header.removeClass("fixed");
            }
        }
        else {
            $header.removeClass("fixed");
        }
    }

    // Mobile Menu ------------------------------
    function showMobileMenu() {
        if (width >= 992) {
            $menu.addClass("navList").removeClass("mMobile").show();
            $mobileMenuLink.hide();
            $menu.find($(".dropMenu")).attr("style", "");
            $menu.find("a.down").removeClass("expand");
            $doc.on("click", "a.down", function(e){
                e.preventDefault();
            });
         }
         else {
            $menu.removeClass("navList").addClass("mMobile").hide();
            $mobileMenuLink.show();
            $menu.find("a.down").addClass("expand");
        }
    }
    function toggleMobileMenu() {
        $mobileMenuLink.on("click", function(e){
            $("ul.mMobile").slideToggle("slow", function(){
                $("ul.mMobile").toggleClass("open");
            });
            e.preventDefault();
        });
        $doc.on("click", "a.expand", function(e){
            $(this).next().slideToggle();
            e.preventDefault();
        });
    }

    // Homepage slideshow --------------------------
    function mainSlideshow(){
        var $slider = $("#homeSlider");
        var $desc = $slider.find('.description');
        var sH = $slider.height();
        var sW = $slider.width(); 
        var homeSlider = $("#homeSlider").glide({
            type: "slideshow",
            autoplay: 400000,
            hoverpause: true,
            afterInit: function() {
                drawLayout();
                setTimeout(function(){
                    var $activeSlide = $(".glide__slide.active");
                    $activeSlide.find(".description").addClass("active")
                }, 400);
            },
            beforeTransition: function() {
                $desc.removeClass("active");
            },
            afterTransition: function() {
                var $activeSlide = $(".glide__slide.active");
                    $activeSlide.find(".description").addClass("active")
            }
        }).data("glide_api");
        function drawLayout(){
            var sH = $slider.height();
            $desc.each(function(i, el) {
                var h = $(el).height();
                $(el).css({"top": (sH - h)/2 + "px"});
            });
            // $slider.find(".glide__slide img").each(function(i, img) {
            //      var imgW = $(img).width();
            //      var imgH = $(img).height();
            //      $(img).css((imgW > width) ? {"width": "auto", "margin-left": -((imgW-width)/2) + "px"} : {"width": width, "margin-left":0});
            //      $(img).css((imgH > sH) ? {"margin-top": -((imgH-sH)/2) + "px"} : {"margin-top": 0});
            // });
        }
        $win.on("resize", drawLayout);
    }

    // Testimonials carousel -----------------------
    function testimonialsCarousel() {
        if ($testimonials.length) {
            $testimonials.owlCarousel({
                items: 1,
                autoHeight: true
            });
        }
    }

    // Projects carousel -----------------------
    function projectCarousel() {
        if ($projectCarousel.length) {
            $projectCarousel.owlCarousel({
                items: 1,
                autoHeight: true,
                dots: false,
                nav: true,
                navText : ["<i class=\"fa fa-chevron-left\"></i>","<i class=\"fa fa-chevron-right\"></i>"]
            });
        }
    }

    // Clients carousel -----------------------
     function clientsCarousel() {
        if ($clients.length) {
            $clients.owlCarousel({
                dots: true,
                nav: false,
                autoplay: false, //// modified
                loop:true,
                autoplaySpeed: 1000,
                lazyLoad:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:3
                    },
                    1000:{
                        items:4}
                }
            });
        }
    }

    //Contact form ----------------------------------
    function submitContactForm() {
        $contactForm.on('submit', function(e) {
            e.preventDefault();
            var formData = $contactForm.serialize();
            $.ajax({
                type: "POST",
                url: $contactForm.attr("action"),
                data: formData
            })
            .done(function(response) {
                $successFeedback.find(".alert").text(response);
                $successFeedback.slideDown("slow");
                $contactForm.find($(".formControl")).val("");
                $contactForm.slideUp("slow");
            })
            .fail(function(data) {
                if (data.responseText !== "") {
                    $errorFeedback.find(".alert").text(data.responseText);
                } else {
                    $errorFeedback.find(".alert").text("An error occured and your message could not be sent.");
                }
                $errorFeedback.slideDown("slow");
            });
        });
    }

    // Display Google Map ------------------------------
    function initializeGMap() {
        var geocoder;
        var map;
        if($mapCanvas.length) {
            geocoder = new google.maps.Geocoder();
            var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(51.513967, -0.153681),
                scrollwheel: false
            }
            map = new google.maps.Map($mapCanvas[0], mapOptions);
            var address = $mapCanvas.attr("data-address");
            if (address) {
              geocoder.geocode({"address": address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  map.setCenter(results[0].geometry.location);
                  var marker = new google.maps.Marker({
                      map: map,
                      position: results[0].geometry.location
                  });
                } else { //nothing to do here
                }
              });
            }
            google.maps.event.addDomListener(window, "resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center); 
            });
        }
    }

    // Animate Progress bars ------------------------------ 
    function animateProgressBar() {
        $progressBar.appear(function () {
            $progressBar.each(function(){
                var innerWidth = $(this).attr("data-width") + '%';
                if (!$(this).hasClass("animated")) {
                    $(this).addClass('animated').animate({width: innerWidth}, {duration: 1000});
                }
            });
       });
    }

    // Isotope Portfolio ------------------------------------
    function isotopeGallery() {
        if($isotopeContainer.length) {
            $isotopeContainer.isotope({
              itemSelector: ".item",
              percentPosition: true,
              masonry: {
                columnWidth: ".grid-sizer"
              }
            });
        }
        $filterIsotope.on( "click", "a", function(e) {
            $filterIsotope.find(".active").removeClass("active");
            $(this).addClass("active");
            $isotopeContainer.isotope({filter: $(this).attr("data-filter")});
            e.preventDefault();
        });
    }

    // Number counter ------------------------------
    function numberCounter(){
        $timer.appear(function () {
            $timer.countTo();
       });
    }

    // Get window width ----------------------------
    var width;
    function windowWidth() {
        width = Math.max($win.width(), window.innerWidth);
    }

    // Accordion plugin ------------------------------------
    (function($) {
        $.fn.smoothAccordion = function() {
            this.each(function() {
                var element = this;
                var accordionContent = $(element).find(".accordionCnt");
                var link = $(element).find(".head");
                accordionContent.each(function(){
                    var $main = $(this);
                    if ($main.hasClass("active")) {
                        $main.show();
                        $main.prev().addClass("active");
                    }
                });
                link.on("click", function(e) {
                    var $cnt = $(this).next();
                    if(!$cnt.hasClass("active")) {
                        accordionContent.removeClass("active").slideUp();
                        link.removeClass("active");
                        $cnt.addClass("active").slideDown();
                        $(this).addClass("active");
                    }
                    e.preventDefault();
                });
            })
            return this;
        }
    })(jQuery);

    // Tabs plugin ------------------------------------
    (function($) {
        $.organicTabs = function(el, options) {
            var base = this;
            base.$el = $(el);
            base.$nav = base.$el.find(".nav");
            base.init = function() {
                base.options = $.extend({},$.organicTabs.defaultOptions, options);
                $(".hide").css({
                    "position": "relative",
                    "top": 0,
                    "left": 0,
                    "display": "none"
                });
                base.$nav.delegate("li > a", "click", function() {
                    var curList = base.$el.find("a.active").attr("href").substring(1),
                        $newList = $(this),
                        listID = $newList.attr("href").substring(1),
                        $allListWrap = base.$el.find(".tabContent"),
                        curListHeight = $allListWrap.height();
                        $allListWrap.height(curListHeight);

                    if ((listID != curList) && ( base.$el.find(":animated").length == 0)) {
                        base.$el.find("#"+curList).fadeOut(base.options.speed, function() {
                            base.$el.find("#"+listID).fadeIn(base.options.speed);
                            var newHeight = base.$el.find("#"+listID).height();
                            $allListWrap.animate({
                                height: newHeight
                            });
                            base.$el.find(".nav li a").removeClass("active");
                            $newList.addClass("active");
                        });
                    }
                    return false;
                });
            };
            base.init();
        };
        $.organicTabs.defaultOptions = {
            "speed": 300
        };
        $.fn.organicTabs = function(options) {
            return this.each(function() {
                (new $.organicTabs(this, options));
            });
        };
    })(jQuery);
})(jQuery);
