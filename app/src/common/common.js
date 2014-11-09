angular.module('fdCommon', [])


//Mock baseService which will call storage instead
.factory('baseService', ['$http', '$q','$timeout', 'storage', function ($http, $q, $timeout, storage) {
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
            return this.getMock(url);
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
            return this.postMock(url, resource);
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

    /*
    GetMock will simulate a http request by doing a timeout, a promise
    is returned , and after the timeout the promise is resolved. The 
    mock data is retrieved from local storage.
    */
    getMock: function(url) {
        var deferred = $q.defer();
        $timeout(function () {
            u = url.split('/');
            key = u[1]
            element = u[2] || undefined;
            deferred.resolve(storage.get(key, element));
        }, 200);
        return deferred.promise;
    },

    postMock: function(url, resource) {
        var deferred = $q.defer();
        $timeout(function () {
            u = url.split('/');
            key = u[1]
            deferred.resolve(storage.post(key, resource));
        }, 200);
        return deferred.promise;
    },
    };

}])

.factory('backend', ['$http', '$q', 'storage', function ($http, $q, storage) {
    return {
        init: function() {
            this.load('/data/recipes.json')
            .then(function(data) {
                storage.setData('recipe', data);
            });
            this.load('/data/groups.json')
            .then(function(data) {
                storage.setData('group', data);
            });
            this.load('/data/users.json')
            .then(function(data) {
                storage.setData('user', data);
            });
        },

        load: function(url) {
            var deferred = $q.defer();
            $http.get(url).success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
    };
}])  
.factory('storage', ['$window',  function ($window) {
    return {

        get: function(key, id) {
            if(id === undefined) {
                return this.getData(key);
            }
            else {
                return this.getData(key)[id];
            }
        },

        post: function(key, data) {
            if(key==='recipe') {
                this.addRecipe(data);
            }
        },
        //On application load all json data should be loaded into storage,
        //and storage will be used by baseService the retrieve mocked backend resources
        addRecipe: function(recipe, user) {
            //Need to append recipe to users posted recipes
            this.appendData('recipe', recipe)
        },

        appendData: function(key, data) {
            datalist = this.getData(key);
            if(datalist === undefined) {
                datalist = [];
            }
            data['id'] = datalist.length;
            datalist.push(data);
            this.setData(key, datalist);
        },

        setData: function(key, val) {
          $window.localStorage && $window.localStorage.setItem(key, JSON.stringify(val));
          return this;
        },
        getData: function(key) {

            return $window.localStorage && JSON.parse($window.localStorage.getItem(key));
        }
    };
}]);