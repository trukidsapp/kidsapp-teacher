'use strict';

angular.module('app.quiz-questions', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/quiz-questions/:quizId', {
      templateUrl: 'views/quiz-questions/quiz-questions.html',
      controller: 'QuizQuestionsController'
    });
  }])

  .controller('QuizQuestionsController', [
    '$routeParams',
    '$location',
    '$scope',
    '$http',
    'authService',
    'envService',
    function ($routeParams, $location, $scope, $http, authService, envService) {
      var teacherId = authService.getTokenUser().username;
      var quizId = $routeParams.quizId;

      getQuiz();
      getQuestions();
      getAllQuestions();

      $scope.models = {
        selected: null,
        lists: {
          "currentQuestions": [],
          "availableQuestions": []
        }
      };

      $scope.listHeadings = ["Questions In Quiz", "Available Questions"];



      function getQuiz() {
        $http
          .get('http:' + envService.read('apiUrl') + '/quizzes/' + quizId, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.quiz = response.data;
          console.log('retrieved successfully');
        }

        function fail(response) {
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      function getAllQuestions(){
        $http
          .get('http:' + envService.read('apiUrl') + '/questions/', {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.allQuestions = response.data;
          $scope.models.lists.availableQuestions = $scope.allQuestions;
          console.log('allQuestions: ' + $scope.allQuestions);
          console.log('allQuestions: ' + $scope.allQuestions.length);
          console.log('item 1: ' + $scope.allQuestions[0]);
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.allQuestions = new Array();
          }
          console.log(response.data);
          console.log('retrieved fail');
          console.log('allQuestions: ' + $scope.allQuestions);
        }
      }

      function getQuestions() {
        $http
          .get('http:' + envService.read('apiUrl') + '/quizzes/' + quizId + '/questions', {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.questions = response.data;
          console.log(response);
          console.log('retrieved successfully');
          $scope.models.lists.currentQuestions = $scope.questions;
          console.log('questions: ' + $scope.questions);
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.questions = new Array();
          }
          console.log(response.data);
          console.log('retrieved fail');
          console.log('questions: ' + $scope.questions);
          console.log('questions: ' + $scope.questions.length);
        }
      }

      $scope.backBtnClick = function () {
        $location.path('/quiz-list');
      }

      $scope.questionFunction = function(item){
        console.log("Item passed");
        console.log(item);
      }

    }]);