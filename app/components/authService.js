angular.module('app.authService', ['angular-jwt'])
  .factory('authService', function (jwtHelper, $rootScope) {


    return {

      login: function (token) {
        console.log("logging in");
        window.localStorage['auth'] = token;
        console.log(window.localStorage.getItem("auth"));

        $rootScope.$emit('loginStateChange', 'in');
      },

      logout: function () {
        console.log("logout");
        window.localStorage.removeItem('auth');

        $rootScope.$emit('loginStateChange', 'out');

      },

      getAPITokenHeader: function () {
        return {'api-token': window.localStorage['auth']};
      },

      getTokenUser: function () {
        var payload = jwtHelper.decodeToken(window.localStorage['auth']);
        console.log(payload);
        return {
          username: payload.username,
          userType: payload.userType
        }
      },

      isUserAuthenticated: function () {
        var token = window.localStorage['auth'];
        if (token) {
          //console.log(token);
          var expired = jwtHelper.isTokenExpired(token);
          if (expired) {
            console.log("token expired");
            this.logout();
            return false;
          }
          console.log("authenticated");
          return true;
        }
        console.log("not authenticated");
        return false;
      }
    }
  });