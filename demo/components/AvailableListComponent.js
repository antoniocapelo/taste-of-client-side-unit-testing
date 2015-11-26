var $ = require('jquery');

function AvailableListComponent($context, handleAvailableListClick) {
    var compClasses = {
        
    };
    var compSelectors = {
        component: '.available'
    };

    // Private
    var $component = $context.find(compSelectors.component);

    // Public API
    this.removeItem = function($item) {
        $item.remove();
    };

    (function initComponent(){
        console.log('it is on!',handleAvailableListClick);
    })();

    $component.find('li').on('click', handleAvailableListClick || function() {});
}

module.exports = {
    create: function($context, handleAvailableListClick) {
        return new AvailableListComponent($context, handleAvailableListClick);
    }
};
