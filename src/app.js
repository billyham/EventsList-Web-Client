import angular from 'angular';
import router from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import components from './components';
import services from './services';
import 'angular-ui-router/release/stateEvents';

const app = angular.module('app', [
  router,
  ngCookies,
  angular.module( 'ui.router.state.events' ).name,
  components,
  services
]);

export default app;
