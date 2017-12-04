window.onload = function() {
  fetch(window.location.href, {method: 'POST'})
  .then(res=>res.json())
  .then(json=>{
    let visitText = json.visits>1 ? " visits" : " visit";
    document.querySelector('span#visits').innerHTML='with '+json.visits+visitText;
  });
};
