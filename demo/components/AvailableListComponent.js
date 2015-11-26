var $ = require('jquery');

function AvailableListComponent($context, handleAvailableListClick) {
    var compClasses = {
        
    };
    var compSelectors = {
        component: '.available'
    };

    // Private
    var $component = $context.find(compSelectors.component);
        console.log($context.find('.available').attr('class'));
    

    // Public API
    this.removeItem = function($item) {
        $item.remove();
    };

    (function initComponent(){
    })();

    $component.find('li').on('click', handleAvailableListClick || function() {});
}

module.exports = {
    create: function($context, handleAvailableListClick) {
        return new AvailableListComponent($context, handleAvailableListClick);
    }
};
