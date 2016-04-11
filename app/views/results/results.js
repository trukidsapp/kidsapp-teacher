angular.module('app.results', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/results/', {
      templateUrl: 'views/results/results.html',
      controller: 'ResultsController'
    });
  }])

  .controller('ResultsController', [
    '$http',
    '$scope',
    '$location',
    'authService',
    'envService',
    '$routeParams',
    function ($http, $scope, $location, authService, envService, $routeParams) {
      var teacherId = authService.getTokenUser().username;
      getClasses();

      $scope.students = [];
      var test = [];


      function getClasses() {
        $http
          .get('http:' + envService.read('apiUrl') + '/teachers/' + teacherId + '/classes', {
            headers: authService.getAPITokenHeader()
          }).then(classesRetrieveSuccess, classRetrieveFailure);
      }

      function classesRetrieveSuccess(response) {
        //console.log(response);
        $scope.classes = response.data;
        console.log("Number of classes: " + $scope.classes.length);
        getStudentsInClasses($scope.classes.length);
      }

      function classRetrieveFailure(response) {
        if (response.status == 404) {
          console.log('no classes found');
          $scope.classes = [];
        }
        else {
          console.log('failed' + response.status);
        }
      }

      function getStudentsInClasses(numberOfClasses){
        for(var x = 0; x<numberOfClasses; x++){
          $http
            .get('http:' + envService.read('apiUrl') + '/classes/' + $scope.classes[x].id + '/students', {
              headers: authService.getAPITokenHeader()
            }).then(getStudentsRetrieveSuccess, getStudentsRetrieveFailure);
        }

        function getStudentsRetrieveSuccess(response){
          console.log("RESPONSE " + response);
          console.log("RESPONSE DATA " + response.data);
          $scope.students.push(response.data);
          console.log($scope.students.length);
        }

        function getStudentsRetrieveFailure(response){
          if (response.status == 404) {
            console.log('no students found');
            $scope.students.push(0);
            console.log($scope.students);
          }
          else {
            console.log('failed' + response.status);
          }
        }
      }

      $scope.viewStudent

    }]);
