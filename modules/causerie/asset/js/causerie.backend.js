/**
 * Initialise l'objet "causerie" ainsi que la méthode "init" obligatoire pour la bibliothèque EoxiaJS.
 *
 * @since   6.6.0
 */
window.eoxiaJS.digirisk.causerie = {};

/**
 * Gestion des signatures.
 *
 * @type {HTMLCanvasElement}
 */
window.eoxiaJS.digirisk.causerie.canvas;

/**
 * Initialise les évènements.
 *
 * @since   6.6.0
 *
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.init = function() {
	window.eoxiaJS.digirisk.causerie.event();
	window.eoxiaJS.digirisk.causerie.refresh();

	window.eoxiaJS.digirisk.causerie.leBouttonPlayCestPourLaMusique();
};

/**
 * Initialise le canvas, ainsi que owlCarousel.
 *
 * @since   6.6.0
 *
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.refresh = function() {
	window.eoxiaJS.digirisk.causerie.canvas = document.querySelectorAll("canvas");
	for( var i = 0; i < window.eoxiaJS.digirisk.causerie.canvas.length; i++ ) {
		window.eoxiaJS.digirisk.causerie.canvas[i].signaturePad = new SignaturePad( window.eoxiaJS.digirisk.causerie.canvas[i], {
			penColor: "rgb(66, 133, 244)"
		} );
	}

	/*jQuery( '.causerie-wrap .owl-carousel' ).owlCarousel( {
		'items': 1,
		'dots' : true
	} );*/

	jQuery( '.causerie-wrap .owl-carousel' ).owlCarousel( {
		'nav': 1,
		'loop': 1,
		'items': 1,
		'dots' : false,
		'navText' : ['<span class="owl-prev"><i class="fa fa-angle-left fa-8x" aria-hidden="true"></i></span>','<span class="owl-next"><i class="fa fa-angle-right fa-8x" aria-hidden="true"></i></span>'],
	} );
};

/**
 * Initialise les évènements principaux des causeries.
 *
 * @since   6.6.0
 *
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.event = function() {
	// Gestion du titre de la modal.
	jQuery( document ).on( 'change', '.digi-causerie-parent .wpeo-autocomplete', window.eoxiaJS.digirisk.causerie.updateModalTitle );

	jQuery( document ).on( 'click', '.causerie .modal-signature .wpeo-button.button-blue', window.eoxiaJS.digirisk.causerie.saveSignatureURL );

	jQuery( document ).on( 'click', '.causerie-wrap a.disabled', function( event ) {
		event.preventDefault();
		return false;
	} );

	jQuery( document ).on( 'click', '.digi-import-add-keyword > .wpeo-button', window.eoxiaJS.digirisk.causerie.addKeywordToTextarea );

	jQuery( document ).on( 'click', '.digi-import-add-keyword .dropdown-content .item', window.eoxiaJS.digirisk.causerie.itemSelectToTextarea );

	jQuery( document ).on( 'keyup', '.digi-import-add-keyword .digi-info-import-link input', window.eoxiaJS.digirisk.causerie.updateImportTextFromUrl );

	// jQuery( document ).on( 'click', '.wpeo-modal .import-git-button', window.eoxiaJS.digirisk.causerie.importGitContent );

	jQuery( document ).on( 'click', '.modal-footer .digi-display-view-git .digi-content-git', window.eoxiaJS.digirisk.causerie.txtHiddenGitToTextArea );

	jQuery( document ).on( 'click', '.modal-container .digi-import-git-success .digi-picture-download', window.eoxiaJS.digirisk.causerie.importAllPictureToMedia );

	jQuery( document ).on( 'click', '.modal-container .modal-footer-view-git .digi-footer-git-display ', window.eoxiaJS.digirisk.causerie.displayImportGitInput );

	jQuery( document ).on( 'click', '.modal-container .digi-view-execute .digi-view-execute-hide', window.eoxiaJS.digirisk.causerie.displayImportGitFromExecute );

	jQuery( document ).on( 'click', '.modal-container .digi-footer-execute .digi-import-execute-run', window.eoxiaJS.digirisk.causerie.importModalExecuteIt );

	jQuery( document ).on( 'click', '.wrap-causerie .tab-select-redirect .tab-element', window.eoxiaJS.digirisk.causerie.tabSelectRedirect );

	jQuery( document ).on( 'click', '.wrap-causerie .modal-footer-view-textarea .digi-display-textarea', window.eoxiaJS.digirisk.causerie.causerieImportDisplayTextarea );
};

/**
 * Met à jour le titre de la modal lors du clic sur le bouton pour que l'utilisateur effectue sa signature.
 *
 * @since   6.6.0
 *
 * @param  {MouseEvent} event  Les données du clic.
 * @param  {Object}     data   Contient les données de la requête XHR.
 */
