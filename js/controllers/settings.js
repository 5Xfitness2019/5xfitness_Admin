 

    app.controller('SettingsCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config','$filter', '$timeout','localStorageService', '$rootScope',
    '$stateParams','$uibModal','Notification',  function ($scope, $http, appSerivce, dialogService, $state, config, $filter, $timeout, localStorageService, $rootScope, $stateParams,$uibModal,Notification ) {
      $scope.settingsData = [];
      $scope.validationError1 = '';
      $scope.successMsg1 = '';      
      $scope.sessionVal = appSerivce.getLocalStore();


          
      $scope.getSettings = function(){
        $http.get(config.apiUrl + "fivex/getSettings", {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
          params: { 'search': $scope.search }
        }).then(function (res) {
          if (res.data.status) {
            $scope.settingsData = res.data.result[0];
          } else {
            dialogService.showAlert(null, "5X", "No data found");
          }
        }, function (err) {
          dialogService.showAlert(null, "5X ", "Server Error.");
        })

        
       
      }

      $scope.updateSettings = function(){

        if($scope.settingsData.admin_email != '' ){
          console.log($scope.settingsData);
          config.postReq("fivex/saveSettings",$scope.settingsData, false)
          .then(function(res){
              console.log(res.data);
              $scope.validationError1 = "";
  
              if(res.data.status){
                $scope.successMsg1 = "Updated successfully";
              }else{
                //dialogService.showAlert(null, "5X", "No data found");
              }
          }, function(err){
              dialogService.showAlert(null, "5X", "Server Error.");
          })
        }else{
          $scope.successMsg1 = '';
          $scope.validationError1 = "Fields cannot be null";
        }
        
      }
      
      $scope.changePasswordPop = function(){
        $scope.modelPop = $uibModal.open({
          ariaLabelledBy: 'modal-title-top',
          ariaDescribedBy: 'modal-body-top',
          templateUrl: 'html/change_password.html',
          scope: $scope,
          size: 'md'
        });
      }
      $scope.closeModal = function () {
          $scope.modelPop.close();
      }
      $scope.changePassword = function (oldpassword,newpassword,confirmpassword) {
        if(newpassword != confirmpassword){
          $scope.validationError1 = 'Password mismatch';
        }else{
          console.log(oldpassword);
          console.log(newpassword);
          $scope.setArray = { 'oldpassword': oldpassword, 'newPassword': newpassword };
          $http.post(config.apiUrl + "fivex/changePassword", $scope.setArray , {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
            transformRequest: function (data) {
                return $.param(data);
            }
        }).then(function (res) {
            console.log(res);
            if (res.data.status) {
                $scope.validationError1 = '';
                success_msessage(res.data.message);
                $scope.modelPop.close();
            } else {
                $scope.validationError1 = res.data.message;
            }
        }, function (err) {
            dialogService.showAlert(null, "5X", "Server Error."+err);
        })
        }
        


      }

    function success_msessage(message) {
        message = ` <strong>Success!</strong> ` + message;
        Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
    }

}]);