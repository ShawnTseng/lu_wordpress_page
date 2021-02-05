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
	var headerFixPoint;
	var headerScrollStart;
	//content
	var contentElement = $('.content');
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
			var headerWidth = headerElement.outerWidth( true );
			var headerContentWidth = 0;	
			$('.chartContainer .header .r_column .picture_group a').each(function() {
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
			contentHScrollStart = Math.round(contentElement.scrollLeft());
			headerScrollStart = Math.round(headerElement.scrollLeft());
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
			headerElement.scrollLeft(headerScrollTo);
			if(headerScrollTo > 0 && headerScrollTo < headerFixPoint){
				headerElement.scrollLeft(headerScrollTo);
				contentElement.scrollLeft(contentHScrollTo);
				$('.section .r_column').css( { left  : contentHScrollTo});
				$('.item .l_column').css( { left  : contentHScrollTo});
			}else if(headerScrollTo <= 0){
				headerElement.scrollLeft(0);
				contentElement.scrollLeft(0);
				$('.section .r_column').css( { left  : 0});
				$('.item .l_column').css( { left  : 0});
			}else if(headerScrollTo >= headerFixPoint){
				headerElement.scrollLeft(headerFixPoint);
				contentElement.scrollLeft(headerFixPoint);
				$('.section .r_column').css( { left  : headerFixPoint});
				$('.item .l_column').css( { left  : headerFixPoint});
			}
			//Y
			if(adScrollDist > 0){
				//scroll UP (+)
				//window scroll
				windowScrollTo = Math.round(windowScrollStart + adScrollDist);
				if(windowScrollTo < windowUpFixPoint){
					windowElement.scrollTop(windowScrollTo);
				} else {
					if(windowScrollFooter){
						if(contentScrollStart !== contentUpFixPoint){
							adScrollDist = adScrollDist-(contentUpFixPoint-contentScrollStart);
						}
						windowScrollTo = Math.round(windowScrollStart + adScrollDist);
						windowElement.scrollTop(windowScrollTo);
					} else {
						windowElement.scrollTop(windowUpFixPoint);
						//content scroll
						if(windowScrollStart !== windowUpFixPoint){
							adScrollDist = adScrollDist-windowUpFixPoint;
						}
						contentScrollTo = Math.round(contentScrollStart + adScrollDist);
						if(contentScrollTo < contentUpFixPoint){
							contentElement.scrollTop(contentScrollTo);
						}else{
							contentElement.scrollTop(contentUpFixPoint);
							windowScrollFooter = true;
						}
					}
				}
			}else if(adScrollDist < 0){
				// scroll DOWN (-)
				if(windowScrollFooter){
					windowScrollTo = Math.round(windowScrollStart + adScrollDist);
					if(windowScrollTo > WindowDownFixPoint){
						windowElement.scrollTop(windowScrollTo);
					} else {
						windowElement.scrollTop(WindowDownFixPoint);
						windowScrollFooter = false;
					}
				}else{
					//content scroll
					if(windowScrollStart !== WindowDownFixPoint){
						adScrollDist = adScrollDist-(WindowDownFixPoint - windowScrollStart);
					}
					contentScrollTo = Math.round(contentScrollStart + adScrollDist);
					if(contentScrollTo > contentDownFixPoint){
						contentElement.scrollTop(contentScrollTo);
					}else{
						contentElement.scrollTop(contentDownFixPoint);
						if(contentScrollStart !==  contentDownFixPoint){
							adScrollDist = adScrollDist + contentScrollStart;
						}
						windowScrollTo = Math.round(windowScrollStart + adScrollDist);
						windowElement.scrollTop(windowScrollTo);
					}
				}				
			}
		}
	});
	//init
	var init = function(){
		disableWindowScroll();
		window.dispatchEvent(new Event('resize'));
	};
	init();
});