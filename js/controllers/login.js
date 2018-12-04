'use strict';

/* Controllers */
  // signin controller
app.controller('LoginFormController', ['$scope', '$http', '$state', 'config', 'localStorageService',
function($scope, $http, $state, config, localStorageService) {
    $scope.user = {'email':'','password':""};
    $scope.authError = null;
    

    $scope.login = function() {
      //$state.go('app.emoji_list');

      $scope.authError = null;
      // Try to login
      $http.post( config.apiUrl + 'fivex/login', {email: $scope.user.email, password: $scope.user.password},{
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function(data){
          return $.param(data);
        }
      })
      .then(function(response) {
        console.log(response.data);
        if ( response.data.status == false ) {
          $scope.authError = response.data.message;
        }else{   
            if(response.data.user.member_type==0)
            {
                localStorageService.set('user', JSON.stringify(response.data.user));
                localStorageService.set('token', response.data.userToken);
                localStorageService.set('password',$scope.user.password);
                localStorageService.set('isLoggedin', 'true');
                $state.go('app.dashboard');               
            }else{
               $scope.authError = 'Invalid login details';
            }
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });

    };  

  }]);