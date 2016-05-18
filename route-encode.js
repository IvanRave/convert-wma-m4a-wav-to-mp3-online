'use strict';

var conf = require('./conf');

var Encoder = require('media-encoder');

/** /encode */
class RouteEncode{
  constructor(AWS_ACCESS_KEY_ID,
              AWS_SECRET_ACCESS_KEY){
    this.encoder = new Encoder(AWS_ACCESS_KEY_ID,
                               AWS_SECRET_ACCESS_KEY,
                               conf.awsRegion,
                               conf.pipelineId,
                               conf.bucketName,
                               conf.outputBucketName);
  }

  handleJobResult(err, jobResult, next){
    if (err) {
      switch (err) {
      case this.encoder.errAccessDenied:
        next(new Error('access denied for your user'));
        return;
      case this.encoder.errAws:
        next(new Error('errAws: ' + this.encoder.errAws.message));
        return;
      }

      next(new Error('err: ' + err.message));
      return;
    }

    console.log(JSON.stringify(jobResult));

    next(null, jobResult);
    
    // if (jobResult.Status === "Submitted" || jobResult.Status === "Progressing"){
    //   next(null, jobResult);
    //   // setTimeout(() => {
    //   //   this.encoder.readJob(jobResult.Id, handleJobResult);
    //   // }, 1500);
    // } else {
    //   // return dest file path
    //   next(null, jobResult);
    //   return;
    // }
  }
  
  encode(fileBaseName, kbps, next){
    var presetId = conf["preset" + kbps];
    var outFolder = conf["out" + kbps];

    if (!presetId || !outFolder){
      next(new Error("kbps is not supported"));
      return;
    }
    
    this.encoder.createJob(conf.outBase + fileBaseName,
                           outFolder + fileBaseName,
                           presetId,
                           (err, jobResult) => {
                             this.handleJobResult(err, jobResult, next);
                           });

  }

  readJob(id, next) {
    this.encoder.readJob(id, (err, jobResult) => {
      this.handleJobResult(err, jobResult, next);
    });
  }
}

module.exports = RouteEncode;
