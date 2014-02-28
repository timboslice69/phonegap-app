"use strict";
/*  ================================================================================
 General Components
 ================================================================================  */
angular.module('ComponentsCore', [])
	/* ================================================================================
	#icon: Creates an icon with screen readable text
	================================================================================ */
	.directive('icon', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: { icon: '@', text: '@' },
			template: '<span class="icon">' +
				'<span aria-hidden="true" data-icon="{{icon}}" class="icon-{{icon}}"></span> ' +
				'<span class="scr-text">{{text}}</span>' +
				'</span>',
			replace: true
		};
	})
	/* ================================================================================
	#details: Provides  functionality for the details html5 element
	================================================================================ */
	.directive('details', ['Log',
		function(Log) {
			return {
				restrict: 'E',
				transclude: false,
				replace: false,
				link: function($scope, $element) {
					if ('open' in document.createElement('details')) return; // supports details element no need to add functionality
					var toggleOpen = function() {
						if ($element.attr('open')) $element.removeAttr('open');
						else $element.attr('open', 'open');
					};

					$element.children('summary').click(toggleOpen);
				}
			};
		}
	])
	/* ================================================================================
	#tooltip: Tooltip functionality
	================================================================================ */
	.directive('tooltip', ['Log',
		function(Log) {
			return {
				restrict: 'E',
				transclude: false,
				scope: { tip: '=' },
				replace: true,
				template: '<div class="tooltip"><p ng-bind="tip"></p></div>',
				link: function($scope, $element) {
					//Log.debug(['ComponentsCore:tooltip:init', $element]);
					var eventId = 'tooltip' + Math.floor((Math.random() * 10000) + 1);

					function addPositionClass() {
						//Log.debug(['ComponentsCore:tooltip:addPositionClass', $element, eventId]);
						var xPos = $($element).offset().left,
							windowWidth = $(window).width();

						if (xPos < (windowWidth * 0.25)) $element.addClass('left');
						else if (xPos > (windowWidth * 0.75)) $element.addClass('right');
					}

					addPositionClass();

					$(window).resize(function() {
						lastEvent(function() {
							addPositionClass()
						}, eventId);
					});

				}
			};
		}
	])
	/* ================================================================================
	#seeMore:
	================================================================================ */
	.directive('seeMore', ['Log',
		function(Log) {
			return {
				restrict: 'E',
				transclude: true,
				replace: true,
				template: '<span class="seeMore"><button class="trigger"></button><span class="content" ng-transclude></span></span>',
				link: function($scope, $element) {
					/*

					// Using focus css state to control active inactive... re-enable this if things aren't working in older
					// browsers and you need to use active class state instead.

					var active = $element.is('.active');

					Log.debug([$scope._name, $scope, 'init', $element, active]);

					$element.on(
						'click',
						'button',
						function() {
							Log.debug([$scope._name, $scope, 'click', $element, active]);
							active ? $element.removeClass('active') : $element.addClass('active');
							if (active) $element.focus();
							active = !active;

						}
					);*/
				}
			};
		}
	])
	/* ================================================================================
	#infoBox:
	================================================================================ */
	.directive('infoBox', ['Log',
		function(Log) {
			return {
				restrict: 'E',
				transclude: true,
				replace: true,
				template: '<span class="infoBox"><span class="content" ng-transclude></span></span>',
				link: function($scope, $element) {
					Log.debug(['Component:infoBox', $scope, 'init', $element]);
					$element.click(function() {$(this).toggleClass('active')});
				}
			};
		}
	])
;
