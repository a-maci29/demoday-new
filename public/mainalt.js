
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
    console.log(migrations)
    function makeNode(m, parent) {
      console.log('makeNode', m, parent)
      console.log(i, m.lat, m.long);
      let circle = L.circle([m.lat, m.long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100000
      }).addTo(map);
      console.log('created circle', migrations[i].title, circle);

      circle.bindTooltip(m.key, { permanent: true }).openTooltip();

      let c = circle.bindPopup(`
${m.key}, ${'people'},
<a href='article'>See full article</a>
<span>See full article</span><br></br>
<button class="saveforlater" onclick="saveMigration('${m._id}')">Save for later reference</button>
`, {});

      console.log('bound popup', migrations[i].title, c)
      if(parent){
      var pathLine = L.polyline([[parent.lat, parent.long], [m.lat, m.long]]).addTo(map)
      }

      for (let i = 0; i < m.branchKeys.length; i++) {
        makeNode(migrations.find(x => x.key === m.branchKeys[i]), m)
      }

    }
    const rootNodes = migrations.filter(m => m.root)
    console.log('rootNodes', rootNodes)
    for (i = 0; i < rootNodes.length; i++) {
      makeNode(rootNodes[i])

    }



  }) 
function saveMigration(migrationId) {
  console.log('saveMigration');
  fetch('/saveMigration', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ migrationId: migrationId })
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