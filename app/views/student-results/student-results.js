angular.module('app.student-results', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/student-results/classes/:classId/students/:studentId', {
      templateUrl: 'views/student-results/student-results.html',
      controller: 'StudentResultsController'
    });
  }])

  .controller('StudentResultsController', [
    '$http',
    '$scope',
    '$location',
    'authService',
    'envService',
    '$routeParams',
    function ($http, $scope, $location, authService, envService, $routeParams) {
      var teacherId = authService.getTokenUser().username;
      var studentId = $routeParams.studentId;
      var classId = $routeParams.classId;

      function getStudent(){
        $http
          .get('http:' + envService.read('apiUrl') + '/classes/' + classId + '/students/' + studentId, {
            headers: authService.getAPITokenHeader()
          }).then(success, failure);

        function success(){

        }
        function failure(){

        }
      }



      function getQuestionAnswers(){

      }


    }]);