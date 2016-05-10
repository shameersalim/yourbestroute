(function() {
  'use strict';

  angular.module('starter.services', [])
    .factory('RouteService', RouteService);

  RouteService.$inject = [];

  function RouteService() {

    function setRoute(route) {
        this.route = route;
    }

    function getRoute() {
      return this.route;
    }

    return {
      setRoute : setRoute,
      getRoute : getRoute
    }

  }
}());
