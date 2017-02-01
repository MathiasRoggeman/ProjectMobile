
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'chart.js', 'ionic-datepicker', 'ngSanitize', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, $localStorage) {

  $rootScope.apiEndpoint = "https://www.gingerwald.com/community/v2.1/";
  $rootScope.client_id = "GingerwaldUserApp12";
  $rootScope.client_secret = "OnLxDTzVXdcDA6blqG71j6wb7Kw7MNMqag08SaOXp9MFejnjffAwsxO7EsGdVcd2";

  // A method to check if a user is logged in or not
  $rootScope.isLoggedIn = function() {
      if(typeof $localStorage.token !== 'undefined') {
          return true;
      }else{
          return false;
      }
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app.menu', {
    url: '/menu',
    views: {
      'menuContent': {
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
      }
    },
  })

  .state('app.scan', {
    url: '/scan',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/scan.html',
        controller: 'ScanCtrl'
      }
    },
  })

  .state('app.scanned', {
    url: '/scanned',
    views: {
      'menuContent': {
        templateUrl: 'templates/scanned.html',
        controller: 'ScanCtrl'
      }
    },
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    },
  })


  $urlRouterProvider.otherwise('/app/menu');
})


.config(['$httpProvider', function ($httpProvider) {

  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
    var key, result = [];

    if (typeof data === "string")
      return data;

    for (key in data) {
      if (data.hasOwnProperty(key))
        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
    return result.join("&");
  });
}]);
