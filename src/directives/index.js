import angular from 'angular';
import ondrop from './ondrop';
import ondragstart from './ondragstart';
import ondragover from './ondragover';
import onchange from './onchange';
import ontouchcancel from './ontouchcancel';
import ontouchend from './ontouchend';
import ontouchmove from './ontouchmove';
import ontouchstart from './ontouchstart';

const directives = angular.module('directives', [])
.directive('ngOnDrop', ondrop)
.directive('ngOnDragStart', ondragstart)
.directive('ngOnDragOver', ondragover)
.directive('ngOnChange', onchange)
.directive('ngOnTouchCancel', ontouchcancel)
.directive('ngOnTouchEnd', ontouchend)
.directive('ngOnTouchMove', ontouchmove)
.directive('ngOnTouchStart', ontouchstart);

export default directives.name;
