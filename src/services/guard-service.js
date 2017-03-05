
export default function guardService() {
  return {
    /**
     * A helper function to test the validity of nested properties on an object.
     *
     * @param {Object}  obj   Any javascript object, can be null
     * @param {string}  args  Any number of strings, identifying the property names
     *                        in sequence from parent to child.
     *
     * @return {boolean}      Returns false if the chain of all properties exists
     *                        with truthy values. Returns true if the guard is
     *                        triggered by the presence of a false or null value.
     */
    check(obj, ...args){
      for (let i = 0; i < args.length; i++){
        if (!obj || !obj.hasOwnProperty(args[i])){
          return true;
        }
        obj = obj[args[i]];
      }
      return false;
    },

    /**
     * Everything that check does, but also assures that the final child property
     * is an array with at least one member.
     */
    arrayWithMember(obj, ...args){
      for (let i = 0; i < args.length; i++){
        if (!obj || !obj.hasOwnProperty(args[i])){
          return true;
        }
        obj = obj[args[i]];
      }

      if (obj.length < 1){
        return true;
      } else {
        return false;
      }

    }
  };
}
