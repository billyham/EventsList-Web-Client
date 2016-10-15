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
      ckqueryResult: ['ckconfigureService', 'ckqueryService', (ckconfigureService, ckqueryService) => {
        return ckqueryService.query('PUBLIC','_defaultZone',null,'Program',
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
      main: {
        component: 'eventList'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
}
