import angular from 'angular';
import event from './event/event';

const components = angular.module('components', [])
.component('event', event);

export default components.name;
