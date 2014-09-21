'use strict';
angular.module('leafletMapApp')
  .directive('leafletMap', function($compile) {
    return {
      restrict: 'E',
      scope: {
        zoom: '=',
        search: '=',
        markerClusters: '=',
        popuptpl: '=',
        drawing: '=',
        type: '=',
        settings: '=',
        config: '=',
        layers: '='
      },
      replace: true,
      templateUrl: 'views/directives/map.tpl.html',
      link: function(scope, element) {
        var map, geocodeService, markers, layer, drawControl, mapDrawCloseCtrl, mapStyleCtrl, markerLayerGroup;
        /**
         * changes the map based on type selection
         */
        scope.$watch('type', function(newVal) {
          if (layer !== undefined && map.hasLayer(layer)) {
            map.remove();
          }
          if (newVal === 'Google') {
            layer = new L.Google('ROADMAP');
          } else if (newVal === 'Alk' || newVal === undefined) {
            layer = ALK.MapsLayer({
              region: 'NA',
              style: 'default'
            });
          }
          init();
        });

        /**
         * gets geo address based on latlng
         */
        function getGeoAddress(location) {
          var address;
          geocodeService.reverse(location, {}, function(error, result) {
            if (result) {
              address = result.address + ', ' + result.city + ', ' + result.countryCode + ', ' + result.postal;
              placeMarker(location, address);
            }
          });
        }

        /**
         * places marker and adds popup based on latlng position
         */
        function placeMarker(location, address) {
          var marker;
          if (address) {
            marker = new L.marker(location).addTo(map);

            var tpl = '<div class="marker-popup">' +
              '<div class="glyphicon glyphicon-picture marker-popup-icon pull-left"></div>' +
              '<p class="marker-popup-text pull-left">' + address + '</p>' +
              '</div>';

            //creates marker info window             
            marker.bindPopup(tpl);
            markerLayerGroup.addLayer(marker);
            map.addLayer(markerLayerGroup);
            //pushes marker to array
            if (scope.markerClusters) {
              markers.addLayer(marker);
              map.addLayer(markers);
            }
          }
        }

        /**
         * opens search process to place a marker on desired location
         */
        function searchLocation() {
          //search location
          // create the geocoding control and add it to the map
          var searchControl = new L.esri.Controls.Geosearch({
            //bounds: [38.50, -90.50]
          }).addTo(map);

          // create an empty layer group to store the results and add it to the map        
          var results = new L.LayerGroup().addTo(map);
          // listen for the results event and add every result to the map
          searchControl.on('results', function(data) {
            results.clearLayers();
            for (var i = data.results.length - 1; i >= 0; i--) {
              getGeoAddress(data.results[i].latlng);
            }
          });
        }


        /**
         * creates custom drawing control for clearing the drawing items
         */
        function createDrawingCustomControl() {
          mapDrawCloseCtrl = L.control({
            position: 'bottomright'
          });

          mapDrawCloseCtrl.onAdd = function() {
            this._div = L.DomUtil.create('div', 'map-draw-close'); // create a div with a class "mapDrawCloseCtrl"
            this.update();
            return this._div;
          };

          // method that we will use to update the control based on feature properties passed
          mapDrawCloseCtrl.update = function() {
            this._div.innerHTML = '<div class="glyphicon glyphicon-remove-circle map-close-icon"></div>';
            this._div.addEventListener('click', scope.closeDrawingItems, false);
          };
          mapDrawCloseCtrl.addTo(map);
        }

        /**
         * creates custom control for map setting map styles
         */
        function createMapStyleControl() {
          mapStyleCtrl = L.control({
            position: 'topleft'
          });
          mapStyleCtrl.onAdd = function() {
            this._div = L.DomUtil.create('div', 'map-style'); // create a div with a class "mapStyleCtrl"
            this.update();
            return this._div;
          };

          // method that we will use to update the control based on feature properties passed
          mapStyleCtrl.update = function() {
            var element = angular.element('<span class="dropdown">' +
              '<a class="dropdown-toggle">' +
              '<div class="glyphicon glyphicon-tags map-style-icon"></div>' +
              '</a>' +
              '<ul class="dropdown-menu dropdown-menu-left">' +
              '<li ng-repeat="(key,layer) in layers"><a ng-click="changeMapType(layer.layerType)">{{layer.name}}</a></li>' +
              '</ul>' +
              '</span>');
            $compile(element)(scope);
            this._div.appendChild(element[0]);
          };
          mapStyleCtrl.addTo(map);
        }

        /**
         * changes map type based on selection
         */
        scope.changeMapType = function(type) {
          if (scope.type === 'Alk') {
            layer.setStyle(type);
          }
          /* else {
            layer._type = google.maps.MapTypeId['HYBRID'];
          }*/
        };
        /**
         * shows drawing controls
         */
        function showDrawingItems() {
          /**
           * disables click event on map when drawing items are on the screen
           */
          map.off('click');

          /**
           * defines drawing items and adds them to map
           */
          var drawnItems = new L.FeatureGroup();
          map.addLayer(drawnItems);

          /**
           * defines drawing controls and adds them to map
           */
          drawControl = new L.Control.Draw({
            position: 'bottomright',
            draw: {
              polyline: false,
              polygon: {
                title: 'Draw a polygon!',
                allowIntersection: false,
                drawError: {
                  color: '#b00b00',
                  timeout: 1000
                },
                shapeOptions: {
                  color: '#000'
                },
                showArea: true
              },
              rectangle: true,
              circle: {
                shapeOptions: {
                  color: '#000'
                }
              },
              marker: true
            },
            edit: {
              featureGroup: drawnItems,
              remove: true
            }
          });
          map.addControl(drawControl);

          map.on('draw:created', function(e) {
            var layer, tpl, ele, latlng, type, address, addressEle;

            layer = e.layer;
            type = e.layerType;
            if (type === 'marker' || type === 'circle') {
              latlng = layer.getLatLng();
              tpl = scope.popuptpl;
              geocodeService.reverse(latlng, {}, function(error, result) {
                if (result) {
                  address = result.address + ', ' + result.city + ', ' + result.countryCode + ', ' + result.postal;
                } else {
                  address = '';
                }
                /**
                 * template bind to popup
                 *otherwise only address is binding to popup
                 */
                addressEle = angular.element('<p class="popup-content pull-right">' + address + '</p>');
                if (tpl) {
                  ele = angular.element(tpl);
                  ele.append(addressEle);
                } else {
                  ele = addressEle;
                }
                $compile(ele)(scope);
                layer.bindPopup(ele[0]);
              });
            } else {
              latlng = layer.getLatLngs();
              /*btpl = scope.beforePopuptpl;
              atpl = scope.afterPopuptpl;
              if (type === 'circle') {
                latlng = layer.getLatLng();
              } else {
                latlng = layer.getLatLngs();
              }*/
            }
            /**
             * before popup template after draw ends
             */
            /*ele = angular.element(btpl);
            $compile(ele)(scope);
            layer.bindPopup(ele[0]);
            drawnItems.addLayer(layer);
            layer.openPopup();*/
            drawnItems.addLayer(layer);
            scope.$emit('draw-created', type, latlng);
          });

          map.on('draw:edited', function(e) {
            var layers = e.layers.getLayers();
            scope.$emit('draw-edited', layers);
          });
          map.on('draw:deleted', function(e) {
            var layers = e.layers.getLayers();
            scope.$emit('draw-deleted', layers);
          });
        }

        /**
         * map initialization
         */
        function init() {
          var locations;
          /**
           * defines map with default options
           */
          map = new L.Map(element.children()[0], {
            center: [38.50, -90.50],
            zoom: 4,
            zoomControl: false,
            doubleClickZoom: scope.zoom,
            attributionControl: false
          });
          map.addLayer(layer);

          if (scope.zoom) {
            var zoomCtrl = L.control.zoom({
              position: 'bottomleft'
            });
            map.addControl(zoomCtrl);
          }
          markerLayerGroup = new L.LayerGroup().addTo(map);

          geocodeService = new L.esri.Services.Geocoding();
          L.Icon.Default.imagePath = '../images';

          //creates cluster group when concerned option is true
          if (scope.markerClusters === true) {
            markers = new L.MarkerClusterGroup();
          }

          //trying to place markers depending on json data
          try {
            if (scope.config && scope.config.data) {
              locations = scope.config.data;
              for (var i = 0; i < locations.length; i++) {
                //creating markers using longitude and latitude
                try {
                  if (locations[i].address.latitude && locations[i].address.longitude) {
                    var _latLng = new L.LatLng(locations[i].address.latitude, locations[i].address.longitude);
                    getGeoAddress(_latLng);
                  } else {
                    throw new Error('location data insufficient');
                  }
                } catch (e) {
                  console.error(e);
                }
              }
            } else {
              throw new Error('map locations data is null');
            }
          } catch (e) {
            console.error(e);
          }

          /**
           * performs search only when scope variable is true
           */
          if (scope.search === true) {
            searchLocation();
          }
          if (scope.drawing) {
            scope.drawingItems = scope.drawing;
          } else {
            scope.drawingItems = false;
          }
          if (scope.layers) {
            createMapStyleControl();
          }
        }

        /**
         * opens drawing controls
         */
        scope.openDrawingItems = function() {
          scope.drawingItems = false;
          showDrawingItems();
          createDrawingCustomControl();
        };

        /**
         * closes drawing controls
         */
        scope.closeDrawingItems = function() {
          map.on('click');
          scope.drawingItems = true;
          map.removeControl(mapDrawCloseCtrl);
          map.removeControl(drawControl);
          if (scope.$phase) {
            scope.$apply();
          }
        };
      }
    };
  });