<?php
/**
 * Gestion du formulaire pour générer une fiche de poste
 *
 * @author Jimmy Latour <jimmy@evarisk.com>
 * @since 6.2.1.0
 * @version 6.2.4.0
 * @copyright 2015-2017 Evarisk
 * @package sheet_workunit
 * @subpackage view
 */

if ( ! defined( 'ABSPATH' ) ) {	exit; } ?>

<tr class="sheet-workunit-row">
	<input type="hidden" name="action" value="generate_fiche_de_poste" />
	<?php wp_nonce_field( 'ajax_generate_fiche_de_poste' ); ?>
	<input type="hidden" name="element_id" value="<?php echo esc_attr( $element_id ); ?>" />

	<td></td>
	<td><?php esc_html_e( 'Générer une nouvelle fiche de poste', 'digirisk' ); ?></td>

	<td>
		<div class="action w50">
			<div class="action-input button blue add" data-loader="sheet-workunit-row" data-parent="sheet-groupment-row">
				<i class="icon fa fa-plus"></i>
			</div>
		</div>
	</td>
</li>
