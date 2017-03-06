ProgramFactory.$inject = [];

export default function ProgramFactory(){

  class Program {
    /**
     * Constructor function for Program class model.
     *
     * @param {string}  programJson Serialized JSON representation of a Program
     *                              object as structured by CloudKit. Title
     *                              is the only required property, all others
     *                              are optional.
     */
    constructor(programJson){
      let jsonObj;

      try {
        jsonObj = JSON.parse(programJson);
      }catch(err){
        return null;
      }

      if (!jsonObj.fields.title) return null;

      this.title = jsonObj.fields.title.value;
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
    toJson(){
      const output = { fields: {} };
      output.fields.title = {value: this.title};

      if (this.video){
        output.fields.video = {value: this.video};
      }

      if (this.fulldescription){
        output.fields.fulldescription = {value: this.fulldescription};
      }

      if (this.imageRef){
        output.fields.imageRef = { type: 'REFERENCE', value: {} };
        output.fields.imageRef.value.recordName = this.imageRef;
        output.fields.imageRef.value.action = 'NONE';
      }

      return JSON.stringify(output);
    }
  }

  return Program;
}