window.eoxiaJS.digirisk.causerie.updateModalTitle = function( event, data ) {
	var title = '';
	var element  = jQuery( this );

	if ( data && data.element ) {
		var request_data = {};
		request_data.action  = 'causerie_save_former';
		request_data.id      = jQuery( this ).closest( 'tr' ).find( 'input[name="causerie_id"]' ).val();
		request_data.user_id = jQuery( this ).closest( 'tr' ).find( 'input[name="former_id"]' ).val();

		window.eoxiaJS.loader.display( jQuery( this ) );
		window.eoxiaJS.request.send( jQuery( this ), request_data, function( triggeredElement, response ) {
			title = 'Signature de l\'utilisateur: ' + data.element.data( 'result' );
			element.closest( 'tr' ).find( '.wpeo-modal-event' ).attr( 'data-title', title );
			element.closest( 'tr' ).find( '.wpeo-modal-event' ).removeClass( 'button-disable' );
		} );
	}
};

/**
 * Enregistres dans un champ caché
 *
 * @since   6.6.0
 *
 * @param  {MouseEvent} event Les données du clic.
 *
 * @TODO: Mieux définir cette méthode.
 */
window.eoxiaJS.digirisk.causerie.saveSignatureURL = function( event ) {
	event.preventDefault();

	jQuery( '.modal-signature' ).find( 'canvas' ).each( function() {
		if ( ! jQuery( this )[0].signaturePad.isEmpty() ) {
			jQuery( this ).closest( 'div' ).find( 'input:first' ).val( jQuery( this )[0].toDataURL() );
			jQuery( '.step-1 .action-input[data-action="next_step_causerie"]' ).removeClass( 'button-disable' );
			jQuery( '.step-4 a.button-disable' ).removeClass( 'button-disable' );
		}
	} );
};

/**
 * Appliques la signature.
 *
 * @since   6.6.0
 *
 * @param  {[type]} element [description]
 * @return {boolean}         [description]
 *
 * @TODO: Mieux définir cette méthode.
 */
window.eoxiaJS.digirisk.causerie.applySignature = function( element ) {
	if ( ! element.closest( '.wpeo-modal' ).find( 'canvas' )[0].signaturePad.isEmpty() ) {
		element.closest( '.wpeo-modal' ).find( 'input[name="signature_data"]' ).val( element.closest( '.wpeo-modal' ).find( 'canvas' )[0].toDataURL() );
	}

	return true;
};

/**
 * Vérifie que la catégorie de risque soit sélectionné avant d'enregistrer la causerie.
 *
 * @since 6.6.0
 *
 * @param  {HTMLDivElement} triggeredElement L'élément déclenchant l'action.
 *
 * @return {boolean}                         True pour continuer l'action. False pour stopper l'action.
 */
window.eoxiaJS.digirisk.causerie.beforeSaveCauserie = function( triggeredElement ) {
	window.eoxiaJS.tooltip.remove( triggeredElement.closest( '.causerie-row' ).find( '.category-danger.wpeo-tooltip-event' ) );

	// Vérification du danger.
	if ( '-1' === triggeredElement.closest( '.causerie-row' ).find( 'input[name="risk_category_id"]' ).val() ) {
		window.eoxiaJS.tooltip.display( triggeredElement.closest( '.causerie-row' ).find( '.category-danger.wpeo-tooltip-event' ) );
		return false;
	}

	return true;
};

