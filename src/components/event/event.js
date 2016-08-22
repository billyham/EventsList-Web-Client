import template from './event.html';

export default {
  template,
  bindings: {
    ckqueryResult: '<',
    // arrayOfRecords: '<',
    arrayOfImages: '<'
  },
  controller: ['ckquery', controller]
};

function controller(ckquery){

  this.loadMore = function(){
    console.log('loadMore fires');
    ckquery.demoPerformQuery('PUBLIC','_defaultZone',null,'Program',
      ['title', 'imageRef', 'video'],null,null,null,null,
      [], this.ckqueryResult.continuationMarker)
      .then(result => {
        let array = result.records.map( element => {
          return {fields: element.fields};
        });
        this.ckqueryResult.records = this.ckqueryResult.records.concat(array);
        this.ckqueryResult.continuationMarker = result.continuationMarker;
      });
  };

}
