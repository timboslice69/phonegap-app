"use strict";
/*  ================================================================================
	Services
================================================================================  */
angular
	.module('Services', [])
	/* ================================================================================
	 #AuthSvc: Service for user authentication
	 ================================================================================ */
	.factory(
		'AuthSvc', [
			'$rootScope', 'Log', '$resource', '$filter', 'ParametersSvc', 'RouteSvc',
			function($rootScope, Log, $resource, $filter, ParametersSvc, RouteSvc) {
				$rootScope.stateString = appUtils.randomString();
				var service = {
					_name: 'AuthSvc',
					authenticated: false,
					resourceParams: {
						path: 'https://github.com/login/oauth/authorize/?client_id=70a09db6369193145af5&state=' + $rootScope.stateString,
						params: {},
						actions: {}
					}
				};

				/* ==== INIT VARIABLES ==================== */
				service.init = function() {
					Log.debug([service._name, service, 'init']);
					//service.resource = $resource(service.resourceParams.path, service.resourceParams.params, service.resourceParams.actions);
					return service;
				};

				/* ==== FUNCTIONS ==================== */
				service.doAuth = function(){
					RouteSvc.goToExternal(service.resourceParams.path);
				};

				/**
				 * Check if supplied state string is the stateString this application created, if so
				 * @param  {string} code - github provided authentication code
				 * @param  {string} state - github returned state string
				 * @returns {boolean}
				 */
				service.verifyAuthenticationCode = function(code, state){
					if (angular.isUndefined(code) || angular.isUndefined(state) || (code == "") || (state == "") || (state !== $rootScope.stateString)) return false; //TODO trigger error message
					else {
						service.authCode = code;
						service.authenticated = true;
						$rootScope.$broadcast('AuthSvc:user:authenticated');
						return true;
					}
				};

				/* ==== BROADCASTS ==================== */
				service.broadcastAuthentication = function() {
					$rootScope.$broadcast('AuthSvc:user:authenticated');
				};

				/* ==== LISTENERS ==================== */
				$rootScope.$on('Services:init', function() {
					// Reinitialise service.
					service.init();
				});

				return service.init(); // Return Service
			}
		]
	)
		/* ================================================================================
	 #IssuesSvc: Repository Issues Service
	 ================================================================================ */
	.factory(
		'IssuesSvc', [
			'$rootScope', 'Log', '$resource', '$filter', 'ParametersSvc',
			function($rootScope, Log, $resource, $filter, ParametersSvc) {
				var service = {
					_name: 'IssuesSvc',
					resourceParams:  {
						path: 'https://api.github.com/issues',
						params: {
						},
						actions: {
							getIssues: {
								method: 'GET',
								isArray: true
							}
						}
					}
				};

				/* ==== INIT VARIABLES ==================== */
				service.init = function() {
					Log.debug([service._name, service, 'init']);
					service.resource = $resource(service.resourceParams.path, service.resourceParams.params, service.resourceParams.actions);
					return service;
				};

				/* ==== FUNCTIONS ==================== */
				service.getIssues = function(){
					service.issues = service.resource.getIssues();
				};

				/* ==== BROADCASTS ==================== */

				/* ==== LISTENERS ==================== */
				$rootScope.$on('Services:init', function() {
					// Reinitialise service.
					service.init();
				});

				return service.init(); // Return Service
			}
		]
	)
;