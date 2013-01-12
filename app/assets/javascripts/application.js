// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

/**  Plugins  **/

/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
/* Delay Hover (Intent) */
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);


/* Shorten Plot */
jQuery.fn.shorten = function(settings) {

  var config = {
    showChars : 100,
    ellipsesText : "...",
    moreText : "more",
    lessText : "less"
  };

  var hoverConfig = {
    over: showPlot,
    timeout: 500,
    out: hidePlot
  }

  if (settings) {
    $.extend(config, settings);
  }

  $('.plot').die();

  $('.plot').hoverIntent(hoverConfig);

  function showPlot() {
    $(this).children('.shortcontent').css('opacity', '0').hide();
    $(this).children('.allcontent').fadeTo(200, 1).show();
    $(this).children('.allcontent').addClass('all');
  }

  function hidePlot() {
    $(this).children('.allcontent').css('opacity', '0').hide();
    $(this).children('.shortcontent').fadeTo(200, 1).show();
    $(this).children('.allcontent').removeClass('all');
  } 


  return this.each(function() {
    var $this = $(this);
 
    var content = $this.html();
    if (content.length > config.showChars) {
      var c = content.substr(0, config.showChars);
      var h = content.substr(config.showChars , content.length - config.showChars);
      var html = '<span class="shortcontent">' + c + '<span class="moreellipses">' + config.ellipsesText + '</span></span><span class="allcontent">' + c + h + '</span>';
      $this.html(html);
      $(".allcontent").css('opacity', '0');
    }
  });
}


/* Ajax */
$(function() {
  $('[data-remote][data-replace]')
    .data('type', 'html')
    .live('ajax:success', function(event, data) {
      var $this = $(this);
      $($this.data('replace')).html(data);     
      

      /* reapply details hover */
      $('figure')
      .hover(function() {
        $(this).children('ul').hoverFlow('mouseenter', { opacity: 1 }, 'fast');
      }, function() {
        $(this).children('ul').hoverFlow('mouseleave', { opacity: 0 }, 'fast');
      });

      /* plot popup */
      $(".plot").shorten({
        "showChars" : 100
      });

      $this.trigger('ajax:replaced');
    });
});


/**  App **/
$(document).ready(function(){
	/* movie details */
  $('figure')
  .hover(function() {
    $(this).children('ul').hoverFlow('mouseenter', { opacity: 1 }, 'fast');
  }, function() {
    $(this).children('ul').hoverFlow('mouseleave', { opacity: 0 }, 'fast');
  });


  /* plot popup */
  $(".plot").shorten({
    "showChars" : 100
  });



  /* genres menu */
  $('nav#genres')
  .hover(function() {
    $('nav#genres ul').stop().fadeIn(100, function() { });
  }, function() {
    $('nav#genres ul').stop().fadeOut(100, function() { });
  });

  /*  sort order */
  var order = "updated"

  $('#order li').click(function () {
    if ($(this).is('.by')) {
      /* toggle ASC or DESC on second click */
      if ($('#genres a[href*="ASC"]').length > 0) {
        $('#genres a').attr('href', function(i,a){ return a.replace( /(dir=)[a-z]+/ig, '$1DESC'); });
        $('nav form input[name="dir"]').attr('value', 'DESC');

        /* sort current */
        if (order == "title") {
          $('#movies figure').tsort('li.title',{order:'desc'});
        } else {
          $('#movies figure').tsort({attr:'updated',order:'desc'});
        }
      } else {
        $('#genres a').attr('href', function(i,a){ return a.replace( /(dir=)[a-z]+/ig, '$1ASC'); });
        $('nav form input[name="dir"]').attr('value', 'ASC');

        /* sort current */
        if (order == "updated") {
          $('#movies figure').tsort('li.title',{order:'asc'});
        } else {
          $('#movies figure').tsort({attr:'updated',order:'asc'});
        }
      }
    } else {
      /* toggle order and classf on first click */
      if ($('#order .by:contains("date")').length > 0) {
        $('#genres a').attr('href', function(i,a){ return a.replace( /(order=)[a-z_]+/ig, '$1title'); });
        $('nav form input[name="order"]').attr('value', 'title');
        /* sort current */
        $('#movies figure').tsort('li.title');
        order = "title"
      } else {
        $('#genres a').attr('href', function(i,a){ return a.replace( /(order=)[a-z_]+/ig, '$1updated_at'); });
        $('nav form input[name="order"]').attr('value', 'updated_at');
        /* sort current */
        $('#movies figure').tsort({attr:'updated'});
        order = "updated"
      }

      $('.by').removeClass('by');
      $(this).addClass('by');
    }
  });


});