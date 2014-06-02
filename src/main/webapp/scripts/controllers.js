'use strict';

/* Custom Controllers 
 * Service can be used to share data betweeen views http://stackoverflow.com/questions/12574765/better-design-for-passing-data-to-other-ng-views-in-angularjs-persisting-it-ac
 * Or pass parameter using /suite/:suiteId and access as $routeParams.suiteId
*/
jhipsterApp.controller('ProjectController', ['$scope', '$http', 'ProjectService',
    function ($scope, $http, ProjectService) {
	$scope.updateProjectId = function() {
		console.log("updateProjectId called");
		angular.forEach($scope.projects,function(value,index){
			console.log("$scope.projects applied");
			if(value.projectName.trim().toUpperCase() == $scope.suite.project.projectName.trim().toUpperCase()){
				$scope.suite.project.projectId = value.projectId;
				console.log(value.projectId);
			}
        });
	};
	
	$scope.addSuite = function() {
		$http.post("app/rest/suite", $scope.suite)
			.success(function(data) {
				console.log(data);
				$scope.refresh();
			});
	};
	
	$scope.refresh = function() {
        // TODO: hard code RIQ project as current project for now
        $scope.projects = ProjectService.get();
        
        // Angular does not populate projects yet, so promise is empty and resolved is false
        $scope.projects.$promise.then(function(items){
        	angular.forEach(items,function(value,index){
    			if(value.projectName.trim().toUpperCase() == 'RIQ'){
    				$scope.project=value;
    				$scope.suites=value.suites;
    			}
            });
        });
    };
	
    $scope.refresh();
    
}]);


jhipsterApp.controller('SuiteController', ['$scope', '$http', '$routeParams', 'SuiteService',
     function ($scope, $http, $routeParams, SuiteService) {
	
	$scope.suiteId = $routeParams.suiteId;
	
	$scope.updateSuiteId = function() {
		console.log("updateSuiteId called");
		$scope.suites = SuiteService.get();
		
		// when suites gets evaluated, then find and match the suiteName
		$scope.suites.$promise.then(function(items){
			console.log("$scope.suites() applied, refreshing suite Id");
     		// for each suite
			angular.forEach(items,function(value,index){
				if(value.suiteName.trim().toUpperCase() == $scope.suite.suiteName.trim().toUpperCase()){
					$scope.suite = value;
					$scope.suite.suiteId = value.suiteId;
					console.log(value.suiteId);
					
					$scope.apply();
					$scope.refresh();	// get tests for this suite
				}
	        });
		});
	};
	
	$scope.refresh = function() {
		console.log("suite refresh(), getting tests for this suite");
		SuiteService.findById($scope.suiteId);
		
		/*$scope.suite = SuiteService.findById($scope.suite.suiteId);
         
         // Angular does not populate projects yet, so promise is empty and resolved is false
         $scope.suite.$promise.then(function(items){
        	console.log("$scope.suite() applied, refreshing tests");
     		$scope.tests = $scope.suite.tests;
         	console.log("$scope.tests available as:");
         	console.log($scope.tests);
         });
         
         $scope.apply();*/
    };
    
    $scope.refresh();
 }]);

jhipsterApp.controller('TestController', ['$scope', '$http', '$routeParams', 'TestService',
       function ($scope, $http, $routeParams, TestService) {
  	
  	$scope.testId = $routeParams.testId;
  	
  	$scope.refresh = function() {
  		console.log("test refresh(), getting test for this suite");
  		TestService.findById($scope.testId)
  			.then(function(data){
  				$scope.test = data;
  		  		console.log($scope.test);
  			});
     };
      
    $scope.refresh();
 }]);

/************ Default Controllers *************/

jhipsterApp.controller('MainController', ['$scope',
    function ($scope) {
    }]);

jhipsterApp.controller('AdminController', ['$scope',
    function ($scope) {
    }]);

jhipsterApp.controller('LanguageController', ['$scope', '$translate',
    function ($scope, $translate) {
        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };
    }]);

jhipsterApp.controller('MenuController', ['$scope',
    function ($scope) {
    }]);

jhipsterApp.controller('LoginController', ['$scope', '$location', 'AuthenticationSharedService',
    function ($scope, $location, AuthenticationSharedService) {
        $scope.rememberMe = true;
        $scope.login = function () {
            AuthenticationSharedService.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe,
                success: function () {
                    $location.path('');
                }
            });
        };
    }]);

jhipsterApp.controller('LogoutController', ['$location', 'AuthenticationSharedService',
    function ($location, AuthenticationSharedService) {
        AuthenticationSharedService.logout({
            success: function () {
                $location.path('');
            }
        });
    }]);

