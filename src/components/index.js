import angular from 'angular';
import eventPage from './event-page/event-page';
import event from './event/event';
import eventList from './event-list/event-list';
import eventAdd from './event-add/event-add';
import main from './main/main';
import imagePicker from './image-picker/image-picker';
import imageCrop from './image-picker/image-crop/image-crop';
import mainHeader from './main-header/main-header';
import mainNav from './main-header/main-nav/main-nav';
import comingSoon from './coming-soon/coming-soon';
import loading from './sprites/loading/loading';

const components = angular.module('components', [])
.component('eventPage', eventPage)
.component('event', event)
.component('main', main)
.component('eventList', eventList)
.component('eventAdd', eventAdd)
.component('imagePicker', imagePicker)
.component('imageCrop', imageCrop)
.component('mainHeader', mainHeader)
.component('mainNav', mainNav)
.component('comingSoon', comingSoon)
.component('loading', loading);

export default components.name;
