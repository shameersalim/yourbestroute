(function() {
"use strict";

angular.module("app").factory("WeatherService", WeatherService);

WeatherService.$inject = ["$log"];
function WeatherService($log) {
  var getWeather = function(apiKey, url, params) {
    $log.log("Some method");
  };

  return {
    getWeather : getWeather
  };


}
}());
