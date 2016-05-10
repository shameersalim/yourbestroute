(function() {
  angular.module('starter.controllers', [])
    .controller('RoutesController', RoutesController);

  RoutesController.$inject = ["$rootScope", "$scope", "$log", "$http", "$timeout", "$state",
"RouteService"];

  function RoutesController($rootScope, $scope, $log, $http, $timeout, $state,
  RouteService) {
    $scope.temperature = $scope.address1 = $scope.address2 = '';
    $rootScope.setup = JSON.parse(window.localStorage.getItem("setup"));
    $scope.originLabel = "Home";
    $scope.destinationLabel = "Work";

    if ($rootScope.setup === null || angular.isUndefined($rootScope.setup)) {
      $rootScope.setup = {};
      $rootScope.setup.address1 = $rootScope.setup.address2 = '';
    }
    if ($rootScope.setup.address1 === null || angular.isUndefined($rootScope.setup.address1)) {
      $rootScope.setup.address1 = '';
    }
    if ($rootScope.setup.address2 === null || angular.isUndefined($rootScope.setup.address2)) {
      $rootScope.setup.address2 = '';
    }

    $scope.address1 = $rootScope.setup.address1 = "3630 Sterling Magnolia Ct S, Charlotte, NC 28211";
    $scope.address2 = $rootScope.setup.address2 = "831 E Morehead St, Charlotte, NC 28202";

    var getDirections = function(origin, destination) {
          var directionsService = new google.maps.DirectionsService;
          directionsService.route({
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: true
          }, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                  $log.log("Successfully retrieved directions");
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
                  $scope.$apply();
              } else {
                  $log.log("Error in retrieving directions");
              }
          })
      };

      function getWeather() {

          var apiKey = 'dff13526e6fd3e06e534646075eeb74d';
          var url = "http://api.openweathermap.org/data/2.5/weather";
          var params = {
              zip: '28211,us',
              apikey: apiKey,
              units: 'imperial',
              callback: 'JSON_CALLBACK'
          };


          $http.jsonp(url, {
                  params: params
              })
              .success(function(data, status, headers, config) {
                  $log.log("success : Weather");
                  $scope.temperature = data.main.temp;
                  $scope.weatherObj = data.weather[0];
                  $scope.tempDescription = $scope.weatherObj.description;
                  $scope.imgSource = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
              })
              .error(function(data, status, headers, config) {
                  $log.log("errors : Weather");
              });

      }

      $scope.switchDirections = function() {
        var temp = $scope.address1;
        $scope.address1 = $scope.address2;
        $scope.address2 = temp;
        if($scope.originLabel == 'Home' && $scope.destinationLabel == 'Work') {
          $scope.originLabel = 'Work';
          $scope.destinationLabel = 'Home';
          getDirections($scope.address1, $scope.address2);
        } else {
          $scope.originLabel = 'Home';
          $scope.destinationLabel = 'Work';
          getDirections($scope.address1, $scope.address2);
        }


      };

      getDirections($scope.address1, $scope.address2);
      getWeather();

    $scope.routeClickHandler = function(route) {
      RouteService.setRoute(route);
      $state.go('app.single');
    };

    $scope.getClass = function(index){
      if(index === 0) {
        
      } else {

      }
    }
  };

}());
