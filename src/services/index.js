import angular from 'angular';
import ckconfigureService from './cloudkit/ckconfigure-service';
import ckqueryService from './cloudkit/ckquery-service';
import ckrecordService from './cloudkit/ckrecord-service';
import ckauthenticateService from './cloudkit/ckauthenticate-service';
import ckassetService from './cloudkit/ckasset-service';
import authService from './auth-service';
import eventPublishService from './event-publish-service';
import imageService from './image-service';
import imageFileService from './image-file-service';
import guardService from './guard-service';
import Program from './models/Program';
import Image440 from './models/Image440';

const services = angular.module('services', [])
.factory('ckconfigureService', ckconfigureService)
.factory('ckqueryService', ckqueryService)
.factory('ckrecordService', ckrecordService)
.factory('ckauthenticateService', ckauthenticateService)
.factory('imageService', imageService)
.factory('imageFileService', imageFileService)
.factory('ckassetService', ckassetService)
.factory('authService', authService)
.factory('eventPublishService', eventPublishService)
.factory('guardService', guardService)
.factory('Program', Program)
.factory('Image440', Image440);

export default services.name;
