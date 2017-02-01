angular.module('app.routes', [])

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
});