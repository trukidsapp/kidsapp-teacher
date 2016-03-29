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

      $scope.models = {
        selected: null,
        lists: {
          "currentQuizzes": [],
          "availableQuizzes": []
        }
      };

      $scope.listHeadings = ["Quizzes Assigned to Class", "Available Quizzes"];

      $scope.itemInserted = function(item, list){

        if(list === 'currentQuizzes'){
          putQuiz(item);
        }
        else if(list === 'availableQuizzes'){
          removeQuiz(item);
        }
        else{
          console.log("An unexpected operation occurred.");
        }
      };

      function getClass() {
        $http
          .get('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes/' + classId, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.class = response.data;
          console.log('retrieved successfully');
          getAllQuizzes();
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
          getQuizzes();
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
          filterQuizzes();
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.quizzes = {};
          }
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      function putQuiz(quiz){
        $http
          .put('http:' + envService.read('apiUrl') + '/classes/' + classId + '/quizzes/' + quiz.id, quiz , {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          console.log(response);
          console.log('Quiz posted successfully');
        }

        function fail(response) {
          if (response.status == 404) {

          }
          console.log(response.data);
          console.log('Quiz post fail');
        }
      }

      function removeQuiz(quiz){
        console.log("Removing question");
        $http
          .delete('http:' + envService.read('apiUrl') + '/classes/' + classId + '/quizzes/' + quiz.id, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          console.log(response);
          console.log('Quiz removed successfully');
        }

        function fail(response) {
          if (response.status == 404) {

          }
          console.log(response.data);
          console.log('Quiz remove fail');
        }
      }

      $scope.backBtnClick = function () {
        $location.path('/class-list');
      }

      function filterQuizzes(){
        $scope.models.lists.availableQuizzes = $scope.allQuizzes.filter(function(x){
          for(var i = 0; i<$scope.quizzes.length; i++){
            if($scope.quizzes[i].id == x.id){
              return false;
            }
          }
          return true;
        });
      }
    }]);