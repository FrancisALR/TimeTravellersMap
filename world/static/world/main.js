var jsList = "{{names|escapejs}}";

var stamen;

// Solution to add WorldBorder entries to map with kml taken from following source
// Title: How to display my PostGis geometry on the GeoDjango map widget
// Author: User dmh126 at gis.stackexchange
// Available at: https://gis.stackexchange.com/questions/138278/how-to-dispay-my-postggis-geometry-on-the-geodjango-map-widget
var sourceF = new ol.source.Vector({
    projection: new ol.proj.get("EPSG:3857"),
    url: 'http://localhost:8080/world/all_countries',
    format: new ol.format.KML({
        extractStyles: false
    })

})
var generalLayer = new ol.layer.Vector({
    source: sourceF
})

function init() {

  // Solution to overlay external data to the map taken from OpenLayers.org official examples
  // Title: DragAndDrop
  // Author: OpenLayers
  // Available at: https://openlayers.org/en/latest/examples/drag-and-drop.html
  var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
          // Different accepted formats
          ol.format.GPX,
          ol.format.GeoJSON,
          ol.format.IGC,
          ol.format.KML,
          ol.format.WKT,
          ol.format.TopoJSON
        ]
      });

    // Creation of map
    map = new ol.Map({
        interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
        target: 'mapcontainer',
        renderer: 'canvas',
        view: new ol.View({
            projection: 'EPSG:3857',
            center: ol.proj.transform([2.4, 48], 'EPSG:4326', 'EPSG:3857'),
            zoom: 4,
        })
    });

    // Map base layer
    stamen = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner-lite'
        })
    });

    map.addLayer(stamen);

    // Source containing all WorldBorder entries
    var sourceF = new ol.source.Vector({
        projection: new ol.proj.get("EPSG:3857"),
        url: 'http://localhost:8080/world/all_countries', // url to access all entries in kml format
        format: new ol.format.KML({
            extractStyles: false
        })

    })
    map.addLayer(generalLayer)

    // Makes sure source is actually loaded but layer is invisible
    generalLayer.getSource().on('change', function(evt) {
        generalLayer.setVisible(false)
    })

    // Instantiates drag and drop function
    dragAndDropInteraction.on('addfeatures', function(event) {
            var vectorSource = new ol.source.Vector({
              features: event.features
            });
            map.addLayer(new ol.layer.Vector({
              source: vectorSource,
              visibility: true,
            }));
          });

          var displayFeatureInfo = function(pixel) {
            var features = [];
            map.forEachFeatureAtPixel(pixel, function(feature) {
              features.push(feature);
            });
            if (features.length > 0) {
              var info = [];
              var i, ii;
              for (i = 0, ii = features.length; i < ii; ++i) {
                info.push(features[i].get('name'));
              }
              document.getElementById('info').innerHTML = info.join(', ') || '&nbsp'; //displays country names on hover
            } else {
              document.getElementById('info').innerHTML = '&nbsp;';
            }
          };

          map.on('pointermove', function(evt) {
            if (evt.dragging) {
              return;
            }
            var pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
          });

          // Solution modified from OpenLayers.org official examples
          // Title: Select Features
          // Author: OpenLayers
          // Available at: https://openlayers.org/en/latest/examples/select-features.html
          map.on('click', function(evt) {
            displayFeatureInfo(evt.pixel);
          });

          var select = new ol.interaction.Select({
            condition: ol.events.condition.click
          });

          map.addInteraction(select);

              window.app = {};

      var app = window.app;

}

// Function that adds user map specific layers
function addingSavedMapFeaturesToLayer() {

    var names = document.getElementById('layer'); // gets id of select object
    var userColour = names.options[names.selectedIndex].value; // strips colour of layer
    var text = names.options[names.selectedIndex].text; // strips country list as a string
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", "); // creates array of country names

    for (let name of nameArray) {

        var trimmedname = name.replace(/^"+|"+$/g, '');
        var fullytrimmed = trimmedname.trim(); // final processing to get just country names


        var featureList = new Array;

        var specificSource = new ol.source.Vector({}) // new source for features to be added

        // accesses all features from the general layer containing all border data
        features = generalLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            if (features[i].getProperties().name == trimmedname) { // checks the name corresponds to an entry
                featureList.push(features[i])
                specificSource.addFeature(features[i])
                map.removeLayer(generalLayer)
                break;
            }

        }

        var specificLayer = new ol.layer.Vector({
            source: specificSource,
            style: [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: userColour // user defined colour
                    })
                })
            ]
        })

        map.addLayer(specificLayer);
        specificLayer.setOpacity(0.5);
        document.getElementById('exportjson').disabled = false; // allows the user to export features

    }

}

// adds standalone layers to the map, same general working as previous function
function addingSavedFeaturesToLayer() {

    var names = document.getElementById('dropdown');
    var text = names.options[names.selectedIndex].text;
    var userColour = names.options[names.selectedIndex].value;
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", ");
    if (text != "Select a Layer") {

    for (let name of nameArray) {
        var trimmedname = name.replace(/^[\n']+|[\n']+$/g, "");
        var fullytrimmed = trimmedname.trim();

        var featureList = new Array;

        var specificSource = new ol.source.Vector({})

        features = generalLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            if (features[i].getProperties().name == trimmedname) {
                featureList.push(features[i])
                specificSource.addFeature(features[i])

                map.removeLayer(generalLayer)
            }

        }

        var specificLayer = new ol.layer.Vector({
            source: specificSource,
            style: [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: userColour
                    })
                })
            ]
        })
        map.addLayer(specificLayer);
        specificLayer.setOpacity(0.5);
        document.getElementById('exportjson').disabled = false;

    }
  }
}

