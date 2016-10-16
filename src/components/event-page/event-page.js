import template from './event-page.html';
import styles from './event-page.scss';

export default {
  template,
  bindings: {
    publicEvents: '<',
    privateEvents: '<',
    userIdentity: '<'
  },
  controller: ['ngDialog', controller]
};

function controller(ngDialog) {
  this.styles = styles;
  this.typepublic = 'PUBLIC';
  this.typeprivate = 'PRIVATE';

  console.log('privateEvents', this.privateEvents);
  console.log('publicEvents', this.publicEvents);
  // console.log('userIdentity', this.userIdentity);

  this.showadd = function showadd(){
    const dialog = ngDialog.open({
      template:'<event-add close="close()" add="add(rec)">Enter</event-add>',
      className: 'ngdialog-theme-default',
      plain: true,
      data: this.privateEvents,
      controller: ['$scope', function($scope){

        // Close the dialog
        $scope.close = function close(){
          dialog.close();
        };

        // Update the list view with the new Event
        $scope.add = rec => {
          if (!rec) return;
          $scope.ngDialogData.records.push(rec);
          $scope.ngDialogData.records.sort( (a,b) => {
            if (a.fields.title.value.toUpperCase() > b.fields.title.value.toUpperCase()) return 1;
            if (a.fields.title.value.toUpperCase() < b.fields.title.value.toUpperCase()) return -1;
            return 0;
          });
          $scope.$apply();
        };
      }]
    });
  };


}