/**
 * Le callback en cas de réussite à la requête Ajax "edit_causerie".
 * Remplaces le contenu du tableau par la vue renvoyée par la réponse Ajax.
 *
 * @since   6.6.0
 *
 * @param  {HTMLDivElement} triggeredElement  L'élement HTML déclenchant la requête Ajax.
 * @param  {Object}         response          Les données renvoyées par la requête Ajax.
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.editedCauserieSuccess = function( triggeredElement, response ) {
	triggeredElement.closest( '.tab-content' ).html( response.data.view );
};

/**
 * Le callback en cas de réussite à la requête Ajax "load_causerie".
 * Remplaces le contenu de la ligne du tableau "causerie" par le template renvoyé par la requête Ajax.
 *
 * @since   6.6.0
 *
 * @param  {HTMLDivElement} triggeredElement  L'élement HTML déclenchant la requête Ajax.
 * @param  {Object}         response          Les données renvoyées par la requête Ajax.
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.loadedCauserieSuccess = function( element, response ) {
	jQuery( element ).closest( 'tr' ).replaceWith( response.data.view );
};

/**
 * Le callback en cas de réussite à la requête Ajax "delete_causerie".
 * Supprimes la ligne du tableau.
 *
 * @since   6.6.0
 *
 * @param  {HTMLDivElement} triggeredElement  L'élement HTML déclenchant la requête Ajax.
 * @param  {Object}         response          Les données renvoyées par la requête Ajax.
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.deletedCauserieSuccess = function( element, response ) {
	element.closest( 'tr' ).fadeOut();
};

/**
 * Le callback en cas de réussite à la requête Ajax "save_final_causerie_step_1".
 *
 * @since   6.6.0
 *
 * @param  {HTMLDivElement} triggeredElement  L'élement HTML déclenchant la requête Ajax.
 * @param  {Object}         response          Les données renvoyées par la requête Ajax.
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.nextStep = function( element, response ) {
	jQuery( '.ajax-content' ).html( response.data.view );

	var currentStep = response.data.current_step;
	var percent     = 0;

	if ( 2 === currentStep ) {
		percent = 37;
	} else if ( 3 === currentStep ) {
		percent = 62;
	}else if( 4 === currentStep ) {
		percent = 100;
	}else{
		percent = 0;
	}

	if ( jQuery( '.main-content' ).hasClass( 'step-1' ) ) {
		jQuery( '.main-content' ).removeClass( 'step-1' ).addClass( 'step-2' );
	} else if ( jQuery( '.main-content' ).hasClass( 'step-2' ) ) {
		jQuery( '.main-content' ).removeClass( 'step-2' ).addClass( 'step-3' );
	}else if ( jQuery( '.main-content' ).hasClass( 'step-3' ) ) {
		jQuery( '.main-content' ).removeClass( 'step-3' ).addClass( 'step-4' );
	}

	jQuery( '.causerie-wrap .bar .loader' ).css( 'width',  percent + '%' );
	jQuery( '.causerie-wrap .bar .loader' ).attr( 'data-width', percent );
	jQuery( '.causerie-wrap .step-list .step[data-width="' + percent + '"]' ).addClass( 'active' );

	window.eoxiaJS.refresh();
};

/**
 * Ajoutes la nouvelle ligne du participant dans le tableau.
 *
 * @since   6.6.0
 *
 * @param  {HTMLDivElement} element  Le bouton déclencahd l'action AJAX.
 * @param  {Object}         response Les données reçu dans le formulaire.
 *
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.savedParticipant = function( element, response ) {
	jQuery( '.ajax-content' ).html( response.data.view );

	window.eoxiaJS.digirisk.causerie.checkParticipantsSignature();

	window.eoxiaJS.refresh();
};

/**
 * Vérifie si toutes les signatures sont présentes dans le tableau.
 * Si toutes les signatures sont présentes, le bouton pour cloturer la causerie est cliquable.
 * Sinon, si une signature est manquante, le bouton est grisé.
 *
 * @since   6.6.0
 *
 * @return {boolean}
 */
window.eoxiaJS.digirisk.causerie.checkParticipantsSignature = function() {
	var allSignature = true

	if ( '.step-4 input[name="signature_data"]'.length ) {
		jQuery( '.step-4 input[name="signature_data"]' ).each( function() {
			if ( ! jQuery( this ).val() ) {
				allSignature = false;
				return false;
			}
		} );
	}

	if ( allSignature ) {
		jQuery( '.step-4 a.disabled' ).removeClass( 'disabled wpeo-tooltip-event' );
	} else {
		jQuery( '.step-4 a.disabled' ).addClass( 'disabled wpeo-tooltip-event' );
	}
};

/**
 * Remplaces le contenu de la ligne déclenchant cette action.
 * Cette action est déclenché lorsqu'un participant signe dans la modal.
 *
 * Cette méthode appelle la méthode "checkParticipantsSignature" afin de vérifier
 * si le bouton "cloturer la causerie" peut être cliquable.
 *
 * @since   6.6.0
 * @version 6.6.0
 *
 * @param  {HTMLDivElement} element  Le bouton déclenchant l'action.
 * @param  {Object}         response La réponse de la requête avec la vue.
 *
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.savedSignature = function( element, response ) {
	element.closest( 'tr' ).replaceWith( response.data.view );

	window.eoxiaJS.digirisk.causerie.checkParticipantsSignature();

	window.eoxiaJS.digirisk.causerie.refresh();
};

/**
 * Remplaces le contenu de la ligne déclenchant cette action.
 * Cette action est déclenché lorsqu'un participant signe dans la modal.
 *
 * Cette méthode appelle la méthode "checkParticipantsSignature" afin de vérifier
 * si le bouton "cloturer la causerie" peut être cliquable.
 *
 * @since   6.6.0
 * @version 6.6.0
 *
 * @param  {HTMLDivElement} element  Le bouton déclenchant l'action.
 * @param  {Object}         response La réponse de la requête avec la vue.
 *
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.savedFormerSignature = function( element, response ) {
	element.closest( 'tr' ).find( 'td.signature' ).replaceWith( response.data.view );

	window.eoxiaJS.digirisk.causerie.refresh();
};

/**
 * Vérifie que l'utilisateur et que la signature soit bien présente dans le formulaire.
 *
 * @since   6.6.0
 *
 * @param  {[type]} element [description]
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.checkAllData = function( element ) {
	console.log( '- - ' );
	jQuery( '.step-1 .former-tooltip' ).removeClass( 'active' );
	jQuery( '.step-1 .signature-tooltip' ).removeClass( 'active' );

	if ( ! jQuery( '.step-1 input[name="former_id"]' ).val() ) {
		jQuery( '.step-1 .former-tooltip' ).addClass( 'active' );

		return false;
	}

	if ( jQuery( '.step-1 input[name="signature_data"]' ).length ) {
		jQuery( '.step-1 .signature-tooltip' ).addClass( 'active' );

		return false;
	}

	return true;
};

/**
 * Vérifie que l'ID de l'utilisateur soit bien présente dans le formulaire.
 *
 * @since   6.6.0
 *
 * @param  {HTMLDivElement} element Le bouton déclenchant cette méthode.
 *
 * @return {boolean}                True si le formateur à été choisi, sinon false pour stopper la requête XHR.
 */
