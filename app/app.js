// application module depends on views, and components
angular.module('app', [
  'ngRoute',
  'environment',
  'app.authService',
  'app.nav',
  'app.home',
  'app.login',
  'app.class-list'

]).config(['$routeProvider', 'envServiceProvider', function ($routeProvider, envServiceProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});

  envServiceProvider.config({
    domains: {
      development: ["localhost"],
      production: ["24.70.42.226"]
    },
    vars: {
      development: {
        apiUrl: "//localhost:8080/api"
      },
      production: {
        apiUrl: "//24.70.42.226:8080/api"
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
