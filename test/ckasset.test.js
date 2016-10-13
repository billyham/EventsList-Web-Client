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
    angular.mock.module('services', {apiUrl: 'https://api.apple-cloudkit.com/'}, providerFunction)
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

  it('performs request', done => {
    const returnObject = {token: 'mocktoken', url: 'mockurl'};

    $httpBackend
      .expectPOST(/\/api.apple-cloudkit.com\/(.+)/, undefined, undefined, ['development', 'public', 'assests', 'upload', 'ckAPIToken', 'ckWebAuthToken'],
      JSON.stringify({
        tokens:[{
          recordType:'Image440',
          fieldName:'image'
        }]})
      )
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
  // it.hide('performs modify', done => {
  //
  // });

});
