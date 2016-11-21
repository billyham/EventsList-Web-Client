import angular from 'angular';
import ondrop from './ondrop';
import ondragstart from './ondragstart';
import ondragover from './ondragover';

const directives = angular.module('directives', [])
.directive('ngOnDrop', ondrop)
.directive('ngOnDragStart', ondragstart)
.directive('ngOnDragOver', ondragover);

export default directives.name;
