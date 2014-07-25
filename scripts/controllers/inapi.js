'use strict';

angular.module('inapiApp')
  .controller('InapiController', ['$scope','$timeout','_','SearchService',function ($scope,$timeout,_,searchService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.searchTerm = "";
    this.searching = false;

    this.chartWidth=800;
    this.chartHeigth=400;

    this.tooltipMessage = function(d) {
      var msg = '';
      msg += '<h4>'+d['name'] +'</h4>';
      msg += '<span class="label label-default">'+d['source']+'</span> <span class="label label-primary">'+d['country']+'</span> <span class="label label-info">'+d['language']+'</span> <span class="label label-warning">'+d['year']+'</span>  <br>'
      msg += '<h5>'+d['author'] +'</h4>';
      msg += '<p>'+d['abstract'][0] +'</p>';
 
      return msg;
    };

  //                  <a ng-show="record.url != 'none'" href="{{record.url}}" target="_blank">Ir a la fuente</a>

 


   /**
    * @ngdoc function
    * @name fondecytApp.CarrerasController:updateCarreras
    * @methodOf fondecytApp.controller:CarrerasController
    * @description 
    * Updates the list of valid careers to be displayed (this.carreras) acording to the option this.filtraTopCarreras.
    * If this.filtraTopCarreras is true, it will select a maximum of this.maxCarreras, if not it will display all careers. 
    * 
    * Once updated, will assign the first career to this.selectedCarrera.
    */
    this.search = function(searchText) {
      if (searchText) {
        this.searching = true;
        this.numFound = 0;
        searchService.search(searchText)
        .then(function(response) {
          this.searching = false;
          this.numFound = response.numFound
          this.data = response.docs;
          this.groups = _.groupBy(this.data, function(d) {return d.source});
        }.bind(this))
        .catch(function(err) {
          this.searching = false;
          console.log(err);

        }); 
      }

    };


    this.changeSearchTerm = function() {
      $scope.searchTerm = this.query;
    }

    // Next search (used instead of "query")
    $scope.filterText = '';

    // Instantiate these variables outside the watch
    var tempFilterText = '',
        filterTextTimeout;

    $scope.$watch('searchTerm', function (val) {
        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

        tempFilterText = val;
        filterTextTimeout = $timeout(function() {
            this.search(tempFilterText);
        }.bind(this), 500); // delay 500 ms
    }.bind(this))



  }]);


/**
 * @ngdoc service
 * @name inapiApp.AreasDataService
 * @requires $q
 * @requires d3
 * @requires _
 *
 * @description
 * Manages data corresponidng to carreras at PUC
 *
 */
angular.module('inapiApp')
.service('SearchService',['$http', '$q',function($http, $q) {

 


  this.search = function(querytext) {
    // Create deferred promise to deal with async results
    var deferred = $q.defer();
    $http(
      {method: 'JSONP',
       url: 'http://lahuen.dcc.uchile.cl:8983/inapi/select/',
       params:{'json.wrf': 'JSON_CALLBACK',
              'wt':'json',
              'rows':1000,
              'q': querytext
            }
      })
      .success(function(data) {
        _.each(data.response.docs, function(d) {d.size=1})
        //var docs = data.response.docs;
        console.log('search success!');
        deferred.resolve(data.response);

      }).error(function() {
        console.log('Search failed!');
        deferred.reject('Search failed!');
      });

      return deferred.promise;

  }



  
}]);
