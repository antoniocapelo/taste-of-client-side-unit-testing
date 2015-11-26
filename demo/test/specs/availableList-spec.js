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
        // should check if the ListChooserPage instantiates its dependencies
        // set up spies
        //var $context = jasmine.createSpy('$context', ['find']);
        var $context = $('#jasmine-fixtures');
        //console.log($context.find('.available').attr('class'));
        spyOn($context, 'find');

        availableList = AvailableListComponent.create($context);


        expect($context.find).toHaveBeenCalledWith('.available');
        //expect(AvailableComponent.create)
        //.toHaveBeenCalledWith($container, availableList.handleAvailableListClick);
    });

    xit('should call endpoint X and on success removeItem from available and addItem from myList', function () {
        spyOn(MyListComponent, 'create').and.callFake(function() {
                return myList;
            });
        spyOn(AvailableComponent, 'create').and.callFake(function() {
            return availableList;
        });
        spyOn($, 'ajax').and.callFake(function() {
            var d = $.Deferred();
            d.resolve({});
            return d.promise();
        });
        var $container = $('#container');

        availableList = ListChooserPage.create();
        availableList.handleAvailableListClick();

        expect(myList.addItem).toHaveBeenCalled();
        expect(availableList.removeItem).toHaveBeenCalled();
    });

    xit('should call endpoint X and if error should not call any other fn', function () {
        spyOn(MyListComponent, 'create').and.callFake(function() {
                return myList;
            });
        spyOn(AvailableComponent, 'create').and.callFake(function() {
            return availableList;
        });
        spyOn($, 'ajax').and.callFake(function() {
            var d = $.Deferred();
            d.reject();
            return d.promise();
        });
        var $container = $('#container');

        availableList = ListChooserPage.create();
        availableList.handleAvailableListClick();

        expect(myList.addItem).not.toHaveBeenCalled();
        expect(availableList.removeItem).not.toHaveBeenCalled();
    });
});

