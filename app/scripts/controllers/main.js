'use strict';

angular.module('leafletMapApp')
  .controller('MainCtrl', function($scope) {
    /**
     * map related scope data
     */
    var alkLayers = {
      default: {
        name: 'Default',
        layerType: 'default'
      },
      contemporary: {
        name: 'Contemporary',
        layerType: 'contemporary'
      },
      monochrome: {
        name: 'Monochrome',
        layerType: 'monochrome'
      },
      satellite: {
        name: 'Satellite',
        layerType: 'satellite'
      },
      night: {
        name: 'Night',
        layerType: 'night'
      }
    };
    var googleLayers = {
      default: {
        name: 'Roadmap',
        layerType: 'roadmap'
      },
      hybrid: {
        name: 'Hybrid',
        layerType: 'hybrid'
      },
      terrain: {
        name: 'Terrain',
        layerType: 'terrain'
      },
      satellite: {
        name: 'Satellite',
        layerType: 'satellite'
      }
    };

    $scope.mapTitle = 'Map Component';
    $scope.mapSettings = [{
      option: 'Tile Layer',
      data: [{
        name: 'Google'
      }, {
        name: 'Alk'
      }]
    }];

    $scope.mapConfig = {
      'data': [{
        'address': {
          'longitude': -87.70753,
          'latitude': 41.961246
        },
        'label': 'CAAA_GOLF_HOME, 3156 W MONTROSE AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -104.957115,
          'latitude': 39.71954
        },
        'label': 'COLUMBINE LM11, 201 COLUMBINE ST,DENVER,CO'
      }, {
        'address': {
          'longitude': -73.955795,
          'latitude': 40.766876
        },
        'label': 'EBAA_ALPHA_START, 427 E 71ST ST,NEW YORK,NY'
      }, {
        'address': {
          'longitude': -87.70753,
          'latitude': 41.961246
        },
        'label': 'CAAA_GOLF_HOME, 3156 W MONTROSE AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.73567,
          'latitude': 41.90769
        },
        'label': 'CAAA_HOTEL_HOME, 4366 W LE MOYNE ST,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.60574,
          'latitude': 41.824223
        },
        'label': 'CAAB_ALPHA_HOME, 847 E PERSHING RD,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.73656,
          'latitude': 41.87199
        },
        'label': 'CAAB_BRAVO_HOME, 706 S KENNETH AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.675446,
          'latitude': 41.966934
        },
        'label': 'CAAB_CHARLIE_HOME, 1855 W LELAND AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.67659,
          'latitude': 41.967007
        },
        'label': 'CAAB_FOXTROT_HOME, 1908 W LELAND AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -104.99272,
          'latitude': 39.744686
        },
        'label': 'CALIFORNIA LM2, 1550 CALIFORNIA ST,DENVER,CO'
      }, {
        'address': {
          'longitude': -87.715195,
          'latitude': 41.874104
        },
        'label': 'CB_WAREHOUSE 1,419 S CENTRAL PARK BLVD,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.64108,
          'latitude': 41.881184
        },
        'label': 'CB_WAREHOUSE 2, 53 S CLINTON ST,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.648834,
          'latitude': 41.808853
        },
        'label': 'CB_WAREHOUSE 3,934 W 47TH ST,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.64679,
          'latitude': 41.808884
        },
        'label': 'CB_WAREHOUSE 4,850 W 47TH ST,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.68292,
          'latitude': 41.769085
        },
        'label': 'CB_WAREHOUSE 5,6845 S WESTERN AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.67788,
          'latitude': 41.87937
        },
        'label': 'CBAA_ALPHA_HOME, 148 S SEELEY AVE,CHICAGO,IL'
      }, {
        'address': {
          'longitude': -87.719635,
          'latitude': 41.856018
        },
        'label': 'CBAA_BRAVO_HOME, 1835 S HAMLIN AVE,CHICAGO,IL'
      }]
    };

    /*$scope.layers = {
      googleTerrain: {
        name: 'Google Terrain',
        layerType: 'terrain',
        type: 'google'
      },
      googleHybrid: {
        name: 'Google Hybrid',
        layerType: 'hybrid',
        type: 'google'
      },
      googleRoadmap: {
        name: 'Google Streets',
        layerType: 'roadmap',
        type: 'google'
      },
      googleSatillite: {
        name: 'Google Satellite',
        layerType: 'satellite',
        type: 'google'
      }
    };*/

    $scope.mapType = 'Alk';
    $scope.layers = alkLayers;
    $scope.$on('change-map', function(evt, type) {
      $scope.mapType = type;
      if (type === 'Google') {
        $scope.layers = googleLayers;
      } else {
        $scope.layers = alkLayers;
      }
    });

    $scope.$watch('mapType', function(newVal) {
      if (newVal) {
        if (newVal === 'Google') {
          $scope.mapType = 'Google';
        } else {
          $scope.mapType = 'Alk';
        }
      }
    });

    /*  $scope.beforePopuptpl = '<div class="before-drawing">' +
      '<div class="text-box"><input type="text" ng-model="assetName" placeholder="Enter Asset Name..."></div>' +
      '<button type="button" class="btn btn-default btn-xs ng-click="save()">save</button>' +
      '</div>';*/

    $scope.popuptpl = '<div class="popup">' +
      '</div>';

    $scope.save = function() {
      console.log('saves drawing item name');
    };

    //events from map
    $scope.$on('draw-created', function(evt, type, latlng) {
      console.log('draw-created');
      console.log(type);
      console.log(latlng);
    });
    $scope.$on('draw-edited', function(evt, layers) {
      console.log('draw-edited');
      console.log(layers);
    });
    $scope.$on('draw-deleted', function(evt, layers) {
      console.log('draw-deleted');
      console.log(layers);
    });
  });