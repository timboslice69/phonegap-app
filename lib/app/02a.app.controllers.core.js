"use strict";
/*  ================================================================================
 Core Controllers Module

 ================================================================================  */
angular.module('ControllersCore', [])
	/*  ================================================================================
	 #VersionControl: Version Control
	 Allows the switching of versions (templates, parameters)
	================================================================================  */
	.controller(
		'VersionCtrl', [
			'$scope', '$rootScope', 'RouteSvc', '$routeParams', 'Log', 'ParametersSvc', //safe dependency injection
			function($scope, $rootScope, RouteSvc, $routeParams, Log, ParametersSvc) {

				/*  INIT    ========================================  */
				$scope.init = function() {
					//Log.debug(['VersionCtrl:init', $routeParams]);
					$rootScope.version = (angular.isDefined($routeParams.version) && ($routeParams.version !== "")) ? $routeParams.version : 'default';
					RouteSvc.goToExternal('?v=' + $rootScope.version);
				};

				/* LISTENERS ========================  */

				if (RouteSvc.allowCtrlInit()) $scope.init();
			}
		]
	);