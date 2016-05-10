(function() {
"use strict";
angular.module('app')

.factory('WeatherService', WeatherService);
//.factory('MapsService', MapsService);

WeatherService.$inject = ["$resource", "$http", "$log"];

function WeatherService($resource, $http, $log) {
  var getWeather = function(apiKey, url, params) {

    $http.jsonp(url, {
        params: params
      })
      .success(function(data, status, headers, config) {
        $log.log("success");
        return data;
      })
      .error(function(data, status, headers, config) {
        $log.log("error");
        return data;
      });
  };

  return {
    getWeather: getWeather
  };
}
//
// MapsService.$inject = ["$resource"];
//
// function MapsService() {
//
// }
}());
