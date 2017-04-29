$(function(){
  $('#fieldPrevious').on('click', function(){
      if ($('select#layer').find(":selected").index() != 0) {
        var selectedElement = $('select#layer option:selected');
        selectedElement.removeAttr('selected');
        selectedElement.prev().attr('selected', 'selected');
        $('select#layer').val(selectedElement.prev().val());
        // $("select#layer").trigger('change');
        clearLastAdded();
}

  });
});

function clearLastAdded() {
    var names = document.getElementById('layer');
    var userColour = names.options[names.selectedIndex].value;
    var text = names.options[names.selectedIndex].text;
    var string = text.substring(text.lastIndexOf("[") + 2, text.lastIndexOf("]") - 1);
    var nameArray = string.split(", ");
    specificLayer = map.getLayers().getArray();
    specificLayer.splice(0, 1);
    console.log(specificLayer[0].getSource().getFeatures())
    for (let name of nameArray) {
        var trimmedname = name.replace(/[^a-zA-Z0-9]/g, "");
        features = specificLayer[1].getSource().getFeatures();
        console.log(features)
        console.log(specificLayer[0].getSource())
        specificLayer[0].getSource().clear()
        map.addLayer(stamen)
    }
}
