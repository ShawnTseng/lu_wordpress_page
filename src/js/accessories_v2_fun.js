$(function() {
	//console
	var print = function(value, isConsole){
		if(isConsole){
			if($('.console').html()){
				$('.console').html(value+'<br>'+$('.console').html());
			}else{
				$('.console').html(value);
			}
		}else{
			console.log(value);
		}		
	}
	//header
    var headerElement = $('.chartContainer .header');
    var headerScrollElement = $('.chartContainer .header .r_column');
	var headerFixPoint;
	var headerScrollStart;
	//content
    var contentElement = $('.content');
    var contentScrollElement = $('.part_r_column .r_column');
	var contentUpFixPoint, contentDownFixPoint;	
	var contentScrollStart, contentHScrollStart;
	//window
	var windowElement = $(window);
	var windowIsMatchMedia;
	var windowUpFixPoint, WindowDownFixPoint;
	var windowScrollStart;
	var windowScrollFooter = false;
	var disableWindowScroll = function(){
		var supportsPassive = false;
		try {
			window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
				get: function () { supportsPassive = true; } 
			}));
		} catch(e) {}
		var wheelOpt = supportsPassive ? { passive: false } : false;
		window.addEventListener('touchmove', function(e) {
			if(windowIsMatchMedia){
				e.preventDefault();
			}
		}, wheelOpt);
	}
	windowElement.resize(function(event) {
		windowIsMatchMedia = window.matchMedia('(max-width: 768px)').matches;
		if(!windowIsMatchMedia){
			// init PC
			windowUpFixPoint = null;
			WindowDownFixPoint = null;
			windowScrollStart = null;
			contentUpFixPoint = null;
			contentHFixPoint = null;
		}else{
			// init mobile
			var windowUpFixAd = 3;
			windowUpFixPoint = Math.round(headerElement.offset().top - windowUpFixAd);
			var windowDownFixAd = 55;
			WindowDownFixPoint = Math.round($('.newsletter').offset().top - $(window).height() - windowDownFixAd);
			var contentHeight = contentElement.outerHeight( true );
			var contentContentHeight = 0;
			contentElement.children().each(function() {
				contentContentHeight += $(this).outerHeight( true );
			});
			contentUpFixPoint = ((contentContentHeight - contentHeight) > 0)? Math.round(contentContentHeight - contentHeight) : 0;
			contentDownFixPoint = 0;
			var headerWidth = headerScrollElement.outerWidth( true );
			var headerContentWidth = 0;	
			$('.chartContainer .header .r_column a').each(function() {
				headerContentWidth += $(this).outerWidth( true );
			});
			headerFixPoint = ((headerContentWidth - headerWidth) > 0)? Math.round(headerContentWidth - headerWidth) : 0;
		}
	});
	var adjustNum = 0;
	var hammertime = new Hammer(windowElement[0]);
	hammertime.get('pinch').set({ enable: false });
	hammertime.get('rotate').set({ enable: false });
	hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL});
	hammertime.get('swipe').set({ enable: false});
	hammertime.on('panstart', function(event) {
		if(windowIsMatchMedia){
			adjustNum = 0;
			windowScrollStart = Math.round(windowElement.scrollTop());
			contentScrollStart = Math.round(contentElement.scrollTop());
			contentHScrollStart = Math.round(contentScrollElement.scrollLeft());
			headerScrollStart = Math.round(headerScrollElement.scrollLeft());
		}
	});
	hammertime.on('panmove', function(event) {
		var windowScrollTo, contentScrollTo, headerScrollTo, contentHScrollTo;
		var adScrollDist = -event.deltaY;
		var adScrollHDist = -event.deltaX;
		//adjust
		//scroll
		if(windowIsMatchMedia){
			//X
			headerScrollTo = headerScrollStart + adScrollHDist;
			contentHScrollTo = contentHScrollStart + adScrollHDist;
			//console.log(headerScrollTo, headerFixPoint);
			headerScrollElement.scrollLeft(headerScrollTo);
			if(headerScrollTo > 0 && headerScrollTo < headerFixPoint){
				headerScrollElement.scrollLeft(headerScrollTo);
				contentScrollElement.scrollLeft(contentHScrollTo);
			}else if(headerScrollTo <= 0){
				headerScrollElement.scrollLeft(0);
				contentScrollElement.scrollLeft(0);
			}else if(headerScrollTo >= headerFixPoint){
				headerScrollElement.scrollLeft(headerFixPoint);
				contentScrollElement.scrollLeft(headerFixPoint);
			}
			//Y
			windowScrollTo = Math.round(windowScrollStart + adScrollDist);
			windowElement.scrollTop(windowScrollTo);
		}
	});
	//init
	var init = function(){
		disableWindowScroll();
		window.dispatchEvent(new Event('resize'));
	};
	init();
});