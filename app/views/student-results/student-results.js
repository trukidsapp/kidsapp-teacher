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
      //var teacherId = authService.getTokenUser().username;
      var studentId = $routeParams.studentId;
      var classId = $routeParams.classId;
      $scope.questions = [];

      getStudent();

      function getStudent(){
        $http
          .get('http:' + envService.read('apiUrl') + '/classes/' + classId + '/students/' + studentId, {
            headers: authService.getAPITokenHeader()
          }).then(success, failure);

        function success(response){
          console.log("Student retrieved successfully.");
          $scope.student = response.data;
          getStudentAnswers()
        }
        function failure(response){
          if(response.status == 404){
            console.log("No student found.");
          }
          else{
            console.log("Failed: " + response.status);
          }
        }
      }

      function getStudentAnswers(){
        $http
          .get('http:' + envService.read('apiUrl') + '/students/' + studentId + '/results', {
            headers: authService.getAPITokenHeader()
          }).then(success, failure);

        function success(response){
          console.log("Results retrieved successfully.");
          $scope.results = response.data;
          console.log($scope.results);
          getQuestions();
        }
        function failure(response){
          if(response.status == 404){
            console.log("No results found.");
          }
          else{
            console.log("Failed: " + response.status);
          }
        }
      }

      function getQuestions(){
        var questionResults = $scope.results;
        var questionToGet = [];
        var z;
        var i;

        for(z = 0; z<questionResults.length;z++){
          var questionId = questionResults[z].QuestionId;
          if(!contains(questionId)){
            questionToGet.push(questionId);
          }
        }

        console.log("Questions to get: ");
        console.log(questionToGet);

        for(i = 0; i<questionToGet.length; i++){
          $http
            .get('http:' + envService.read('apiUrl') + '/questions/' + questionToGet[i], {
              headers: authService.getAPITokenHeader()
            }).then(success, failure);
        }

        function contains(x){
          var exists = false;
          for(var y = 0; y<questionResults.length;y++){
            if(questionToGet[y]==x){
              exists = true;
              break;
            }
          }
          return exists;
        }

        function linkResults(questionId){
          console.log("Linking results");
          var results = [];

          for(var k = 0; k<questionResults.length; k++){
            if(questionResults[k].QuestionId==questionId){
              results.push(questionResults[k]);
            }
          }
          return results;
        }

        function success(response){
          console.log("Question retrieved successfully.");

          $scope.questions.push(
            {"question":response.data, "results":linkResults(response.data.id)}
          );
          console.log($scope.questions);

        }

        function failure(response){
          if(response.status == 404){
            console.log("No question found.");
          }
          else{
            console.log("Failed: " + response.status);
          }
        }
      }

      $scope.backBtnClick = function () {
        $location.path('/results');
      }

    }]);