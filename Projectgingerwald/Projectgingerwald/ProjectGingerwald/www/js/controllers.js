angular.module('starter.controllers', ['ngStorage'])


  .controller('LoginCtrl', function($scope, $ionicModal, $timeout, $http, $localStorage, $rootScope, $location) {

    var login_url =  $rootScope.apiEndpoint + 'authorization/oauth/token.php?';

    $scope.errorMessage = "";

    console.log($rootScope.apiEndpoint); 

    $scope.Login = function() {

       var config = {
            headers: {
                
                'Content-Type': 'application/x-www-form-urlencoded;'
            }
        };

         var data = {
            grant_type: 'password',
            username: $scope.email,
            password: $scope.password,
        };

        $http.POST(login_url, config, data)

        .success(function(response, status) {
          $localStorage.token = response.access_token;
          $location.path("/app/menu");
        })


        .error(function(response, status) {
          $scope.errorMessage = "An error happened, (status code: " + status + ")";
        });
    }

  

  })
  
 .controller('ScanCtrl', ['$scope', '$stateParams','$cordovaBarcodeScanner',
function ($scope, $stateParams, $cordovaBarcodeScanner) {
 $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            let url = $location.url(imageData.text);
            alert(imageData.text);
            window.open(url, '_system');
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };

}])

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


  .controller('DashboardCtrl', function($scope, $stateParams, $localStorage, $http, $rootScope, ionicDatePicker, $filter) {

    if (typeof $localStorage.token !== 'undefined') {


      var capitalize = function capitalizeFirstLetter(string) {

        return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
      };

      $scope.startDate =  new Date(2016, 1, 1);
      $scope.endDate =  new Date(2017,1,1);
     
      var datePickerUpdate = function () {
         $http({
          method: 'GET',
          url: $rootScope.apiEndpoint + '/api/getUserDashboard.php?token=' + $localStorage.token + '&report_from=' + $filter('date')($scope.startDate, 'yyyy-mm-dd') + '&report_to=' + $filter('date')($scope.endDate, 'yyyy-mm-dd')
        }).then(function successCallback(response) {
          console.log(response.data);
      
          var labels = [];
          var values = [];


          angular.forEach(response.data.Ingredients,
            function(value, key)
            {
              labels.push(capitalize(value.Ingredient.Name));
              values.push(value.Ingredient.Amount_g)
            });

          $scope.labelsIngredients = labels;
          $scope.dataIngredients = values;


          var labels = [];
          var values = [];


          angular.forEach(response.data.Nutrients,
            function(nutrient, key)
            {
            labels.push(nutrient.Nutrient.Name);
            values.push(nutrient.Nutrient.Amount_g)
            });

        $scope.labelsNutrients = labels;
          $scope.dataNutrients = values;


        }, function errorCallback(response) {

        })
      };



      $scope.DatePickerStart= function (val) {
        let StartDate = {
          callback: function (val) {  
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.startDate = new Date(val);
            datePickerUpdate();

          },
          from: new Date(2012, 1, 1),
          to: new Date(),
          inputDate: new Date(2016, 1, 1),
          mondayFirst: true,
          disableWeekdays: [],
          closeOnSelect: false,
          templateType: 'popup',
          dateFormat: 'yyyy/MM/dd'
        };
        ionicDatePicker.openDatePicker(StartDate);
      };

      $scope.DatePickerEnd = function (val) {
        var EndDate = {
          callback: function (val) {  
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.endDate = new Date(val);
            datePickerUpdate();

          },
          from: new Date(2016, 1, 1),
          to: new Date(2019,1,1),
          inputDate: new Date(2017,1,1),
          mondayFirst: true,
          disableWeekdays: [],
          closeOnSelect: false,
          templateType: 'popup',
          dateFormat: 'yyyy/MM/dd'
        };
        ionicDatePicker.openDatePicker(EndDate);
      };



      datePickerUpdate();

    }

    else
    {
     
       $location.path("/login");
    }

  });
