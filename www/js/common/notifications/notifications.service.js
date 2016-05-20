(function() {
  "use strict";

  angular.module("starter.services").factory("NotificationsService", NotificationsService);

  NotificationsService.$inject = ["$log", "$http", "$q", "$cordovaLocalNotification", "$ionicPlatform"];

  function NotificationsService($log, $http, $q, $cordovaLocalNotification, $ionicPlatform) {
    var scheduleInstantNotification = function() {
      $ionicPlatform.ready(function() {
        $cordovaLocalNotification.schedule({
          id: 1,
          text: 'Instant Notification',
          title: 'Instant'
        }).then(function() {
          $log.log("Instant Notification set");
        });
      });
    };

    var scheduleDelayedNotification = function() {
      $ionicPlatform.ready(function() {
        var now = new Date().getTime();
        var _5SecondsFromNow = new Date(now + 5000);

        $cordovaLocalNotification.schedule({
          id: 2,
          at: _5SecondsFromNow,
          text: 'Notification After 5 Seconds Has Been Triggered',
          title: 'After 5 Seconds'
        }).then(function(result) {
          $log.log('After 5 sec Notification Set');
        });
      });
    };

    //Scheduled Every X Seconds / Minutes
    //Every Options: second, minute, hour, day, week, month, year
    var scheduleEveryMinuteNotification = function() {
      $ionicPlatform.ready(function() {
        $cordovaLocalNotification.schedule({
          id: 3,
          title: 'Every Minute',
          text: 'Give a real message',
          every: 'minute'
        }).then(function(result) {
          $log.log('Every Minute Notification Set');
        });
      });
    };


    // Update a Scheduled Notification
    var updateNotificationText = function() {
      $ionicPlatform.ready(function() {
        $cordovaLocalNotification.isPresent(3).then(function(present) {
          if (present) {
            $cordovaLocalNotification.update({
              id: 3,
              title: 'Notificaton  Update',
              text: 'Notification Update Details'
            }).then(function(result) {
              $log.log('Updated Notification Text');
            });
          } else {
            alert("Must Schedule Every Minute First");
          }
        });
      });
    };

    var updateNotificationEvery = function() {
      $ionicPlatform.ready(function() {
        $cordovaLocalNotification.isPresent(3).then(function(present) {
          if (present) {
            $cordovaLocalNotification.update({
              id: 3,
              title: 'Notification  Update',
              text: 'Every Minute change to second',
              every: 'second'

            }).then(function(result) {
              $log.log('Updated Notification Every');
            });
          } else {
            $log.log("Must Schedule Every Minute First");
          }
        });
      });
    };

    //Cancel a Notification
    var cancelNotification = function() {
      $ionicPlatform.ready(function() {
        $cordovaLocalNotification.isPresent(3).then(function(present) {
          if (present) {
            $cordovaLocalNotification.cancel(3).then(function(result) {
              $log.log('Notification EveryMinute Cancelled');
              $log.log('Cancelled Every Minute');
            });
          } else {
            $log.log("Must Schedule Every Minute First");
          }
        });
      });
    };

    return {
      scheduleInstantNotification: scheduleInstantNotification,
      scheduleDelayedNotification: scheduleDelayedNotification,
      scheduleEveryMinuteNotification: scheduleEveryMinuteNotification,
      updateNotificationText: updateNotificationText,
      updateNotificationEvery: updateNotificationEvery,
      cancelNotification: cancelNotification
    };


  }
}());
