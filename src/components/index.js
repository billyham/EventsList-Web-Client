import angular from 'angular';
import event from './event/event';
import eventList from './event-list/event-list';
import main from './main/main';

const components = angular.module('components', [])
.component('event', event)
.component('main', main)
.component('eventList', eventList);

export default components.name;
