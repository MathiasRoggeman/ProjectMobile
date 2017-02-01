angular.module('starter.controllers', ['ngStorage'])


  .controller('LoginCtrl', function($scope, $ionicModal, $timeout, $http, $localStorage, $rootScope, $location) {

    var login_url =  $rootScope.apiEndpoint + 'authorization/oauth/token.php?';

    $scope.errorMessage = "";

    console.log($rootScope.apiEndpoint); 

    $scope.doLogin = function() {

       
        var data = {
            grant_type: 'password',
            username: $scope.email,
            password: $scope.password,
            client_id: $rootScope.client_id,
            client_secret: $rootScope.client_secret
        };

        console.log($scope.email);

        // Set config required for POST such as headers
        var config = {
            headers: {
                //'Content-Type': 'application/json;'
                'Content-Type': 'application/x-www-form-urlencoded;'
            }
        };

        // Do the actual POST using $http
        $http.post(login_url, data, config)

        .success(function(response, status) {
          console.log("Success! " + response.access_token);
          $localStorage.token = response.access_token;
          $location.path("/app/menu");
        })

        .error(function(response, status) {
          console.log("An error occured: " + status);
          $scope.errorMessage = "Een heeft zich een fout voorgedaan, (status code: " + status + ")";
        });
    }

  

  })


  .controller('MenuCtrl', function($scope, $stateParams, $localStorage, $location, $rootScope, $http) {

    if (typeof $localStorage.token !== 'undefined') {
        $http({
          method: 'GET',
          url: $rootScope.apiEndpoint + '/api/getUserDetails.php?token=' + $localStorage.token
        }).then(function successCallback(response) {
          $scope.user = response.data.User;
      
        }, function errorCallback(response) {
         
            $location.path("/login");
        });
    }
    else
    {
     
       $location.path("/login");
    }

  })

 .controller('ScanCtrl', ['$scope', '$stateParams','$cordovaBarcodeScanner',
function ($scope, $stateParams, $cordovaBarcodeScanner) {
 $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            var url = $location.url(imageData.text);
            alert(imageData.text);
            window.open(url, '_system');
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };

}])

  .controller('DashboardCtrl', function($scope, $stateParams, $localStorage, $http, $rootScope, ionicDatePicker, $filter) {

    if (typeof $localStorage.token !== 'undefined') {


      var capitalize = function capitalizeFirstLetter(string) {

        return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
      };

      $scope.selectedDate1 =  new Date(2016, 1, 1);
      $scope.selectedDate2 =  new Date();


      var datePickerUpdate = function () {

        $http({
          method: 'GET',
          url: $rootScope.apiEndpoint + '/api/getUserDashboard.php?token=' + $localStorage.token + '&report_from=' + $filter('date')($scope.selectedDate1, 'yyyy-mm-dd') + '&report_to=' + $filter('date')($scope.selectedDate2, 'yyyy-mm-dd')
        }).then(function successCallback(response) {
          console.log(response.data);
      
          var labels = [];
          var amounts = [];


          angular.forEach(response.data.Ingredients,
            function(value, key)
            {
              labels.push(capitalize(value.Ingredient.Name));
              amounts.push(value.Ingredient.Amount_g)
            });

          $scope.labelsIngredients = labels;
          $scope.dataIngredients = amounts;


          var labels = [];
          var amounts = [];


          angular.forEach(response.data.Nutrients,
            function(nutrient, key)
            {
            labels.push(capitalize(nutrient.Nutrient.Name));
            amounts.push(nutrient.Nutrient.Amount_g)
            });

          console.log(labels);
          console.log(amounts);

          $scope.labelsNutrients = labels;
          $scope.dataNutrients = amounts;


        }, function errorCallback(response) {

        })
      };



      $scope.openDatePickerOne = function (val) {
        var ipObj1 = {
          callback: function (val) {  
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.selectedDate1 = new Date(val);
            datePickerUpdate();

          },
          from: new Date(2012, 1, 1),
          to: new Date(2018, 10, 30),
          inputDate: new Date(2016, 1, 1),
          mondayFirst: true,
          disableWeekdays: [],
          closeOnSelect: false,
          templateType: 'popup',
          dateFormat: 'yyyy-MM-dd'
        };
        ionicDatePicker.openDatePicker(ipObj1);
      };

      $scope.openDatePickerTwo = function (val) {
        var ipObj2 = {
          callback: function (val) {  
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.selectedDate2 = new Date(val);
            datePickerUpdate();

          },
          from: new Date(2012, 1, 1),
          to: new Date(2018, 10, 30),
          inputDate: new Date(),
          mondayFirst: true,
          disableWeekdays: [],
          closeOnSelect: false,
          templateType: 'popup',
          dateFormat: 'yyyy-MM-dd'
        };
        ionicDatePicker.openDatePicker(ipObj2);
      };



      datePickerUpdate();

    }

    else
    {
     
       $location.path("/login");
    }

  });
