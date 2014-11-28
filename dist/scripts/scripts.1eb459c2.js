"use strict";angular.module("foodieApp",["ngRoute","ngMessages","fdHome","fdNotifications","fdGroup","fdUser","fdRecipe","fdCommon","fdLogin","fdFaq"]).config(["$routeProvider",function($routeProvider){$routeProvider.otherwise({redirectTo:"/"})}]).run(function($rootScope,backend,sessionManager){$rootScope.apiPath="",backend.init(),sessionManager.setContext()}),angular.module("fdCommon",[]).factory("baseService",["$http","$q","mockService","$rootScope",function($http,$q,mockService,$rootScope){var mock=!0;return{getResources:function(url){if(mock)return mockService.getMock($rootScope.apiPath+url);var deferred=$q.defer();return $http.get(url).success(function(data){deferred.resolve(data)}).error(function(error){deferred.reject(error)}),deferred.promise},postResource:function(url,resource){if(mock)return mockService.postMock($rootScope.apiPath+url,resource);var deferred=$q.defer();return console.log(resource),$http.post(url,resource).success(function(data){deferred.resolve(data)}).error(function(error){console.log(error),deferred.reject(error)}),deferred.promise},putResource:function(url,resource){if(mock)return mockService.putMock($rootScope.apiPath+url,resource);var deferred=$q.defer();return $http.post(url,resource).success(function(data){deferred.resolve(data)}).error(function(error){deferred.reject(error)}),deferred.promise},deleteResource:function(url){var deferred=$q.defer();return $http.delete($rootScope.apiPath+url).success(function(data){deferred.resolve(data)}).error(function(error){deferred.reject(error)}),deferred.promise}}}]).factory("storage",["$window",function($window){return{appendData:function(key,data){var datalist=this.getData(key);return void 0===datalist&&(datalist=[]),data.id=datalist.length,datalist.push(data),this.setData(key,datalist),data.id},replaceData:function(key,data,idx){var datalist=this.getData(key);datalist[idx]=data,this.setData(key,datalist)},setData:function(key,val){return $window.localStorage&&$window.localStorage.setItem(key,JSON.stringify(val)),this},getData:function(key){return $window.localStorage&&JSON.parse($window.localStorage.getItem(key))}}}]).factory("sessionManager",["baseService","$rootScope","storage","$http",function(baseService,$rootScope,storage,$http){return{postCredentials:function(credentials){var url="api/login/";return baseService.postResource(url,credentials)},setContext:function(user){if(void 0===user||null===user){var cred=storage.getData("credentials");$rootScope.user={},cred&&cred.username&&cred.token&&($rootScope.user=cred,$http.defaults.headers.common["X-AUTH-TOKEN"]=cred.token)}else $rootScope.user=user,storage.setData("credentials",user),$http.defaults.headers.common["X-AUTH-TOKEN"]=user.token},destroyContext:function(){storage.setData("credentials",null),$rootScope.user={}}}}]).directive("ngFocus",[function(){var FOCUS_CLASS="ng-focused";return{restrict:"A",require:"ngModel",link:function(scope,element,attrs,ctrl){ctrl.$focused=!1,element.bind("focus",function(){element.addClass(FOCUS_CLASS),scope.$apply(function(){ctrl.$focused=!0,ctrl.$dirty=!0})}).bind("blur",function(){element.removeClass(FOCUS_CLASS),scope.$apply(function(){ctrl.$focused=!1})})}}}]).filter("capitalize",function(){return function(input){return input?input.replace(/([^\W_]+[^\s-]*) */g,function(txt){return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase()}):""}}),angular.module("fdCommon").factory("backend",["$http","$q","storage","$rootScope",function($http,$q,storage,$rootScope){return{init:function(){null===storage.getData("user")&&(console.log("TEST"),this.load("/data/recipes.json").then(function(data){storage.setData("recipe",data)}),this.load("/data/groups.json").then(function(data){storage.setData("group",data)}),this.load("/data/users.json").then(function(data){storage.setData("user",data)}),this.load("/data/notifications.json").then(function(data){storage.setData("notification",data)}),this.load("/data/faq.xml").then(function(data){storage.setData("faq",data)}))},load:function(url){var deferred=$q.defer();return $http.get(url).success(function(data){deferred.resolve(data)}).error(function(error){deferred.reject(error)}),deferred.promise},addRecipe:function(recipe,user){recipe.creator=user,recipe.created=new Date,recipe.approvals=0;for(var idx=storage.appendData("recipe",recipe),users=storage.getData("user"),i=0;i<users.length;i++)users[i].username===user.username&&(users[i].recipes.push({id:recipe.id,title:recipe.title,image:recipe.image,created:recipe.created}),storage.replaceData("user",users[i],i));return{message:"Your recipe was successfully created",recipeId:idx}},login:function(data){for(var users=storage.getData("user"),i=0;i<users.length;i++)if(users[i].username===data.username.toLowerCase())return users[i].token="abc",users[i];return void 0},addUser:function(user){return user.joined=new Date,user.recipes=[],user.image||(user.image="images/no-profile-image.png"),storage.appendData("user",user),user},addGroup:function(group,user){group.creator=user,group.created=new Date,group.participants=[user];var recipe=this.get("recipe",group.recipe.id);group.recipe.title=recipe.title,group.recipe.id=recipe.id,group.recipe.creator=recipe.creator,group.recipe.image=recipe.image;var groupId=storage.appendData("group",group);return{message:"Your group was successfully created",groupId:groupId}},addParticipant:function(groupId,user){var group=storage.getData("group")[groupId],par={id:user.id,username:user.username,image:user.image};return group.participants.push(par),storage.replaceData("group",group,groupId),{message:"Your group was successfully created",participants:group.participants}},removeParticipant:function(groupId,user){for(var group=storage.getData("group")[groupId],i=0;i<group.participants.length;i++)console.log("HEI"),user.username===group.participants[i].username&&group.participants.splice(i,1);return storage.replaceData("group",group,groupId),{message:"Your group was successfully created",participants:group.participants}},getGroupsForRecipe:function(recipeId){for(var groups=storage.getData("group"),recipeGroups=[],i=0;i<groups.length;i++)groups[i].recipe.id==recipeId&&recipeGroups.push(groups[i]);return recipeGroups},getGroup:function(groupId,user){var group=storage.getData("group")[groupId];if(group.joined=!1,user.username)for(var i=0;i<group.participants.length;i++)user.username==group.participants[i].username&&(group.joined=!0);return group},incrementApprovals:function(value){console.log(value);var recipe=storage.getData("recipe")[value];return recipe.approvals=recipe.approvals+1,storage.replaceData("recipe",recipe,recipe.id),{message:"Like was successfully added",approvals:recipe.approvals}},get:function(key,id){if(void 0===id)return storage.getData(key);if("popular"===id)return storage.getData(key);if("group"===key){var user=$rootScope.user;return this.getGroup(id,user)}return storage.getData(key)[id]},post:function(key,data){var user=$rootScope.user;return"recipe"===key?this.addRecipe(data,user):"user"===key?this.addUser(data):"login"===key?this.login(data):"group"===key?this.addGroup(data,user):null},put:function(key,object,value,operation){if("group"==key){if("join"===operation)return this.addParticipant(value,object);if("leave"===operation)return console.log("HEI"),this.removeParticipant(value,object)}return"recipe"==key?this.incrementApprovals(value):null}}}]).factory("mockService",["$http","$q","$timeout","backend",function($http,$q,$timeout,backend){return{getMock:function(url){var deferred=$q.defer();return $timeout(function(){var u=url.split("/"),key=u[1],element=u[2]||void 0;deferred.resolve(u.length>3&&"group"===u[3]?backend.getGroupsForRecipe(element):backend.get(key,element))},200),deferred.promise},postMock:function(url,resource){var deferred=$q.defer();return $timeout(function(){var u=url.split("/"),key=u[1];deferred.resolve(backend.post(key,resource))},200),deferred.promise},putMock:function(url,object){var deferred=$q.defer();return $timeout(function(){var u=url.split("/"),key=u[1],value=u[2],operation=u[3];deferred.resolve(backend.put(key,object,value,operation))},200),deferred.promise}}}]),angular.module("fdCommon").directive("minimizer",["$window",function($window){return function(scope){scope.minimized=!1,angular.element($window).bind("scroll",function(){scope.minimized=!1;var scrollTop=$window.pageYOffset,navBP=310,navAniBP=280;if(scrollTop>navAniBP){var value=(scrollTop-navAniBP)/(navBP-navAniBP),nSize=(100-30*value).toFixed();document.getElementById("overlay").setAttribute("style","opacity: "+value+";"),document.getElementById("pictureAni").setAttribute("style","width: "+nSize+"px; height: "+nSize+"px;")}else document.getElementById("overlay").setAttribute("style","opacity:0;"),document.getElementById("pictureAni").setAttribute("style","width: 100px; height:100px;");scope.minimized=scrollTop>navBP?!0:!1,scope.$apply()})}}]).directive("navbar",function(){return{templateUrl:"src/common/header/header.tpl.html",link:function(){}}}),angular.module("fdHome",["fdRecipe"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/",{templateUrl:"src/homePage/home.tpl.html",controller:"HomeCtrl",resolve:{recipes:["recipes",function(recipes){return recipes.getPopular().then(function(response){return response})}]}})}]).controller("HomeCtrl",["$scope","recipes",function($scope,recipes){$scope.popularRecipes=recipes}]),angular.module("fdGroup",[]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/group/:gid",{templateUrl:"src/group/group.tpl.html",controller:"GroupCtrl",resolve:{groupData:["groups","$route",function(groups,$route){var groupId=$route.current.params.gid;return groups.get(groupId).then(function(response){return response})}]}}).when("/recipe/:rid/group",{templateUrl:"src/group/group-form.tpl.html",controller:"GroupFormCtrl",resolve:{recipe:["recipes","$route",function(recipes,$route){var recipeId=$route.current.params.rid;return recipes.get(recipeId).then(function(response){return response})}]}})}]).controller("GroupCtrl",["$scope","groupData","groups",function($scope,groupData,groups){$scope.group=groupData,$scope.thumbTemplate="src/recipe/grid/recipe-thumb.tpl.html",$scope.recipe=$scope.group.recipe,$scope.join=function(){$scope.user.username&&groups.putUser($scope.user,$scope.group.id).then(function(success){$scope.group.participants=success.participants,$scope.group.joined=!0},function(){console.log("Could not join group")})},$scope.leave=function(){$scope.user.username&&groups.leaveUser($scope.user,$scope.group.id).then(function(success){$scope.group.participants=success.participants,$scope.group.joined=!1})}}]).controller("RecipeGroupCtrl",["$scope","groups","$location",function($scope,groups,$location){$scope.noRecipes=!0,$scope.groupList=[],$scope.redirectToForm=function(){$location.path("/recipe/"+$scope.$parent.recipe.id+"/group")};var init=function(){var recipeId=$scope.$parent.recipe.id;groups.getAllForRecipe(recipeId).then(function(success){$scope.groupList=success,success.length>0&&($scope.noRecipes=!1)},function(){})};init()}]).controller("GroupFormCtrl",["$scope","groups","$location","recipe",function($scope,groups,$location,recipe){$scope.group={},$scope.recipe=recipe,$scope.max=Number.MAX_VALUE,$scope.today=new Date,$scope.createGroup=function(newGroup,valid){return $scope.user.username?void(valid?(newGroup.nr_participants||(newGroup.nr_participants=$scope.max),newGroup.recipe={},newGroup.recipe.title="",newGroup.recipe.id=recipe.id,groups.store(newGroup).then(function(data){$location.path("/group/"+data.groupId)})):console.log("Form is not valid")):void $location.path("/login")}}]).factory("groups",["baseService",function(baseService){return{getAllForRecipe:function(recipeId){var url="api/recipe/"+recipeId+"/group";return baseService.getResources(url)},store:function(group){var url="api/group";return baseService.postResource(url,group)},get:function(groupId){var url="api/group/"+groupId;return baseService.getResources(url)},getAll:function(){var url="api/group";return baseService.getResources(url)},putUser:function(user,groupId){var url="api/group/"+groupId+"/join";return baseService.putResource(url,user)},leaveUser:function(user,groupId){console.log("TEST");var url="api/group/"+groupId+"/leave";return baseService.putResource(url,user)}}}]),angular.module("fdNotifications",[]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/notification/",{templateUrl:"src/notifications/notifications.tpl.html",controller:"NotificationCtrl"})}]).controller("NotificationCtrl",["$scope","notifications",function($scope,notifications){$scope.notificationList=[],$scope.image="images/no-profile-image.png",$scope.getNewNotifications=function(){notifications.getNew().then(function(data){$scope.notificationList=data})},$scope.getNewNotifications()}]).factory("notifications",["baseService",function(baseService){return{getAll:function(){var url="api/notification";return baseService.getResources(url)},getNew:function(){var url="api/notification";return baseService.getResources(url)},answer:function(){}}}]),angular.module("fdRecipe",["fdCommon"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/recipe/",{templateUrl:"src/recipe/recipe-form.tpl.html",controller:"RecipeFormCtrl"}).when("/recipe/:rid",{templateUrl:"src/recipe/recipe.tpl.html",controller:"RecipeCtrl",resolve:{recipe:["recipes","$route",function(recipes,$route){var recipeId=$route.current.params.rid;return recipes.get(recipeId).then(function(response){return response})}]}})}]).controller("RecipeCtrl",["$scope","recipe","recipes",function($scope,recipe,recipes){$scope.recipe=recipe,$scope.approve=function(){$scope.user.username&&recipes.incrementLike($scope.recipe.id,$scope.user).then(function(success){$scope.recipe.approvals=success.approvals})}}]).controller("RecipeFormCtrl",["$scope","recipes","$location",function($scope,recipes,$location){$scope.newRecipe={},$scope.newRecipe.ingredients=[],$scope.newRecipe.description=[],$scope.postRecipe=function(recipe,valid){return $scope.user.username?void(valid?recipes.store(recipe).then(function(success){$location.path("/recipe/"+success.recipeId)}):console.log("NOT VALID YET")):void $location.path("/login")}}]).factory("recipes",["baseService",function(baseService){return{get:function(id){var url="api/recipe/"+id;return baseService.getResources(url)},getAll:function(){var url="api/recipe";return baseService.getResources(url)},getPopular:function(){var url="api/recipe/popular";return baseService.getResources(url)},store:function(newRecipe){var url="api/recipe";return baseService.postResource(url,newRecipe)},incrementLike:function(recipeId,user){var url="api/recipe/"+recipeId+"/like";return baseService.putResource(url,user)}}}]).directive("fdDescriptor",function(){return{template:'<ul><li ng-repeat="step in model track by $index"><label><i ng-if="$index==0">* </i>Step {{$index+1}}</label><button class="btn--negative" ng-click="removeStep($index)"><b>X</b></button><span><textarea type="text" ng-model="model[$index]"></textarea></span></li><button type="button" class="btn--neutral" ng-click="addStep()">Add step</button></ul>',scope:{model:"=ngModel"},controller:["$scope",function($scope){$scope.addStep=function(){$scope.model.push("")},$scope.removeStep=function(idx){$scope.model.splice(idx,1)},$scope.init=function(){$scope.model.length<=0&&$scope.model.push("")},$scope.init()}],link:function(){}}}).directive("fdIngredients",function(){return{scope:{model:"=ngModel"},template:'<ul><li ng-repeat="step in model track by $index"><label style="float:inherit"><i ng-if="$index==0">* </i> Ingredient {{$index+1}}</label><input  type="number" ng-model="step.quantity" /><input placeholder="unit" type="text" ng-model="model[$index].unit" /><input  class="ingredient-name" style="width: 45%" placeholder="name"type="text" ng-model="model[$index].name" /><button class="btn--negative" ng-click="removeStep($index)" ng-show="$index >0"><b>X</b></button></li></ul><button type="button" class="btn--neutral" ng-click="addStep()" style="float:right">Add ingredients</button>',controller:["$scope",function($scope){$scope.addStep=function(){$scope.model.push({quantity:0,unit:"",name:""})},$scope.removeStep=function(idx){$scope.model.splice(idx,1)},$scope.init=function(){$scope.model.length<=0&&$scope.model.push({quantity:0,unit:"",name:""})},$scope.init()}]}}).directive("fdLeastOne",function(){return{require:"ngModel",link:function(scope,ele,attrs,c){scope.$watch(attrs.ngModel,function(newVal){console.log(newVal[0].length),newVal&&newVal.length>0&&newVal[0].length>0||newVal[0].name&&newVal[0].name.length>0?c.$setValidity("leastOne",!0):c.$setValidity("leastOne",!1)},!0)}}}),angular.module("fdRecipe").directive("fdGrid",[function(){return{restrict:"AE",scope:{gridContent:"=",maxRow:"@",maxColumn:"@"},template:'<div><table class="recipeThumb__grid"><tr ng-repeat="row in matrix"><td class="col-centered" ng-repeat="recipe in row track by $index"><ng-include src="thumbTemplate"></ng-include></td><td ng-repeat="i in getNumber(internalMaxCols - row.length)"></td></tr></table>',controller:["$scope",function($scope){$scope.matrix=[],$scope.totalItems,$scope.internalMaxCols=4,$scope.thumbTemplate="src/recipe/grid/recipe-thumb.tpl.html",$scope.getNumber=function(num){for(var numbers=[],i=0;num>i;i++)numbers.push(i);return numbers},$scope.constructGridLayout=function(data){var resultSet=angular.copy(data);if(angular.isDefined(resultSet)){$scope.matrix=[];for(var currentRow=[],i=0;i<resultSet.length;i++)currentRow.push(resultSet[i]),currentRow.length>=$scope.internalMaxCols&&($scope.matrix.push(currentRow),currentRow=[]);currentRow.length>0&&$scope.matrix.push(currentRow)}}}],link:function(scope){scope.maxColumn&&scope.maxRow?scope.itemPerPage=scope.maxColumn*scope.maxRow:scope.maxColumn&&(scope.internalMaxCols=scope.maxColumn),scope.$watch("gridContent",function(newValue){newValue&&scope.constructGridLayout(newValue)})}}}]),angular.module("fdUser",[]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/profile/:uid",{templateUrl:"src/userProfile/userProfile.tpl.html",controller:"UserProfileCtrl",resolve:{user:["users","$route",function(users,$route){var userId=$route.current.params.uid;return users.get(userId).then(function(response){return response})}]}})}]).controller("UserProfileCtrl",["$scope","user",function($scope,user){$scope.userProfile=user}]).factory("users",["baseService",function(baseService){return{get:function(id){var url="api/user/"+id;return baseService.getResources(url,id)},getAll:function(){var url="api/user";return baseService.getResources(url)},create:function(user){var url="api/user";return baseService.postResource(url,user)}}}]),angular.module("fdLogin",["fdCommon","fdUser"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/login",{templateUrl:"src/login/login.tpl.html",controller:"LoginCtrl"}).when("/create-account",{templateUrl:"src/login/create-account.tpl.html",controller:"AccountFormCtrl"})}]).controller("LoginCtrl",["$scope","sessionManager","$location",function($scope,sessionManager,$location){$scope.credentials={},$scope.signIn=function(credentials){sessionManager.postCredentials(credentials).then(function(user){sessionManager.setContext(user),$location.path("/")},function(error){$scope.errorMessage=error.message})}}]).controller("HeaderCtrl",["$scope","sessionManager",function($scope,sessionManager){$scope.signOut=function(){sessionManager.destroyContext()}}]).controller("AccountFormCtrl",["$scope","users","sessionManager",function($scope,users,sessionManager){$scope.user={},$scope.password="",$scope.registrationSuccessful=!1,$scope.register=function(newAccount){$scope.accountForm.$valid?(newAccount.username=newAccount.username.toLowerCase(),users.create(newAccount).then(function(success){$scope.user=success,$scope.registrationSuccessful=!0,sessionManager.setContext($scope.user),console.log("Created new user")})):console.log("Not valid")}}]).directive("fdIdentical",function(){return{require:"ngModel",link:function(scope,ele,attrs,c){scope.$watch(attrs.ngModel,function(newVal){newVal===attrs.fdIdentical?c.$setValidity("identical",!0):c.$setValidity("identical",!1)})}}}),angular.module("foodieApp").config(["$routeProvider",function($routeProvider){$routeProvider.when("/sitemap/",{templateUrl:"src/sitemap/sitemap.tpl.html",controller:"SitemapCtrl",resolve:{groupList:["groups",function(groups){return groups.getAll().then(function(response){return response})}],recipeList:["recipes",function(recipes){return recipes.getAll().then(function(response){return response})}],userList:["users",function(users){return users.getAll().then(function(response){return response})}]}})}]).controller("SitemapCtrl",["$scope","groupList","recipeList","userList",function($scope,groupList,recipeList,userList){$scope.groups=groupList,$scope.recipes=recipeList,$scope.users=userList}]),angular.module("fdFaq",[]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/faq",{templateUrl:"src/faq/faq.tpl.html",controller:"FaqCtrl",resolve:{faqData:["faq",function(faq){return faq.get().then(function(response){return response.faq})}]}})}]).controller("FaqCtrl",["$scope","faqData","faq",function($scope,faqData){$scope.faq=faqData}]).factory("faq",["baseService",function(baseService){var convert=function(xml){var x2js=new X2JS,json=x2js.xml_str2json(xml);return json};return{get:function(){var url="api/faq";return baseService.getResources(url).then(function(data){return console.log(data),convert(data)})}}}]);