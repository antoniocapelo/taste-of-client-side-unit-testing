var $ = require('jquery');

function MyListComponent($context) {
    var compClasses = {
        item: 'list-group-item'
    };
    var compSelectors = {
        component : '.my-list',
        item      : 'li',
        itemCount : '.items-count'
    };

    // Private
    var $component = $context.find(compSelectors.component);

    function initComponent() {
        updateItemCount();
    }

    function updateItemCount() {
        $context.find(compSelectors.itemCount).text(getItemCount());
    }

    function getItemCount() {
        return $component.find(compSelectors.item).length;
    }

    function buildItem(text) {
        return $('<li>').addClass(compClasses.item).text(text);
    }

    // Public API
    this.addItem = function(text) {
        $component.append(buildItem(text));
        updateItemCount();
    };

    this.getItemCount = getItemCount;

    initComponent();
}

module.exports = {
    create: function($ctx) {
        return new MyListComponent($ctx);
    }
};
