'use strict';

angular.module('app.students', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/students/:classId', {
      templateUrl: 'views/students/students.html',
      controller: 'StudentsController'
    });
  }])

  .controller('StudentsController', [
    '$routeParams',
    '$location',
    '$scope',
    '$http',
    'authService',
    'envService',
    function ($routeParams, $location, $scope, $http, authService, envService) {

      var teacherId = authService.getTokenUser().username;
      var classId = $routeParams.classId;

      getEvaluation();
      getStudents();

      function getEvaluation() {
        $http
          .get('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes/' + classId, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.class = response.data;
          console.log('retrieved successfully');
        }

        function fail(response) {
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      function getStudents() {
        $http
          .get('http:' + envService.read('apiUrl') + '/classes/' + classId + '/students', {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.students = response.data;
          console.log(response);
          console.log('retrieved successfully');
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.students = {};
          }
          console.log(response.data);
          console.log('retrieved fail');
        }
      }


      $scope.addStudentBtnClick = function () {
        $scope.action = 'Add';
        $('#modifyStudentModal').modal('show');
        $scope.student = {};
      };

      $scope.editStudentBtnClick = function (toEdit) {
        //console.log('edit student ' + toEdit.username);
        // ensure editing a copy of the object so model in view behind modal doesn't update until save
        $scope.student = angular.copy(toEdit);
        //console.log($scope.student);
        $scope.action = "Edit";
        $('#modifyStudentModal').modal('show');
      };

      $scope.modifyStudentDoneBtnClick = function () {
        console.log($scope.action + ' done click');
        console.log($scope.student);
        // $scope.class.TeacherUsername = teacherId;
        if ($scope.action == 'Add') {
          //add
          $http
            .post('http:' + envService.read('apiUrl') + '/classes/' + classId + '/students', $scope.student, {
              headers: authService.getAPITokenHeader()
            }).then(studentModifySuccess, studentModifyFailure);
        }
        else {
          //edit
          $http
            .put('http:' + envService.read('apiUrl') + '/classes/' + classId + '/students/' + $scope.student.username, $scope.student, {
              headers: authService.getAPITokenHeader()
            }).then(studentModifySuccess, studentModifyFailure);
        }
      };

      function studentModifyFailure(response) {
        console.error(response);
        showFailMsg();
      }

      function studentModifySuccess(response) {
        // console.log('student ' + $scope.action + 'ed successfully');
        //console.log(response);
        //console.log($scope.student);

        getStudents();
        $('#modifyStudentModal').modal('hide');
        showSuccessMsg();
      }

      $scope.deleteStudentBtnClick = function (idToDelete) {
        if (confirm("Are you sure you want to delete the student? This cannot be undone")) {
          $scope.action = "Delete";
          //   console.log('delete student ' + idToDelete);
          $http
            .delete('http:' + envService.read('apiUrl') + '/classes/' + classId + '/students/' + idToDelete, {
              headers: authService.getAPITokenHeader()
            }).then(studentModifySuccess, studentModifyFailure);
        }
      };

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

      $scope.backBtnClick = function () {
        $location.path('/class-list');
      }

    }]);