window.eoxiaJS.digirisk.causerie.checkUserID = function( element ) {
	element.closest( 'tr' ).find( '.user-tooltip' ).removeClass( 'active' );

	if ( ! element.closest( 'tr' ).find( 'input[name="participant_id"]' ).val() ) {
		element.closest( 'tr' ).find( '.user-tooltip' ).addClass( 'active' );

		return false;
	}

	return true;
};

window.eoxiaJS.digirisk.causerie.addKeywordToTextarea = function( event ){
	var importContent = jQuery( this ).closest( '.digi-import-causeries.modal-active' ).find( 'textarea' );
	if( jQuery( this ).attr( 'data-type' ) == "link" ){
		window.eoxiaJS.digirisk.causerie.buttonLinkExternalText( jQuery( this ), importContent );
	}else{
		if( jQuery( this ).attr( 'data-type' ) != "" && jQuery( this ).attr( 'data-type' ) != null ){
			var keyword       = '%' + jQuery( this ).attr( 'data-type' ) + '% ';
			importContent.focus().val( importContent.val() + '\r\n' + keyword );
		}
	}
}

window.eoxiaJS.digirisk.causerie.itemSelectToTextarea = function( event ){
	var keyword = jQuery( this ).attr( 'aria-label' );
	var importContent = jQuery( this ).closest( '.digi-import-causeries.modal-active' ).find( 'textarea' );
	importContent.val( importContent.val() + '\r\n' + '%risque%' + keyword );
}

window.eoxiaJS.digirisk.causerie.buttonLinkExternalText = function( element, importContent ){

	if( element.closest( '.digi-import-add-keyword' ).find( '.digi-info-import-link input' ).attr( 'data-import' ) == "true" ){
		var data         = {};
		data.action  = 'get_text_from_url';
		data.content = element.closest( '.digi-import-add-keyword' ).find( '.digi-info-import-link input' ).val(); // On recupere le contenu

		window.eoxiaJS.loader.display( jQuery( '.digi-import-add-keyword' ) );
		window.eoxiaJS.request.send( element, data );
	}else{
		if( element.attr( 'data-link' ) == "no"){
			element.find( '.digi_save_backup' ).val( importContent.val() ); // On recupere le contenu

			var next_step = 'yes';
			element.removeClass( 'button-grey' ).addClass( 'button-green' );
			element.closest( '.digi-import-add-keyword' ).find( '.digi-info-import-link' ).show( '200' );
		}else{
			importContent.focus().val( element.find( '.digi_save_backup' ).val() );

			var next_step = 'no';
			element.removeClass( 'button-green' ).addClass( 'button-grey' );
			element.closest( '.digi-import-add-keyword' ).find( '.digi-info-import-link' ).hide( '200' );
		}
		element.attr( 'data-link', next_step );
		element.find( '.digi_link_external' ).val( next_step );
	}
}

window.eoxiaJS.digirisk.causerie.updateImportTextFromUrl = function( event ){
	if( jQuery( this ).val().trim() != "" ){
		jQuery( this ).closest( '.digi-import-add-keyword' ).find( '.digi-icon-import-from-url' ).removeClass( 'fa-link' ).addClass( 'fa-file-import' );
		jQuery( this ).attr( 'data-import', "true" );
	}else{
		jQuery( this ).closest( '.digi-import-add-keyword' ).find( '.digi-icon-import-from-url' ).removeClass( 'fa-file-import' ).addClass( 'fa-link' );
		jQuery( this ).attr( 'data-import', "false" );
	}
}

window.eoxiaJS.digirisk.causerie.get_content_from_url_to_import_textarea = function( element, response ){
	if( response.data.error == "" ){
		element.closest( '.tm-import-tasks.modal-active' ).find( 'textarea' ).val( response.data.content );
	}

	element.closest( '.digi-import-add-keyword' ).find( '.digi-info-import-link input' ).val( '' );
	element.removeClass( 'button-green' ).addClass( 'button-grey' );
	element.closest( '.digi-import-add-keyword' ).find( '.digi-info-import-link' ).hide( '200' );

	element.attr( 'data-link', "no" );
	element.find( '.digi_link_external' ).val( "no" );
}
/**
 * Le callback en cas de réussite à la requête Ajax "delete_started_causerie".
 * Remplaces le contenu du tableau par la vue renvoyée par la réponse Ajax.
 *
 * @since   7.3.0
 *
 * @param  {HTMLDivElement} triggeredElement  L'élement HTML déclenchant la requête Ajax.
 * @param  {Object}         response          Les données renvoyées par la requête Ajax.
 * @return {void}
 */
window.eoxiaJS.digirisk.causerie.deletedStartedCauserie = function( triggeredElement, response ) {
	triggeredElement.closest( '.causerie-row' ).fadeOut();
};

