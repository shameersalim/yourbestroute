angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('tabsController.routesTab', {
    url: '/routes',
    views: {
      'tab1': {
        templateUrl: 'js/routes/routes.tab.view.html',
        controller: 'RoutesTabController'
      }
    }
  })

  .state('tabsController.settingsTab', {
    url: '/settings',
    views: {
      'tab2': {
        templateUrl: 'js/setup/setup.tab.view.html',
        controller: 'SetupTabController'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/page1/routes')



});
