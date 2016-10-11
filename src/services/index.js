import angular from 'angular';
import ckconfigureService from './ckconfigure-service';
import ckqueryService from './ckquery-service';
import ckrecordService from './ckrecord-service';
import ckauthenticateService from './ckauthenticate-service';
import loadImageService from './loadimage-service';
import ckassetService from './ckasset-service';
import authService from './auth-service';

const services = angular.module('services', [])
.factory('ckconfigureService', ckconfigureService)
.factory('ckqueryService', ckqueryService)
.factory('ckrecordService', ckrecordService)
.factory('ckauthenticateService', ckauthenticateService)
.factory('loadImageService', loadImageService)
.factory('ckassetService', ckassetService)
.factory('authService', authService);

export default services.name;
