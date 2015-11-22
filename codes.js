// Initial
$(document).ready(function(){
        var listDiv   = $('.available'),
        myList    = $('.my-list'),
        itemCount = getItemCount( '.item' );

        $(.items-count).html(itemCount);

        listDiv.on('click',function(){
            var $clickedEL = $(this);
            $.ajax(...);
            function onSucces() {
            $clickedEL.remove();
            var $newEl; 
            itemCount+=1;
            $(.items-count).html(itemCount);
            $newEl = $('<li class="item">').text($clickedEL.text());
            myList.append($newEL);
            }
            });

        function getItemCount( selector ){
            return $( selector ).length;
        }
});

// Breaking it down

function MyListComponent($context) {
    var compClasses = {
item: 'item'
    };
    var compSelectors = {
component : '.my-list',
            item      : '.item',
            itemCount : 'item-count'
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
        return $context.find(compSelectors.item).length;
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

//---------//

function AvailableComponent($context, handleAvailableListClick) {
    var compClasses = {
        ...
    };
    var compSelectors = {
        ...
    };

    // Private
    var $component = $context.find(compSelectors.component);

    // Public API
    this.removeItem = function($item) {
    };

    $component.on('click', handleAvailableListClick || function() {});
}


// App example
function ListChooserPage() {
    var $page = $('#container');

    var myListComponent    = new MyListComponent($page);
    var availableComponent = new AvailableComponent($page, handleAvailableListClick);

   function handleAvailableListClick() {
        var $clickedEL = $(this);
        $.ajax(...);
        function onSucces() {
            availableComponent.removeItem($clickedEL);
            myListComponent.addItem($clickedEL.text());
        }
    };

    // Public 
    this.handleAvailableListClick = handleAvailableListClick;
}

new ListChooserPage();