window.eoxiaJS.digirisk.causerie.getContentFromUrl = function( triggeredElement, response ){
	var data = response.data.response_git;

	if( data.success ){
		triggeredElement.closest( '.modal-container' ).find( '.digi-view-git' ).html( response.data.view );

	}else{
		triggeredElement.closest( '.modal-footer-view-git' ).find( '.digi-info-git-error' ).show();
		triggeredElement.closest( '.modal-footer-view-git' ).find( '.digi-info-git-error .notice-title' ).html( response.data.error );
	}
}

window.eoxiaJS.digirisk.causerie.importGitContent = function( event ){
	var url = jQuery( this ).closest( '.digi-import-add-keyword' ).find( '.import-git-input input[type="text"]' );
	var textarea_element = jQuery( this ).closest( '.digi-view-textarea' );

	var data         = {};
	data.url  = url;
	data.action  = jQuery( this ).attr( 'data-action' );
	data._wpnonce  = jQuery( this ).attr( 'data-nonce' );
	data.url  = jQuery( this ).attr( 'data-url' );

	window.eoxiaJS.loader.display( jQuery( this ).parent() );
	window.eoxiaJS.request.send( jQuery( this ), data );
}

window.eoxiaJS.digirisk.causerie.importPictureToMediaSuccess = function( triggeredElement, response ){
	var success_element = triggeredElement.closest( '.modal-container' ).find( '.digi-info-git-success' );
	if( response.data.id > 0 ){
		triggeredElement.removeClass( 'action-attribute' );
		triggeredElement.removeClass( 'button-green' ).addClass( 'button-grey' );
		triggeredElement.html( '<i class="fas fa-check"></i>' );
		triggeredElement.closest( '.table-row' ).css( 'border', 'solid 2px green' );

		var id = " (#" + response.data.id + ")";
		success_element.html( '<a href="' + response.data.link + '" target="_blank"> ' + response.data.text_info + id + '</a>' );
		success_element.show();

		triggeredElement.closest( '.modal-container' ).find( '.modal-footer-view-git .digi-footer-git-import' ).hide();
		triggeredElement.closest( '.modal-container' ).find( '.modal-footer-view-git .digi-footer-git-display' ).show();



		triggeredElement.closest( '.modal-container' ).find( '.digi-display-view-git [data-display="git"]' ).attr( 'data-buttongit', true );
		var str = triggeredElement.closest( '.modal-container' ).find( '.digi-display-view-git [name="contentgit"]' ).val();
		triggeredElement.closest( '.modal-container' ).find( '.digi-display-view-git [name="contentgit"]' ).val( str + '\r\n' + response.data.content );

		triggeredElement.attr( 'data-alreadydl', 'true' );

		var nbr = triggeredElement.closest( '.modal-container' ).find( '.digi-import-git-success .digi-number-picture' ).html();
		nbr = parseInt( nbr ) - 1;
		if( nbr > 0 ){
			triggeredElement.closest( '.modal-container' ).find( '.digi-import-git-success .digi-number-picture' ).html( nbr );
		}else{
			triggeredElement.closest( '.modal-container' ).find( '.digi-import-git-success .digi-picture-download' ).hide( '200' );
		}

	}
}

window.eoxiaJS.digirisk.causerie.importTxtToTextareaSuccess = function( triggeredElement, response ){
	triggeredElement.closest( '.modal-content' ).find( '.digi-view-textarea [name="content"]' ).val( response.data.content );

	var success_element = triggeredElement.closest( '.modal-container' ).find( '.digi-info-git-success' );

	success_element.html( response.data.text_info );
	success_element.show();
}

window.eoxiaJS.digirisk.causerie.txtHiddenGitToTextArea = function( event ){
	var gitstr = jQuery( this ).find( '[name ="contentgit"]' ).val();
	var str = jQuery( this ).closest( '.modal-container').find( '.digi-view-textarea textarea[ name="content" ]' ).val();
	jQuery( this ).closest( '.modal-container').find( '.digi-view-textarea textarea[ name="content" ]' ).val( str + gitstr );
}

window.eoxiaJS.digirisk.causerie.importAllPictureToMedia = function( event ){
	var button_element = jQuery( this );
	jQuery( this ).closest( '.digi-view-git' ).find( '.digi-display-response-git .table-row .digi-this-is-a-picture' ).each( function( e ){
		if( jQuery( this ).attr( 'data-alreadydl' ) == "false" ){
			jQuery( this ).attr( 'data-alreadydl', 'true' );

			var data         = {};
			data.filename  = jQuery( this ).attr( 'data-filename' );
			data.url  = jQuery( this ).attr( 'data-url' );
			data.action  = jQuery( this ).attr( 'data-action' );
			data._wpnonce  = jQuery( this ).attr( 'data-nonce' );
			data.url  = jQuery( this ).attr( 'data-url' );

			window.eoxiaJS.loader.display( jQuery( this ).parent() );
			window.eoxiaJS.request.send( jQuery( this ), data );
		}
	})
}

