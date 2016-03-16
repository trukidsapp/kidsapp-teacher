'use strict';

angular.module('app.question-list', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/question-list', {
      templateUrl: 'views/question-list/question-list.html',
      controller: 'QuestionListController'
    });
  }])

  .controller('QuestionListController', ['$http', '$scope', '$location', 'authService', 'envService', function ($http, $scope, $location, authService, envService) {

    var teacherId = authService.getTokenUser().username;
    getQuestions();

    function getQuestions() {
      $http
        .get('http:' + envService.read('apiUrl') + '/questions', {
          headers: authService.getAPITokenHeader()
        })
        .then(function (response) {
          $scope.questions = response.data;
        })
        .catch(function (response) {
          if (response.status == 404) {
            console.log('no classes found');
            $scope.classes = [];
          }
          else {
            console.log('failed' + response.status);
          }
        });
    }

    $scope.addQuestionBtnClick = function () {
      $scope.action = 'Add';
      $('#modifyQuestionModal').modal('show');
      $scope.question = {};
    };

    $scope.deleteQuestionBtnClick = function (idToDelete) {
      if (confirm("Are you sure you want to delete this question? This cannot be undone")) {
        $scope.action = "Delete";
        console.log('delete question ' + idToDelete);
        $http
          .delete('http:' + envService.read('apiUrl') + '/questions/' + idToDelete, {
            headers: authService.getAPITokenHeader()
          })
          .then(questionModifySuccess, questionModifyFailure);
      }
    };

    $scope.editQuestionBtnClick = function (toEdit) {
     // console.log('edit question ' + toEdit);
      // ensure editing a copy of the object so model in view behind modal doesn't update until save
      $scope.question = angular.copy(toEdit);
     // console.log($scope.question);
      $scope.action = "Edit";
      $('#modifyQuestionModal').modal('show');
    };

    $scope.modifyQuestionDoneBtnClick = function () {
      console.log($scope.action + ' done click');
      console.log($scope.question);
      if ($scope.action == 'Add') {
        $scope.question.hint = $scope.question.hint || "";
        //add
        $http
          .post('http:' + envService.read('apiUrl') + '/questions/', $scope.question, {
            headers: authService.getAPITokenHeader()
          }).then(questionModifySuccess, questionModifyFailure);
      }
      else {
        //edit
        $http
          .put('http:' + envService.read('apiUrl') + '/questions/' + $scope.question.id, $scope.question, {
            headers: authService.getAPITokenHeader()
          }).then(questionModifySuccess, questionModifyFailure);
      }
    };

    function questionModifySuccess(response) {
      console.log(response);
      $('#modifyQuestionModal').modal('hide');
      getQuestions();
      showSuccessMsg();
    }

    function questionModifyFailure(response) {
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