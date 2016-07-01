<?php if ( !defined( 'ABSPATH' ) ) exit;
/**
 * Fichier du controlleur principal de l'extension digirisk pour wordpress / Main controller file for digirisk plugin
 *
 * @author Evarisk development team <dev@evarisk.com>
 * @version 6.0
 */

/**
 * Classe du controlleur principal de l'extension digirisk pour wordpress / Main controller class for digirisk plugin
 *
 * @author Evarisk development team <dev@evarisk.com>
 * @version 6.0
 */
class sheet_groupment_action {

	/**
	 * CORE - Instanciation des actions ajax pour les unités de travail / Instanciate ajax treatment for work unit
	 */
	function __construct() {
  	add_action( 'wp_ajax_wpdigi_save_sheet_digi-group', array( $this, 'generate_sheet' ) );
	}

	/**
	 *	Callback function for group sheet generation / Fonction de rappel pour la génération des fiches de groupements
	 */
	function generate_sheet() {
		check_ajax_referer( 'digi_ajax_generate_element_sheet' );

		$element_id = !empty( $_POST ) && !empty( $_POST[ 'element_id' ] ) && is_int( (int)$_POST[ 'element_id' ] ) ? (int)$_POST[ 'element_id' ] : ( null !== $element_id  && is_int( (int)$element_id ) ? (int)$element_id : null );
		if ( 0 === $element_id ) {
			wp_send_json_error( array( 'message' => __( 'Requested element for sheet generation is invalid. Please check your request', 'digirisk' ), ) );
		}

		$generation_response = sheet_groupment_class::get()->generate_sheet( $element_id );

		wp_die( json_encode( $generation_response ) );
	}

}

new sheet_groupment_action();
