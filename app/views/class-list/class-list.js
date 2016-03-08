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
      .get('http:' + envService.read('apiUrl') + '/teachers/' + authService.getTokenUser().username + '/classes', {
        headers: authService.getAPITokenHeader()
      }).then(classRetrieveSuccess, classRetrieveFailure);

    function classRetrieveSuccess(response) {
      //console.log(response);
      $scope.classes = response.data;
    }

    function classRetrieveFailure(response) {
      if (response.status == 404) {
        console.log('no classes found');
        $scope.classes = [];
      }
      else {
        console.log('failed' + response.status);
      }
    }

    $scope.addClassBtnClick = function () {
      $scope.action = 'Add';
      $('#addEditClassModal').modal('show');
      $scope.class = {};
    };

    $scope.editClassBtnClick = function (toEdit) {
      console.log('edit class ' + toEdit.id);
      // ensure editing a copy of the object so model in view behind modal doesn't update until save
      $scope.class = Object.create(toEdit);
      console.log($scope.class);
      $scope.action = "Edit";
      $('#addEditClassModal').modal('show');
    };

    $scope.addEditClassDoneBtnClick = function () {
      console.log($scope.action + ' click');

      $scope.class.TeacherUsername = authService.getTokenUser().username;
      if ($scope.action == 'Add') {
        //add
        $http
          .post('http:' + envService.read('apiUrl') + '/teachers/' + authService.getTokenUser().username + '/classes', $scope.class, {
            headers: authService.getAPITokenHeader()
          }).then(classAddEditSuccess, classAddEditFailure);
      }
      else {
        //edit
        $http
          .put('http:' + envService.read('apiUrl') + '/teachers/' + authService.getTokenUser().username + '/classes/' + $scope.class.id, $scope.class, {
            headers: authService.getAPITokenHeader()
          }).then(classAddEditSuccess, classAddEditFailure);
      }
    };

    function classAddEditSuccess(response) {
      console.log('class ' + $scope.action + 'ed successfully');
      console.log(response);
      console.log($scope.class);

      if ($scope.action == "Add") {
        $scope.classes.push($scope.class);
      }
      else {
        // TODO replace the class in the view array
        // find id in $scope.classes , replace that element with $scope.class

      }
      $('#addEditClassModal').modal('hide');
      showSuccessMsg();
    }

    function classAddEditFailure(response) {
      console.error(response);
      showFailMsg();
    }

    function showSuccessMsg() {
      $('#updateSuccessAlert').show();
      setTimeout(function () {
        $('#updateSuccessAlert').fadeOut();
      }, 7000);
    }

    function showFailMsg() {
      $('#updateFailAlert').show();
      setTimeout(function () {
        $('#updateFailAlert').fadeOut();
      }, 7000);
    }

  }]);