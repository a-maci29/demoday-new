//const { json } = require("body-parser");


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
        migrationId : element.dataset.id,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});