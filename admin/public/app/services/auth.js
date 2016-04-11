angular.module('AuthSrvc',[]).factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

   // create user variable
    var user = null;
    var role = null;
    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      getUserRole:getUserRole
    });
    
    function getUserStatus() {
      $http.post('/api/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
          role = data.role;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }
    function getUserRole (){
      return role;
    }


    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post('/api/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.post('/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(name,email,role, password) {

      // create a new instance of deferred
      var deferred = $q.defer();
      console.log(name + email + role)
      // send a post request to the server
      $http.post('/api/user/add',
        {name: name,email:email,role:role, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
}]);