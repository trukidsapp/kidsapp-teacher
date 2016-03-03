'use strict';

angular.module('app.nav', ['ngRoute'])

  .controller('navController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    console.log($location.path());

    $scope.templateUrl = (authService.isUserAuthenticated()) ? 'views/nav/nav_private.html' : 'views/nav/nav_public.html';

    $scope.isActive = function (location) {
      return location == $location.path();
    };

    $scope.logout = function () {
      console.log("Logging out");
      authService.logout()
    };

  }]);
