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
    console.log("migrations", migrations)
    for (let i = 0; i < migrations.length; i++) {
      let currentMigration = migrations[i]
      console.log(i, currentMigration.startLat, migrations[i].startLong);
      let circle = L.circle([migrations[i].startLat, migrations[i].startLong], { //the circle is a function requiring two arguments. in this case, the coordinates in the [] make up the first one, aka the location of the shape/center of the circle
        color: 'red', //this block makes up the entirety of the second argument being passed through the circle function
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100000
      }).addTo(map);
      console.log('created circle', migrations[i].title, circle);


      let circleEnd = L.circle([migrations[i].endLat, migrations[i].endLong], { //the circle is a function requiring two arguments. in this case, the coordinates in the [] make up the first one, aka the location of the shape/center of the circle
        color: 'blue', //this block makes up the entirety of the second argument being passed through the circle function
        fillColor: '#000',
        fillOpacity: 0.5,
        radius: 100000
      })
      const result = circleEnd.addTo(map);
      console.log(circleEnd)
      console.log('result', result)


      circle.bindTooltip(migrations[i].title, { permanent: true }).openTooltip();
      circleEnd.bindTooltip(migrations[i].title, { permanent: true }).openTooltip()
      //another function. this time, the argument will be the message that will appear inside the popup
      //.bindTooltip = another method, applied to the circle variable. 

      let c = circle.bindPopup(`
${migrations[i].title}, ${migrations[i].caption},
<a href='${migrations[i].article}'>See full article</a>
<span>See full article</span><br></br>
<button class="saveforlater" onclick="saveMigration('${migrations[i]._id}')">Save for later reference</button>
`, {});

      circleEnd.bindPopup(`
// ${migrations[i].title}, ${migrations[i].people},
// <a href='${migrations[i].article}'>See full article</a>
// <span>See full article</span><br></br>
// <button class="saveforlater" onclick="saveMigration('${migrations[i]._id}')">Save for later reference</button>
// `, {});
      // var pathLine = L.polyline([[migrations[i].startLat, migrations[i].startLong ], [migrations[i].endLat, migrations[i].endLong]]).addTo(map)

      //   console.log('bound popup', migrations[i].title, c)


      // c.bindPopup(`
      // ${migrations[i].title}, ${migrations[i].people},
      // <a href='${migrations[i].articleEnd}'>See full article</a>
      // <span>See full article</span><br></br>
      // <button class="saveforlater" onclick="saveMigration('${migrations[i]._id}')">Save for later reference</button>
      // `, {});
      //     var pathLine = L.polyline([[migrations[i].startLat, migrations[i].startLong ], [migrations[i].endLat, migrations[i].endLong]]).addTo(map)

      //       console.log('bound popup', migrations[i].title, c)

      // circleEnd.bindPopup(`
      // ${migrations[i].title}, ${migrations[i].people},
      // <a href='${migrations[i].article}'>See full article</a>
      // <span>See full article</span><br></br>
      // `,
      // {});//another function. this time, the argument will be the message that will appear inside the popup
      //.bindTooltip = another method, applied to the circle variable.

      var polyline = L.polyline([[migrations[i].startLat, migrations[i].startLong], [migrations[i].endLat, migrations[i].endLong]]);
      var decorator = L.polylineDecorator(polyline, {
        patterns: [
          // defines a pattern of 10px-wide dashes, repeated every 20px on the line
          {
            offset: 0,
            repeat: 20,
            symbol: L.Symbol.dash({
              pixelSize: 10
            })
          }
        ]
      }).addTo(map);
    }

  }) //for loop ends here

// var polyline = L.polyline([[23,120],[16,121]]);
// var decorator = L.polylineDecorator(polyline, {
//   patterns: [
//     // defines a pattern of 10px-wide dashes, repeated every 20px on the line
//     {
//       offset: 0,
//       repeat: 20,
//       symbol: L.Symbol.dash({
//         pixelSize: 10
//       })
//     }
//   ]
// }).addTo(map);

//fetch function to send info to the server
function saveMigration(migrationId) {
  console.log('saveMigration');
  fetch('/saveMigration', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ migrationId: migrationId }) //the onclick method is saving the _id as the body for the fetch to happen.
  })
    .then(response => {
      //show some kind of notice/alert/etc that the update happened
      if (response.ok) {
        alert('saved')
      }
    })
}

let historyBg = ["img/backgrounds/bg-01.jpg", "img/backgrounds/bg-02.jpg", "img/backgrounds/bg-03.jpg"]
// cards.sort(() => (Math.random() - 0.5 ));
// let arr =  document.querySelectorAll('img')
// let firstCard = null //<- 'firstCard' represents the first card of a specific match
// arr.forEach((e,i) => e.src =  cards[i] )//'i' begins as card = 0 because it is the first iteration in the array

//document.getElementById("body").addEventListener('load', randombg)

function randombg() {
  historyBg.sort(() => (Math.random() - 0.5));
  var bigSize = ["url('img/backgrounds/bg-01.jpg')",
    "url('img/backgrounds/bg-02.jpg')",
    "url('img/backgrounds/bg-03.jpg')",
    "url('img/backgrounds/bg-04.jpg')",
    "url('img/backgrounds/bg-05.jpg')",
    "url('img/backgrounds/bg-06.jpg')"];

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
const trash = document.querySelectorAll('.fa-trash')
console.log(trash)
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    console.log('button clicked')
    fetch('/saveMigration', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        migrationId: element.dataset.id,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

const viewPopup = document.querySelector('#popupBox')
const findPopup = document.querySelector('#popupText')

const userNotes = document.querySelectorAll('.viewNote')
Array.from(userNotes).forEach(function (element) {
  element.addEventListener('click', function () {
    console.log('button clicked')
    fetch('/userNotes', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        migrationId: element.dataset.id,
      })
    }).then(function (response) { //show popup
      let jsonRes = response.JSON()
      viewPopup.setAttribute('data-migrationId', element.dataset.id)
      if (jsonRes = null) {
        findPopup.value = ''
      } else {
        findPopup.value = jsonRes.note
      }
      viewPopup.style.display = "block"
      // window.location.reload()
    })
  });
});


// function CustomAlert() {

//   this.render = function () {

//     //Show Modal

//     let popUpBox = document.getElementById('popUpBox');
//     popUpBox.style.display = "block";

//     //Close Modal
//     document.getElementById('closePopup').innerHTML = '<button onclick="Alert.ok()">Save</button>';
//   }


//   this.ok = function () {
//     document.getElementById('popUpBox').style.display = "none";
//     document.getElementById('popUpOverlay').style.display = "none"
//   }
// }
