(function() {
  "use strict";

  angular.module("starter.services").factory("WeatherService", WeatherService);

  WeatherService.$inject = ["$log", "$http", "$q"];

  function WeatherService($log, $http, $q) {
    var getWeather = function(apiKey, url, params) {
      return $http.jsonp(url, {
          params: params
        })
        .then(function(response) {
          if (typeof response.data === 'object') {
            return response.data;
          } else {
            return $q.reject(response.data);
          }
        }, function(response) {
          return $q.reject(response.data);
        });

    };

    return {
      getWeather: getWeather
    };


  }
}());
