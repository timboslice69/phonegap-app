"use strict";
/*  ================================================================================
 Services
 Tine AngularJS Application Services
 ================================================================================  */
angular
	.module('ServicesCore', [])
	/* ================================================================================
	 #ParametersSvc: Parameters Service
	 ================================================================================ */
	.factory(
		'ParametersSvc', [
			'$rootScope', 'Log', '$resource',
			function($rootScope, Log, $resource) {
				var service = { _name: 'ParametersSvc' }, // Create Service
					resourceDefinition = {
						path: 'resources/parameters/parameters.:version.json',
						params: {
							version: '@version'
						},
						actions: {}
					};

				/* ==== INIT VARIABLES ==================== */
				service.init = function() {
					//Log.debug([service._name, 'init']);
					service.parameters = {};
					service.resource = $resource(resourceDefinition.path, resourceDefinition.params, resourceDefinition.actions);
					service.defaultVersion = 'default';
					return service;
				};

				/* ==== FUNCTIONS ==================== */
				service.get = function(version) {
					//Log.debug(['ParametersSvc:get:', version]);
					service.parameters = service.resource.get({version: (version || service.defaultVersion)}, service.broadcastUpdate);
				};

				/* ==== BROADCASTS ==================== */
				service.broadcastUpdate = function() {
					//Log.debug(['ParametersSvc:broadcastUpdate:ParametersSvc:parameters:updated', service.parameters]);
					$rootScope.$broadcast('ParametersSvc:parameters:updated');
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
	 #LanguageSvc: Language (terms) Service
	 ================================================================================ */
	.factory(
		'LanguageSvc', [
			'$rootScope', 'Log', '$resource',
			function($rootScope, Log, $resource) {
				var service = { _name: 'LanguageSvc' }, // Create Service
					resourceDefinition = {
						path: 'resources/language/language.:languageCode.json',
						params: {
							languageCode: '@languageCode'
						},
						actions: {}
					};

				/* ==== INIT VARIABLES ==================== */
				service.init = function() {
					//Log.debug([service._name, 'init']);
					service.terms = {};
					service.resource = $resource(resourceDefinition.path, resourceDefinition.params, resourceDefinition.actions);
					service.defaultLanguage = 'en';
					return service;
				};

				/* ==== FUNCTIONS ==================== */
				service.get = function(languageCode) {
					//Log.debug(['LanguageSvc:get:', languageCode]);
					service.terms = service.resource.get({languageCode: (languageCode || service.defaultLanguage)}, service.broadcastUpdate);
				};

				/* ==== BROADCASTS ==================== */
				service.broadcastUpdate = function() {
					//Log.debug(['LanguageSvc:broadcastUpdate:LanguageSvc:terms:updated', service.terms]);
					$rootScope.$broadcast('LanguageSvc:terms:updated');
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
	 #MessageSvc: Message Service
	 ================================================================================ */
	.factory(
		'MessageSvc', [
			'$rootScope', 'Log', 'LanguageSvc',
			function($rootScope, Log, LanguageSvc) {
				var service = {};

				service.sendMessage = function(msg) {
					//Log.debug(['MessageSvc:sendMessage', msg]);
					service.broadcastMessage(msg);
				};

				service.sendWarning = function(msg) {
					//Log.debug(['MessageSvc:sendWarning', msg]);
					service.broadcastWarning(msg);
				};

				service.sendError = function(msg) {
					//Log.debug(['MessageSvc:sendError', msg]);
					service.broadcastError(msg);
				};

				service.sendSuccess = function(msg) {
					//Log.debug(['MessageSvc:sendSuccess', msg]);
					service.broadcastSuccess(msg);
				};

				/* BROADCASTS */
				service.broadcastMessage = function(msg) {
					//Log.debug(['MessageSvc:broadcastMessage']);
					$rootScope.$broadcast('MessageSvc:message', msg);
				};

				service.broadcastSuccess = function(msg) {
					//Log.debug(['MessageSvc:broadcastSuccess']);
					$rootScope.$broadcast('MessageSvc:success', msg);
				};

				service.broadcastWarning = function(msg) {
					//Log.debug(['MessageSvc:broadcastWarning']);
					$rootScope.$broadcast('MessageSvc:warning', msg);
				};

				service.broadcastError = function(error) {
					//Log.debug(['MessageSvc:broadcastError']);
					$rootScope.$broadcast('MessageSvc:error', error);
				};

				/* BROADCAST LISTENERS */
				/*
				 We can define most of the messaging here so they're kept in one place, just create a listener for the
				 broadcast type we want to act onm and supply the appropriate message form the language service
				 */

				/*$rootScope.$on('TheSVC:event',function(){
					service.broadcastSuccess(LanguageSvc.terms.success);
				});*/

				/*$rootScope.$on('TheSVC:event', function () {
					service.broadcastWarning(LanguageSvc.terms.warning);
				});*/

				/*$rootScope.$on('TheSVC:event', function () {
					service.broadcastError(LanguageSvc.terms.error);
				});*/

				return service;
			}
		]
	)
	/* ================================================================================
	 #StateSvc: State Service - Used for storing state of controllers
	 ================================================================================ */
	.factory(
		'StateSvc', [
			'$rootScope', 'Log',
			function($rootScope, Log) {
				var service = {}; // Create Service

				/* ==== INIT VARIABLES ==================== */
				service.init = function() {
					Log.debug(['StateSvc:init', service]);
					service.state = {};
					localStorage.getObject('state');
					return service;
				};

				/* ==== FUNCTIONS ==================== */
				service.getState = function(name) {
					var local = localStorage.getObject(name);
					if (angular.isUndefined(service.state[name])) service.state[name] = (local) ? angular.copy(local) : {};
					return service.state[name];
				};

				service.clearState = function(name) {
					service.state[name] = {};
					localStorage.setObject(name, service.state[name]);
					return service.state[name];
				};

				service.saveState = function(name){
					if (angular.isUndefined(name)){
						anfular.forEach(service.state, function(data, name){
							localStorage.setObject(name, angular.copy(data));
						});
					}
					else localStorage.setObject(name, angular.copy(service.state[name]));
				}

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
	 #RouteSvc: Route Handling Service
	 ================================================================================ */
	.factory(
		'RouteSvc', [
			'$rootScope', '$routeParams', '$location', '$route', 'Log', '$window',
			function($rootScope, $routeParams, $location, $route, Log, $window) {
				var service = {};

				/* ==== INIT ==================== */
				service.init = function() {
					//Log.debug(['RouteSvc:init']);
					if (angular.isUndefined($rootScope.preventRouteChange)) $rootScope.preventRouteChange = false;
					return service;
				};

				service.back = $window.history.back;

				service.allowCtrlInit = function() {
					//Log.debug(['RouteSvc:allowCtrlInit', $rootScope.systemReady]);
					return $rootScope.systemReady;
				};

				service.goToPrevious = function() {
					//Log.debug(['RouteSvc:goToPrevious', $location.history, $location.history[1]]);
					if ($location.history.length >= 1) $location.path($location.history[1]);
				};

				service.goTo = function(path) {
					//Log.debug(['RouteSvc:gotTo', path]);
					if (!$rootScope.preventRouteChange) $location.path(path);
				};

				service.goToExternal = function(url) {
					//Log.debug(['RouteSvc:goToExternal', url]);
					if (!$rootScope.preventRouteChange) $window.location = url;
				};

				/*$rootScope.$on('TheSvc:event', function () {
					service.goTo('path');
				});*/

				return service;
			}
		]
	)
	/* ================================================================================
	 #ErrorSvc: Error Handling Service Service
	 ================================================================================ */
	.factory(
		'ErrorSvc', [
			'$rootScope', 'Log', 'LanguageSvc', 'MessageSvc',
			function($rootScope, Log, LanguageSvc, MessageSvc) {
				var service = { _name: 'ErrorSvc' };

				service.resultIsError = function(result) {
					Log.debug([service._name, service, 'resultIsError', result]);
					if ((angular.isDefined(result.success) && !result.success)) {
						service.processError(result.data);
						return true;
					}
					else return false;
				};

				service.processError = function(error) {
					//Log.debug([service._name, service, 'processError', error]);
					switch (typeof(error)) {
						case 'object':
						{
							service.processErrors(error);
							break;
						}
						case 'string':
							error = appUtils.camelCase(error);
						case 'number':
						{
							MessageSvc.sendError(LanguageSvc.terms.errorMessages.global[error]);
							break;
						}
					}
				};

				service.processErrors = function(errors) {
					//Log.debug([service._name, service, 'processErrors', errors]);
					var message = '';

					angular.forEach(errors, function(errorCode) {
						switch (typeof(errorCode)) {
							case 'string':
								errorCode = appUtils.camelCase(error);
							case 'number':
							{
								message = message + LanguageSvc.terms.errorMessages.global[errorCode] + ' \n';
								break;
							}
						}
					});

					MessageSvc.sendError(message);
				};

				return service;
			}]
	)
	/* ================================================================================
	 #LogSvc: Event, Debugging, Error & info logging service

	 A singular service that provides the varying levels of logging used
	 in this application.
	 ================================================================================ */
	.factory(
		'Log', [
			'$rootScope', '$log', '$window',
			function($rootScope, $log, $window) {
				var service = {};
				//$log.log(['Log Service: Init', service]);

				service.ts = function(t) {
					return function(m) {
						$log[t](new Date().getTime(), m);
					}
				};

				function track(category, action, label, value) {
					$window.ga('send', 'event', category, action, label, value);
					//$log['log'](['ga:send:event', category, action, label, value]);
				}

				function pathChange(path) {
					$window.ga('send', 'pageview', path);
					//$log['log'](['ga:send:pageview', path]);
				}

				function errorLog(logToConsole) {
					return function(e) {
						data.ts = new Date().getTime();
						data.error = e;
						if (logToConsole) { $log['error'](e);}
					}
				}

				function warnLog(logToConsole) {
					return function(w) {
						data.ts = new Date().getTime();
						data.authCredentials = $rootScope.authCredentials;
						data.warning = w;
						if (logToConsole) { $log['warn'](w);}
					}
				}

				switch ($window.appHelper.verboseLevel) {
					// Log errors, debug
					case 1:
						return { info: angular.noop, log: angular.noop, warn: angular.noop, error: errorLog(true), debug: service.ts('log'), track: track, pathChange: pathChange };
					// Log errors, debug, warnings, log
					case 2:
						return { info: angular.noop, log: service.ts('log'), warn: service.ts('warn'), error: errorLog(false), debug: service.ts('log'), track: track, pathChange: pathChange };
					// Log errors, debug, warnings, log & info
					case 3:
						return { info: service.ts('info'), log: service.ts('log'), warn: service.ts('warn'), error: errorLog(false), debug: service.ts('log'), track: track, pathChange: pathChange };
					// Log Nothing
					default:
						return { info: angular.noop, log: angular.noop, warn: angular.noop, error: angular.noop, debug: angular.noop, track: track, pathChange: pathChange };
				}
			}
		]
	)
;