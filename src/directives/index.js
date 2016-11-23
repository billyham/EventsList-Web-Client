import angular from 'angular';
import ondrop from './ondrop';
import ondragstart from './ondragstart';
import ondragover from './ondragover';
import onchange from './onchange';

const directives = angular.module('directives', [])
.directive('ngOnDrop', ondrop)
.directive('ngOnDragStart', ondragstart)
.directive('ngOnDragOver', ondragover)
.directive('ngOnChange', onchange);

export default directives.name;
