describe('my to do app', function() {

  describe('navigation', function() {

    beforeEach(function() {
      browser.get('/');
    }, 25000);

    it('defaults to /', function() {

      expect(browser.getLocationAbsUrl()).toMatch('/');

      // Wait until angular-ui-router completes resolve dependencies
      browser.wait(function() {
        return $('event-page').isPresent();
      });

      // Gets first tag of ui-view at home state and test that it's our component
      const uiView = element.all(by.css('section')).first();
      expect(uiView.all(by.css('*')).first().getTagName()).toEqual('event-page');

    }, 25000);

  });

});
