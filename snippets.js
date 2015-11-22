$(document).ready(function(){
  var div1 = $('div.one'),
      itemCount = getItemCount( 'li.item' );

  div1.on('click',function(){
      ...
    });

  function getItemCount( selector ){
      return $( selector ).length;
    }
});



