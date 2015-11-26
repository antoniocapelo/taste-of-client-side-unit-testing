describe('ListChooserPage', function () {
    var listChooserPage;
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = this.updateInterval;

    // module to test
    var ListChooserPage = require('../../components/ListChooserPageComponent');

    // get modules and fake them
    var MyListComponent = require('../../components/MyListComponent');
    var myList;
    var AvailableComponent = require('../../components/AvailableListComponent');
    var availableList;
    var $ = require('jquery');

    beforeEach(function () {
        loadFixtures('listChooserPage.html');
        myList = jasmine.createSpyObj('myList', ['addItem']);
        availableList = jasmine.createSpyObj('availableList', ['removeItem']);
    });

    it('should initiate correctly', function () {
        // should check if the ListChooserPage instantiates its dependencies
        // set up spies
        spyOn(AvailableComponent, 'create');
        spyOn(MyListComponent, 'create');
        var $container = $('#container');

        listChooser = ListChooserPage.create();

        expect(MyListComponent.create).toHaveBeenCalled();
        expect(AvailableComponent.create)
        .toHaveBeenCalledWith($container, listChooser.handleAvailableListClick);
    });

    it('should call endpoint X and on success removeItem from available and addItem from myList', function () {
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

        listChooser = ListChooserPage.create();
        listChooser.handleAvailableListClick();

        expect(myList.addItem).toHaveBeenCalled();
        expect(availableList.removeItem).toHaveBeenCalled();
    });

    it('should call endpoint X and if error should not call any other fn', function () {
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

        listChooser = ListChooserPage.create();
        listChooser.handleAvailableListClick();

        expect(myList.addItem).not.toHaveBeenCalled();
        expect(availableList.removeItem).not.toHaveBeenCalled();
    });
});
