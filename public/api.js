var app = app || {};

(function(fetch){
  'use strict';

  var buildParams = function(obj){
    var reqParams = [];
    for (var key in obj){
      reqParams.push(key + '=' + encodeURIComponent(obj[key]));
    }

    return reqParams.join('&');
  };

  /**
   * @returns {Promise} Json object or Error with message
   */
  var handleFetch = function(response){
    if (!response.ok) {
      return response.json()
        .then(function(msg){
          return Promise.reject(new Error(msg));
        });
      
    }
    
    return response.json();
  };

  app.apiGet = function(url, params){
    if (params){
      url += '?' + buildParams(params);
    }
    
    return fetch("/api" + url)
      .then(handleFetch);
  };

  app.apiPost = function(url, params){
    var opts = {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    };

    if (params){
      opts.body = buildParams(params);
    }
    
    return fetch("/api" + url, opts)
      .then(handleFetch);
  };
  
})(window.fetch);
