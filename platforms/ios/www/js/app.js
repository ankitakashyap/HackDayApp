// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'QRController'
            })
		
            .state('createGroup', {
                url: '/createGroup',
                templateUrl: 'templates/createGroup.html',
                controller: 'createGroupController'
            })
            .state('joinGroup', {
                url: '/joinGroup',
                templateUrl: 'templates/joinGroup.html',
                controller: 'joinGroupController'
            })
			.state('shoppingCart', {
                url: '/shoppingCart',
                templateUrl: 'templates/shoppingCart.html',
                controller: 'shoppingCartController'
            })
			.state('checkOut', {
                url: '/checkOut',
                templateUrl: 'templates/checkOut.html',
                controller: 'checkOutController'
            })
			.state('confirmation', {
                url: '/confirmation',
                templateUrl: 'templates/confirmation.html',
                controller: 'confirmationController'
            })
		    .state('login', {
			    url: '/login',
			    templateUrl: 'templates/login.html',
				controller: 'loginController'
		    })
		;
        $urlRouterProvider.otherwise('/');
})

;
