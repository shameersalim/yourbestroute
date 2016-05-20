(function() {
  'use strict';

  angular.module('starter.services', [])
    .factory('RouteService', RouteService);

  RouteService.$inject = ["$log", "$q"];

  function RouteService($log, $q) {

    function getDirections(origin, destination) {

        var defer = $q.defer();
        var directionsService = new google.maps.DirectionsService;
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            defer.resolve(response);
          } else {
            $log.log("Error in retrieving directions");
            defer.reject(response);
          }
        });
        return defer.promise;

    }
/*
    function getBingDirections() {
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
*/
    function setRoute(route) {
      this.route = route;
    }

    function getRoute() {
      return this.route;
    }

    return {
      setRoute: setRoute,
      getRoute: getRoute,
      getDirections: getDirections
    }

  }
}());
