"use strict";
/*  ================================================================================
 General Components
 ================================================================================  */
angular.module('ComponentsFormControls', [])
	/* ================================================================================
	#icon: Creates an icon with screen readable text
	================================================================================ */
	.directive('controlInput', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: {
				type: '@',
				terms: '=',
				params: '=',
				model: '='
			},
			replace: true,
			templateUrl: window.appHelper.componentPath('controlInput.html')
		};
	})
;
