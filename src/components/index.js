import angular from 'angular';
import event from './event/event';
import eventList from './event-list/event-list';
import eventAdd from './event-add/event-add';
import main from './main/main';
import imageUpload from './image-upload/image-upload';
import mainHeader from './main-header/main-header';
import mainNav from './main-header/main-nav/main-nav';
import appleDestination from './main-header/main-nav/apple-destination/apple-destination';

const components = angular.module('components', [])
.component('event', event)
.component('main', main)
.component('eventList', eventList)
.component('eventAdd', eventAdd)
.component('imageUpload', imageUpload)
.component('mainHeader', mainHeader)
.component('mainNav', mainNav)
.component('appleDestination', appleDestination);

export default components.name;
