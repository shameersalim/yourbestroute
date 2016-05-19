(function() {
  angular.module('starter.controllers', [])
    .controller('RoutesController', RoutesController);

  RoutesController.$inject = ["$rootScope", "$scope", "$log", "$http", "$timeout", "$state",
  "$cordovaLocalNotification", "$ionicPlatform",
"RouteService"];

  function RoutesController($rootScope, $scope, $log, $http, $timeout, $state,
    $cordovaLocalNotification, $ionicPlatform,
  RouteService) {
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

      function getBingDirections(origin, destination) {
        //http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=Minneapolis,MN&wp.1=St%20Paul,MN&optmz=distance&routeAttributes=routePath&key=Am5PQzEG1r-DsGOntmKzr27fPT8OmW35G15dgU4e7qojz1E6_jcqWJVYCo1QNDvY
        var request = 'http://dev.virtualearth.net/REST/V1/Routes/Driving' +
        '?wp.0=' + origin +
        '&wp.1=' + destination +
        '&optmz=distance&routeAttributes=routePath&jsonp=JSON_CALLBACK&key=' + BING_MAPS_KEY;
        request = request.replace(/ /g, '%20');
        $http.jsonp(request)
        .success(function (result) {

        })
        .error(function(data, status, error, thing) {

        })
      };

      var getDirections = function(origin, destination) {
        if(origin === null || destination === null) {
          return;
        }

        if(angular.isUndefined(origin) || angular.isUndefined(destination)) {
          return;
        }
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
            getBingDirections(origin, destination);
        };

      $scope.switchDirections = function() {
        var temp = $scope.origin;
        $scope.origin = $scope.destination;
        $scope.destination = temp;
        if($scope.originLabel == 'Home' && $scope.destinationLabel == 'Work') {
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
      if(address === null || angular.isUndefined(address)) {
        return;
      }
      $rootScope.setup.origin = address.formatted_address;
      $rootScope.setup.originLabel = $scope.originLabel;
      $scope.origin = address.formatted_address;

    saveInformation();

      getDirections($scope.origin, $scope.destination);
    };

    var destinationChange = function(address) {
      if(address === null || angular.isUndefined(address)) {
        return;
      }
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

    $scope.getClass = function(index){
      if(index === 0) {
        return 'best-route';
      }
    };

    $ionicPlatform.ready(function () {

        $scope.scheduleInstantNotification = function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            text: 'Instant Notification',
            title: 'Instant'
          }).then(function () {
            alert("Instant Notification set");
          });;
        };

        $scope.scheduleDelayedNotification = function () {
          var now = new Date().getTime();
          var _5SecondsFromNow = new Date(now + 5000);

          $cordovaLocalNotification.schedule({
            id: 2,
            at: _5SecondsFromNow,
            text: 'Notification After 5 Seconds Has Been Triggered',
            title: 'After 5 Seconds'
          }).then(function (result) {
            console.log('After 5 sec Notification Set');
          });
        }

        //Scheduled Every X Seconds / Minutes
        //Every Options: second, minute, hour, day, week, month, year
        $scope.scheduleEveryMinuteNotification = function () {
          $cordovaLocalNotification.schedule({
            id: 3,
            title: 'Every Minute',
            text: 'Give a real message',
            every: 'minute'
          }).then(function (result) {
            console.log('Every Minute Notification Set');
          });
        };


        // Update a Scheduled Notification
        $scope.updateNotificationText = function () {
          $cordovaLocalNotification.isPresent(3).then(function (present) {
            if (present) {
              $cordovaLocalNotification.update({
                id: 3,
                title: 'Notificaton  Update',
                text: 'Notification Update Details'
              }).then(function (result) {
                console.log('Updated Notification Text');
              });
            } else {
              alert("Must Schedule Every Minute First");
            }
          });
        };

        $scope.updateNotificationEvery = function () {
          $cordovaLocalNotification.isPresent(3).then(function (present) {
            if (present) {
              $cordovaLocalNotification.update({
                id: 3,
                title: 'Notification  Update',
                text: 'Every Minute change to second',
                every: 'second'

              }).then(function (result) {
                console.log('Updated Notification Every');
              });
            } else {
              alert("Must Schedule Every Minute First");
            }
          });
        };

        //Cancel a Notification
        $scope.cancelNotification = function () {
          $cordovaLocalNotification.isPresent(3).then(function (present) {
            if (present) {
              $cordovaLocalNotification.cancel(3).then(function (result) {
                console.log('Notification EveryMinute Cancelled');
                alert('Cancelled Every Minute');
              });
            } else {
              alert("Must Schedule Every Minute First");
            }
          });
        };

  });
};



}());
