// application module depends on views, and components
angular.module('app', [
  'ngRoute',
  'environment',
  'app.authService',
  'app.nav',
  'dndLists',
  'app.home',
  'app.login',
  'app.class-list',
  'app.class-quizzes',
  'app.quiz-list',
  'app.quiz-questions',
  'app.question-list',
  'app.answers',
  'app.students',
  'app.results',
  'app.student-results',
  'app.feedback'

]).config(['$routeProvider', 'envServiceProvider', function ($routeProvider, envServiceProvider) {
  $routeProvider.otherwise({redirectTo: '/class-list'});

  envServiceProvider.config({
    domains: {
      development: ["localhost"],
      production: ["kidsapp.dufferin.sd73.bc.ca"]
    },
    vars: {
      development: {
        apiUrl: "//localhost:5000/api"
      },
      production: {
        apiUrl: "//kidsapp.dufferin.sd73.bc.ca:3000/api"
      }
    }
  });

  envServiceProvider.check();
}]).run(function ($rootScope, $location, authService) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if (!authService.isUserAuthenticated()) {
      // if not logged in, show login
      if (next.templateUrl === "views/login/login.html") {
      } else {
        $location.path("/home");
      }
    }
  });
});
