'use strict';

var conf = require('./conf');
var Conv = require('direct-upload-s3');

class RouteForm {
  constructor(AWS_ACCESS_KEY_ID,
              AWS_SECRET_ACCESS_KEY){
    this.awsService = 's3';
    this.conv = new Conv(AWS_ACCESS_KEY_ID,
                         AWS_SECRET_ACCESS_KEY,
                         this.awsService,
                         conf.awsRegion);
  }
  
  run(next){
    // depends of current time
    var base64Policy = this.conv.getBase64Policy(conf.bucketName,
                                            conf.acl,
                                            conf.expiresInterval,
                                            conf.contentTypeStart,
                                            0,
                                            conf.contentLengthMaxMB * 1024 * 1024);

    var signature = this.conv.getSignature(base64Policy);

    var formParams = this.conv.getFormParams(conf.acl,
                                        conf.outBase + "${filename}",
                                        signature,
                                        base64Policy);

    var form = {
      action: 'https://'+ conf.bucketName +'.'+ this.awsService + '-'+ conf.awsRegion +'.amazonaws.com/',
      method: 'POST',
      enctype: 'multipart/form-data',
      contentLengthMaxMB: conf.contentLengthMaxMB,
      contentTypeStart: conf.contentTypeStart,
      params: formParams
    };

    next(null, form);
  }
}

module.exports = RouteForm;
