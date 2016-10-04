import template from './image-upload.html';

export default {
  template,
  bindings: {
    record: '<',
    edit: '&'
  },
  controller: ['ckasset', controller]
};

function controller(ckasset){

  this.sendRequest = function sendRequest(){

    let filePath = document.getElementById(this.record);
    let file = filePath.files[0];

    var fileReader = new FileReader();

    fileReader.onloadend = element => {

      ckasset.request()
      .then( tokenResponseDictionary => {

        var data = new Uint8Array(element.target.result);

        ckasset.upload(tokenResponseDictionary.data.tokens[0].url, data, assetDictionary => {
          const recordName = tokenResponseDictionary.data.tokens[0].recordName;
          const fileName = filePath.files[0].name;
          const { singleFile } = assetDictionary.data;
          ckasset.modify(fileName, recordName, singleFile, finalObj => {
            console.log(finalObj);
            this.edit({ image: { field: 'imageRef', recordname: recordName } });
          });
        });
      });
    };

    fileReader.readAsArrayBuffer(file);
  };

}
