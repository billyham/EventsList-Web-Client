ProgramFactory.$inject = [];

export default function ProgramFactory(){

  class Program {
    /**
     * Constructor function for Program class model.
     *
     * @param {string}  programJson Serialized JSON representation of a Program
     *                              object as structured by CloudKit. Some Record
     *                              Type fields are optional: video, fulldescription,
     *                              imageRef.
     */
    constructor(jsonObj){
      if (!jsonObj || !jsonObj.fields || !jsonObj.fields.title) return null;

      this.title = jsonObj.fields.title.value;
      this.recordName = jsonObj.recordName;
      this.recordChangeTag = jsonObj.recordChangeTag;

      // Optional properties
      this.ownerRecordName = '';
      this.zoneName = '';
      this.deviceID = '';
      this.timestamp = '';
      this.userRecordName = '';

      this.video = '';
      this.fulldescription = '';
      this.imageRef = '';

      if (jsonObj.zoneID){
        this.ownerRecordName = jsonObj.zoneID.ownerRecordName;
        this.zoneName = jsonObj.zoneID.zoneName;
      }

      if (jsonObj.created){
        this.deviceID = jsonObj.created.deviceID;
        this.timestamp = jsonObj.created.timestamp;
        this.userRecordName = jsonObj.created.userRecordName;
      }


      if (jsonObj.fields.video){
        this.video = jsonObj.fields.video.value;
      }

      if (jsonObj.fields.fulldescription){
        this.fulldescription = jsonObj.fields.fulldescription.value;
      }

      if (jsonObj.fields.imageRef && jsonObj.fields.imageRef.value){
        this.imageRef = jsonObj.fields.imageRef.value.recordName;
      }

    }

    /**
     * Converts a Program model object to the object structure as defined by
     * CloudKit and the Record Type fields.
     *
     * @return  {Object}  Javascript object (but with no __proto__ properties)
     */
    toObject(){
      const output = Object.create(null);

      output.recordName = this.recordName;
      output.recordChangeTag = this.recordChangeTag;
      output.recordType = 'Program';

      output.zoneID = Object.create(null);
      output.zoneID.ownerRecordName = this.ownerRecordName;
      output.zoneID.zoneName = this.zoneName;

      output.fields = Object.create(null);
      output.fields.title = Object.create(null);
      output.fields.title.value = this.title;
      output.fields.title.type = 'STRING';

      // Optional properties
      if (this.video){
        output.fields.video = Object.create(null);
        output.fields.video.value = this.video;
        output.fields.video.type = 'STRING';
      }

      if (this.fulldescription){
        output.fields.fulldescription = Object.create(null);

        output.fields.fulldescription.value = this.fulldescription;
        output.fields.fulldescription.type = 'STRING';
      }

      if (this.imageRef){
        output.fields.imageRef = Object.create(null);
        output.fields.imageRef.type = 'REFERENCE';
        output.fields.imageRef.value = Object.create(null);
        output.fields.imageRef.value.recordName = this.imageRef;
        output.fields.imageRef.value.action = 'NONE';
      }else{
        output.fields.imageRef = Object.create(null);
        output.fields.imageRef.type = 'REFERENCE';
        output.fields.imageRef.value = null;
      }

      return output;
    }

    /**
     * Converts a Program model object to the JSON structure as defined by
     * CloudKit and the Record Type fields.
     *
     * @return  {string}  Serialized JSON object
     */
    toJson(){
      const output = this.toObject;
      return JSON.stringify(output);
    }
  }

  return Program;
}
