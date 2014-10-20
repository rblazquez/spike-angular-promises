/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('movieApp.controllers',[])

.controller('MovieListController',function($scope,$state,popupService,$window,Movie, Category, $q){

    var tmpMovieList = Movie.query();  

    var globalMovieList = null;

    tmpMovieList.$promise
        .then(function(movieList) {
            console.log(movieList);
            globalMovieList = movieList;
            return movieList;
        })
        .then(function(movieList) {

            var promises = [];

            console.log(movieList);
            angular.forEach(globalMovieList, function(value, key) {
                promises[promises.length] = Category.get({id:value.categoryId}).$promise;
            });

            $q.all(promises).then(function(response) {
                var i = 0;
                angular.forEach(response, function(value, key) {
                    console.log(movieList);
                    globalMovieList[i].categoryId = value.name;
                    i++;
                });
                $scope.movies = globalMovieList;
            });
        })
})
.controller('MovieViewController',function($scope,$stateParams,Movie, Category){

    var tmpMovie = Movie.get({id:$stateParams.id});  

    var globaldata = null;

    tmpMovie.$promise
        .then(function(data) { 
            console.log(data);
            return data;
        })
        .then(function(data) {
            globaldata = data;
            console.log("CategoryId to resolve: " + data.categoryId);

            var tmpCategory = Category.get({id:data.categoryId});
            tmpCategory.$promise.then(function(category) { 
                console.log("Category Name resolved: " + category.name);
                globaldata.name = 'pepe'; 
                globaldata.categoryId = category.name;
                
                $scope.movie = globaldata;

                return category
            });
        });
    
    //$scope.movie = tmpMovie;
})
.controller('MovieCreateController',function($scope,$state,$stateParams,Movie){

    $scope.movie=new Movie();

    $scope.addMovie=function(){
        $scope.movie.$save(function(){
            $state.go('movies');
        });
    }

})
.controller('MovieEditController',function($scope,$state,$stateParams,Movie){

    $scope.updateMovie=function(){
        $scope.movie.$update(function(){
            $state.go('movies');
        });
    };

    $scope.loadMovie=function(){
        $scope.movie=Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();
});