/**
 * GLOBAL PARAMETERS
 * Define some global parameters
 * @type {number}
 */
var mobileWidth = 650,
	defaultAnimationSpeed = 300,
	deviceSize = null,
	smallClass = 'small',
	mediumClass = 'medium',
	largeClass = 'large';


/**
 * Checks window width on resize and sets deviceSize parameter accordingly
 */
function onResize() {
	var windowWidth = $(window).width();
	if (windowWidth <= mobileWidth) {
		//Small window
		deviceSize = smallClass;
	}
	else {
		//Big window
		deviceSize = mediumClass;
	}
}


/**
 * Checks window width on scroll and triggers necessary actions when pixel positions are reached
 */
function onScroll() {
	var h = $(this).scrollTop();
	if (h >= 200) {
		//We've scrolled 200px down from the top
	}
	else {
		//we are above 200px
	}
}

/**
 * Touch Device specific actions
 */
// Are we dealing with a touch device?
if (Modernizr.touch) {
	//If so, put your touch script here
}
else {
	//If not, jam stuff in here
}


/**
 * DOCUMENT READY
 * Actions to perform when the document is ready
 */
$(document).ready(function() {

	// Document ready actions here.

});

/**
 * WINDOW LOAD
 * Actions to perform when all resources are loaded
 */
$(window).load(function() {

	// Window load ready actions here.

});


/**
 * WINDOW EVENTS
 * Map window events to functions
 */

// Window Resize	========================================
$(window).resize(onResize);

// Window Scroll	========================================
$(window).scroll(onScroll);