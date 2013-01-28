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

/*
 Color animation 20120928
 http://www.bitstorm.org/jquery/color-animation/
 Copyright 2011, 2012 Edwin Martin <edwin@bitstorm.org>
 Released under the MIT and GPL licenses.
*/
/* animate colours */
(function(d){function m(){var b=d("script:first"),a=b.css("color"),c=false;if(/^rgba/.test(a))c=true;else try{c=a!=b.css("color","rgba(0, 0, 0, 0.5)").css("color");b.css("color",a)}catch(e){}return c}function j(b,a,c){var e="rgb"+(d.support.rgba?"a":"")+"("+parseInt(b[0]+c*(a[0]-b[0]),10)+","+parseInt(b[1]+c*(a[1]-b[1]),10)+","+parseInt(b[2]+c*(a[2]-b[2]),10);if(d.support.rgba)e+=","+(b&&a?parseFloat(b[3]+c*(a[3]-b[3])):1);e+=")";return e}function g(b){var a,c;if(a=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b))c=
[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16),1];else if(a=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b))c=[parseInt(a[1],16)*17,parseInt(a[2],16)*17,parseInt(a[3],16)*17,1];else if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))c=[parseInt(a[1]),parseInt(a[2]),parseInt(a[3]),1];else if(a=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(b))c=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])];return c}
d.extend(true,d,{support:{rgba:m()}});var k=["color","backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","outlineColor"];d.each(k,function(b,a){d.Tween.propHooks[a]={get:function(c){return d(c.elem).css(a)},set:function(c){var e=c.elem.style,i=g(d(c.elem).css(a)),h=g(c.end);c.run=function(f){e[a]=j(i,h,f)}}}});d.Tween.propHooks.borderColor={set:function(b){var a=b.elem.style,c=[],e=k.slice(2,6);d.each(e,function(h,f){c[f]=g(d(b.elem).css(f))});var i=g(b.end);
b.run=function(h){d.each(e,function(f,l){a[l]=j(c[l],i,h)})}}}})(jQuery);

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

  $('.plot').hover(
    function(){
      $(this).children('.shortcontent').css('opacity', '0').hide();
      $(this).children('.allcontent').fadeTo(200, 1).show();
      $(this).children('.allcontent').addClass('all');
    },
    function(){
      $(this).children('.allcontent').css('opacity', '0').hide();
      $(this).children('.shortcontent').fadeTo(200, 1).show();
      $(this).children('.allcontent').removeClass('all');
    }
  );
//  $('.plot').hoverIntent(hoverConfig);

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

      // fadeOut & remove current movies
      $('#movies').children().each( function(index) {
        $(this).delay(50*index).fadeOut(50, function() {
          $(this).remove();
        });
      });

      // add new movies to DOM as hidden
      $(data).each(function() {
        $('#movies').append($(this).hide());
      });

      // reapply details hover
      $('figure')
      .hover(function() {
        $(this).children('ul').hoverFlow('mouseenter', { opacity: 1 }, 'fast');
      }, function() {
        $(this).children('ul').hoverFlow('mouseleave', { opacity: 0 }, 'fast');
      });

      // reapply plot popup
      $(".plot").shorten({
        "showChars" : 100
      });

      // fadeIn current search
      $('#movies').children().each( function(index) {
        $(this).delay(100*index).fadeIn(120);
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
      /* toggle order and class on first click */
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

  
  /* search highlight */
  $('input[name="key"]').on("focus", function(e){
    $('input[type="submit"]').animate({ color: '#ffffff' }, 300);
  }).on("blur", function(e){
    $('input[type="submit"]').animate({ color: '#646464' }, 300);
  });



});