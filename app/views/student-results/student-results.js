angular.module('app.student-results', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/student-results/:studentId', {
      templateUrl: 'views/student-results/student-results.html',
      controller: 'StudentResultsController'
    });
  }])

  .controller('StudentResultsController', [
    '$http',
    '$scope',
    '$location',
    'authService',
    'envService',
    '$routeParams',
    function ($http, $scope, $location, authService, envService, $routeParams) {
      var teacherId = authService.getTokenUser().username;


    }]);