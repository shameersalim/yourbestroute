(function() {
    "use strict";

    angular.module('app').controller("RoutesTabController", RoutesTabController);

    RoutesTabController.$inject = ["$rootScope", "$scope", "$log", "$http", "$timeout"];

    function RoutesTabController($rootScope, $scope, $log, $http, $timeout) {
        $scope.temperature = '';
        $rootScope.setup = $scope.setup = JSON.parse(window.localStorage.getItem("setup"));
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
        var origin = $scope.address1 = $rootScope.setup.address1;
        var destination = $scope.address2 = $rootScope.setup.address2;

        $scope.iconClass = "wi-night-clear";

        function setWeatherIcon(actualId, sunrise, sunset) {
            var id = actualId / 100;
            var isDay = true;
            var currentTime = new Date().getTime();
            if (currentTime >= sunrise && currentTime < sunset) {
                isDay = true;
            } else {
                isDay = false;
            }
            if (actualId === 800) {
                if (isDay) {
                    $scope.iconClass = "wi-day-sunny";
                } else {
                    $scope.iconClass = "wi-night-clear";
                }
                return;
            }
            switch (id) {
                case 2:
                    $scope.iconClass = "wi-thunderstorm";
                    break;
                case 3:
                    $scope.iconClass = "wi-showers";
                    break;
                case 7:
                    $scope.iconClass = "wi-fog";
                    break;
                case 8:
                    $scope.iconClass = "wi-cloudy";
                    break;
                case 6:
                    $scope.iconClass = "wi-snow";
                    break;
                case 5:
                    $scope.iconClass = "wi-rain";
                    break;
                case 9:
                    $scope.iconClass = "wi-tornado";
                    break;

            }
            $scope.$apply();
        }


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
                    setWeatherIcon($scope.weatherObj.id, $scope.weatherObj.sunrise, $scope.weatherObj.sunset);
                    var iconTemp = angular.element(document.querySelector('#iconTemp'));
                    iconTemp.addClass($scope.iconClass);
                })
                .error(function(data, status, headers, config) {
                    $log.log("errors : Weather");
                });

        }

        function getIcon() {
            return $scope.iconClass;
        }

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

        $scope.switchDirections = function() {
            if (origin == $scope.address1 && destination === $scope.address2) {
                origin = $scope.address2;
                destination = $scope.address1;
                $scope.originLabel = "Work";
                $scope.destinationLabel = "Home";
            } else if (origin == $scope.address2 && destination === $scope.address1) {
                origin = $scope.address1;
                destination = $scope.address2;
                $scope.originLabel = "Home";
                $scope.destinationLabel = "Work";
            }
            getDirections(origin, destination);
        };

        $scope.addressChangeHandler = function() {
          if($scope.address1 === '' || angular.isUndefined($scope.address1)) {
            return;
          }
          $rootScope.setup.address1 = $scope.address1;
          if($scope.address2 === '' || angular.isUndefined($scope.address2)) {
            return;
          }
          $rootScope.setup.address2 = $scope.address2;
          var setupStr = JSON.stringify($rootScope.setup);
          window.localStorage.setItem("setup", setupStr);
          getDirections($scope.address1, $scope.address2);
        };

        getWeather();
        getDirections(origin, destination);
    }

}());
