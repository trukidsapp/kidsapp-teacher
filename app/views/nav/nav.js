'use strict';

angular.module('app.nav', ['ngRoute'])

  .controller('navController', ['$rootScope', '$scope', '$location', 'authService', function ($rootScope, $scope, $location, authService) {

    $scope.templateUrl = (authService.isUserAuthenticated()) ? 'views/nav/nav_private.html' : 'views/nav/nav_public.html';

    $scope.isActive = function (location) {
      return location == $location.path();
    };

    $rootScope.$on('loginStateChange', function (event, data) {

      if (data === 'in') {
        console.log('log in');
        $scope.templateUrl = 'views/nav/nav_private.html';
      }
      else {
        console.log('log out');
        $scope.templateUrl = 'views/nav/nav_public.html';

      }

    });

    $scope.logout = function () {
      console.log("Logging out");
      authService.logout();
    };

  }]);
