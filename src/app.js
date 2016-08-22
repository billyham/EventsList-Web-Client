import angular from 'angular';
import router from 'angular-ui-router';
import components from './components';
import services from './services';
import 'angular-ui-router/release/stateEvents';

const app = angular.module('app', [
  router,
  angular.module( 'ui.router.state.events' ).name,
  components,
  services
]);

export default app;
