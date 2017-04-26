var jsList = "{{names|escapejs}}";

var stamen;

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
  console.log('initialized')

  var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
          ol.format.GPX,
          ol.format.GeoJSON,
          ol.format.IGC,
          ol.format.KML,
          ol.format.WKT,
          ol.format.TopoJSON
        ]
      });

    // create a layer with the OSM source
    var layer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner-lite'
        })
    });

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

    stamen = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner-lite'
        })
    });

    map.addLayer(stamen);

    var sourceF = new ol.source.Vector({
        projection: new ol.proj.get("EPSG:3857"),
        url: 'http://localhost:8080/all_countries',
        format: new ol.format.KML({
            extractStyles: false
        })
    })


    map.addLayer(generalLayer)

    generalLayer.getSource().on('change', function(evt) {
        generalLayer.setVisible(false)
    })

    dragAndDropInteraction.on('addfeatures', function(event) {
            var vectorSource = new ol.source.Vector({
              features: event.features
            });
            map.addLayer(new ol.layer.Vector({
              source: vectorSource,
              visibility: true,
            }));
            //map.getView().fit(vectorSource.getExtent());
          });

          var displayFeatureInfo = function(pixel) {
            var features = [];
            map.forEachFeatureAtPixel(pixel, function(feature) {
              feature.setGeometry('XY')
              console.log(feature)
              features.push(feature);
            });
            if (features.length > 0) {
              var info = [];
              var i, ii;
              for (i = 0, ii = features.length; i < ii; ++i) {
                info.push(features[i].get('name'));
              }
              document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
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

          map.on('click', function(evt) {
            displayFeatureInfo(evt.pixel);
          });

          var select = new ol.interaction.Select({
            condition: ol.events.condition.click
          });

          map.addInteraction(select);
              select.on('select', function(e) {
                document.getElementById('onclickinfo').innerHTML = '&nbsp;'
              });

              window.app = {};
      var app = window.app;

}

function addingSavedMapFeaturesToLayer() {

    var names = document.getElementById('layer');
    var userColour = names.options[names.selectedIndex].value;
    var text = names.options[names.selectedIndex].text;
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", ");
    //console.log(nameArray)

    for (let name of nameArray) {

        var trimmedname = name.replace(/^"+|"+$/g, '');
        var fullytrimmed = trimmedname.trim();


        var featureList = new Array;

        var specificSource = new ol.source.Vector({})

        features = generalLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            if (features[i].getProperties().name == trimmedname) {
                featureList.push(features[i])
                specificSource.addFeature(features[i])
                //console.log(features[i])
                map.removeLayer(generalLayer)
                console.log(features[i])
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
                        color: userColour
                    })
                })
            ]
        })

        //console.log(specificSource.getFeatures())

          console.log(featureList)
        map.addLayer(specificLayer);
        specificLayer.setOpacity(0.5);

    }

}

function addingSavedFeaturesToLayer() {

    var names = document.getElementById('dropdown');
    var text = names.options[names.selectedIndex].text;
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", ");
    //console.log(nameArray);
    console.log(text)
    if (text != "Select a Layer") {

    for (let name of nameArray) {
       console.log(name)
        var trimmedname = name.replace(/^[\n']+|[\n']+$/g, "");
        var fullytrimmed = trimmedname.trim();
        console.log(trimmedname)

        var featureList = new Array;

        var specificSource = new ol.source.Vector({})

        features = generalLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            if (features[i].getProperties().name == trimmedname) {
                featureList.push(features[i])
                specificSource.addFeature(features[i])

                //console.log(features[i])
                map.removeLayer(generalLayer)
                //console.log(featureList)
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
        console.log(specificSource.getFeatures());
        map.addLayer(specificLayer);
        document.getElementById('exportkml').disabled = false;

    }
  }
}

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
                console.log(featureList)
                console.log('here')
                specificSource.addFeature(features[i])
                //console.log(features[i])
                map.removeLayer(generalLayer)
                //console.log(featureList)
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
        //console.log(specificSource.getFeatures())
        console.log(nameArray.length)
        console.log(featureList.length)
        if (1 == featureList.length) {
        map.addLayer(specificLayer)
        document.getElementById('exportkml').disabled = false;
      }
    }
}

