import angular from 'angular';
import event from './event/event';
import eventList from './event-list/event-list';
import eventAdd from './event-add/event-add';
import main from './main/main';
import imageUpload from './image-upload/image-upload';
import header from './header/header';
import nav from './header/nav/nav';

const components = angular.module('components', [])
.component('event', event)
.component('main', main)
.component('eventList', eventList)
.component('eventAdd', eventAdd)
.component('imageUpload', imageUpload)
.component('header', header)
.component('nav', nav);

export default components.name;
