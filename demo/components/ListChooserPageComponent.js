var $ = require('jquery');
var AvailableListComponent = require('./AvailableListComponent');
var MyListComponent = require('./MyListComponent');

function ListChooserPageComponent() {
    var $page = $('#container');
    var URL = 'http://jsonplaceholder.typicode.com/posts';

    var myListComponent        = MyListComponent.create($page);
    var availableListComponent = AvailableListComponent.create($page, handleAvailableListClick);

    function handleAvailableListClick() {
        var $clickedEL = $(this);
        $page.addClass('loading');
        $.ajax(URL, {
            timeout: 1000
        }).then(function() {
            availableListComponent.removeItem($clickedEL);
            myListComponent.addItem($clickedEL.text());
        }).always(function() {
            $page.removeClass('loading');
        });
        window.setTimeout(function() {
        }, 1000);
    }

    // Public 
    this.handleAvailableListClick = handleAvailableListClick;
}


module.exports = {
    create: function() {
        return new ListChooserPageComponent()
    }
};
