(function() {
    "use strict";

    angular.module('app').controller("SetupTabController", SetupTabController);

    SetupTabController.$inject = ["$rootScope", "$scope"];

    function SetupTabController($rootScope, $scope) {
        $rootScope.setup = $scope.setup = JSON.parse(window.localStorage.getItem("setup"));
        if ($scope.setup === null) {
            $scope.setup = {};
            $scope.setup.address1 = $scope.setup.address2 = '';
            $scope.setup.pushNotifications = true;
        }
        $scope.masterSetup = angular.copy($scope.setup);


        $scope.address1ChangeHandler = function() {
            $rootScope.setup.address1 = $scope.setup.address1;
            saveSetupInformation();
        };

        $scope.address2ChangeHandler = function() {
            $rootScope.setup.address2 = $scope.setup.address2;
            saveSetupInformation();
        };

        $scope.pushNotificationsClickHandler = function() {
            $rootScope.setup.pushNotifications = $scope.setup.pushNotifications;
            saveSetupInformation();
        };

        var saveSetupInformation = function() {
            window.localStorage.setItem("setup", JSON.stringify($scope.setup));
        };
    }

}());
