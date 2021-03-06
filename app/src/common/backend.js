/*The backend service is a collection of methods that
interact with the browsers local storage to simulate a backend. 
The backend supports adding recipes, groups, approvals, users, login request 
and so on. 

backend.js should not be included if a real external api is made.

*/
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
                })
                this.load('/data/faq.xml')
                .then(function(data) {
                    storage.setData('faq', data);
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
            recipe.approvals = 0;
            var idx = storage.appendData('recipe', recipe);
            var users = storage.getData('user');
            for (var i = 0; i< users.length; i++) {
                if (users[i].username === user.username) {
                    users[i].recipes.push({id: recipe.id, title: recipe.title, image: recipe.image, created: recipe.created});
                    storage.replaceData('user', users[i], i);
                }
            }
            return {message: "Your recipe was successfully created", recipeId: idx};
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
            user.joined = new Date();
            user.recipes = [];
            if(!user.image) {
            user.image = 'images/no-profile-image.png'
          }
            storage.appendData('user', user)
            return user;
        },

        addGroup: function(group, user) {
            //Fake a user logged in status. The user id should be
            // be added to the group data
            group.creator = user;
            group.created = new Date();
            group.participants = [user];
            var recipe =  this.get('recipe', group.recipe.id);
            group.recipe.title = recipe.title;
            group.recipe.id = recipe.id;
            group.recipe.creator = recipe.creator;
            group.recipe.image = recipe.image;
            var groupId = storage.appendData('group', group)
            return {message: "Your group was successfully created", groupId: groupId};
        },

        addParticipant: function(groupId, user) {
            var group = storage.getData('group')[groupId];
            var par = {id: user.id, username: user.username, image: user.image};
            group.participants.push(par);
            storage.replaceData('group', group, groupId);
            return {message: "Your group was successfully created", participants: group.participants};
        },
        removeParticipant: function(groupId, user) {
            var group = storage.getData('group')[groupId];
            for(var i = 0; i<group.participants.length; i++) {
                console.log("HEI");
                if(user.username === group.participants[i].username) {
                    group.participants.splice(i, 1);
                }
            }
            storage.replaceData('group', group, groupId);
            return {message: "Your group was successfully created", participants: group.participants};
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
        getGroup: function(groupId, user) {
            var group = storage.getData('group')[groupId];
            group.joined = false;
            if(user.username) {
                for(var i = 0; i<group.participants.length; i++) {
                    if(user.username == group.participants[i].username) {
                        group.joined = true;
                    }
                }
            }
            return group;
        },
        incrementApprovals: function(value) {
            console.log(value);
            var recipe = storage.getData('recipe')[value];
            recipe.approvals = recipe.approvals  + 1;
            storage.replaceData('recipe', recipe, recipe.id);
            return {message: "Like was successfully added", approvals: recipe.approvals};
        },
         /*
        * The get method recieve all GET requests made by the front end, 
        * and routes them to the proper method for handling.
        */
        get: function(key, id) {
            if(id === undefined) {
                return storage.getData(key);
            }
            else {
                if(id === "popular") {
                    //Just return all recipes if popular recipes are requested
                    return storage.getData(key);
                }
                if(key === 'group') {
                    var user = $rootScope.user;
                    return this.getGroup(id, user);
                }
                return storage.getData(key)[id];
            }
        },

        /*
        * The post method recieve all POST requests made by the front end, 
        * and routes them to the proper method for handling.
        */
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

        /*
        * The put method recieve all PUT requests made by the front end, 
        * and routes them to the proper method for handling.
        */
        put: function(key, object, value, operation) {
            if( key == 'group') {
                if(operation === 'join') {
                    return this.addParticipant(value, object);
                }
                else if(operation === 'leave') {
                     console.log("HEI");
                    return this.removeParticipant(value, object);
                }
            }
            if ( key == 'recipe') {
                return this.incrementApprovals(value);
            }
            return null;
        },
    };
}])

/*
Except for app.js no other js file has to know about the fake backend. All communication and 
methods go through the mockService. The mockService contain methods to fake
a http request. A promise is made and returned, just like what baseService
does. Before the promise is resolved a timeout is added to simulate network
delay. Currently this timeout is a fixed amount of time
 but can easily be changed to a random variable amount of time, to more realistically
 resemble network delay.
*/
.factory('mockService', ['$http', '$q','$timeout', 'backend', function ($http, $q, $timeout, backend) {
    return {
       
        /*
	    GetMock will simulate a http request by doing a timeout, a promise
	    is returned , and after the timeout the promise is resolved. 
	    */
	    getMock: function(url) {
	        var deferred = $q.defer();
	        $timeout(function () {
                //url split into an array, which backend uses to route request
	            var u = url.split('/');
	            var key = u[1]
	            var element = u[2] || undefined;
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
                 //url split into an array, which backend uses to route request
	            var u = url.split('/');
	            var key = u[1]
	            deferred.resolve(backend.post(key, resource));
	        }, 200);
	        return deferred.promise;
	    },

        putMock: function(url, object) {
            var deferred = $q.defer();
            $timeout(function () {
                 //url split into an array, which backend uses to route request
                var u = url.split('/');
                var key = u[1]
                var value = u[2]
                var operation = u[3]
                deferred.resolve(backend.put(key, object, value, operation));
            }, 200);
            return deferred.promise;
        }
        
    };
}])  