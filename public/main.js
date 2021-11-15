

const map = L.map('map').setView([21.346982, 105.326259], 5);
setTimeout(() =>{map.flyTo([10, 10], 3)},2000) //setTimeout method an anonymous function and the time as the two parameters
//L = leaflet (the API)
//L.map([id of the div designated to be where the map is]) <--initialize map
//.setView <- another method that is being called upon the map that is setting up the initial coordinates and the zoom level
var Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
//^^creating a variable of the base map


map.addLayer(Stadia_OSMBright)
let circle = L.circle([21.346982, 105.326259], { //the circle is a function requiring two arguments. in this case, the coordinates in the [] make up the first one, aka the location of the shape/center of the circle
  color: 'red', //this block makes up the entirety of the second argument being passed through the circle function
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 200000
}).addTo(map); 

circle.bindTooltip("Hồng Bàng dynasty, c. 2879 (?)–258 BC", {permanent : true}).openTooltip(); //another function. this time, the argument will be the message that will appear inside the popup
//.bindTooltip = another method, applied to the circle variable.

circle.bindPopup(`
TITLE. Or whatever else.
<img class='' src='https://upload.wikimedia.org/wikipedia/commons/5/50/World_500_BCE_showing_Van_Lang.png'>
<span>Save for reference</span>
`, 
{}); //another function. this time, the argument will be the message that will appear inside the popup
//.bindTooltip = another method, applied to the circle variable.




 Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
}); 
