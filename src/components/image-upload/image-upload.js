import template from './image-upload.html';

export default {
  template,
  bindings: {

  },
  controller: ['ckasset', controller]
};

function controller(ckasset){

  this.sendRequest = function sendRequest(){
    ckasset.request();
  };

}