// takes list of countries as input and adds to the map with preset styling
function addingFeaturesToLayer() {

    var names = document.getElementById("value").value;
    var nameArray = names.split(", ");

        for (let name of nameArray) {

            var featureList = new Array;

            var specificSource = new ol.source.Vector({})
            features = generalLayer.getSource().getFeatures();

            for (var i = 0; i < features.length; i++) {
                if (features[i].getProperties().name == name) {
                    featureList.push(features[i].getProperties().name)

                    specificSource.addFeature(features[i])
                    map.removeLayer(generalLayer)
                    break;
                }

            }




            var specificLayer = new ol.layer.Vector({
                source: specificSource,
                style: [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'black',
                            width: 1
                        }),
                        fill: new ol.style.Fill({
                            color: [0, 255, 255, 0.5]
                        })
                    })
                ]
            })

            if (1 == featureList.length) {
            map.addLayer(specificLayer)
            document.getElementById('exportjson').disabled = false;


          }

    }

}
// Solution for updating selects modified from Devinterface.com by Stefano
// Title: Come implementare due dropdown dipendenti l’una dall’altra in Django e jQuery
// Author: Stefano, Devinterface
// Available at: https://www.devinterface.com/it/blog/how-to-implement-two-dropdowns-dependent-on-each-other-using-django-and-jquery
$(document).ready(
    function() {
        $("select#map").change(function() {
            if ($(this).val() == 'Z') {
                $("select#layer").html("<option>Select a layer</option>");
                $("select#layer").attr('disabled', true);
            } else {
                var url = "map/" + $(this).val() + "/all_json_models"; // accesses the map data in json format
                var map = $(this).val();
                $.getJSON(url, function(layers) {
                    var options = '<option value="Z">Select a layer</option>';
                    // adds options to second select for each layer of the selected map
                    for (var i = 0; i < layers.length; i++) {
                        options += '<option value="' + layers[i].fields['layercolour'] + '" id=' + layers[i].fields['layername'] + '>' + layers[i].fields['countrylist'] + " : " + layers[i].fields['year'] + '</option>';
                    }
                    $("select#layer").html(options);
                    $("select#layer option:first").attr('selected', 'selected');
                    $("select#layer").attr('disabled', false);
                });
            }
        });
    });

$(document).ready(
  function() {
    $("select#layer").change(function() {
      addingSavedMapFeaturesToLayer();
      document.getElementById('exportjson').disabled = false;
      var url = "map/" + $('select#map').val() + "/all_json_models";
      var map = $(this).val();
      var selectedLayer = $(this).children(":selected").attr("id");
      // console.log('here')
      $.getJSON(url, function(layers) {
        for (var i = 0; i < layers.length; i++) {
          if (selectedLayer == layers[i].fields['layername']) {
            $("#infofield").val(layers[i].fields['info']); // adds info and year data to form fields
            $("#yearfield").val(layers[i].fields['year']);
        }
      }

    })})});

$(document).ready(function() {
$( "#clearform" ).click(function() {
  document.getElementById("mapsform").reset(); // resets form entries
  $('select#layer option').prop('selectedIndex', 0)
  for (layer in map.getLayers()) {
    if (map.getLayers().getArray().length > 1) {
      map.getLayers().removeAt(1); // removes all layers except that at index 0, the stamen layer

  }
}
})});

// clearing for use in export function
function clearMapOnly() {
  for (layer in map.getLayers()) {
    if (map.getLayers().getArray().length > 1) {
      map.getLayers().removeAt(1);
    }}
    document.getElementById("mapsform").reset();
    map.addLayer(stamen)
}

// Solution for moving through select modified to update layer adding
// Title: Select next option with JQuery
// Author: Dev, stackoverflow
// Available at: http://stackoverflow.com/questions/11556557/select-next-option-with-jquery
$(function(){
  $('#fieldNext').on('click', function(){
    if ($('select#layer').find(":selected").index() <= $('select#layer option').length) {
      var selectedElement = $('select#layer option:selected');
      selectedElement.removeAttr('selected');
      selectedElement.next().attr('selected', 'selected');
      $('select#layer').val(selectedElement.next().val());
      $("select#layer").trigger('change'); // triggers the adding of layers to the map

}


  });
});

// Function to get GeoJSON data from the layers currently on the map
function getJsonfromCurrentMap() {
  if (map.getLayers().getArray().length >0) {
    specificLayer = map.getLayers().getArray();
    specificLayer.splice(0, 1); // takes layers except for base layer
    if (specificLayer[0] == null) { // checks there are layers on the map
      map.addLayer(stamen)
    }
    else {
      var specificSource = new ol.source.Vector({}) // new source for adding features to
      var containsArray = new Array; // Array to hold what is being exported
      for (var i = 0; i < map.getLayers().getArray().length; i++) {
          features = specificLayer[i].getSource().getFeatures();
          for (let feature of features) {

        }
          if (features.length >200) {
            break;
          }
          else {
            // must check if features are already in as cannot export duplicate features
          if (containsArray.indexOf(features[0].getProperties().name) === -1) {
            containsArray.push(features[0].getProperties().name)
            specificSource.addFeatures(features);
        }
      }

      }

      // New format for export
      var geoJSONExport = new ol.format.GeoJSON({
        'extractStyles':true,
        'defaultdataprojection': 'EPSG:3857',
        'featureProject' : 'EPSG:3857'

      })

      // Writes features and posts to a new browser window
      var geojsonoutput = geoJSONExport.writeFeatures(specificSource.getFeatures());
      var wnd = window.open("", "_blank");
      wnd.document.write(geojsonoutput);
      // clears map and instigates this function again so base layer is readded
      clearMapOnly()
      document.getElementById('exportjson').click()
    }

}
}
