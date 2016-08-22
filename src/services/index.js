import angular from 'angular';
import ckconfigure from './ckconfigure';
import ckquery from './ckquery';
import ckrecord from './ckrecord';

const services = angular.module('services', [])
.factory('ckconfigure', ckconfigure)
.factory('ckquery', ckquery)
.factory('ckrecord', ckrecord);

export default services.name;