window.eoxiaJS.digirisk.causerie.displayImportGitInput = function( event ){
	jQuery( this ).closest( '.modal-footer' ).find( '.modal-footer-view-git .digi-footer-git-import' ).show();
	jQuery( this ).closest( '.modal-footer' ).find( '.modal-footer-view-git .digi-info-git-success' ).hide();
	jQuery( this ).hide();
}

window.eoxiaJS.digirisk.causerie.executeTxtToTextareaSuccess = function( triggeredElement, response ){
	triggeredElement.closest( '.modal-container' ).find( '.view-git-element' ).hide( '200' );
	triggeredElement.closest( '.modal-container' ).find( '.digi-view-execute' ).show();
	triggeredElement.closest( '.modal-container' ).find( '.digi-content-execute' ).html( response.data.view );
	triggeredElement.closest( '.modal-container' ).find( '.digi-footer-execute' ).html( response.data.view_footer );
}

window.eoxiaJS.digirisk.causerie.displayImportGitFromExecute = function( event ){
	jQuery( this ).closest( '.modal-container' ).find( '.view-git-element' ).show( '200' );
	jQuery( this ).closest( '.modal-container' ).find( '.digi-view-execute' ).hide();
}


window.eoxiaJS.digirisk.causerie.importModalExecuteIt =  function ( event ){

	var content = '';
	jQuery( this ).closest( '.modal-container' ).find('.digi-view-execute .digi-import-execute-success' ).each( function( e ){
		content += jQuery( this ).find( 'span' ).html();
	})

	var request_data = {};
	request_data.action   = 'execute_git_txt';
	request_data.content  = content;
	request_data._wpnonce = jQuery( this ).attr( 'data-nonce' );

	window.eoxiaJS.loader.display( jQuery( this ) );
	window.eoxiaJS.request.send( jQuery( this ), request_data );
}

window.eoxiaJS.digirisk.causerie.executeGitTxtSuccess =  function ( triggeredElement, response ){
	triggeredElement.closest( '.modal-container' ).find( '.tab-content' ).html( response.data.view );
}

window.eoxiaJS.digirisk.causerie.tabSelectRedirect = function( event ){
	var url = jQuery( this ).attr( 'data-url' );
	window.location.href = url;
	console.log( 'efjkopEFKLfEEFZ' );
}


window.eoxiaJS.digirisk.causerie.deletedAccidentSuccess = function( triggeredElement, response ){
	triggeredElement.closest( '.causerie-row' ).hide( '200' );
}

