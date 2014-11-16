angular.module('fdCommon', [])


//Mock baseService which will call storage instead
.factory('baseService', ['$http', '$q','mockService',  function ($http, $q, mockService) {
    mock = true;
    return {
    /**
     * @ngdoc method
     * @name fdCommon.service#getResources
     * @methodOf fdCommon.baseService
     * @param {String} url  The url for resources.
     * @description Gets an JSON array containing a list of a specific resource.
     * @returns {JSON object} A list containing a subset resources.
     */
    getResources: function(url) {
        if(mock) {
            return mockService.getMock(url);
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
     * @ngdoc method
     * @name fdCommon.service#postResource
     * @methodOf fdCommon.baseService
     * @param {String} url. The url where resource should be posted.
     * @param {JSON object} resource. The resource in JSON form.
     * @description Posts the resource to the back end.
     * @returns {JSON object} A success message (If promise is resolved)
     */
    postResource: function(url, resource) {
        if(mock) {
            return mockService.postMock(url, resource);
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
     * @ngdoc method
     * @name fdCommon.service#putResource
     * @methodOf fdCommon.baseService
     * @param {String} url. The url where resource should be put/updated.
     * @param {JSON object} resource. The resource in JSON form.
     * @description Puts the resource to the back end.
     * @returns {JSON object} A success message (If promise is resolved)
     */
    putResource: function(url, resource) {
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
     * @ngdoc method
     * @name fdCommon.service#deleteResource
     * @methodOf fdCommon.baseService
     * @param {String} url  The url of resource.
     * @description Removes/deletes the resource at url at the back end.
     * @returns {JSON object} An JSON message containing answer.
     */
    deleteResource: function(url) {
        var deferred = $q.defer();
        $http.delete(url).success(function(data){
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


.factory('storage', ['$window',  function ($window) {
    return {

        
        appendData: function(key, data) {
            var datalist = this.getData(key);
            if(datalist === undefined) {
                datalist = [];
            }
            data['id'] = datalist.length;
            datalist.push(data);
            this.setData(key, datalist);
        },
        replaceData: function(key, data, idx) {
            var datalist = this.getData(key);
            datalist[idx] = data;
            this.setData(key, datalist)
        },
        setData: function(key, val) {
          $window.localStorage && $window.localStorage.setItem(key, JSON.stringify(val));
          return this;
        },
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

.filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });;