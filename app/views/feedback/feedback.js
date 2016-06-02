'use strict';

angular.module('app.feedback', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/feedback', {
            templateUrl: 'views/feedback/feedback.html',
            controller: 'FeedbackController'
        });
    }])

    .controller('FeedbackController',
        [
            '$http',
            '$scope',
            '$location',
            'authService',
            'envService',
            function ($http, $scope, $location, authService, envService) {

        var teacherId = authService.getTokenUser().username;


        // Feedback Types
        // 0 = bug report
        // 1 = general feedback
        // 2 = suggestions

        $scope.sendBugReportBtnClick = function(){
            $('#bugReportModal').modal('show');
            $scope.feedback = {};
            $scope.feedback.type = 0;
        };

        $scope.sendFeedbackBtnClick = function(){
            $('#generalFeedbackModal').modal('show');
            $scope.feedback = {};
            $scope.feedback.type = 1;
        };
                
        $scope.sendSuggestionsBtnClick = function(){
            $('#suggestionsModal').modal('show');
            $scope.feedback = {};
            $scope.feedback.type = 2;
        };

                
        $scope.sendFeedbackDoneBtnClick = function () {
            $scope.feedback.errorCode = $scope.feedback.errorCode || -1;
            console.log($scope.feedback);
            $http
              .post('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/feedbacks', $scope.feedback,{
                headers: authService.getAPITokenHeader()
              }).then(success,failure);

          function success(response){
            console.log(response);
            $('#bugReportModal').modal('hide');
            $('#generalFeedbackModal').modal('hide');
            $('#suggestionsModal').modal('hide');
            showSuccessMsg();
          }
          function failure(response){
            console.error(response);
            showFailMsg();
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

        $scope.cancelBtn = function () {
            $scope.feedback = {};
        };

    }]);