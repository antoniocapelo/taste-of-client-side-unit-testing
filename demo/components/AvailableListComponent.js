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
    })();

    $component.find('li').on('click', handleAvailableListClick || function() {});
}

module.exports = AvailableListComponent;
