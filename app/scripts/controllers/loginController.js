'use strict';

angular.module('ppnetApp')

.controller('LoginController', function($scope, $location, $routeParams, ppnetUser, ppnetConfig) {
  /* global hello, hello_phonegap, Fingerprint */
  $scope.LoginData = ppnetConfig.getLoginData();

  var isCordovaApp = $scope.isCordovaApp = !!window.cordova;


  $scope.fingerprintjsLogin = function() {
    var newUser = {
      id: new Fingerprint().get(),
      name: $scope.simple.name,
      provider: 'fingerprintjs'
    };
    //console.log(newUser);
    ppnetUser.logout();
    if (ppnetUser.login(newUser)) {
      $location.path('');
    }
  };
  $scope.simpleLogin = function() {
    var newUser = {
      id: $scope.simple.id.toString(),
      name: $scope.simple.name,
      provider: 'simple'
    };
    ppnetUser.logout();
    if (ppnetUser.login(newUser)) {
      $location.path('');
    }
  };

  // Logs the User out if second url parameter is 'logout'
  if ($routeParams.task === 'logout') {
    hello().logout();
    ppnetUser.logout();
  }

  var redirect_uri = (isCordovaApp) ? 'http://www.tobias-rotter.de/ppnet/redirect.html' : 'index.html';
  var fiware = '320';
  var facebook = '758204300873538';
  var google = '971631219298-dgql1k3ia1qpkma6lfsrnt2cjevvg9fm.apps.googleusercontent.com';
  var github = 'c6f5cd8c081419b33623';
  var windows = '0000000048117AB3';

  if (isCordovaApp) {
    hello_phonegap.init({
      facebook: facebook,
      fiware: fiware,
      google: google,
      github: github,
      windows: windows
    }, {
      redirect_uri: redirect_uri
    });
    hello_phonegap.on('auth.login', function(auth) {
      // call user information, for the given network
      hello_phonegap(auth.network).api('/me').success(function(r) {

        var userdata = {
          id: auth.network + '_' + r.id,
          name: r.name,
          provider: auth.network
        };
        ppnetUser.login(userdata);
      });
    });
  } else {
    hello.init({
      facebook: facebook,
      fiware: fiware,
      google: google,
      github: github,
      windows: windows
    }, {
      redirect_uri: redirect_uri
    });
    hello.on('auth.login', function(auth) {
      // call user information, for the given network
      hello(auth.network).api('/me').success(function(r) {

        var userdata = {
          id: auth.network + '_' + r.id,
          name: r.name,
          provider: auth.network
        };
        ppnetUser.login(userdata);
      });
    });
  }



});