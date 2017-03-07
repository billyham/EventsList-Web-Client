ProgramFactory.$inject = [];

export default function ProgramFactory(){

  class Program {
    /**
     * Constructor function for Program class model.
     *
     * @param {string}  programJson Serialized JSON representation of a Program
     *                              object as structured by CloudKit. Title and
     *                              recordName are the only required properties,
     *                              all others are optional.
     */
    constructor(jsonObj){
      if (!jsonObj || !jsonObj.fields || !jsonObj.fields.title) return null;

      this.title = jsonObj.fields.title.value;
      this.recordName = jsonObj.recordName;

      this.video = '';
      this.fulldescription = '';
      this.imageRef = '';

      if (jsonObj.fields.video){
        this.video = jsonObj.fields.video.value;
      }

      if (jsonObj.fields.fulldescription){
        this.fulldescription = jsonObj.fields.fulldescription.value;
      }

      if (jsonObj.fields.imageRef){
        this.imageRef = jsonObj.fields.imageRef.value.recordName;
      }

    }

    /**
     * Converts a Program model object to the JSON structure as defined by
     * CloudKit and the Record Type fields.
     *
     * @return  {string}  Serialized JSON object
     */
    toObject(){
      const output = Object.create(null);
      output.fields = Object.create(null);

      output.recordName = this.recordName;
      output.fields.title = Object.create(null);
      output.fields.title.value = this.title;
      output.fields.title.type = 'STRING';

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
      }

      return output;
    }

    toJson(){
      const output = this.toObject;
      return JSON.stringify(output);
    }
  }

  return Program;
}
