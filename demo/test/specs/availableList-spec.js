describe('AvailableList', function () {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = this.updateInterval;

    // module to test
    var AvailableListComponent = require('../../components/AvailableListComponent');
    var availableList;

    // get modules and fake them
    var $ = require('jquery');

    beforeEach(function () {
        loadFixtures('availableList.html');
    });

    it('should initiate correctly', function () {
        // set up spies
        var $context = $('#jasmine-fixtures');
        spyOn($context, 'find').and.callThrough();
        spyOn(AvailableListComponent, 'create').and.callThrough();

        availableList = AvailableListComponent.create($context);
        expect($context.find).toHaveBeenCalledWith('.available');
    });

    it('should call the handleAvailableListClick callback', function () {
        // set up spies
        var handleAvailableListClickSpy = jasmine.createSpy('callback');
        var $context = $('#jasmine-fixtures');
        var $available = $('.available');

        availableList =  AvailableListComponent.create($context, handleAvailableListClickSpy);
        $available.find('li').trigger('click');
        expect(handleAvailableListClickSpy).toHaveBeenCalled();
    });
});

