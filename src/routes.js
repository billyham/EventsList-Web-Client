configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function configRoutes($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('home', {
    url: '/',
    resolve: {
      ckqueryResult: ['ckconfigure', 'ckquery', (ckconfigure, ckquery) => {
        ckconfigure.configure();
        return ckquery.demoPerformQuery('PUBLIC','_defaultZone',null,'Program',
          ['title', 'imageRef', 'video'],null,null,null,null,
          [], null)
          .then(result => {
            let array = result.records.map( element => {
              return {fields: element.fields};
            });
            return {records: array, continuationMarker: result.continuationMarker};
          });
      }]
    },
    views: {
      header: {
        template: '<h1>Events EventsList, an iOS App</h1>'
      },
      main: {
        component: 'event'
      }
    }
  });
  $urlRouterProvider.otherwise('/');
}
