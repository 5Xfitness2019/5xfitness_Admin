'use strict';

// signup controller
app.controller('RegisterFormController', ['$scope', '$http', '$state', 'config', 'dialogService', '$stateParams', 'localStorageService', 'appSerivce',
function($scope, $http, $state, config, dialogService, $stateParams, localStorageService, appSerivce) {
    $scope.user = {};    
    $scope.authError = null;
    $scope.termsagree = true; 
    $scope.subscription = ($stateParams.subscription)?1:0;
    $scope.patient_id = ($stateParams.user_id)?$stateParams.user_id:'';
    $scope.sub_plans = [];

    var transform = function(data){
        return $.param(data);
    }

    $scope.updateAgreeTerms = function(value){
      $scope.termsagree = value;
    }

    if($scope.subscription){
      $http.get(config.apiUrl + "users/subscriptions",{
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
        if(response.data.status == "success"){
          $scope.sub_plans = response.data.result;         
        }else{
          dialogService.showAlert(null, "Medical One", response.data.error);  
        }
      }, function(err){
        dialogService.showAlert(null, "Medical One", "Server Error.");
      })
    }

    $scope.register = function($event) {      
      $scope.authError = null;
      if(!$scope.termsagree){
        dialogService.showAlert($event, "Medical One", "Please agree our terms and conditions.");
      }else{        
        appSerivce.showLoadingText($event);
        $http.post(config.apiUrl + 'users/register', $scope.user, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          transformRequest: transform
        })
        .then(function(response) {
          appSerivce.hideLoadingText($event, "Sign Up");          
          if ( response.data.status != 'success' ) {
            $scope.authError = response.data.error;
          }else{
            $state.go('subscription', {subscription: true, user_id: response.data.user_id});
          }
        }, function(x) {
          appSerivce.hideLoadingText($event, "Sign Up");
          $scope.authError = 'Server Error';
        });
      }
    }

    $scope.updateSubscription = function(sub_id){      
      $http.post(config.apiUrl + 'users/updateSubscription', {user_id: $scope.patient_id, sub_id: sub_id}, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          transformRequest: transform
        })
        .then(function(response) {          
          if ( response.data.status != 'success' ) {
            $scope.authError = response.data.error;
          }else{
            localStorageService.set('user', JSON.stringify(response.data.user));
            localStorageService.set('token', response.data.userToken);
            localStorageService.set('isLoggedin', 'true');
            $state.go('app.hos-patient-profile');
          }
        }, function(x) {
          $scope.authError = 'Server Error';
        });
    }

  }]);