window.eoxiaJS.digirisk.causerie.leBouttonPlayCestPourLaMusique = function( e ){
	var interval = 0;
	var myReq;
	var k = [13, 13, 13, 13, 13, 13];
	var f = [32, 32, 32, 32, 32, 32];
	n = 0;

	var oui = false;
	var color = [];

	var p = 0;
	jQuery(document).keyup(function (e) {
	   	if (e.keyCode === k[n++]) {
		 	if (n === k.length) {
				if( p == 0 ){
					p = 1;
					draw2();
				}
		 	}
	   }

	   if (e.keyCode === f[n++]) {
		   if (n === f.length) {
			   if( p == 0 ){
				   p = 1;
				   draw3();
			   }
		   }
	  }

	   function createAudioContext(desiredSampleRate) {

		  var AudioCtor = window.AudioContext || window.webkitAudioContext;
		  desiredSampleRate = typeof desiredSampleRate === 'number' ? desiredSampleRate : 44100;
		  var context = new AudioCtor();
		  // Check if hack is necessary. Only occurs in iOS6+ devices
		  // and only when you first boot the iPhone, or play a audio/video
		  // with a different sample rate
		  if (/(iPhone|iPad)/i.test(navigator.userAgent) && context.sampleRate !== desiredSampleRate) {
			  var buffer = context.createBuffer(1, 1, desiredSampleRate);
			  var dummy = context.createBufferSource();
			  dummy.buffer = buffer;
			  dummy.connect(context.destination);
			  dummy.start(0);
			  dummy.disconnect();
			  context.close();
			  // dispose old context
			  context = new AudioCtor();
		  }
		  return context;
	  }
	  var audioContext = new createAudioContext();
	  var mixGain = audioContext.createGain();
	  var filterGain = audioContext.createGain();
	  var kickButton = document.querySelector('#kickButton');
	  var snareButton = document.querySelector('#snareButton');
	  var hihatButton = document.querySelector('#hihatButton');
	  var mixButton = document.querySelector('#mixButton');

	  //SOUNDS
	  function kick() {

		  var osc = audioContext.createOscillator();
		  var osc2 = audioContext.createOscillator();
		  var gainOsc = audioContext.createGain();
		  var gainOsc2 = audioContext.createGain();

		  osc.type = 'triangle';
		  osc2.type = 'sine';

		  gainOsc.gain.setValueAtTime(1, audioContext.currentTime);
		  gainOsc.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
		  gainOsc.connect(audioContext.destination);
		  gainOsc2.gain.setValueAtTime(1, audioContext.currentTime);
		  gainOsc2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
		  gainOsc2.connect(audioContext.destination);
		  osc.frequency.setValueAtTime(120, audioContext.currentTime);
		  osc.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
		  osc2.frequency.setValueAtTime(50, audioContext.currentTime);

		  //Connections
		  osc.connect(gainOsc);
		  osc2.connect(gainOsc2);
		  gainOsc2.connect(mixGain);
		  gainOsc.connect(mixGain);

		  mixGain.gain.value = 1;

		  osc.start(audioContext.currentTime);
		  osc2.start(audioContext.currentTime);
		  osc.stop(audioContext.currentTime + 0.5);
		  osc2.stop(audioContext.currentTime + 0.5);
	  }

	  function snare() {

		  var osc3 = audioContext.createOscillator();
		  var gainOsc3 = audioContext.createGain();

		  filterGain.gain.setValueAtTime(1, audioContext.currentTime);
		  filterGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

		  osc3.type = 'triangle';
		  osc3.frequency.value = 100;

		  gainOsc3.gain.value = 0;
		  gainOsc3.gain.setValueAtTime(0, audioContext.currentTime);
		  //gainOsc3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

		  //Connections
		  osc3.connect(gainOsc3);
		  gainOsc3.connect(mixGain);

		  mixGain.gain.value = 1;

		  osc3.start(audioContext.currentTime);
		  osc3.stop(audioContext.currentTime + 0.2);

		  var node = audioContext.createBufferSource(),
			  buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate),
			  data = buffer.getChannelData(0);

		  var filter = audioContext.createBiquadFilter();

		  filter.type = 'highpass';
		  filter.frequency.setValueAtTime(100, audioContext.currentTime);
		  filter.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.2);

		  for (var i = 0; i < 4096; i++) {
			  data[i] = Math.random();
		  }

		  node.buffer = buffer;
		  node.loop = true;

		  //Connections
		  node.connect(filter);
		  filter.connect(filterGain);
		  filterGain.connect(mixGain);

		  node.start(audioContext.currentTime);
		  node.stop(audioContext.currentTime + 0.2);

	  }

	  function hihat() {

		  var gainOsc4 = audioContext.createGain();
		  var fundamental = 40;
		  var ratios = [
			  2,
			  3,
			  4.16,
			  5.43,
			  6.79,
			  8.21
		  ];
		  var bandpass = audioContext.createBiquadFilter();
		  bandpass.type = 'bandpass';
		  bandpass.frequency.value = 10000;
		  var highpass = audioContext.createBiquadFilter();
		  highpass.type = 'highpass';
		  highpass.frequency.value = 7000;
		  ratios.forEach(function(ratio) {
			  var osc4 = audioContext.createOscillator();
			  osc4.type = 'square';
			  osc4.frequency.value = fundamental * ratio;
			  osc4.connect(bandpass);
			  osc4.start(audioContext.currentTime);
			  osc4.stop(audioContext.currentTime + 0.05);
		  });

		  gainOsc4.gain.setValueAtTime(1, audioContext.currentTime);
		  gainOsc4.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

		  bandpass.connect(highpass);
		  highpass.connect(gainOsc4);
		  gainOsc4.connect(mixGain);

		  mixGain.gain.value = 1;
	  }

	  function custom_song() {

		  var gainOsc4 = audioContext.createGain();
		  var fundamental = 80;
		  var ratios = [
			  2,
			  3,
			  4.16,
			  5.43,
			  6.79,
			  8.21
		  ];
		  var bandpass = audioContext.createBiquadFilter();
		  bandpass.type = 'bandpass';
		  bandpass.frequency.value = 8500;
		  var highpass = audioContext.createBiquadFilter();
		  highpass.type = 'highpass';
		  highpass.frequency.value = 7000;
		  ratios.forEach(function(ratio) {
			  var osc4 = audioContext.createOscillator();
			  osc4.type = 'triangle';
			  osc4.frequency.value = fundamental * ratio;
			  osc4.connect(bandpass);
			  osc4.start(audioContext.currentTime);
			  osc4.stop(audioContext.currentTime + 0.4);
		  });

		  gainOsc4.gain.setValueAtTime(1, audioContext.currentTime);
		  gainOsc4.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 0.4);

		  bandpass.connect(highpass);
		  highpass.connect(gainOsc4);
		  gainOsc4.connect(mixGain);

		  mixGain.gain.value = 1.5;
	  }

	  //BUTTON

	  //INTERVALS
	  function interval(func, wait, times) {
		  var interv = function(w, t) {
			  return function() {
				  if (typeof t === 'undefined' || t-- > 0) {
					  setTimeout(interv, w);
					  try {
						  func.call(null);
					  } catch (e) {
						  t = 0;
						  throw e.toString();
					  }
				  }
			  };
		  }(wait, times);
		  setTimeout(interv, wait);
	  }
	  mixGain.connect(audioContext.destination);
	  mixGain.gain.value = 0;
	  filterGain.gain.value = 0;

	  //EXAMPLE SOUNDS
	  var kickMixGain = audioContext.createGain();
	  var kickOsc = audioContext.createOscillator();
	  var kickOsc2 = audioContext.createOscillator();
	  var kickGainOsc = audioContext.createGain();
	  var kickGainOsc2 = audioContext.createGain();

	  kickOsc.type = 'triangle';
	  kickOsc.frequency.value = 40;
	  kickGainOsc.gain.value = 1;
	  kickOsc2.type = 'sine';
	  kickOsc2.frequency.value = 80;
	  kickGainOsc2.gain.value = 1;

	  //Connections
	  kickOsc.connect(kickGainOsc);
	  kickOsc2.connect(kickGainOsc2);
	  kickGainOsc2.connect(kickMixGain);
	  kickGainOsc.connect(kickMixGain);
	  kickMixGain.gain.value = 0;
	  kickOsc.start(audioContext.currentTime);
	  kickOsc2.start(audioContext.currentTime);

	  //DRAW BOXES
	function createBox(instrument) {
	  	switch (true) {
		  	case instrument === hihat:
			  	hihat();
			  	break;
		  	case instrument === kick:
			  	kick();
			  	break;
		  	case instrument === snare:
			  	snare();
			  	break;
			case instrument === custom_song:
			custom_song();
			break;
		}
	};

	  function draw2() {
		  var elements = 0;
		  var tour = 1;

		  var Timer = setInterval(function() {

			  elements ++;
			  console.log( '1 :' + elements );

				if (elements % 2 == 0 || elements == 0 ) {
					createBox(hihat);
				}

			  	if ( tour == 2 || tour > 3 ) {
					var a = ( elements + 1 ) % 2;
					if( a == 0 || elements == 0 ){
						createBox(kick);
					}
			  	}

				if ( ( elements % 4 == 0 || elements == 0 ) && tour > 2 ) {
				  	createBox(snare);
				}
				if( tour < 4 ){ // 4
					if( elements > 11) {
						tour ++;
						elements = 0;
						console.log( 'Tour : ' + tour );
					}
				}else{
					if( elements === 24 ){
						clearInterval(Timer);
						refrain();
					}
				}
		  }, 250 );

		  var stopIt = document.getElementById('stopButton');
	  }

	  function refrain(){
		  var elements = 0;

		  var new_Timer = setInterval(function() {
			  elements ++;

				if (elements % 2 == 0 || elements == 0 ) {
					createBox(hihat);
				}

				var a = ( elements + 1 ) % 2;
				var b = ( elements + 1 ) % 4;
				if( b == 0 ){
					createBox(kick);
				}

				if( a == 0 ){
					createBox(custom_song);
				}

				if ( elements % 4 == 0 ) {
				  	createBox(snare);
				}

				if( elements >= 50 ){
					clearInterval(new_Timer);
					console.log( 'END' );
				}
		  }, 200 );
	  }

	  function draw3() {
		  var elements = 0;
		  var tour = 1;

		  var Timer = setInterval(function() {

				elements ++;
				if ( elements == 5 ){
					createBox(custom_song);
					createBox(hihat);
				}

				if( elements == 10 ){
					createBox(kick);
				}

				if ( elements == 15 ){
					createBox(hihat);
				}

				if( elements == 20 ){
					createBox(snare);
				}

				if( elements > 20 ) {
					tour ++;
					elements = 0;
				}
		  }, 50 );

	  }

		(function setButtonStyle() {
			// var buttons = document.querySelector(".btnz");
			// buttons.style.width = '900px';
			// buttons.style.height = '60px';
			// buttons.style.position = 'relative';
			// buttons.style.border = '10px solid white';
			// buttons.style.display = 'in-line';
		}());
	});
};

