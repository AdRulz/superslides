// Generated by CoffeeScript 1.4.0

/*
  Superslides 0.4.3
  Fullscreen slideshow plugin for jQuery
  by Nic Aitch @nicinabox
  http://nicinabox.github.com/superslides/
*/


(function() {
  var $children, $container, $control, $nav, $window, addPaginationItem, adjustImagePosition, adjustSlidesSize, animate, animating, append, first_load, height, is_mobile, loadImage, multiplier, play, play_interval, setHorizontalPosition, setVerticalPosition, setup, setupChildren, setupContainers, size, start, stop, update, width;

  $window = $(window);

  width = $window.width();

  height = $window.height();

  is_mobile = navigator.userAgent.match(/mobile/i);

  first_load = true;

  play_interval = 0;

  animating = false;

  size = 0;

  multiplier = 3;

  $control = [];

  $container = [];

  $nav = [];

  $children = [];

  setup = function() {
    setupContainers();
    return setupChildren();
  };

  setupContainers = function() {
    return $control.css({
      width: width * multiplier,
      height: height,
      left: size > 1 ? -width : void 0
    });
  };

  setupChildren = function() {
    if ($.fn.superslides.options.scrollable) {
      $children.each(function() {
        var $scrollable;
        $scrollable = $(this).find('.scrollable');
        if (!$scrollable) {
          $(this).wrapInner('<div class="scrollable" />');
        }
        return $scrollable.find('img').not('.keep-original').insertBefore($scrollable);
      });
    }
    if (size > 1) {
      $children.not('.current').css({
        display: 'none',
        position: 'absolute',
        overflow: 'hidden',
        top: 0,
        left: width,
        zIndex: 0
      });
    }
    return adjustSlidesSize($children);
  };

  loadImage = function($img, callback) {
    return $("<img>", {
      src: $img.attr('src')
    }).load(function() {
      if (callback instanceof Function) {
        return callback(this);
      }
    });
  };

  setVerticalPosition = function($img) {
    var scale_height;
    scale_height = width / $img.data('aspect-ratio');
    $img.height(scale_height);
    if (scale_height >= height) {
      return $img.css({
        top: -(scale_height - height) / 2
      });
    } else {
      return $img.css({
        top: 0
      });
    }
  };

  setHorizontalPosition = function($img) {
    var scale_width;
    scale_width = height * $img.data('aspect-ratio');
    $img.width(scale_width);
    if (scale_width >= width) {
      return $img.css({
        left: -(scale_width - width) / 2
      });
    } else {
      return $img.css({
        left: 0
      });
    }
  };

  adjustImagePosition = function($img) {
    if (!$img.data('aspect-ratio')) {
      loadImage($img, function(image) {
        $img.removeAttr('width').removeAttr('height');
        $img.data('aspect-ratio', image.width / image.height);
        return adjustImagePosition($img);
      });
      return;
    }
    setHorizontalPosition($img);
    setVerticalPosition($img);
    return $container.trigger('slides.image_adjusted');
  };

  adjustSlidesSize = function($el) {
    $el.each(function(i) {
      $(this).width(width).height(height);
      if (size > 1) {
        $(this).css({
          left: width
        });
      }
      return adjustImagePosition($('img', this).not('.keep-original'));
    });
    return $container.trigger('slides.sized');
  };

  addPaginationItem = function(i) {
    var $pagination;
    $pagination = $(".slides-pagination");
    if (!(i >= 0)) {
      i = size - 1;
    }
    return $pagination.append($("<a>", {
      href: "" + (window.location.pathname + window.location.search) + "#" + i
    }));
  };

  start = function() {
    var index;
    if (size > 1) {
      if (location.hash) {
        index = location.hash.replace(/^#/, '');
      } else {
        index = (first_load ? 0 : "next");
      }
      animate(index);
      return play();
    } else {
      $container.fadeIn('fast');
      return $("." + $.fn.superslides.options.nav_class).hide();
    }
  };

  stop = function() {
    return clearInterval(play_interval);
  };

  play = function() {
    if ($.fn.superslides.options.play) {
      if (play_interval) {
        stop();
      }
      return play_interval = setInterval(function() {
        return animate((first_load ? 0 : "next"));
      }, $.fn.superslides.options.delay);
    }
  };

  update = function() {
    $children = $container.children();
    $.fn.superslides.api.size = size = $children.length;
    setupChildren();
    addPaginationItem();
    return $container.trigger('slides.updated');
  };

  append = function($el) {
    $container.append($el);
    return update();
  };

  animate = function(direction) {
    var next, position, prev,
      _this = this;
    if (animating || direction >= size || direction === this.current) {
      return;
    }
    animating = true;
    prev = this.current || direction - 1 || 0;
    switch (direction) {
      case 'next':
        position = width * 2;
        direction = -position;
        next = this.current + 1;
        if (size === next) {
          next = 0;
        }
        break;
      case 'prev':
        position = direction = 0;
        next = this.current - 1;
        if (next === -1) {
          next = size - 1;
        }
        break;
      default:
        next = +direction;
        if (isNaN(next)) {
          console.log('isnan');
          animating = false;
          return false;
          break;
        }
        if (next > prev) {
          position = width * 2;
          direction = -position;
        } else {
          position = direction = 0;
        }
    }
    this.current = next;
    $children.removeClass('current').eq(this.current).css({
      left: position,
      display: 'block'
    });
    $control.animate({
      useTranslate3d: (is_mobile ? true : false),
      left: direction
    }, $.fn.superslides.options.slide_speed, $.fn.superslides.options.slide_easing, function() {
      $control.css({
        left: -width
      });
      $children.eq(next).css({
        left: width,
        zIndex: 2
      });
      $children.eq(prev).css({
        left: width,
        display: 'none',
        zIndex: 0
      });
      $children.eq(_this.current).addClass('current');
      if (first_load) {
        $container.fadeIn('fast');
        $container.trigger('slides.initialized');
        first_load = false;
      }
      animating = false;
      return $container.trigger('slides.animated', [_this.current, next, prev]);
    });
    return this.current;
  };

  $.fn.superslides = function(options) {
    var api, args, method;
    if (typeof options === "string") {
      api = $.fn.superslides.api;
      method = options;
      args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      return api[method].apply(this, args);
    } else {
      options = $.fn.superslides.options = $.extend($.fn.superslides.options, options);
      $("." + options.container_class, this).wrap('<div class="slides-control" />');
      $control = $('.slides-control', this);
      $container = $("." + options.container_class);
      $nav = $("." + options.nav_class);
      $children = $container.children();
      $.fn.superslides.api.size = size = $children.length;
      multiplier = (size === 1 ? 1 : 3);
      return this.each(function() {
        var _this = this;
        setup();
        $(window).resize(function(e) {
          width = $window.width();
          height = $window.height();
          adjustSlidesSize($children);
          $control.width(width * multiplier).height(height);
          if (size > 1) {
            return $control.css({
              left: -width
            });
          }
        });
        $(document).on('click', "." + options.nav_class + " a", function(e) {
          e.preventDefault();
          stop();
          if ($(this).hasClass('next')) {
            return animate('next');
          } else {
            return animate('prev');
          }
        });
        if (options.pagination) {
          $window.on("slides.initialized", function(e) {
            $(_this).append($("<nav>", {
              "class": 'slides-pagination'
            }));
            return $children.each(function(i) {
              return addPaginationItem(i);
            });
          }).on("slides.animated", function(e, current, next, prev) {
            var $pagination;
            $pagination = $(".slides-pagination");
            $(".active", $pagination).removeClass("active");
            return $("a", $pagination).eq(current).addClass("active");
          }).on("click", ".slides-pagination a", function(e) {
            var index;
            if (!options.hashchange) {
              e.preventDefault();
            }
            index = this.hash.replace(/^#/, '');
            return animate(index);
          }).on('hashchange', function(e) {
            var index;
            index = location.hash.replace(/^#/, '');
            stop();
            return animate(index);
          });
        }
        return start();
      });
    }
  };

  $.fn.superslides.options = {
    delay: 5000,
    play: false,
    slide_speed: 'normal',
    slide_easing: 'linear',
    nav_class: 'slides-navigation',
    container_class: 'slides-container',
    pagination: false,
    hashchange: false,
    scrollable: true
  };

  $.fn.superslides.api = {
    start: function() {
      return start();
    },
    stop: function() {
      return stop();
    },
    play: function() {
      return play();
    },
    append: function($el) {
      return append($el);
    },
    animate: function(direction) {
      stop();
      return animate(direction);
    },
    next: function() {
      return animate('next');
    },
    prev: function() {
      return animate('prev');
    }
  };

}).call(this);
