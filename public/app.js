var app = window.app || {};

(function(Dropzone){
  'use strict';

  Dropzone.autoDiscover = false;

  var buildForm = function(data){

    var frm = document.createElement('form');
    frm.className = 'dropzone';
    frm.action = data.action;
    frm.method = data.method;
    frm.enctype = data.enctype;

    for (var paramKey in data.params) {   
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = paramKey;
      inp.value = data.params[paramKey];
      frm.appendChild(inp);
    }

    document.body.appendChild(frm);

    var arrKbps = [128, 160, 192, 320];

    var generateButton = function(fileBaseName){
      arrKbps.forEach(function(kbps){     
        document.body.appendChild(app.createEncodeButton(fileBaseName, kbps));
      });
    };
    
    var handleInit  = function(){
      this.on('addedfile', function(file){
        console.log(file);
      });

      this.on("sending", function(file, xhr, formData) {
        // Will send the filesize along with the file as POST data.
        formData.append("Content-Type", file.type);
      });

      // The file has been uploaded successfully. Gets the server response as second argument.
      this.on("success", function(file){
        console.log('success');
        console.log(file);

        generateButton(file.name);
        // file.size;
        // file.type;
        // file.lastModified;
      });
    };

    var opts = {
      // default: 1000
      filesizeBase: 1024,
      maxFiles: 1,
      acceptedFiles: (data.contentTypeStart || '') + '*',
      maxFilesize: data.contentLengthMaxMB || 5,
      clickable: true,
      autoProcessQueue: true,
      dictDefaultMessage: "Select or drop any audio file...",
      init: handleInit
    };
    
    var myDropzone = new Dropzone(frm, opts);

    console.log('myDropzone', myDropzone);
    
    var conds = document.createElement('ul');
    conds.innerHTML = '<li>maxFiles: ' + opts.maxFiles +
      '<li>acceptedFiles: ' + opts.acceptedFiles +
      '<li>maxFilesize, MB: ' + opts.maxFilesize;
      // '<li>' +
      // '<li>formAction: ' + frm.action +
      // '<li>formMethod: ' + frm.method +
      // '<li>formEnctype: ' + frm.enctype;
    document.body.appendChild(conds);
  };

  app.apiGet('/calc-form-params')
    .then(buildForm)
    .catch(function(err) {
      console.log(err);
      alert(err.message);
    });
  
})(window.Dropzone);
