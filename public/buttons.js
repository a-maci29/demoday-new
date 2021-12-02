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