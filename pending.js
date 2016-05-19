var app = window.app || {};

(function(){

  var pending = document.createElement('div');
  pending.innerText = 'progressing...';
  pending.style.margin = 16;
  pending.style.textAlign = 'center';
  pending.style.visibility = 'hidden';
  pending.style.fontSize = '1.2rem';
  document.getElementById('loader').appendChild(pending);
  
  app.showPending = function(){
    pending.style.visibility = 'visible';
  };

  app.hidePending = function(){
    pending.style.visibility = 'hidden';
  };

})();
