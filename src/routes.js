configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function configRoutes($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('home', {
    url: '/',
    resolve: {
      userIdentity: ['ckconfigure', 'ckauthenticate', (ckconfigure, ckauthenticate) => {
        ckconfigure.configure();
        return ckauthenticate.authenticate();
      }],
      ckqueryResult: ['ckconfigure', 'ckquery', (ckconfigure, ckquery) => {
        return ckquery.query('PUBLIC','_defaultZone',null,'Program',
          ['title', 'imageRef', 'video'],'title',null,null,null,
          [], null)
          .then(result => {
            return {records: result.records, continuationMarker: result.continuationMarker};
          });
      }]
    },
    views: {
      // header: {
      //   component: 'header'
      // },
      main: {
        component: 'eventList'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
}