window.eoxiaJS.digirisk.causerie.causerieImportTxtFromUrl = function( triggeredElement, response ){
	if( response.data.view != "" ){
		var parent_element = triggeredElement.closest( '.digi-view-textarea' );
		parent_element.find( '.digi-import-add-keyword' ).hide();
		parent_element.find( '.digi-import-modal-content-main' ).hide();
		parent_element.find( '.digi-import-modal-content-main textarea' ).val( response.data.content );

		parent_element.find( '.digi-import-modal-content-git' ).show();
		parent_element.find( '.digi-import-modal-content-git' ).html( response.data.view );

		triggeredElement.closest( '.modal-container' ).find( '.digi-button-import-git' ).show();
		triggeredElement.closest( '.modal-container' ).find( '.digi-button-import' ).hide();
	}
}

window.eoxiaJS.digirisk.causerie.causerieImportDisplayTextarea = function( event ){
	console.log( '----' );
	jQuery( this ).closest( '.modal-container' ).find( '.digi-import-modal-content-main' ).show();
	jQuery( this ).closest( '.modal-container' ).find( '.digi-import-add-keyword' ).show();
	jQuery( this ).closest( '.modal-container' ).find( '.digi-button-import' ).show();

	jQuery( this ).closest( '.modal-container' ).find( '.digi-import-modal-content-git' ).hide();
	jQuery( this ).closest( '.modal-container' ).find( '.digi-button-import-git' ).hide();
}
