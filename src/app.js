import angular from 'angular';
import router from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import components from './components';
import services from './services';
import 'angular-ui-router/release/stateEvents';
import ngDialog from 'ng-dialog';
import 'ng-dialog/css/ngDialog.css';
import 'ng-dialog/css/ngDialog-theme-default.css';

const app = angular.module('app', [
  router,
  ngCookies,
  angular.module( 'ui.router.state.events' ).name,
  ngDialog,
  components,
  services
]);

export default app;
