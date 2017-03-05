
export default function imageFileService(){

  return {
    /**
     * Evaluates the pixel size of an image and returns an object. Currently works
     * for JPEG and PNG file types.
     *
     * @param  {ArrayBuffer} arrayBuffer  Raw image data.
     * @param  {string} imageType         File type, expects "image/png" or "image/jpeg"
     *
     * @return {Object}  An object with properties for pixel dimensions of the image:
     *                        width: {number}
     *                        height: {number}
     *                   Will return null if the evaluation fails.
     */
    getImageSize(arrayBuffer, imageType){

      const MARKER_PREFIX           = 255;
      const EXIF_APP1_MARKER        = 225;
      const EXIF_APP1_CONFIRMATION  = 1165519206;
      const EXIF_SUB_IFD            = 34665;
      const START_OF_SCAN_MARKER    = 218;
      const INTEL_BYTE              = 73;
      // const MOTOROLA_BYTE           = 77;

      const EXIF_IMAGE_WIDTH        = 256;
      const EXIF_IMAGE_HEIGHT       = 257;
      // EXIF_ORIENTATION = 274
      // EXIF_ORIENTATION = 112

      const EXIF_SUB_IFD_WIDTH      = 40962;
      const EXIF_SUB_IFD_HEIGHT     = 40963;

      let rawWidth = 0;
      let rawHeight = 0;

      const dataV = new DataView(arrayBuffer);

      function startOfFrame(tag) {
        if(
          (tag >= 192 && tag <= 195) ||
          (tag >= 197 && tag <= 199) ||
          (tag >= 201 && tag <= 203) ||
          (tag >= 205 && tag <= 207)
        ) return true;
      }

      function subIFD(startByte, offsetToFirstIFD, i, isIntelAlign){
        let IFDWidth = 0;
        let IFDHeight = 0;
        let subOffset = dataV.getUint16(startByte + 9 + offsetToFirstIFD + 2 + (i * 12) + (isIntelAlign ? 8 : 10), isIntelAlign);

        if (subOffset === 0) return false;
        let fullSubOffset = startByte + 9 + subOffset;
        let numOfSubs = dataV.getUint16(fullSubOffset, isIntelAlign);

        // Bitmask to exit the loop if width and height are found;
        let widthFlag = 1, heightFlag = 2, flags = 0;
        for (let n = 0; n < numOfSubs; n++){

          let entryItem = dataV.getUint16(fullSubOffset + 2 + (n * 12), isIntelAlign);

          if (entryItem === EXIF_SUB_IFD_WIDTH){
            IFDWidth = dataV.getUint32(fullSubOffset + 2 + (n * 12) + 8, isIntelAlign);
            if (flags & heightFlag) return {width: IFDWidth, height: IFDHeight};
            flags |= widthFlag;
          }

          if (entryItem === EXIF_SUB_IFD_HEIGHT){
            IFDHeight = dataV.getUint32(fullSubOffset + 2 + (n * 12) + 8, isIntelAlign);
            if (flags & widthFlag) return {width: IFDWidth, height: IFDHeight};
            flags |= heightFlag;
          }
        }
      }

      if (imageType === 'image/png'){
        rawWidth = dataV.getUint32(16);
        rawHeight = dataV.getUint32(20);
        return { width: rawWidth, height: rawHeight };

      }else if (imageType === 'image/jpeg'){
        // While(! start of scan marker){...  could be used in place of a for loop,
        // but the for loop will guard against a corrupt file that lacks a start
        // of scan marker.
        for(let x = 0; x < 40000; x++){
          if (dataV.getUint8(x) === MARKER_PREFIX){
            let byte = x + 1;

            // APP1 Marker (EXIF)
            if (dataV.getUint8(byte) === EXIF_APP1_MARKER){
              // Check if EXIF header marker or APP1 Marker was false positive
              if (dataV.getUint32(byte + 3) !== EXIF_APP1_CONFIRMATION) continue;

              // 73 73: Intel byte align uses little endian
              // 77 77: Motorola byte align uses big endian
              let isIntelAlign = false;
              if (dataV.getUint8(byte + 9) === INTEL_BYTE && dataV.getUint8(byte + 10) === INTEL_BYTE) isIntelAlign = true;

              // Offset to the first IFD
              const offsetToFirstIFD = dataV.getUint32(byte + 13, isIntelAlign);
              const entryCount = dataV.getUint16(byte + 9 + offsetToFirstIFD, isIntelAlign);
              // Each entry is 12 bytes:
              //   2 bytes for tag number
              //   2 bytes for data type
              //   4 bytes for number of components
              //   4 bytes for data (or offset to data)
              for (let i = 0; i < entryCount; i++){
                let tagNum = dataV.getUint16(byte + 9 + offsetToFirstIFD + 2 + (i * 12), isIntelAlign);

                // Found Image Width (however for some files this is thumbnail width)
                if (tagNum === EXIF_IMAGE_WIDTH){
                  let actualWidth = dataV.getUint16(byte + 9 + offsetToFirstIFD + 2 + (i * 12) + 8, isIntelAlign);
                  if (!rawWidth) rawWidth = actualWidth;
                }

                // Found Image Height (however for some files this is thumbnail height)
                if (tagNum === EXIF_IMAGE_HEIGHT){
                  let actualHeight = dataV.getUint16(byte + 9 + offsetToFirstIFD + 2 + (i * 12) + 8, isIntelAlign);
                  if (!rawHeight) rawHeight = actualHeight;
                }

                // EXIF SubIFD marker
                // EXIF SubIFD is authoritative. If height and width properties
                // exist here, they take precedence and can be trusted to be
                // definitive.
                if (tagNum === EXIF_SUB_IFD){
                  const IFDResult = subIFD(byte, offsetToFirstIFD, i, isIntelAlign);
                  if (!IFDResult) continue;
                  if (!IFDResult.width || !IFDResult.height) return null;
                  return IFDResult;
                }
              }
            }

            // Start-Of-Frame marker
            if (startOfFrame(dataV.getUint8(byte))){
              if (!rawHeight) rawHeight = dataV.getUint16(byte + 4);
              if (!rawWidth) rawWidth = dataV.getUint16(byte + 6);
            }

            // Start-Of-Scan marker, stop looking for markers
            if (dataV.getUint8(byte) === START_OF_SCAN_MARKER) {
              break;
            }
          }
        }
        // Return dimensions if valid
        if (rawWidth && rawHeight) return { width: rawWidth, height: rawHeight };

        // Failed to find dimensions
        return null;

      }else{
        // Unrecognized image type
        return null;
      }
    }
  };

}
