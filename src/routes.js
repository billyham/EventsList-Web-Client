configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function configRoutes($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('home', {
    url: '/',
    resolve: {
      userIdentity: ['ckconfigureService', 'ckauthenticateService', (ckconfigureService, ckauthenticateService) => {
        ckconfigureService.configure();
        return ckauthenticateService.authenticate();
      }],
      publicEvents: ['ckconfigureService', 'ckqueryService', (ckconfigureService, ckqueryService) => {
        return ckqueryService.query('PUBLIC','_defaultZone',null,'Program',
          ['title', 'imageRef', 'video', 'fulldescription'],'title',null,null,null,
          [], null)
          .then(result => {
            return {records: result.records, continuationMarker: result.continuationMarker, error: result.error};
          });
      }],
      privateEvents: ['ckconfigureService', 'ckqueryService', (ckconfigureService, ckqueryService) => {
        return ckqueryService.query('PRIVATE','_defaultZone',null,'Program',
          ['title', 'imageRef', 'video', 'fulldescription'],'title',null,null,null,
          [], null)
          .then(result => {
            return {records: result.records, continuationMarker: result.continuationMarker, error: result.error};
          });
      }]
    },
    views: {
      header: {
        component: 'mainHeader'
      },
      eventPage: {
        component: 'eventPage'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
}
