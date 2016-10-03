import template from './image-upload.html';

export default {
  template,
  bindings: {
    record: '<'
  },
  controller: ['ckasset', controller]
};

function controller(ckasset){

  this.sendRequest = function sendRequest(){

    let filePath = document.getElementById(this.record);
    let file = filePath.files[0];

    var fileReader = new FileReader();

    fileReader.onloadend = function(element){

      ckasset.request( tokenResponseDictionary => {
        // console.log(tokenResponseDictionary);
        // console.log(element.target.result);
        var data = new Uint8Array(element.target.result);

        ckasset.upload(tokenResponseDictionary.data.tokens[0].url, data, function(assetDictionary){
          // console.log(assetDictionary);
          // console.log(assetDictionary.data.singleFile);
          const recordName = tokenResponseDictionary.data.tokens[0].recordName;
          const fileName = filePath.files[0].name;
          const { singleFile } = assetDictionary.data;
          ckasset.modify(fileName, recordName, singleFile);
        });
      });
    };
    
    fileReader.readAsArrayBuffer(file);
  };

}
