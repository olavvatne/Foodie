angular.module('fdCommon', []).
factory('baseService', ['$http', '$q', function ($http, $q) {

    return {

    /**
     * @ngdoc method
     * @name fdCommon.service#getResources
     * @methodOf fdCommon.baseService
     * @param {String} url  The url for resources.
     * @description Gets an JSON array containing a list of a specific resource.
     * @returns {JSON object} A list containing a subset resources.
     */
    /*getResources: function(url) {
        var deferred = $q.defer();
        $http.get(url).success(function(data){
            //Passing data to deferred's resolve function on successful completion
            console.log('data'+ data);
            deferred.resolve(data);
        }).error(function(error){

            //Sending a friendly error message in case of failure
            deferred.reject(error);
        });
        return deferred.promise;
    },*/


    /**
     * @ngdoc method
     * @name fdCommon.service#postResource
     * @methodOf fdCommon.baseService
     * @param {String} url. The url where resource should be posted.
     * @param {JSON object} resource. The resource in JSON form.
     * @description Posts the resource to the back end.
     * @returns {JSON object} A success message (If promise is resolved)
     */
    /*postResource: function(url, resource) {
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
    },*/


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

    getResources: function(url, id) {
        var deferred = $q.defer();
        $http.get(url).success(function(data){
            //Passing data to deferred's resolve function on successful completion
            console.log('data'+ data);
            //Customized for a json mock object, containing several resources
            if(angular.isUndefined(id)) {
                //If id parameter has not been specified return all resources found
                //at address.
                deferred.resolve(data);
            }
            else {
                deferred.resolve(data[id]);
            }
        }).error(function(error){

            //Sending a friendly error message in case of failure
            deferred.reject(error);
        });
        return deferred.promise;
    },
    };

    postResource: function(url, resource) {
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
}]);