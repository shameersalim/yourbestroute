(function() {
  angular.module('starter.controllers')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ["$rootScope", "$scope", "$log", "$http", "$timeout", "$state",
  "AppConstants"
  ];

  function SettingsController($rootScope, $scope, $log, $http, $timeout, $state,
  AppConstants) {
    $scope.hometoWorkTime = undefined;
    $scope.workToHomeTime = undefined;

    $scope.$on('$ionicView.enter', function(e) {

    });

    $scope.radioButtonChangeHandler = function(tempFormat) {
      $scope.temperatureFormat = tempFormat;
      $rootScope.setup.temperatureFormat = $scope.temperatureFormat;
      saveInformation();
    };

    function loadInformation() {
      $rootScope.setup = JSON.parse(window.localStorage.getItem("setup"));

      if($rootScope.setup === null || angular.isUndefined($rootScope.setup) || Object.keys($rootScope.setup).length === 0) {
        $rootScope.setup = {};
        $scope.temperatureFormat = AppConstants.TEMPERATURE_FORMAT_FARENHEIT;
        $rootScope.setup.temperatureFormat = AppConstants.TEMPERATURE_FORMAT_FARENHEIT;
        $rootScope.setup.homeToWorkTime = '';
        $rootScope.setup.workToHomeTime = '';
        saveInformation();
        return;
      }

      if($rootScope.setup.temperatureFormat === null || angular.isUndefined($rootScope.setup.temperatureFormat)) {
        return;
      }

      $scope.temperatureFormat = $rootScope.setup.temperatureFormat;
    }

    function saveInformation() {
      var setupStr = JSON.stringify($rootScope.setup);
      window.localStorage.setItem("setup", setupStr);
    }

    loadInformation();
  }


}());
