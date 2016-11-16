import angular from 'angular';
import ondrop from './ondrop';

const directives = angular.module('directives', [])
.directive('ngOnDrop', ondrop);

export default directives.name;