jhipsterApp.controller('SettingsController', ['$scope', 'Account',
    function ($scope, Account) {
        $scope.success = null;
        $scope.error = null;
        $scope.settingsAccount = Account.get();

        $scope.save = function () {
            Account.save($scope.settingsAccount,
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = 'OK';
                    $scope.settingsAccount = Account.get();
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        };
    }]);

jhipsterApp.controller('PasswordController', ['$scope', 'Password',
    function ($scope, Password) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.changePassword = function () {
            if ($scope.password != $scope.confirmPassword) {
                $scope.doNotMatch = "ERROR";
            } else {
                $scope.doNotMatch = null;
                Password.save($scope.password,
                    function (value, responseHeaders) {
                        $scope.error = null;
                        $scope.success = 'OK';
                    },
                    function (httpResponse) {
                        $scope.success = null;
                        $scope.error = "ERROR";
                    });
            }
        };
    }]);

jhipsterApp.controller('SessionsController', ['$scope', 'resolvedSessions', 'Sessions',
    function ($scope, resolvedSessions, Sessions) {
        $scope.success = null;
        $scope.error = null;
        $scope.sessions = resolvedSessions;
        $scope.invalidate = function (series) {
            Sessions.delete({series: encodeURIComponent(series)},
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = "OK";
                    $scope.sessions = Sessions.get();
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        };
    }]);

 jhipsterApp.controller('MetricsController', ['$scope', 'MetricsService', 'HealthCheckService', 'ThreadDumpService',
    function ($scope, MetricsService, HealthCheckService, ThreadDumpService) {

        $scope.refresh = function() {
            HealthCheckService.check().then(function(data) {
                $scope.healthCheck = data;
            });

            $scope.metrics = MetricsService.get();

            $scope.metrics.$get({}, function(items) {

                $scope.servicesStats = {};
                $scope.cachesStats = {};
                angular.forEach(items.timers, function(value, key) {
                    if (key.indexOf("web.rest") != -1) {
                        $scope.servicesStats[key] = value;
                    }

                    if (key.indexOf("net.sf.ehcache.Cache") != -1) {
                        // remove gets or puts
                        var index = key.lastIndexOf(".");
                        var newKey = key.substr(0, index);

                        // Keep the name of the domain
                        index = newKey.lastIndexOf(".");
                        $scope.cachesStats[newKey] = {
                            'name': newKey.substr(index + 1),
                            'value': value
                        };
                    }
                });
            });
        };

        $scope.refresh();

        $scope.threadDump = function() {
            ThreadDumpService.dump().then(function(data) {
                $scope.threadDump = data;

                $scope.threadDumpRunnable = 0;
                $scope.threadDumpWaiting = 0;
                $scope.threadDumpTimedWaiting = 0;
                $scope.threadDumpBlocked = 0;

                angular.forEach(data, function(value, key) {
                    if (value.threadState == 'RUNNABLE') {
                        $scope.threadDumpRunnable += 1;
                    } else if (value.threadState == 'WAITING') {
                        $scope.threadDumpWaiting += 1;
                    } else if (value.threadState == 'TIMED_WAITING') {
                        $scope.threadDumpTimedWaiting += 1;
                    } else if (value.threadState == 'BLOCKED') {
                        $scope.threadDumpBlocked += 1;
                    }
                });

                $scope.threadDumpAll = $scope.threadDumpRunnable + $scope.threadDumpWaiting +
                    $scope.threadDumpTimedWaiting + $scope.threadDumpBlocked;

            });
        };

        $scope.getLabelClass = function(threadState) {
            if (threadState == 'RUNNABLE') {
                return "label-success";
            } else if (threadState == 'WAITING') {
                return "label-info";
            } else if (threadState == 'TIMED_WAITING') {
                return "label-warning";
            } else if (threadState == 'BLOCKED') {
                return "label-danger";
            }
        };
    }]);

jhipsterApp.controller('LogsController', ['$scope', 'resolvedLogs', 'LogsService',
    function ($scope, resolvedLogs, LogsService) {
        $scope.loggers = resolvedLogs;

        $scope.changeLevel = function (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                $scope.loggers = LogsService.findAll();
            });
        }
    }]);

jhipsterApp.controller('AuditsController', ['$scope', '$translate', '$filter', 'AuditsService',
    function ($scope, $translate, $filter, AuditsService) {
        $scope.onChangeDate = function() {
            AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function(data){
                $scope.audits = data;
            });
        };

        // Date picker configuration
        $scope.today = function() {
            // Today + 1 day - needed if the current day must be included
            var today = new Date();
            var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1); // create new increased date

            $scope.toDate = $filter('date')(tomorrow, "yyyy-MM-dd");
        };

        $scope.previousMonth = function() {
            var fromDate = new Date();
            if (fromDate.getMonth() == 0) {
                fromDate = new Date(fromDate.getFullYear() - 1, 0, fromDate.getDate());
            } else {
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
            }

            $scope.fromDate = $filter('date')(fromDate, "yyyy-MM-dd");
        };

        $scope.today();
        $scope.previousMonth();
        
        AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function(data){
            $scope.audits = data;
        });
    }]);

