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

    $scope.addQuizBtnClick= function () {
      $scope.action = 'Add';
      $('#modifyQuizModal').modal('show');
      $scope.quiz = {};
    };

    $scope.editQuizBtnClick = function (toEdit) {
      console.log('edit quiz ' + toEdit.id);
      // ensure editing a copy of the object so model in view behind modal doesn't update until save
      $scope.quiz = angular.copy(toEdit);
      console.log($scope.quiz);
      $scope.action = "Edit";
      $('#modifyQuizModal').modal('show');
    };

    $scope.modifyQuizDoneBtnClick = function () {
      console.log($scope.action + ' done click');
      console.log($scope.quiz);
      $scope.quiz.TeacherUsername = teacherId;
      if ($scope.action == 'Add') {
        //add
        // localhost:8080/api/quizzes/
        $http
          .post('http:' + envService.read('apiUrl') + '/quizzes/', $scope.quiz, {
            headers: authService.getAPITokenHeader()
          }).then(quizModifySuccess, quizModifyFailure);
      }
      else {
        //edit
        $http
          .put('http:' + envService.read('apiUrl') + '/quizzes/' + $scope.quiz.id, $scope.quiz, {
            headers: authService.getAPITokenHeader()
          }).then(quizModifySuccess, quizModifyFailure);
      }
    };

    $scope.deleteQuizBtnClick = function (idToDelete) {
      if (confirm("Are you sure you want to delete the quiz? This cannot be undone")) {
        $scope.action = "Delete";
        console.log('delete quiz ' + idToDelete);
        $http
          .delete('http:' + envService.read('apiUrl') + '/quizzes/' + idToDelete, {
            headers: authService.getAPITokenHeader()
          }).then(quizModifySuccess, quizModifyFailure);
      }
    };

    function quizModifySuccess(response) {
      console.log('quiz ' + $scope.action + 'ed successfully');
      console.log(response);

      $('#modifyQuizModal').modal('hide');

      getQuizzes();
      showSuccessMsg();
    }

    function quizModifyFailure(response) {
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

    $scope.manageQuestions = function (quizId) {
      console.log("QuizId: " + quizId);
      $location.path("/quiz-questions/" + quizId);
    };

  }]);