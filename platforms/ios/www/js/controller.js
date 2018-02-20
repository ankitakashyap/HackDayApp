angular.module('starter.controllers', ['ngCordova','monospaced.qrcode', 'chart.js', 'app.directives', 'angular.filter'])

.service('bkgShoppingCart', function($http, $rootScope) {
	$rootScope.url = "http://52.86.109.77:8081";
	this.bkgUpdateItems = function(){
		var urlService = $rootScope.url+"/getCart?cartID="+$rootScope.groupID;
		var testURL = "http://52.86.109.77:8081/getCart?cartID=9237326742";
		this.ajax = $http.get(urlService);
		this.ajax.success(function(response) {
			//$scope.responseData = response.data;
			$rootScope.shoppingCart = [];
			//alert(response.data);
			angular.forEach(response.data, function(value, key){
				  console.log(value);
				  if(item.status!=null)
                  	$rootScope.shoppingCart.push(item);   
             });
			
			
			//$rootScope.shoppingCart = $scope.responseData;
			//alert($scope.responseData);
			return true;
		});
		
	}
})



.controller("createGroupController", function($rootScope, $scope, $state, $http, $cordovaSocialSharing) {
	$rootScope.url = "http://52.86.109.77:8081";
	if($rootScope.groupID==null || $rootScope.groupID==0)
		$rootScope.groupID = (Math.random()*89821312*1000000000).toLocaleString('en-US', {minimumIntegerDigits: 10, maximumFractionDigits: 10, useGrouping:false});
	
	$scope.gotoHome = function(){
			$state.go("home");
	}
	
	$scope.createGroup = function(){
		//52.86.109.77:8081/AddGroup?QRString=1412423142314123&userID=1
		var urlService = $rootScope.url+"/AddGroup?groupID="+$rootScope.groupID+"&userID="+$rootScope.userID;
		$http.get(urlService)
		.then(function(response) {
			$scope.responseData = response.data;
			//alert($scope.responseData);
		});
	}
	
	$scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("Please join my group for shopping together.", "SyncCart VA - invitation", "img/SyncCartVA4.png", "https://www.walmart.com");
    }
	
	$scope.createGroup();
})


.controller("loginController", function($rootScope, $scope, $state) {
	
	$scope.login = function() {
        $state.go("home");
    }
})

.controller("shoppingCartController", function($rootScope, $scope, $cordovaBarcodeScanner, $ionicPlatform, $state, $interval, $http, bkgShoppingCart) {
	//$rootScope.UPCs=[];
	//$rootScope.UPCs.push(123);
	$rootScope.url = "http://52.86.109.77:8081";
	$scope.UPC = "";
	
	$scope.gotoHome = function(){
			$state.go("home");
			$interval.cancel(bkgRefresh);
	}
	$scope.gotoCheckOut = function(){
			$state.go("checkOut");
			$interval.cancel(bkgRefresh);
	}
	
	$scope.scan = function(){
             $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        $scope.UPCs = result.text;
						
						$rootScope.UPCs.push(result.text);
						var serviceURL = $rootScope.url+"/addItem?cartID="+$rootScope.groupID+"&upc="+result.text+"&quantity=1&userID="+$rootScope.userID;
						$http.get(serviceURL)
						.then(function(response) {
							$scope.responseData = response.data;
						});
						//alert(serviceURL);
						//$state.go('shoppingCart');
                    }, function(error) {
                        // An error occurred
						alert("ERROR");
                        $scope.scanResults = 'Error: ' + error;
                    });
           });
        };
	
	
	
	$scope.updateItems = function(){
		var urlService = $rootScope.url+"/getCart?cartID="+$rootScope.groupID;
		var testURL = "http://52.86.109.77:8081/getCart?cartID=1283787817";
		$http.get(urlService)
		.then(function(response) {
			$scope.responseData = response.data;
			$rootScope.shoppingCart = [];
			$rootScope.itemCount = 0;
			$rootScope.totalPrice = 0;
			//alert(response.data);
			angular.forEach($scope.responseData, function(value, key){
				  console.log(value);
				  if(key!="status"){
                  	$rootScope.shoppingCart.push(value);  
					$rootScope.itemCount+=parseInt(value.quantity);
					$rootScope.totalPrice+=parseInt(value.price)*parseInt(value.quantity);
				}
             });
			
			
			$rootScope.shoppingCart = $scope.responseData;
			//alert($scope.responseData);
		});
	}
	
	var bkgRefresh = $interval($scope.updateItems, 1000); 
	//var bkgRefresh = $interval(bkgShoppingCart.bkgUpdateItems, 3000); 
	/*
	var bkgRefresh = $interval(function(){
		var urlService = $rootScope.url+"/getCart?cartID="+$rootScope.groupID;
		var testURL = "http://52.86.109.77:8081/getCart?cartID=1283787817";
		$http.get(testURL)
		.then(function(response) {
			$scope.responseData = response.data;
			$rootScope.shoppingCart = [];
			//alert(response.data);
			angular.forEach($scope.responseData, function(value, key){
				  console.log(value);
				  if(item.status!=null)
                  	$rootScope.shoppingCart.push(item);   
             });
			
			
			$rootScope.shoppingCart = $scope.responseData;
			//alert($scope.responseData);
		});
	},1000);
	*/
})

