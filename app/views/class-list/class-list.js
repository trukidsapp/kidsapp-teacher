'use strict';

angular.module('app.class-list', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/class-list', {
      templateUrl: 'views/class-list/class-list.html',
      controller: 'ClassListController'
    });
  }])

  .controller('ClassListController', ['$http', '$scope', '$location', 'authService', 'envService', function ($http, $scope, $location, authService, envService) {
    var teacherId = authService.getTokenUser().username;

    $http
      .get('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes', {
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
      $('#modifyClassModal').modal('show');
      $scope.class = {};
    };

    $scope.editClassBtnClick = function (toEdit) {
      console.log('edit class ' + toEdit.id);
      // ensure editing a copy of the object so model in view behind modal doesn't update until save
      $scope.class = JSON.parse(JSON.stringify(toEdit)); // TODO this is a hack, better way?
      console.log($scope.class);
      $scope.action = "Edit";
      $('#modifyClassModal').modal('show');
    };

    $scope.addEditClassDoneBtnClick = function () {
      console.log($scope.action + ' done click');
      console.log($scope.class);
      $scope.class.TeacherUsername = authService.getTokenUser().username;
      if ($scope.action == 'Add') {
        //add
        $http
          .post('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes', $scope.class, {
            headers: authService.getAPITokenHeader()
          }).then(classAddEditDeleteSuccess, classAddEditDeleteFailure);
      }
      else {
        //edit
        $http
          .put('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes/' + $scope.class.id, $scope.class, {
            headers: authService.getAPITokenHeader()
          }).then(classAddEditDeleteSuccess, classAddEditDeleteFailure);
      }
    };

    // TODO save edits fails 404?

    $scope.deleteClassBtnClick = function (idToDelete) {
      if (confirm("Are you sure you want to delete the class? This cannot be undone")) {
        $scope.action = "Delete";
        console.log('delete class ' + idToDelete);
        $http
          .delete('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes/' + idToDelete, {
            headers: authService.getAPITokenHeader()
          }).then(classAddEditDeleteSuccess, classAddEditDeleteFailure);
      }

    };

    function classAddEditDeleteSuccess(response) {
      console.log('class ' + $scope.action + 'ed successfully');
      console.log(response);
      console.log($scope.class);

      if ($scope.action == "Add") {
        $scope.classes.push($scope.class);
      }
      else if ($scope.action == "Delete") {

        $scope.classes = $scope.classes.filter(function (item) {
          return item.id != $scope.class.id;
        });

      }
      else {
        // find class in model and replace with the updated one
        for (var c in $scope.classes) {
          if ($scope.classes.hasOwnProperty(c) && $scope.classes.id == c.id) {
            c = $scope.class;
            break;
          }
        }
      }
      $('#modifyClassModal').modal('hide');
      showSuccessMsg();
    }

    function classAddEditDeleteFailure(response) {
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