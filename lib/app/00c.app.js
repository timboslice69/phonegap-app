"use strict";

/**
 * Set default application parameters
 * Used for alpha/beta template and parameter testing
 * Needs to be on the window namespace as we cannot get
 * @type {object}
 */
window.appHelper = {
	verboseLevel: 3,
	version: 'default',
	viewRoot: 'views/',
	componentRoot: 'components/',
	viewPath: function(template) {
		//console.log(['appHelper.viewPath', template]);
		return (window.appHelper.version == 'default') ? window.appHelper.viewRoot + template : window.appHelper.viewRoot + window.appHelper.version + '/' + template;
	},
	componentPath: function(template) {
		//console.log(['appHelper.viewPath', template]);
		return (window.appHelper.version == 'default') ? window.appHelper.componentRoot + template : window.appHelper.componentRoot + window.appHelper.version + '/	' + template;
	}
};

/**
 * Get version parameter if it exists and assign it to the MF app version parameter
 * @type {string}
 */
var versionParameter = appUtils.URLParameter('v');
if (versionParameter != '') window.appHelper.version = versionParameter;


/*  ================================================================================
	Twigs Rapid Prototype
	Framework for web prototyping
================================================================================  */
angular
	.module(
		'Application',
		[
			'ngRoute', // Angular.js route handler
			'ngResource', // Angular.js resource handler
			'ngAnimate', // Angular.js resource handler
			'ServicesCore', // Core services used by the framework
			'Services', // Application services
			'ControllersCore', // Controllers for the routes/views
			'Controllers', // Controllers for the routes/views
			'ComponentsCore',
			'Components',
			'ComponentsFormControls',
			'Directives',
			'Filters'
		]
	)
	.config(
		[
			'$routeProvider', '$locationProvider', '$httpProvider',
			function($routeProvider, $locationProvider, $httpProvider) {

				// SET HASHBANG!
				$locationProvider.hashPrefix('!');


				// SET ROUTES
				$routeProvider
					.when('/version/:version', {
						controller: 'VersionCtrl',
						template: '<div></div>'
					})
					.when('/home', {
						templateUrl: window.appHelper.viewPath('home.html'),
						controller: 'HomeCtrl',
						routeName: 'home',
						bodyClass: 'home'
					})
					.when('/messages', {
						templateUrl: window.appHelper.viewPath('messages.html'),
						controller: 'MessagesCtrl',
						routeName: 'messages',
						bodyClass: 'messages'
					})
					.when('/tasks', {
						templateUrl: window.appHelper.viewPath('tasks.html'),
						controller: 'TasksCtrl',
						routeName: 'tasks',
						bodyClass: 'tasks'
					})
					.when('/user', {
						templateUrl: window.appHelper.viewPath('user.html'),
						controller: 'UserCtrl',
						routeName: 'user',
						bodyClass: 'user'
					})
					.otherwise({
						redirectTo: '/home'
					});

			}
		]
	)
	.run(
		[
			'$rootScope', '$location', '$window', 'Log', '$route',
			function($rootScope, $location, $window, Log, $route) {
				var loadOnSystemReady = false;

				// SYSTEM READY EVENT======================================================
				$rootScope.$on("MasterCtrl:system:ready", function() {
					//Log.debug(['System ready', loadOnSystemReady, $location, $location.path()]);
					if (loadOnSystemReady !== false) {
						//Log.debug(['MasterCtrl:system:ready:loadOnSystemReady', loadOnSystemReady, $location.path()]);
						loadOnSystemReady = false;
						$route.reload();
					}
				});

				// register listener to watch route changes
				$rootScope.$on("$routeChangeStart", function(event, $nextRoute, $currentRoute) {
					//Log.debug(['$routeChangeStart', $location.path(), event, $nextRoute, $currentRoute]);
					// If next route has defined parameters e.g. not '/'
					if (angular.isDefined($nextRoute)) {
						//Log.debug(['$routeChangeStart:$nextRoute', $nextRoute, $rootScope.systemReady, loadOnSystemReady]);
						// SYSTEM READY ======================================================
						if (!$rootScope.systemReady && !loadOnSystemReady) {
							//Log.debug(['$routeChangeStart:System Not Ready:prevent route', $nextRoute, $location.path()]);
							loadOnSystemReady = true;
							// Cancel the route, it should be changed once the system is ready
							return event.preventDefault();
						}
					}

					/**
					 * ROUTE HISTORY
					 * Add the current route to the history array, this allows us to step back
					 * through the history if we need to
					 */
					if (angular.isUndefined($location.history)) $location.history = [];
					if ($location.history.length > 4) $location.history.pop();
					$location.history.unshift($location.path());

					/**
					 * BODY CLASS
					 *
					 * Check if the next route has a bodyClass parameter and assign it to the rootScope,
					 * this lets us change the body class per view
					 */
					$rootScope.bodyClass = angular.isDefined($nextRoute.bodyClass) ? $nextRoute.bodyClass : '';

					/**
					 * ROUTE NAME
					 *
					 * Check if the next route has a routeName parameter and assign it to the rootScope,
					 * this lets us know what route/view we are in across the application
					 */
					$rootScope.routeName = angular.isDefined($nextRoute.routeName) ? $nextRoute.routeName : '';

				});

				$rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
					/**
					 * Google Analytics Tracking
					 * Universal analytics will fetch url and title so we trigger it after the route change has completed
					 * The current path is still send for shits and giggles
					 */
					// Log.pathChange($location.path());
				});
			}
		]
	);




