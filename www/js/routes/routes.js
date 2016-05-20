(function() {
  angular.module('starter.controllers', [])
    .controller('RoutesController', RoutesController);

  RoutesController.$inject = ["$rootScope", "$scope", "$log", "$http", "$timeout", "$state",
    "$cordovaLocalNotification", "$ionicPlatform",
    "RouteService", "WeatherService", "NotificationsService"
  ];

  function RoutesController($rootScope, $scope, $log, $http, $timeout, $state,
    $cordovaLocalNotification, $ionicPlatform,
    RouteService, WeatherService, NotificationsService) {
    $scope.temperature = $scope.origin = $scope.destination = '';
    $rootScope.setup = JSON.parse(window.localStorage.getItem("setup"));
    $scope.originLabel = "Home";
    $scope.destinationLabel = "Work";
    var BING_MAPS_KEY = 'Am5PQzEG1r-DsGOntmKzr27fPT8OmW35G15dgU4e7qojz1E6_jcqWJVYCo1QNDvY';

    if ($rootScope.setup === null || angular.isUndefined($rootScope.setup)) {
      $rootScope.setup = {};
      $rootScope.setup.origin = $rootScope.setup.destination = {};
      $rootScope.setup.originLabel = $scope.originLabel;
      $rootScope.setup.destinationLabel = $scope.destinationLabel;
    }
    if ($rootScope.setup.origin === null || angular.isUndefined($rootScope.setup.origin)) {
      $rootScope.setup.origin = {};
      $rootScope.setup.originLabel = $scope.originLabel;
    }
    if ($rootScope.setup.destination === null || angular.isUndefined($rootScope.setup.destination)) {
      $rootScope.setup.destination = {};
      $rootScope.setup.destinationLabel = $scope.destinationLabel;
    }

    $scope.origin = $rootScope.setup.origin;
    $scope.destination = $rootScope.setup.destination;
    $scope.originLabel = $rootScope.setup.originLabel;
    $scope.destinationLabel = $rootScope.setup.destinationLabel;

    function getWeather() {
      var apiKey = 'dff13526e6fd3e06e534646075eeb74d';
      var url = "http://api.openweathermap.org/data/2.5/weather";
      var params = {
        zip: '28211,us',
        apikey: apiKey,
        units: 'imperial',
        callback: 'JSON_CALLBACK'
      };
      WeatherService.getWeather(apiKey, url, params)
        .then(function(data) {
          $log.log("success : Weather");
          $scope.temperature = data.main.temp;
          $scope.weatherObj = data.weather[0];
          $scope.tempDescription = $scope.weatherObj.description;
          $scope.imgSource = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        }, function(error) {
          $log.log("errors : Weather");
        });
    }

    var getDirections = function(origin, destination) {
      if (origin === null || destination === null) {
        return;
      }

      if (angular.isUndefined(origin) || angular.isUndefined(destination)) {
        return;
      }

      if (Object.keys(origin).length === 0 || Object.keys(destination).length === 0) {
        return;
      }

      RouteService.getDirections(origin, destination)
        .then(function(response) {
          $scope.listOfRoutes = response.routes;
                              $scope.listOfRoutes.sort(function(a, b) {
                                  if (parseInt(a.legs[0].duration.text) > parseInt(b.legs[0].duration.text)) {
                                      return 1;
                                  }
                                  if (parseInt(a.legs[0].duration.text) < parseInt(b.legs[0].duration.text)) {
                                      return -1;
                                  }
                                  return 0;
                              });
                            
        }, function(response) {
$log.log("Error in retrieving directions");
        });
    };

    $scope.switchDirections = function() {
      var temp = $scope.origin;
      $scope.origin = $scope.destination;
      $scope.destination = temp;
      if ($scope.originLabel == 'Home' && $scope.destinationLabel == 'Work') {
        $scope.originLabel = 'Work';
        $scope.destinationLabel = 'Home';
        getDirections($scope.origin, $scope.destination);
      } else {
        $scope.originLabel = 'Home';
        $scope.destinationLabel = 'Work';
        getDirections($scope.origin, $scope.destination);
      }
      $rootScope.setup.origin = $scope.origin;
      $rootScope.setup.originLabel = $scope.originLabel;
      $rootScope.setup.destination = $scope.destination;
      $rootScope.setup.destinationLabel = $scope.destinationLabel;
      saveInformation();

    };

    getDirections($scope.origin, $scope.destination);
    getWeather();

    $scope.routeClickHandler = function(route) {
      RouteService.setRoute(route);
      $state.go('app.single');
    };

    var saveInformation = function() {
      var setupStr = JSON.stringify($rootScope.setup);
      window.localStorage.setItem("setup", setupStr);
    };

    var originChange = function(address) {
      if (address === null || angular.isUndefined(address)) {
        return;
      }
      $scope.originAddressObject = address;
      $rootScope.setup.origin = address.formatted_address;
      $rootScope.setup.originLabel = $scope.originLabel;
      $scope.origin = address.formatted_address;

      saveInformation();

      getDirections($scope.origin, $scope.destination);
    };

    var destinationChange = function(address) {
      if (address === null || angular.isUndefined(address)) {
        return;
      }
      $scope.destinationAddressObject = address;
      $rootScope.setup.destination = address.formatted_address;
      $rootScope.setup.destinationLabel = $scope.destinationLabel;
      $scope.destination = address.formatted_address;

      saveInformation();
      getDirections($scope.origin, $scope.destination);
    };

    $scope.fromAddressSelectHandler = function(place) {
      originChange(place);
    };

    $scope.toAddressSelectHandler = function(place) {
      destinationChange(place);
    };

    $scope.getClass = function(index) {
      if (index === 0) {
        return 'best-route';
      }
    };

    $ionicPlatform.ready(function() {
      //call notifications service
    });
  };



}());
