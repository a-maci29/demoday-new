//const { json } = require("body-parser");



const map = L.map('map').setView([21.346982, 105.326259], 5);
//setTimeout(() =>{map.flyTo([10, 10], 3)},2000) //setTimeout method an anonymous function and the time as the two parameters
//L = leaflet (the API)
//L.map([id of the div designated to be where the map is]) <--initialize map
//.setView <- another method that is being called upon the map that is setting up the initial coordinates and the zoom level
var Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


map.addLayer(Stadia_OSMBright) //adding the map

//^^creating a variable of the base map
fetch('/migrationsapi', {
  method: 'get',
  headers: { 'Content-Type': 'application/json' },
})
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(migrations => {
    console.log(migrations)
    for (let i = 0; i < migrations.length; i++) {
      let currentMigration = migrations[i]
      console.log(currentMigration.startLat, migrations[i].startLong);
      let circle = L.circle([migrations[i].startLat, migrations[i].startLong], { //the circle is a function requiring two arguments. in this case, the coordinates in the [] make up the first one, aka the location of the shape/center of the circle
        color: 'red', //this block makes up the entirety of the second argument being passed through the circle function
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100000
      }).addTo(map);

      let circleEnd = L.circle([migrations[i].endLat, migrations[i].endLong], { //the circle is a function requiring two arguments. in this case, the coordinates in the [] make up the first one, aka the location of the shape/center of the circle
        color: 'red', //this block makes up the entirety of the second argument being passed through the circle function
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100000
      })
      const result = circleEnd.addTo(map);
      console.log(circleEnd)
      console.log('result', result)


      circle.bindTooltip(migrations[i].title, { permanent: true }).openTooltip();
      // circleEnd.bindTooltip(migrations[i].title, { permanent: true }).openTooltip(); //another function. this time, the argument will be the message that will appear inside the popup
      //.bindTooltip = another method, applied to the circle variable. 

      circle.bindPopup(`
${migrations[i].title}, ${migrations[i].people},
<a href='${migrations[i].article}'>See full article</a>
<span>See full article</span><br></br>
<button class="saveforlater" onclick="saveMigration('${migrations[i]._id}')">Save for later reference</button>
`, {});



      // circleEnd.bindPopup(`
      // ${migrations[i].title}, ${migrations[i].people},
      // <a href='${migrations[i].article}'>See full article</a>
      // <span>See full article</span><br></br>
      // `,
      // {});//another function. this time, the argument will be the message that will appear inside the popup
      //.bindTooltip = another method, applied to the circle variable.

    }
  }) //for loop ends here

  //fetch function to send info to the server
  function saveMigration(migrationId){
    console.log('saveMigration');
    fetch('/saveMigration', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({migrationId: migrationId}) //the onclick method is saving the _id as the body for the fetch to happen.
    })
      .then(response => {
        //show some kind of notice/alert/etc that the update happened
        if (response.ok){
        alert('saved')
        }
      }) 
  }




/*Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
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
*/
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {  
    fetch('/saveMigration', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        migrationId : element.dataset.id,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});