.controller("checkOutController", function($rootScope, $scope, $state, $http) {
	//$rootScope.UPCs=[];
	//$rootScope.UPCs.push(123);
	$scope.UPC = "";
	$scope.gotoConfirmation = function(){
		$scope.validateCartStatus();
		$scope.validateCartStatus();
		if($scope.flag){
			var urlService = $rootScope.url+"/checkout?cartID="+$rootScope.groupID+"&userID="+$rootScope.userID;
			var testURL = "http://52.86.109.77:8081/checkout?cartID=1283787817&userID=Akhil";
			$http.get(urlService)
			.then(function(response) {
				$state.go("confirmation");
			});
		}
		else
			alert("Good news, Cart has been checked out!!!");
	}
	
	$scope.gotoHome = function(){
			$state.go("home");
	}
	
	$scope.validateCartStatus = function(){
		var urlService = $rootScope.url+"/getCart?cartID="+$rootScope.groupID;
		var testURL = "http://52.86.109.77:8081/getCart?cartID=1283787817";
		$http.get(urlService)
		.then(function(response) {
			if(response.data.status=="InProgress")
				$scope.flag=true;
			else
				$scope.flag=false;
		});
	}
	
})

.controller("confirmationController", function($rootScope, $scope, $state) {
	//$rootScope.UPCs=[];
	//$rootScope.UPCs.push(123);
	$scope.UPC = "";
	
	$scope.gotoHome = function(){
			$state.go("home");
	}
})


.controller("QRController", function($scope, $cordovaBarcodeScanner, $rootScope, $ionicPlatform, $state, $http) {
		$rootScope.url = "http://52.86.109.77:8081";
		$rootScope.UPCs=[];
		
	
		$scope.labels = ["Mobile Order", "In-Store Order", "On-line Order"];
  		$scope.data = [300, 500, 100];	
		
	
        $scope.scan = function(){
             $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        $scope.scanResults = "We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled;
						//$rootScope.QRCode = result.text;
						$rootScope.groupID = result.text;
						//$state.go('joinGroup');
						
							//52.86.109.77:8081/AddGroup?QRString=1412423142314123&userID=1
							var urlService = $rootScope.url+"/AddGroup?groupID="+$rootScope.groupID+"&userID="+$rootScope.userID;
							$http.get(urlService)
							.then(function(response) {
								$scope.responseData = response.data;
								if($scope.responseData.error!=null)
									alert($scope.responseData.decription);
							});
						
                    }, function(error) {
                        // An error occurred
                        $scope.scanResults = 'Error: ' + error;
                    });
           });
        };
	
		$scope.scanAndGo = function(){
             $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        $scope.UPCs = result.text;
						
						$rootScope.UPCs.push(result.text);
						var serviceURL = $rootScope.url+"/addItem?cartID="+$rootScope.groupID+"&upc="+result.text+"&quantity=1&userID="+$rootScope.userID;
						$http.get(serviceURL)
						.then(function(response) {
							$scope.responseData = response.data;
						});
						alert(serviceURL);
						$state.go('shoppingCart');
                    }, function(error) {
                        // An error occurred
						alert("ERROR");
                        $scope.scanResults = 'Error: ' + error;
                    });
           });
        };
	
	
		$scope.gotoCreateGroup = function(){
			$state.go("createGroup");
		}
		
		$scope.gotoShoppingCart = function(){
			$state.go("shoppingCart");
		}
		
		$scope.speechData = {
			speechText: ''
		  };
		  $scope.recognizedText = '';

		  $scope.speakText = function() {
			//$scope.speechData.speechText = Math.random()*89821312;
			TTS.speak({
				   text: "Glad to help "+$scope.speechData.speechText,
				   locale: 'en-GB',
				   rate: 0.9
			   }, function () {
				   // Do Something after success
			   }, function (reason) {
				   // Handle the error case
			   });
		  };
	
	
	
	

		  $scope.record = function() {
			  $ionicPlatform.ready(function() {
				  //var recognition = new webkitSpeechRecognition(); //To Computer
				var recognition = new SpeechRecognition(); // To Device
				recognition.lang = 'en-US';

				recognition.onresult = function(event) {
					if (event.results.length > 0) {
						$scope.recognizedText = event.results[0][0].transcript;
						$scope.$apply();
						
						if( ($scope.recognizedText.indexOf("where") != -1) || ($scope.recognizedText.indexOf("how") != -1) || ($scope.recognizedText.indexOf("get") != -1) || ($scope.recognizedText.indexOf("want") != -1)){
							var aisleNum = 10;
							if($scope.recognizedText.indexOf("milk") != -1 )
								aisleNum = 10;
							if($scope.recognizedText.indexOf("bread") != -1 )
								aisleNum = 12;
							if($scope.recognizedText.indexOf("diaper") != -1 )
								aisleNum = 15;
							$scope.speechData.speechText = "The item you asked for is in Aisle "+aisleNum;
							$scope.speakText();
						}
						if($scope.recognizedText.indexOf("help") != -1){
							$scope.speechData.speechText = "Please wait in current location, an associate will be there in 1 minute";
							$scope.speakText();
						}
						
					}
				};

				recognition.start();

				});
			    
		  }
		  
		  $scope.login = function(){
			  $state.go("login");
		  }
		
        $scope.scanResults = '';
});