(function() {
  angular.module('starter.controllers')
    .controller('RouteDetailController', RouteDetailController);

  RouteDetailController.$inject = ["$rootScope", "$scope", "$log", "$http", "$timeout", "$state",
    "RouteService"
  ];

  function RouteDetailController($rootScope, $scope, $log, $http, $timeout, $state,
    RouteService) {
    $scope.$on('$ionicView.enter', function(e) {
      var route = RouteService.getRoute();
      $scope.listOfSteps = route.legs[0].steps;
    });
  };


}());
