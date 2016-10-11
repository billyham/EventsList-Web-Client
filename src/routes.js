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
          ['title', 'imageRef', 'video'],'title',null,null,null,
          [], null)
          .then(result => {
            return {records: result.records, continuationMarker: result.continuationMarker};
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
