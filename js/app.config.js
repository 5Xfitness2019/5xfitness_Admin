var app = angular.module('app')
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', 'localStorageServiceProvider', '$sceDelegateProvider',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide, localStorageServiceProvider, $sceDelegateProvider) {

                //Local storage settings
                localStorageServiceProvider
                    .setPrefix('fivex')
                    .setStorageType('localStorage')
                    .setNotify(true, true);

                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;

                $sceDelegateProvider.resourceUrlWhitelist([
                    // Allow same origin resource loads.
                    'self',
                    // Allow loading from our assets domain. **.
                    'http://10.10.10.67:7071/**',
                    'http://newagesme.com:7071/**',
                    'http://demo.newagesme.com:7071/**',
                    'http://10.10.10.41:7071/**'
                ]);

            }
        ])

    //App configuaration
    .factory('config', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
        return {
            appName: '5X IT',
            appVersion: '1.0.0',
            apiUrl: 'http://10.10.10.41:7071/',
            siteUrl: 'http://10.10.10.41:7071/',
            // insuranceKey: 'pk_test_nbqABb72UyoDlLDumSh47U5U',
            // traditionalKey: 'pk_test_uuATPavEhcN8miUjUbbaOmd2',
            //apiUrl:'http://newagesme.com:7071/',
            //siteUrl:'http://newagesme.com:7071/',
            // apiKey: '45872712',        
            postReq: function (url, data, isTokenRequired) {
                // var loggedUserInfo = appSerivce.getLocalStore();
                var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
                //if(isTokenRequired)
                //headers['x-access-token'] = loggedUserInfo.token;
                return $http.post(this.apiUrl + url, data, {
                    headers: headers,
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                });
            },
            getReq: function (url, data, isTokenRequired) {
                //var loggedUserInfo = appSerivce.getLocalStore();               
                var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
                //if(isTokenRequired)
                //headers['x-access-token'] = loggedUserInfo.token;
                return $http.get(this.apiUrl + url, {
                    params: data,
                    headers: headers
                });
            },
            fileUpload: function (url, fd, isTokenRequired) {
                //var loggedUserInfo = appSerivce.getLocalStore();
                headers = { 'Content-Type': undefined };
                //if(isTokenRequired)
                //headers['x-access-token'] = loggedUserInfo.token;
                return $http.post(this.apiUrl + url, fd, {
                    transformRequest: angular.identity,
                    headers: headers
                });
            }
            // multipleReq: function(urlArray){
            //     var self = this;
            //     var loggedUserInfo = appSerivce.getLocalStore();
            //     var headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
            //     var promiseArray = [];
            //     angular.forEach(urlArray, function(item, index){
            //         if(item.token){
            //             headers['x-access-token'] = loggedUserInfo.token;                    
            //         }

            //         if(item.method == 'post'){
            //             promiseArray[index] = $http.post(self.apiUrl + item.url, item.data, {
            //                 headers: headers,
            //                 transformRequest: function(data){
            //                     return $.param(data);
            //                 }
            //             });

            //         }else if(item.method == 'get'){
            //             promiseArray[index] = $http.get(self.apiUrl + item.url, {
            //                 params: item.data,
            //                 headers: headers                        
            //             });
            //         }
            //     });            
            //     return $q.all(promiseArray);
            // }
        }
    }])

console.log(window.location.protocol);
// if(window.location.protocol=='http:'){
//     //App configuaration
//     app.constant('config', {
//         appName: 'Maintain IT',
//         appVersion: '1.0.0',
//         apiUrl: 'http://10.10.10.67:3000/'
//     })
// }else{
//     app.constant('config', {
//     appName: 'Maintain IT',
//     appVersion: '1.0.0',
//     apiUrl: 'http://newagesme.com:3030/'
// })

// }

//UI-Route change success event
app.run(['$rootScope', 'localStorageService', "$state","$location", function ($rootScope, localStorageService, $state,$location) {
    $rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
        $rootScope.currentRouteName = toState.name;
        if (localStorageService.get('isLoggedin') != 'true' &&
            toState.name != 'register' &&
            toState.name != 'login' &&
            toState.name != 'subscription' &&
            toState.name != 'payment' &&
            toState.name != 'forgot_password' &&
            toState.name != 'verify' &&
            toState.name != 'reset') {
            //$state.go("login");
        }

        if (!localStorage['fivex.token']) {

            $location.path('/login')
        }
        e.preventDefault();
    })
}])

app.controller("globalCtrl", ['appSerivce', '$rootScope', '$state', '$scope', 'config', function (appSerivce, $rootScope, $state, $scope, config) {
    $rootScope.loggedUserInfo = appSerivce.getLocalStore();
    $rootScope.apiUrl = config.apiUrl;
    $rootScope.randno = Math.floor((Math.random() * 1000) + 1);
    $scope.logout = function () {
        appSerivce.logout();
        $state.go('login');
    }

}])

app.directive("agreeterms", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.on("click", function (e) {
                scope.updateAgreeTerms(this.checked);
            })
        }
    }
})
app.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);

            element.bind('change', onChangeFunc);

        }
    };
})
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {

                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('scrollToBottom', function ($timeout, $window) {
    return {
        scope: {
            scrollToBottom: "="
        },
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.$watchCollection('scrollToBottom', function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        element[0].scrollTop = element[0].scrollHeight;
                    }, 0);
                }

            });
        }
    };
});