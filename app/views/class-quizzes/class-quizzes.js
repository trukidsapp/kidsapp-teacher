'use strict';

angular.module('app.class-quizzes', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/class-quizzes/:classId', {
      templateUrl: 'views/class-quizzes/class-quizzes.html',
      controller: 'ClassQuizzesController'
    });
  }])

  .controller('ClassQuizzesController', [
    '$routeParams',
    '$location',
    '$scope',
    '$http',
    'authService',
    'envService',
    function ($routeParams, $location, $scope, $http, authService, envService) {
      var teacherId = authService.getTokenUser().username;
      var classId = $routeParams.classId;

      getClass();
      getQuizzes();
      getAllQuizzes();

      $scope.models = {
        selected: null,
        lists: {
          "currentQuizzes": $scope.quizzes,
          "availableQuizzes": $scope.allQuizzes
        }
      };

      $scope.listHeadings = ["Quizzes Assigned to Class", "Available Quizzes"];



      function getClass() {
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

      function getAllQuizzes(){
        $http
          .get('http:' + envService.read('apiUrl') + '/quizzes/', {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.allQuizzes = response.data;
          console.log(response);
          $scope.models.lists.availableQuizzes = $scope.allQuizzes;
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.allQuizzes = {};
          }
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      function getQuizzes() {
        $http
          .get('http:' + envService.read('apiUrl') + '/classes/' + classId + '/quizzes', {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.quizzes = response.data;
          console.log(response);
          console.log('retrieved successfully');
          $scope.models.lists.currentQuizzes = $scope.quizzes;
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.quizzes = {};
          }
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      $scope.backBtnClick = function () {
        $location.path('/class-list');
      }

    }]);