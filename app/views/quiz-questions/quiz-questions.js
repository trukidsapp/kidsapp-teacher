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
      var quizId = $routeParams.quizId;

      getQuiz();

      $scope.models = {
        selected: null,
        lists: {
          "currentQuestions": [],
          "availableQuestions": []
        }
      };

      $scope.listHeadings = ["Questions In Quiz", "Available Questions"];

      $scope.itemInserted = function(item, list){

        console.log(list);

        if(list === 'currentQuestions'){
          putQuestion(item);
        }
        else if(list === 'availableQuestions'){
          removeQuestion(item);
        }
        else{
          console.log("An unexpected operation occurred.");
        }
      };

      function getQuiz() {
        $http
          .get('http:' + envService.read('apiUrl') + '/quizzes/' + quizId, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.quiz = response.data;
          console.log('retrieved successfully');
          getAllQuestions();
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
          console.log(response);
          console.log('retrieved successfully');
          getQuestions();
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
          $scope.models.lists.currentQuestions = $scope.questions;
          console.log(response);
          console.log('retrieved successfully');
          filterQuestions();
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.questions = new Array();
          }
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      function putQuestion(question){
        $http
          .put('http:' + envService.read('apiUrl') + '/quizzes/' + quizId + '/questions/' + question.id, question , {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          console.log(response);
          console.log('Question posted successfully');
        }

        function fail(response) {
          if (response.status == 404) {

          }
          console.log(response.data);
          console.log('Question post fail');
        }
      }

      function removeQuestion(question){
        console.log("Removing question");
        $http
          .delete('http:' + envService.read('apiUrl') + '/quizzes/' + quizId + '/questions/' + question.id, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          console.log(response);
          console.log('Question removed successfully');
        }

        function fail(response) {
          if (response.status == 404) {

          }
          console.log(response.data);
          console.log('Question remove fail');
        }
      }

      $scope.backBtnClick = function () {
        $location.path('/quiz-list');
      };

      function filterQuestions(){
        $scope.models.lists.availableQuestions = $scope.allQuestions.filter(function(x){
          for(var i = 0; i<$scope.questions.length; i++){
            if($scope.questions[i].id == x.id){
              return false;
            }
          }
          return true;
        });
      }
    }]);