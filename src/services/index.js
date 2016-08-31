import angular from 'angular';
import ckconfigure from './ckconfigure';
import ckquery from './ckquery';
import ckrecord from './ckrecord';
import ckauthenticate from './ckauthenticate';
import loadImage from './loadimage';

const services = angular.module('services', [])
.factory('ckconfigure', ckconfigure)
.factory('ckquery', ckquery)
.factory('ckrecord', ckrecord)
.factory('ckauthenticate', ckauthenticate)
.factory('loadImage', loadImage);

export default services.name;
