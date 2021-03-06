// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'google.places', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$on('$cordovaLocalNotification:schedule',
      function (event, notification, state) {
        console.log("SCHEDULE");
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    $rootScope.$on('$cordovaLocalNotification:trigger',
      function (event, notification, state) {
        console.log("TRIGGER");
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    $rootScope.$on('$cordovaLocalNotification:update',
      function (event, notification, state) {
        console.log('UPDATE');
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });

    $rootScope.$on('$cordovaLocalNotification:cancel',
      function (event, notification, state) {
        console.log('CANCEL');
        console.log('event', event);
        console.log('notification', notification);
        console.log('state', state);
      });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'js/settings/settings.view.html',
        controller : 'SettingsController'
      }
    }
  })

    .state('app.routes', {
      url: '/routes',
      views: {
        'menuContent': {
          templateUrl: 'js/routes/routes.view.html',
          controller: 'RoutesController'
        }
      }
    })

  .state('app.single', {
    url: '/routes/route',
    views: {
      'menuContent': {
        templateUrl: 'js/routes/route.detail.view.html'
        ,controller: 'RouteDetailController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/routes');
});
