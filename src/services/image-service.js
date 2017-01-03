imageService.$inject = ['ckassetService', '$http'];

export default function imageService(ckassetService, $http){

  return {

    /**
     * Uploads an image file to the cloud store.
     *
     * @param  {string}       database            'PUBLIC' or 'PRIVATE'
     * @param  {ArrayBuffer}  croppedImageData    Image data as an ArrayBuffer
     * @param  {string}       fileName            Human readable file name
     * @param  {string}       programRecordName   ID of related program object
     *
     * @return {promise}      Resolves the complete image object.
     */
    upload(database, croppedImageData, fileName, programRecordName){

      return ckassetService.request(database)
      .then( tokenResponseDictionary => {
        var data = new Uint8Array(croppedImageData);

        return ckassetService.upload(tokenResponseDictionary.data.tokens[0].url, data, 'image/png')
        .then( assetDictionary => {
          const { recordName } = tokenResponseDictionary.data.tokens[0];
          const { singleFile } = assetDictionary.data;
          const referenceObj = { type: 'REFERENCE', value: { recordName: programRecordName, action: 'DELETE_SELF' } };
          return ckassetService.modify(fileName, referenceObj, recordName, singleFile, database);
        });
      })
      .catch(err => {
        throw err;
      });
    },

    /**
     * Download image raw binary data as an XHR request.
     *
     * @param  {string}   downloadURL   The CloudKit download URL.
     *
     * @return {promise}  Resolves an arrayBuffer of the raw data.
     */
    download(downloadURL){
      return $http.get(downloadURL, { responseType: 'arraybuffer' })
      .then( response => response.data );
    }
  };

}
