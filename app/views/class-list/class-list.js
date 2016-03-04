'use strict';

angular.module('app.class-list', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/class-list', {
      templateUrl: 'views/class-list/class-list.html',
      controller: 'ClassListController'
    });
  }])

  .controller('ClassListController', ['$http', '$scope', '$location', 'authService', 'envService', function ($http, $scope, $location, authService, envService) {

    $http
      .get('http:' + envService.read('apiUrl') + '/classes', {
        headers: authService.getAPITokenHeader()
      }).then(classRetrieveSuccess, classRetrieveFailure);

    function classRetrieveSuccess(response) {
      //console.log(response);
      $scope.classes = response.data;
    }

    function classRetrieveFailure(response) {
      console.log(response);

      if (response.status == 404) {
        console.log('no classes found');
      }
      else {
        console.log('failed' + response.status);
      }
    }
  }]);