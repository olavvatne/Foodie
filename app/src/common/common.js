angular.module('fdCommon', [])


.factory('baseService', ['$http', '$q','mockService', '$rootScope',
  function ($http, $q, mockService, $rootScope) {
    //When mock is set to true the call is routed to a mockService, that
    //simulate a real backend. Set to false, and the regular http request are
    //done.
    var mock = true;
    return {
    /**
     * A base get request, which all other resource services can utilize to
     * do a http get request, that returns a promise object.
     */
    getResources: function(url) {
        if(mock) {
            return mockService.getMock($rootScope.apiPath + url);
        }
        else {
        var deferred = $q.defer();
        $http.get(url).success(function(data){
            //Passing data to deferred's resolve function on successful completion
            deferred.resolve(data);
        }).error(function(error){

            //Sending a friendly error message in case of failure
            deferred.reject(error);
        });
        return deferred.promise;
        }
    },


    /**
      * A base post request. Other resource services can utilize this service
      * to do http request which will be resolved asynchronous by a returned
      * promise object.
     */
    postResource: function(url, resource) {
        if(mock) {
            return mockService.postMock($rootScope.apiPath + url, resource);
        }
        var deferred = $q.defer();
            console.log(resource)
        $http.post(url, resource).success(function(data){
            //Passing data to deferred's resolve function on successful completion
            deferred.resolve(data);
        }).error(function(error){
            console.log(error)
            //Sending a friendly error message in case of failure
            deferred.reject(error);
        });
        return deferred.promise;
    },


    /**
      * Base http put service method.
     */
    putResource: function(url, resource) {
        if(mock) {
          return mockService.putMock($rootScope.apiPath + url, resource);
        }
        var deferred = $q.defer();
        $http.post(url, resource).success(function(data){
            //Passing data to deferred's resolve function on successful completion
            deferred.resolve(data);
        }).error(function(error){

            //Sending a friendly error message in case of failure
            deferred.reject(error);
        });
        return deferred.promise;
    },

    /**
      Bae http delete service method
     */
    deleteResource: function(url) {
        var deferred = $q.defer();
        $http.delete($rootScope.apiPath + url).success(function(data){
            //Passing data to deferred's resolve function on successful completion
            deferred.resolve(data);
        }).error(function(error){

            //Sending a friendly error message in case of failure
            deferred.reject(error);
        });
        return deferred.promise;
    },


    };

}])

/*
  The storage service is a wrapper providing methods to interact with
  the browsers localstorage. Anything that is put into localStorage will
  be persisted as long as the browser is running. Ideal for mocking
  a backend or put data that should be persisted between user sessions.
*/
.factory('storage', ['$window',  function ($window) {
    return {

        /*
          Appends data in the key-value dictionary in localstorage.
        */
        appendData: function(key, data) {
            var datalist = this.getData(key);
            if(datalist === undefined) {
                datalist = [];
            }
            data['id'] = datalist.length;
            datalist.push(data);
            this.setData(key, datalist);
            return data['id'];
        },

        /*
          replace an element in an array, residing in local storage.
          The data in the key-value dictionary must be in Json format,
          and an array.
        */
        replaceData: function(key, data, idx) {
            var datalist = this.getData(key);
            datalist[idx] = data;
            this.setData(key, datalist)
        },

        /*
          Translate data (javascript array or object) into a json string
          and stored at the location specifed by the key, in the
        */
        setData: function(key, val) {
          $window.localStorage && $window.localStorage.setItem(key, JSON.stringify(val));
          return this;
        },
        /*
          Retrives data from local storage. Data is assumed to be JSON,
          and therefore able to be parsed into a javascript object.
        */
        getData: function(key) {

            return $window.localStorage && JSON.parse($window.localStorage.getItem(key));
        }
    };
}])

/*
Uses baseService to post login requests. Application context can also be set
by setContext, which put token into http request and put username and token
in the rootscope. This function also saves the credentials into localstorage
if a username and token is not undefined parameters. 
*/
.factory('sessionManager', ['baseService', '$rootScope', 'storage', '$http',
function (baseService, $rootScope, storage, $http) {
    return {
        postCredentials: function(credentials) {
        //Mocked backend
        var url = 'api/login/'
        return baseService.postResource(url, credentials);
        },

        setContext: function(user) {
            if(user === undefined || user=== null) {
                var cred = storage.getData('credentials');
                $rootScope.user = {};
                if(cred && cred.username && cred.token) {

                $rootScope.user = cred;
                $http.defaults.headers.common['X-AUTH-TOKEN'] = cred.token
                }
            }
            else {
                $rootScope.user = user;
                storage.setData('credentials', user)
                $http.defaults.headers.common['X-AUTH-TOKEN'] = user.token;
                
            }
        },
        destroyContext: function() {
            storage.setData('credentials', null);
            $rootScope.user = {};
        }
  } ;

}])

//show error after blur
.directive('ngFocus', [function() {
  var FOCUS_CLASS = "ng-focused";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$focused = false;
      element.bind('focus', function(evt) {
        element.addClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = true; ctrl.$dirty = true;});
      }).bind('blur', function(evt) {
        element.removeClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = false;});
      });
    }
  }
}])

.filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });;