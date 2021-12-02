

const map = L.map('map').setView([21.346982, 105.326259], 5);
var Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


map.addLayer(Stadia_OSMBright)


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
      let circle = L.circle([migrations[i].startLat, migrations[i].startLong], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 70000
      }).addTo(map);
      console.log('created circle', migrations[i].title, circle);


      let circleEnd = L.circle([migrations[i].endLat, migrations[i].endLong], {
        color: 'blue',
        fillColor: '#000',
        fillOpacity: 0.5,
        radius: 70000
      })
      const result = circleEnd.addTo(map);
      console.log(circleEnd)
      console.log('result', result)

      let c = circle.bindPopup(`
${migrations[i].title}, ${migrations[i].caption},
<a href='${migrations[i].article}'>See full article</a>
<span></span><br></br>
<input id="notes:${migrations[i]._id}"></input>
<button class="saveforlater" onclick="saveMigration('${migrations[i]._id}')">Save for later reference</button>
`, {});

      circleEnd.bindPopup(`
${migrations[i].title}, ${migrations[i].caption},
 <a href='${migrations[i].articleEnd}'>See full article</a>
 <span></span><br></br>
 <input id="notes:${migrations[i]._id}"></input>
 <button class="saveforlater" onclick="saveMigration('${migrations[i]._id}')">Save for later reference</button>
  `, {});

      var polyline = L.polyline([[migrations[i].startLat, migrations[i].startLong], [migrations[i].endLat, migrations[i].endLong]]);
      var decorator = L.polylineDecorator(polyline, {
        patterns: [
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

  })

function zoomToArea(area){
  if(area === 'Southeast Asia'){
    map.flyTo([21.346982, 105.326259], 5);
  } else if(area === 'Central America'){
    map.flyTo([16.62178758039309, -91.87169987798701]);
  }
}

function saveMigration(migrationId) {
  const inputId = `notes:${migrationId}`
  const input = document.getElementById(inputId)
  console.log('saveMigration');
  fetch('/saveMigration', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ migrationId: migrationId, notes:input.value })
  })
    .then(response => {
  
      if (response.ok) {
        alert('saved')
      }
    })
}

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

