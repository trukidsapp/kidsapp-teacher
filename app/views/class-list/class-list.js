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
      if (response.status == 404) {
        console.log('no classes found');
      }
      else {
        console.log('failed' + response.status);
      }
    }

    $scope.addClassBtnClick = function () {
      $('#addClassModal').modal('show');
      $scope.class = {};
    };

    $scope.saveNewClassBtnClick = function () {

      function classAddFailure() {
        console.log('adding class failed');
        // TODO error msg?
      }

      function classAddSuccess() {
        console.log('class added');
        console.log($scope.class);
        $scope.classes.push($scope.class);
        $('#addClassModal').modal('hide');
        showSuccessMsg();
      }

      $scope.class.TeacherUsername = authService.getTokenUser().username;
      console.log('http:' + envService.read('apiUrl') + '/classes');
      $http
        .post('http:' + envService.read('apiUrl') + '/classes', $scope.class, {
          headers: authService.getAPITokenHeader()
        }).then(classAddSuccess, classAddFailure);
    };

    $scope.editClassBtnClick = function (id) {
      console.log('edit class' + id);
      // TODO
    };

    function showSuccessMsg() {
      $('#updateSuccessAlert').show();
      setTimeout(function () {
        $('#updateSuccessAlert').fadeOut();
      }, 7000);
    }

  }]);