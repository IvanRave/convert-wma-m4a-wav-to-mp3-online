var app = window.app || {};

(function(document){

  /**
   * @returns {Promise} jobResult or jobError
   */
  var readJob = function(id){
    return app.apiGet('/read-job', { id: id });   
  };

  /**
   * Handle errors.
   * Basically fetch() will only reject a promise if the user is offline, or some unlikely networking error occurs, such a DNS lookup failure.
   */
  var catchJobResult = function(err){
    console.log(err);
    app.hidePending();
    alert('Error');
  };

  var showLink = function(jobResult){
    
    var str = jobResult.DstFile;

    if (jobResult.FileSize) {
      var sizeMB = parseFloat((jobResult.FileSize || 0) / 1024 / 1024).toFixed(2);

      str += ' (' + sizeMB + 'MB)';
    }
    
    var link = document.createElement('a');
    link.href = jobResult.DstPath + encodeURIComponent(jobResult.DstFile);
    link.innerText = str;
    link.target = "_blank";

    var wrap = document.createElement('div');
    wrap.style.margin = 20;
    wrap.style.textAlign = 'center';
    wrap.appendChild(link);
    document.body.appendChild(wrap);
  };

  /**
   * Wait while status will be Success
   */
  var handleJobResult = function(jobResult){
    if (jobResult.Status !== 'Complete'){
      setTimeout(function(){    
        readJob(jobResult.Id)
          .then(handleJobResult)
          .catch(catchJobResult);
      }, 1500);
    } else {
      console.log(jobResult);
      app.hidePending();
      showLink(jobResult);
      alert("success");
    }
  };

  /**
   * Constructor for a button
   * @param {string} fileBaseName To encode
   * @param {number} kbps Kbps, e.g. 320, etc.
   */
  app.createEncodeButton = function(fileBaseName, kbps){
    var btnEncode = document.createElement('button');
    btnEncode.onclick = function(){
      btnEncode.disabled = true;
      app.showPending();
      app.apiPost('/encode-to-mp3', {
        name: fileBaseName,
        kbps: kbps
      })
        .then(handleJobResult)
        .catch(catchJobResult)
        .then(function(){
          btnEncode.disabled = false;
        });
    };

    btnEncode.style.padding = 16;
    btnEncode.style.margin = 8;
    
    btnEncode.innerText = 'Encode to MP3 ' + kbps + 'kbps';
    return btnEncode;
  };

})(window.document);
