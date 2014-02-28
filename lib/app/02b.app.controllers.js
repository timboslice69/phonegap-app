"use strict";
/*  ================================================================================
 Controllers Module

 ================================================================================  */
angular.module('Controllers', [])
	/*  ================================================================================
	 #MasterCtrl: Main Control
	 ================================================================================  */
	.controller(
		'MasterCtrl', [
			'$scope', '$rootScope', '$routeParams' , '$route', 'LanguageSvc', 'ParametersSvc', '$location', '$window', '$filter', 'Log', '$timeout', 'MessageSvc', 'ErrorSvc', 'RouteSvc', 'StateSvc',
			function($scope, $rootScope, $routeParams, $route, LanguageSvc, ParametersSvc, $location, $window, $filter, Log, $timeout, MessageSvc, ErrorSvc, RouteSvc, StateSvc) {
				/**
				 * Load these before the init function so they are available as soon as possible
				 */
				$rootScope.pageTitle = "";
				$rootScope.version = (angular.isDefined(window.appHelper) && angular.isDefined(window.appHelper.version)) ? window.appHelper.version : 'default';
				$rootScope.parametersReady = false;
				$rootScope.languageReady = false;
				$rootScope.systemReady = false;

				$scope._name = "MasterCtrl";
				$scope.terms = LanguageSvc.terms;
				$scope.parameters = ParametersSvc.parameters;

				$scope.deviceSize = "normal";
				$scope.touchEnabled = false;

				$scope.systemMessageText = '';
				$scope.systemMessageType = '';
				$scope.systemMessageStatus = 'inactive';

				$scope.init = function() {
					//Log.debug([$scope._name, 'init']);
					$scope.state = StateSvc.getState('MasterCtrl');
					ParametersSvc.get($rootScope.version);
				};

				/* SYSTEM MESSAGING ========================  */
				$scope.$on('MessageSvc:message', function(ev, message) {
					$scope.systemMessage(message, "type-message");
				});

				$scope.$on('MessageSvc:warning', function(ev, message) {
					$scope.systemMessage(message, "type-warning");
				});

				$scope.$on('MessageSvc:error', function(ev, message) {
					$scope.systemMessage(message, "type-error");
				});

				$scope.$on('MessageSvc:success', function(ev, message) {
					$scope.systemMessage(message, "type-success");
				});

				/* SCOPE FUNCTIONS ========================  */
				$scope.home = function() { RouteSvc.goTo('home') };
				$scope.back = RouteSvc.back;

				$scope.toggleTerm = function(bool, termTrue, termFalse) {
					return bool ? termTrue : termFalse;
				};

				$scope.setDevice = function(size, ratio, limbo, touch) {
					$rootScope.deviceSize = $scope.deviceSize = size;
					$rootScope.pixelRatio = $scope.pixelRatio = ratio;
					$rootScope.deviceLimbo = $scope.deviceLimbo = limbo;
					$rootScope.touchDevice = $scope.touchDevice = touch;
				};

				/* SYSTEM MESSAGING  ========================  */
				$scope.systemMessage = function(msg, type) {
					$scope.systemMessageType = type;
					$scope.systemMessageText = msg;
					$scope.systemMessageStatus = 'active';
					$window.dismissSystemMessage($scope.parameters.messaging.notificationDelay);
				};

				$scope.systemMessageDismiss = function() {
					$scope.systemMessageStatus = 'inactive';
				};

				$scope.sendMessage = MessageSvc.sendMessage;
				$scope.sendWarning = MessageSvc.sendWarning;
				$scope.sendError = MessageSvc.sendError;
				$scope.sendSuccess = MessageSvc.sendSuccess;

				/* BROADCAST LISTENERS  ========================  */
				$scope.$on('ParametersSvc:parameters:updated', function() {
					//Log.debug(['MasterCtrl:on:"ParametersSvc:parameters:updated":ParametersSvc.parameters:', ParametersSvc.parameters]);
					$scope.parameters = ParametersSvc.parameters;
					$rootScope.parametersReady = true;
					LanguageSvc.get(ParametersSvc.parameters.defaultLanguage);

					// Make Regular Expression objects out of the validation patterns
					if (angular.isDefined($scope.parameters.validationPatterns)) {
						angular.forEach($scope.parameters.validationPatterns, function(pattern, key) {
							$scope.parameters.validationPatterns[key] = (typeof(pattern) == 'string') ? new RegExp(pattern.replace('\\\\', '\\')) : pattern;
						});
					}
				});

				$scope.$on('LanguageSvc:terms:updated', function() {
					//Log.debug(['MasterCtrl:on:LanguageSvc:terms:updated:LanguageSvc.terms:', LanguageSvc.terms, $scope.terms, $location.path()]);
					$scope.terms = LanguageSvc.terms;
					if (!$rootScope.systemReady) {
						$rootScope.languageReady = true;
						$rootScope.systemReady = true;
						$rootScope.$broadcast('MasterCtrl:system:ready');
					}
					$rootScope.pageTitlePrefix = $scope.terms.pageTitlePrefix;
					$rootScope.pageTitleSuffix = $scope.terms.pageTitleSuffix;
				});


				/* INITIALISE  ========================  */
				$scope.init();
			}
		]
	)
	/*  ================================================================================
	 #HomeCtrl: Home Control
	================================================================================  */
	.controller(
		'HomeCtrl', [
			'$scope', '$rootScope', '$route', '$routeParams', 'Log', 'ParametersSvc', 'LanguageSvc', 'StateSvc', 'RouteSvc', 'AuthSvc',
			function($scope, $rootScope, $route, $routeParams, Log, ParametersSvc, LanguageSvc, StateSvc, RouteSvc, AuthSvc) {
				$scope._name = "HomeCtrl";

				/*  INIT    ========================================  */
				$scope.init = function() {
					//Log.debug(['HomeCtrl:init', $routeParams, $route]);
					$rootScope.pageTitle = appUtils.safeString($scope.terms.views.home.title);
					$rootScope.pageDescription = appUtils.safeString($scope.terms.views.home.description);

					$scope.state = StateSvc.getState('HomeCtrl');

					if (angular.isDefined($routeParams.version) && ($routeParams.version !== "")) {
						ParametersSvc.get($routeParams.version);
					};

					if (angular.isDefined($routeParams.code) && ($routeParams.version !== "")) {
						ParametersSvc.get($routeParams.version);
					};
				};

				$scope.gitAuth = function(){
					AuthSvc.doAuth();
				};

				/* LISTENERS ========================  */

				if (RouteSvc.allowCtrlInit()) $scope.init();
			}
		]
	)
	/*  ================================================================================
	 #MessagesCtrl: Messages Control
	================================================================================  */
	.controller(
		'MessagesCtrl', [
			'$scope', '$rootScope', '$route', '$routeParams', 'Log', 'ParametersSvc', 'LanguageSvc', 'StateSvc', 'RouteSvc', 'AuthSvc',
			function($scope, $rootScope, $route, $routeParams, Log, ParametersSvc, LanguageSvc, StateSvc, RouteSvc, AuthSvc) {
				$scope._name = "MessagesCtrl";

				/*  INIT    ========================================  */
				$scope.init = function() {
					//Log.debug(['HomeCtrl:init', $routeParams, $route]);
					$rootScope.pageTitle = appUtils.safeString($scope.terms.views.home.title);
					$rootScope.pageDescription = appUtils.safeString($scope.terms.views.home.description);

					$scope.state = StateSvc.getState('MessagesCtrl');

					if (angular.isDefined($routeParams.version) && ($routeParams.version !== "")) {
						ParametersSvc.get($routeParams.version);
					};

					if (angular.isDefined($routeParams.code) && ($routeParams.version !== "")) {
						ParametersSvc.get($routeParams.version);
					};
				};

				$scope.gitAuth = function(){
					AuthSvc.doAuth();
				};

				/* LISTENERS ========================  */

				if (RouteSvc.allowCtrlInit()) $scope.init();
			}
		]
	)
	/*  ================================================================================
		 #TasksCtrl: Tasks Control
	================================================================================  */
	.controller(
		'TasksCtrl', [
			'$scope', '$rootScope', '$route', '$routeParams', 'Log', 'ParametersSvc', 'LanguageSvc', 'StateSvc', 'RouteSvc', 'AuthSvc',
			function($scope, $rootScope, $route, $routeParams, Log, ParametersSvc, LanguageSvc, StateSvc, RouteSvc, AuthSvc) {
				$scope._name = "TasksCtrl";

				/*  INIT    ========================================  */
				$scope.init = function() {
					Log.debug(['HomeCtrl:init', $scope]);
					$rootScope.pageTitle = appUtils.safeString($scope.terms.views.home.title);
					$rootScope.pageDescription = appUtils.safeString($scope.terms.views.home.description);

					$scope.state = StateSvc.getState($scope._name, true);

					if(angular.isUndefined($scope.state.tasks)){
						$scope.state.tasks = [
							{ name: "new task", done: true }
						];
					}
				};

				$scope.toggleDone = function(task){
					task.done = !task.done;
					$scope.saveTasks();
				};

				$scope.addNewTask = function(){
					$scope.state.tasks.push({name: $scope.newTask, done: false});
					$scope.newTask = '';
					$scope.saveTasks();
				};

				$scope.saveTasks = function(){
					StateSvc.saveState($scope._name);
				};

				/* LISTENERS ========================  */

				if (RouteSvc.allowCtrlInit()) $scope.init();
			}
		]
	)
	/*  ================================================================================
		 #UserCtrl: User Control
	================================================================================  */
	.controller(
		'UserCtrl', [
			'$scope', '$rootScope', '$route', '$routeParams', 'Log', 'ParametersSvc', 'LanguageSvc', 'StateSvc', 'RouteSvc', 'AuthSvc',
			function($scope, $rootScope, $route, $routeParams, Log, ParametersSvc, LanguageSvc, StateSvc, RouteSvc, AuthSvc) {
				$scope._name = "UserCtrl";

				/*  INIT    ========================================  */
				$scope.init = function() {
					//Log.debug(['HomeCtrl:init', $routeParams, $route]);
					$rootScope.pageTitle = appUtils.safeString($scope.terms.views.home.title);
					$rootScope.pageDescription = appUtils.safeString($scope.terms.views.home.description);

					$scope.state = StateSvc.getState('UserCtrl');
				};


				/* LISTENERS ========================  */

				if (RouteSvc.allowCtrlInit()) $scope.init();
			}
		]
	)
;