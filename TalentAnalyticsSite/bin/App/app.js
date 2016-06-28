'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {

    // Init module configuration options
    var applicationModuleName = 'extrovertApp';
    var applicationModuleVendorDependencies = ['ui.router', 'ngResource', 'ui.bootstrap'];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {

        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
  function ($locationProvider, stateProvider, urlRouterProvider) {
      $locationProvider.html5Mode(false).hashPrefix('!');

      urlRouterProvider.otherwise('/employeeform');
     
      // Use $stateProvider to configure your states.
      stateProvider
		    .state("employeeform", {
		        url: "/employeeform",
		        templateUrl: 'app/employee-form/employeeForm.html'
		    })
             .state("reviewerform", {
                 url: "/reviewerform",
                 templateUrl: 'app/reviewer-form/reviewerForm.html'
             })
    }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, $window) {

    // Record previous state
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (!fromState.data || !fromState.data.ignoreState) {
            $state.previous = {
                state: fromState,
                params: fromParams,
                href: $state.href(fromState, fromParams)
            };
        }
    });

    //Log any pending analytics data
    $rootScope.$on('$locationChangeSuccess', function () {
        var analyticsData = $rootScope.analyticsDataToSend;
        if (analyticsData && analyticsData.pageName && analyticsData.title && analyticsData.userId) {
            console.log('Sending analytics.data at url ' + $window.location.href + ' for ', analyticsData);
            analyticsPageTrack(analyticsData.pageName, analyticsData.title, analyticsData.userId);
            $rootScope.analyticsDataToSend = null;
        }
    });

    //UI.Router intentionally does not log console debug errors out of the box. 
    //Below code is added in order to get some verbosity, and make debugging a hell of a lot easier
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
