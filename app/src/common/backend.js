angular.module('fdCommon')
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
            this.load('/data/notifications.json')
            .then(function(data) {
                storage.setData('notification', data);
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
        },

        //On application load all json data should be loaded into storage,
        //and storage will be used by baseService the retrieve mocked backend resources
        addRecipe: function(recipe, user) {
            //Need to append recipe to users posted recipes
            recipe.creator = user
            storage.appendData('recipe', recipe)
        },
        login: function(data) {
            var users = storage.getData('user');
            for(var i = 0; i<users.length; i++) {
                if(users[i].username === data.username.toLowerCase()) {
                    return {username: data.username, token: 'abc'};
                }
            }
            //No way to create error with mock backend
            return {username: null, token: null};
        },
        addUser: function(user) {
            //Need to append recipe to users posted recipes
            storage.appendData('user', user)
        },
         addGroup: function(group, user) {
            //Fake a user logged in status. The user id should be
            // be added to the group data
            group.creator = user
            storage.appendData('group', group)
        },
        get: function(key, id) {
            if(id === undefined) {
                return storage.getData(key);
            }
            else {
                return storage.getData(key)[id];
            }
        },

        post: function(key, data) {
            if(key==='recipe') {
                return this.addRecipe(data);
            }
            else if(key==='user') {
                return this.addUser(data);
            }
            else if(key==='login') {
                return this.login(data);
            }
        },
    };
}])

.factory('mockService', ['$http', '$q','$timeout', 'backend', function ($http, $q, $timeout, backend) {
    return {
       
        /*
	    GetMock will simulate a http request by doing a timeout, a promise
	    is returned , and after the timeout the promise is resolved. Except for
        app.js no other js file has to know about backend. All communication and
        methods go through getMock.
	    */
	    getMock: function(url) {
	        var deferred = $q.defer();
	        $timeout(function () {
	            u = url.split('/');
	            key = u[1]
	            element = u[2] || undefined;
	            deferred.resolve(backend.get(key, element));
	        }, 200);
	        return deferred.promise;
	    },

	    postMock: function(url, resource) {
	        var deferred = $q.defer();
	        $timeout(function () {
	            u = url.split('/');
	            key = u[1]
	            deferred.resolve(backend.post(key, resource));
	        }, 200);
	        return deferred.promise;
	    },
        
    };
}])  