app.controller('DashboardCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config',
    function ($scope, $http, appSerivce, dialogService, $state, config) {

        $scope.sessionVal = appSerivce.getLocalStore();
        $scope.counts = [];
        $scope.count =0;
        $scope.getDashboard = function(){
            $http.get(config.apiUrl + "fivex/getDashboardCounts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: {}
            }).then(function (res) {
                if (res.data.status) {
                    $scope.counts = res.data.data[0];
                } else {
                    $scope.counts = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "Surgerize IT ", "Server Error.");
            })
        }



    }]);
