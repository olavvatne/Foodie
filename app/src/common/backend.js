angular.module('fdCommon')
.factory('backend', ['$http', '$q', 'storage','$rootScope', function ($http, $q, storage, $rootScope) {
    return {
        init: function() {
            //Only load mock json if they are not in localstore
            if(storage.getData('user') === null) {
                console.log("TEST");
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
            }
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
            recipe.creator = user;
            recipe.created = new Date();
            storage.appendData('recipe', recipe)
        },
        login: function(data) {
            var users = storage.getData('user');
            for(var i = 0; i<users.length; i++) {
                if(users[i].username === data.username.toLowerCase()) {
                    users[i].token = 'abc';
                    return users[i];
                }
            }
            //No way to create error with mock backend
            return undefined;
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

        getGroupsForRecipe: function(recipeId) {
            var groups = storage.getData('group');
            var recipeGroups = [];
            for(var i = 0; i<groups.length; i++) {
                if(groups[i].recipe.id == recipeId) {
                    recipeGroups.push(groups[i]);
                }
            }
            return recipeGroups;
        },
        get: function(key, id) {
            if(id === undefined) {
                return storage.getData(key);
            }
            else {
                if(id === "popular") {
                    //Just return all recipes if popular recipes are requested
                    return storage.getData(key);
                }
                return storage.getData(key)[id];
            }
        },

        post: function(key, data) {
            var user = $rootScope.user
            if(key==='recipe') {
                return this.addRecipe(data, user);
            }
            else if(key==='user') {
                return this.addUser(data);
            }
            else if(key==='login') {
                return this.login(data);
            }
            else if(key==='group') {
                return this.addGroup(data, user);
            }
            return null;
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
                if(u.length > 3 && u[3] === 'group') {
                    deferred.resolve(backend.getGroupsForRecipe(element))
                }
                else {
	               deferred.resolve(backend.get(key, element));
                }
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