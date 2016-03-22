angular.module('app.answers', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/answers/:questionId', {
      templateUrl: 'views/answers/answers.html',
      controller: 'AnswersController'
    });
  }])

  .controller('AnswersController', [
    '$http',
    '$scope',
    '$location',
    'authService',
    'envService',
    '$routeParams',
    function ($http, $scope, $location, authService, envService, $routeParams) {
      var questionId = $routeParams.questionId;
      console.log(questionId);

      getQuestion();
      getAnswers();

      function getQuestion() {
        $http
          .get('http:' + envService.read('apiUrl') + '/questions/' + questionId, {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.question = response.data;
          console.log($scope.question);
          console.log('retrieved successfully');
        }

        function fail(response) {
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      function getAnswers() {
        $http
          .get('http:' + envService.read('apiUrl') + '/questions/' + questionId + '/answers', {
            headers: authService.getAPITokenHeader()
          }).then(success, fail);

        function success(response) {
          $scope.answers = response.data;
          console.log($scope.answers);
          console.log('retrieved successfully');
        }

        function fail(response) {
          if (response.status == 404) {
            $scope.answers = {};
          }
          console.log(response.data);
          console.log('retrieved fail');
        }
      }

      $scope.addAnswerBtnClick = function () {
        $scope.action = 'Add';
        $('#modifyAnswerModal').modal('show');
        $scope.answer = {};
      };

      $scope.editAnswerBtnClick = function (toEdit) {
        $scope.answer = angular.copy(toEdit);
        $scope.action = "Edit";
        $("#modifyAnswerModal").modal("show");
      };

      $scope.deleteAnswerBtnClick = function (idToDelete) {
        if (confirm("Are you sure you want to delete the answer? This cannot be undone")) {
          $scope.action = "Delete";
          $http
            .delete('http:' + envService.read('apiUrl') + '/questions/' + questionId + '/answers/' + idToDelete, {
              headers: authService.getAPITokenHeader()
            }).then(answerModifySuccess, answerModifyFailure);
        }
      };

      $scope.correctAnswerCheckChanged = function () {
        console.log($scope.answer.isCorrect)
      };

      $scope.modifyAnswerDoneBtnClick = function () {
        console.log($scope.action + ' done click');
        console.log($scope.answer);

        $scope.answer.isCorrect = $scope.answer.isCorrect || false;

        if ($scope.action == 'Add') {
          //add
          $http
            .post('http:' + envService.read('apiUrl') + '/questions/' + questionId + '/answers', $scope.answer, {
              headers: authService.getAPITokenHeader()
            }).then(answerModifySuccess, answerModifyFailure);
        }
        else {
          //edit
          $http
            .put('http:' + envService.read('apiUrl') + '/questions/' + questionId + '/answers/' + $scope.answer.id, $scope.answer, {
              headers: authService.getAPITokenHeader()
            }).then(answerModifySuccess, answerModifyFailure);
        }
      };

      function answerModifyFailure(response) {
        console.error(response);
        showFailMsg();
      }

      function answerModifySuccess(response) {
        // console.log('answer ' + $scope.action + 'ed successfully');
        //console.log(response);
        //console.log($scope.answer);

        getAnswers();
        $('#modifyAnswerModal').modal('hide');
        showSuccessMsg();
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

      $scope.backBtnClick = function () {
        $location.path('/question-list');
      };

    }]);
