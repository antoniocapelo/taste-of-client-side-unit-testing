describe('ListChooserPage', function () {
    var listChooserPage;

    beforeEach(function () {
        loadFixtures('pageFixture.html');
    });

    it('should initiate correctly', function () {
        // set up spies
        var myListConstructorSpy = spyOn(window, 'MyListComponent');
        var availableConstructorSpy = spyOn(window, 'AvailableComponent');
        var $container = $('#container');

        listChooser = new ListChooserPage();

        expect(myListConstructorSpy).toHaveBeenCalled();
        expect(availableConstructorSpy)
          .toHaveBeenCalledWith($container,
                                listChooser.handleAvailableListClick);
    });

    it('should call endpoint X and on success removeItem from available and addItem do myList', function () {
        // set up spies
        var myListSpy = spyOn(window, 'MyListComponent').and.callFake(function() {
            return jasmine.createSpyObj('myList', ['addItem']);
        });
        var availableSpy = spyOn(window, 'AvailableComponent').and.callFake(function() {
            return jasmine.createSpyObj('availableList', ['removeItem']);
        });
        spyOn($.fn, 'ajax').and.callFake(function() {
            var d = $.Deferred();
            d.resolve();
            return d.promise();
        });
        var $container = $('#container');

        listChooser = new ListChooserPage();
        ListChooser.handleAvailableListClick();
        expect(myListSpy.addItem).toHaveBeenCalled();
        expect(availableList.removeItem).toHaveBeenCalled();
    });
});

describe('AvailableComponent', function () {
    var availableList;

    beforeEach(function () {
        loadFixtures('availableListFixture.html');
    });

    it('should initiate correctly', function () {
        ...
    });

    it('should call the handleAvailableListClick callback', function () {
        // set up spies
        var handleAvailableListClickSpy = jasmine.createSpy('callback');
        var $context = $('#container');
        var $available = $('.available');

        availableList = new availableList($context, handleAvailableListClickSpy);
        $available.trigger('click');
        expect(handleAvailableListClickSpy).toHaveBeenCalled();
    });
});

