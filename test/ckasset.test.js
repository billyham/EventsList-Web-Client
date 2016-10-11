const assert = chai.assert;

describe('ckassetService', () => {

  angular.mock.module.sharedInjector();

  let $httpBackend, ckassetService = null;
  let $cookies = {};

  const providerFunction = $provide => {
    $cookies.get = () => {
      return 'mockICloudID';
    };
    $provide.value('$cookies', $cookies);
  };

  beforeEach(
    angular.mock.module('services', {apiUrl: 'http://api.apple-cloudkit.com/'}, providerFunction)
  );

  beforeEach(angular.mock.inject( (_$httpBackend_, _ckassetService_, _$cookies_) => {
    $httpBackend = _$httpBackend_;
    ckassetService = _ckassetService_;
    $cookies = _$cookies_;
  }));

  afterEach( () => {
    $httpBackend.verifyNoOutstandingExpectation();
    // $httpBackend.verifyNoOutstandingReqeust();
  });

  it('performas request', done => {
    const returnObject = {token: 'mocktoken', url: 'mockurl'};

    $httpBackend
      .expectPOST('https://api.apple-cloudkit.com/', JSON.stringify({
        tokens:[{
          recordType:'Image440',
          fieldName:'image'
        }]})
      )
      // .expectPOST('https://api.apple-cloudkit.com/data1/iCloud.David-Vincent-Hanagan.EventsList/development/public/assets/upload=2393cbb08e0ba1208e4d3ca3800095b60c38907425562e3d3463fc71b9b14d14&ckWebAuthToken=ididididi')
      .respond(returnObject);

    ckassetService.request()
      .then( data => {
        assert.deepEqual(data.data, returnObject);
        done();
      })
      .catch(done);

    $httpBackend.flush();
  });

  // it.hide('performs upload', done => {
  //
  // });
  //
  // it.hide('peforms modify', done => {
  //
  // });

});
