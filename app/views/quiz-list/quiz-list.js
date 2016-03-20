'use strict';

angular.module('app.quiz-list', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/quiz-list', {
      templateUrl: 'views/quiz-list/quiz-list.html',
      controller: 'QuizListController'
    });
  }])

  .controller('QuizListController', ['$http', '$scope', '$location', 'authService', 'envService', function ($http, $scope, $location, authService, envService) {
    var teacherId = authService.getTokenUser().username;
    getQuizzes();

    function getQuizzes() {
      $http
        .get('http:' + envService.read('apiUrl') + '/quizzes/', {
          headers: authService.getAPITokenHeader()
        }).then(quizzesRetrieveSuccess, quizzesRetrieveFailure);
    }

    function quizzesRetrieveSuccess(response) {
      //console.log(response);
      $scope.quizzes = response.data;
    }

    function quizzesRetrieveFailure(response) {
      if (response.status == 404) {
        console.log('no quizzes found');
        $scope.quizzes = [];
      }
      else {
        console.log('failed' + response.status);
      }
    }
  }]);