$(document).ready(
    function() {
        $("select#map").change(function() {
            if ($(this).val() == 'Z') {
                $("select#layer").html("<option>Select a layer</option>");
                $("select#layer").attr('disabled', true);
            } else {
                var url = "map/" + $(this).val() + "/all_json_models";
                var map = $(this).val();
                $.getJSON(url, function(layers) {
                    var options = '<option value="Z">Select a layer</option>';
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
      document.getElementById('exportkml').disabled = false;
      var url = "map/" + $('select#map').val() + "/all_json_models";
      var map = $(this).val();
      var selectedLayer = $(this).children(":selected").attr("id");
      console.log('here')
      $.getJSON(url, function(layers) {
        for (var i = 0; i < layers.length; i++) {
          console.log(selectedLayer)
          console.log(layers[i].fields['layername'])
          if (selectedLayer == layers[i].fields['layername']) {
            $("#infofield").val(layers[i].fields['info']);
            $("#yearfield").val(layers[i].fields['year']);
            console.log(layers[i].fields['layername'])
        }
      }

    })})});

$(document).ready(function() {
$( "#clearform" ).click(function() {
  document.getElementById("mapsform").reset();
  $('select#layer option').prop('selectedIndex', 0)
  for (layer in map.getLayers()) {
    if (map.getLayers().getArray().length > 1) {
      map.getLayers().removeAt(1);

  }
}
})});

function clearMapOnly() {
  for (layer in map.getLayers()) {
    if (map.getLayers().getArray().length > 1) {
      map.getLayers().removeAt(1);
    }}
    console.log('here')
    map.addLayer(stamen)
}

$(function(){
  $('#fieldNext').on('click', function(){
    if ($('select#layer').find(":selected").index() <= $('select#layer option').length) {
      var selectedElement = $('select#layer option:selected');
      selectedElement.removeAttr('selected');
      selectedElement.next().attr('selected', 'selected');
      $('select#layer').val(selectedElement.next().val());
      $("select#layer").trigger('change');

}


  });
});

// $(function(){
//   $('#fieldPrevious').on('click', function(){
//       if ($('select#layer').find(":selected").index() != 0) {
//         var selectedElement = $('select#layer option:selected');
//         selectedElement.removeAttr('selected');
//         selectedElement.prev().attr('selected', 'selected');
//         $('select#layer').val(selectedElement.prev().val());
//         // $("select#layer").trigger('change');
//         clearLastAdded();
// }
//
//   });
// });
//
// function clearLastAdded() {
//     var names = document.getElementById('layer');
//     var userColour = names.options[names.selectedIndex].value;
//     var text = names.options[names.selectedIndex].text;
//     var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
//     var nameArray = string.split(", ");
//     specificLayer = map.getLayers().getArray();
//     specificLayer.splice(0, 1);
//     console.log(specificLayer[0].getSource().getFeatures())
//     for (let name of nameArray) {
//         var trimmedname = name.replace(/[^a-zA-Z0-9]/g, "");
//         features = specificLayer[1].getSource().getFeatures();
//         console.log(features)
//         console.log(specificLayer[0].getSource())
//         specificLayer[0].getSource().clear()
//         map.addLayer(stamen)
//     }
// }

function getKMLfromCurrentMap() {
  if (map.getLayers().getArray().length >0) {
    specificLayer = map.getLayers().getArray();
    specificLayer.splice(0, 1);
    console.log(specificLayer)
    if (specificLayer[0] == null) {
      console.log('here')
      map.addLayer(stamen)
    }
    else {
      var specificSource = new ol.source.Vector({})
      var containsArray = new Array;
      var addArray = new Array;
      for (var i = 0; i < map.getLayers().getArray().length; i++) {
          features = specificLayer[i].getSource().getFeatures();

          if (features.length >200) {
            break;
          }
          else {
          console.log(features)
          if (containsArray.indexOf(features[0].getProperties().name) === -1) {
            containsArray.push(features[0].getProperties().name)
            specificSource.addFeatures(features);
        }
      }

      }

      var geoJSONExport = new ol.format.GeoJSON({
        // 'maxDepth':10,
        'extractStyles':true,
        'defaultdataprojection': 'EPSG:3857',
        'featureProject' : 'EPSG:3857'

      })

      var geojsonoutput = geoJSONExport.writeFeatures(specificSource.getFeatures());
      console.log(geojsonoutput)
      var wnd = window.open("", "_blank");
      wnd.document.write(geojsonoutput);
      clearMapOnly()
      document.getElementById('exportkml').click()
    }

}
}
