window.digirisk.tab = function() {
	window.digirisk.tab.init();
	window.digirisk.tab.event();
}

window.digirisk.tab.init = function() {};
window.digirisk.tab.event = function() {
  jQuery( document ).on( 'click', '.wp-digi-global-sheet-tab li', window.digirisk.tab.load );
};

window.digirisk.tab.load = function( event ) {
  event.preventDefault();
  var a = jQuery( this );

  jQuery( ".wp-digi-global-sheet-tab li.active" ).removeClass( "active" );
  a.addClass( "active" );

  jQuery( ".wp-digi-content" ).addClass( "wp-digi-bloc-loading" );

  var data = {
    action:           "load_tab_content",
    _wpnonce:         a.data( 'nonce' ),
    tab_to_display:   a.data( "action" ),
    element_id :      a.closest( '.wp-digi-sheet' ).data( 'id' ),
  };

  jQuery.post( window.ajaxurl, data, function( response ) {
    jQuery( ".wp-digi-content" ).replaceWith( response.data.template );
  } );
};
