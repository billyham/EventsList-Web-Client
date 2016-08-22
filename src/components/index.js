import angular from 'angular';
import event from './event/event';
import main from './main/main';

const components = angular.module('components', [])
.component('event', event)
.component('main', main);

export default components.name;
