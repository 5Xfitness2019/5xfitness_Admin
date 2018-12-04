'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .config(
        ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
            function ($stateProvider, $urlRouterProvider, JQ_CONFIG) {

                
                // if (!localStorage['fivex.token'] ) {
                    
                    
                //         console.log('DENY : Redirecting to Login');
                //         $urlRouterProvider.rule(function ($injector, $location) {
                //             $location.path('/login')
                              
                //           });
                     
                    
                 
                // }
                $urlRouterProvider
                    .otherwise('login');

                $stateProvider
                    .state('login', {
                        abstract: false,
                        url: "/login",
                        templateUrl: 'html/ui-login.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/controllers/login.js').then(
                                        function () {
                                            return $ocLazyLoad.load('../bower_components/font-awesome/css/font-awesome.css');
                                        }
                                    )
                                }
                            ]
                        }
                    })

                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'partials/app.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/services/app-service.js']);
                                }
                            ]
                        }
                    })
                    .state('app.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'html/dashboard.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/dashboard.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })

                    .state('app.settings', {
                        url: '/settings',
                        templateUrl: 'html/settings.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/settings.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })

                    .state('app.chatroom', {
                        url: '/chatroom',
                        templateUrl: 'html/chat.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/chat.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.chatdetails', {
                        url: '/chatdetails/:group_id',
                        templateUrl: 'html/chatdetails.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/chat.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })

                    .state('app.workouts', {
                        url: '/workouts',
                        templateUrl: 'html/workouts.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/workouts.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })

                    .state('app.workout_details', {
                        url: '/workout_details/:workout_id',
                        templateUrl: 'html/workout_details.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/workouts.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.users', {
                        url: '/users',
                        templateUrl: 'html/users.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/users.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.user_details', {
                        url: '/user_details/:member_id',
                        templateUrl: 'html/user_details.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/users.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.cms', {
                        url: '/cms',
                        templateUrl: 'html/cmslist.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/cms.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
 
                    .state('app.cmsdetails', {
                        url: '/cmsdetails/:cms_id',
                        templateUrl: 'html/cms.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/cms.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.subscriptions', {
                        url: '/subscriptions',
                        templateUrl: 'html/subscription.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/users.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.category', {
                        url: '/category',
                        templateUrl: 'html/category.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/category.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })
                    .state('app.subcategory', {
                        url: '/subcategory',
                        templateUrl: 'html/subcategory.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/functions/category.js', 'js/services/app-service.js', 'js/services/dialog-service.js', '../bower_components/font-awesome/css/font-awesome.css']);
                                }
                            ]
                        }
                    })

            }
        ]
    );
