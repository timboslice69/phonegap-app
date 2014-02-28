"use strict";
/* START FUNCTION WRAPPER ==================== */

(function() {

	function evalFn(element, scope, exp, property) {
		property = property || '$token';
		return function(token) {
			var old = scope.hasOwnProperty(property) ? scope[property] : undefined;
			scope[property] = token;
			var retVal = scope.$eval(exp, element);
			scope[property] = old;
			return retVal;
		};
	}

	/*  ================================================================================
	 General Directives
	 ================================================================================  */
	angular.module("Directives", [])
		/* ================================================================================
		 #preventDefault: Prevent default click action
		 ================================================================================ */
		.directive('preventDefault',
		function() {
			return {
				link: function($scope, $element) {
					$element.click(function(event) {
						//console.log(event);
						event.preventDefault();
					});
				}
			};
		}
	)
		/* ================================================================================
		 #formAssist: Prevent default click action
		 ================================================================================ */
		.directive('formAssist', ['Log', '$window',
			function(Log, $window) {
				return {
					link: function($scope, $element) {
						$element.on('submit', function() {
							if ($(this).is('.submitted.ng-invalid')) $window.scrollWindowTo('input.ng-invalid:first', $window.defaultScrollOffset);
						});
					}
				};
			}
		])
		/* ================================================================================
		 #clickModal: turn into a modal on click
		 ================================================================================ */
		.directive('clickModal', ['Log', '$window',
			function(Log, $window) {
				return {
					link: function($scope, $element) {
						//Log.debug(['clickModal', $scope]);
						$element.on(
							'click',
							'.modalTrigger',
							function() {
								//Log.debug(['clickModal:click', $element.is('.modal')]);
								if ($element.is('.modal')) {
									$element.removeClass('modal').removeAttr('style');
									$('body').removeClass('modal');
								}
								else {
									$element.css({width: $element.outerWidth()}).addClass('modal');
									$('body').addClass('modal');
								}
							}
						);
					}
				};
			}
		])
		/* ================================================================================
		 #toggleActive: Toggles active class to element and selected elements
		 ================================================================================ */
		.directive('toggleActive', ['Log', '$window',
			function(Log, $window) {
				return {
					link: function($scope, $element) {
						var _name = 'Component:toggleActive';
						var selector = $element.attr('data-toggle-active');

						Log.debug([_name, $scope, 'init', $element, selector]);

						$scope.toggleActive = function() {

							Log.debug([_name, $scope, 'toggleActive', $element, selector]);

							if ($element.is('.active')) {
								$element.removeClass('active');
								$(selector).removeClass('active').find('.trigger').off('click.toggleActive');
							}
							else {
								$($('[data-toggle-active].active').attr('data-toggle-active')).removeClass('active');
								$('[data-toggle-active].active').removeClass('active');

								$element.addClass('active');
								$(selector).addClass('active').find('.trigger').on('click.toggleActive', $scope.toggleActive);
							}
						};
						$element.click($scope.toggleActive);
					}
				};
			}
		])
		/* ================================================================================
		 #toggleModal: Toggles body modal class to element and selected elements
		 ================================================================================ */
		.directive('toggleModal', ['Log', '$window',
			function(Log, $window) {
				return {
					link: function($scope, $element) {
						var _name = 'Component:toggleModal';

						Log.debug([_name, $scope, 'init', $element]);

						$scope.toggleModal = function() {
							var selector = $element.attr('data-toggle-modal');

							Log.debug([_name, $scope, 'toggleModal', $element, selector]);

							if ($element.is('.active')) {
								$(selector).removeClass('active').find('.trigger').off('click.toggleModal');
								$element.removeClass('active');
								$('body').removeClass('modalActive');
							}
							else {
								$(selector).addClass('active').find('.trigger').on('click.toggleModal', $scope.toggleModal);
								$element.addClass('active');
								$('body').addClass('modalActive');
							}
						};

						$element.click($scope.toggleModal);
					}
				};
			}
		]);
	/* END FUNCTION WRAPPER ==================== */
})();