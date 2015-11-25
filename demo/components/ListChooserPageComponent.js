var $ = require('jquery');
 var AvailableListComponent = require('./AvailableListComponent');
 var MyListComponent = require('./MyListComponent');

function ListChooserPageComponent() {
    var $page = $('#container');

    var myListComponent    = new MyListComponent($page);
    var availableListComponent = new AvailableListComponent($page, handleAvailableListClick);

   function handleAvailableListClick() {
        var $clickedEL = $(this);
        //$.ajax(...);
        $page.addClass('loading');
        window.setTimeout(function() {
            availableListComponent.removeItem($clickedEL);
            myListComponent.addItem($clickedEL.text());
            $page.removeClass('loading');
        }, 1000);
    };

    // Public 
    this.handleAvailableListClick = handleAvailableListClick;
}


module.exports = ListChooserPageComponent;
