'use strict';

// Initializes the ChattingListFunc.
function MapFunc() {
  document.addEventListener('DOMContentLoaded', function() {
    this.mapSearchText = document.getElementById('map_search');
    this.submitButton = document.getElementById('submit');
    this.map = document.getElementById('map');
    this.submitButton.addEventListener('click', this.searchMap.bind(this));
    /* this.google.maps.event.addListener(this.autoComplete, 'place_changed', function() {
         var place = autocomplete.getPlace();
         if (place.geometry) {
             map.panTo(place.geometry.location);
             map.setZoom(15);
         }
     });*/
  }.bind(this));
}

/* Map.prototype.autoComplete = function () {
    return new google.maps.places.Autocomplete(
        document.getElementById(search), {
            types: ['(cities)']})

};*/
MapFunc.prototype.searchMap = function() {
  this.map.setAttribute('src', 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCBo3swO_cz9JmPXG8rv4PJL79H5_wIFaM&q=' + this.mapSearchText.value);
};

window.demo = new MapFunc();
