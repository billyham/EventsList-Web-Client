imageService.$inject = ['ckassetService'];

export default function imageService(ckassetService){

  return {

    upload(dbType, croppedImageData, fileName, record){

      let recordName = '';

      return ckassetService.request(dbType)
      .then( tokenResponseDictionary => {
        var data = new Uint8Array(croppedImageData);

        return ckassetService.upload(tokenResponseDictionary.data.tokens[0].url, data, 'image/png')
        .then( assetDictionary => {
          recordName = tokenResponseDictionary.data.tokens[0].recordName;
          const name = fileName;
          const { singleFile } = assetDictionary.data;
          const referenceObj = { type: 'REFERENCE', value: { recordName: record, action: 'DELETE_SELF' } };
          return ckassetService.modify(name, referenceObj, recordName, singleFile, dbType);
        });
      })
      .catch(err => {
        console.log('imageService > upload error from ckassetService.request: ', err);
      });
    }
  };
}
