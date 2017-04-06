var js_list = "{{names|escapejs}}"
console.log(js_list)

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

    // create a layer with the OSM source
    var layer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner-lite'
        })
    });

    map = new ol.Map({
        target: 'mapcontainer',
        renderer: 'canvas',
        view: new ol.View({
            projection: 'EPSG:3857',
            center: ol.proj.transform([2.4, 48], 'EPSG:4326', 'EPSG:3857'),
            zoom: 4,
        })
    });

    var stamen = new ol.layer.Tile({
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

}

function addingSavedMapFeaturesToLayer() {

    var names = document.getElementById('layer');
    var userColour = names.options[names.selectedIndex].value;
    var text = names.options[names.selectedIndex].text;
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", ");
    console.log(nameArray)

    for (let name of nameArray) {
        console.log(name)
        var trimmedname = name.replace(/[^a-zA-Z0-9]/g, "");
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
                        color: userColour
                    })
                })
            ]
        })
        //console.log(specificSource.getFeatures())
        map.addLayer(specificLayer)

    }
}

function addingSavedFeaturesToLayer() {

    var names = document.getElementById('dropdown');
    var text = names.options[names.selectedIndex].text;
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", ");
    console.log(nameArray);
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
        map.addLayer(specificLayer)

    }
}

function addingFeaturesToLayer() {

    var names = document.getElementById('value').value;
    var nameArray = names.split(", ");

    for (let name of nameArray) {

        var featureList = new Array;

        var specificSource = new ol.source.Vector({})

        features = generalLayer.getSource().getFeatures();
        for (var i = 0; i < features.length; i++) {
            if (features[i].getProperties().name == name) {
                featureList.push(features[i])
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
        map.addLayer(specificLayer)

    }
}

function clearLayers() {
    map.getLayers().removeAt(1);
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
                        options += '<option value="' + layers[i].fields['layercolour'] + '">' + layers[i].fields['countrylist'] + layers[i].fields['year'] + layers[i].fields['layercolour'] + '</option>';
                    }
                    $("select#layer").html(options);
                    $("select#layer option:first").attr('selected', 'selected');
                    $("select#layer").attr('disabled', false);
                });
            }
        });
        $("select#layer").change(function(vent) {
            console.log('entered')
            addingSavedMapFeaturesToLayer();
            if ($(this).val() == -1) {
                return;
            }
        });
    });

$(document).ready(
  function() {
    $("select#layer").change(function() {
      var url = "map/" + $('select#map').val() + "/all_json_models";
      var map = $(this).val();
      $.getJSON(url, function(layers) {
        for (var i = 0; i < layers.length; i++) {
        $("#infofield").val(layers[i].fields['info']);
        $("#yearfield").val(layers[i].fields['year']);
        console.log(layers[i].fields['info']);
      }

    })})});

function clearform() {
  document.getElementById("mapsform").reset();
  var layers = map.getLayers().getArray();
  for (layer in layers)
    clearmap(layer);
}

function clearmap(layer) {
  map.getLayers().removeAt(1);
}
