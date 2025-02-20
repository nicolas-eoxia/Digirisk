<?php
/**
 * Le modèle définissant les données d'une fiche d'un plan de prévention
 *
 * @author    Evarisk <dev@evarisk.com>
 * @since     6.6.0
 * @version   6.6.0
 * @copyright 2019 Prevention.
 * @package   DigiRisk
 */

namespace digi;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Le modèle définissant les données d'une fiche de causerie.
 */
class Sheet_Permis_Feu_Model extends Document_Model {

	/**
	 * Construit le modèle
	 *
	 * @since 6.6.0
	 * @version 6.6.0
	 *
	 * @param  Sheet_Permis_Feu_Model $object La définition de l'objet dans l'instance actuelle.
	 *
	 * @return Sheet_Permis_Feu_Model
	 */
	public function __construct( $object, $req_method ) {
		$this->schema['document_meta'] = array(
			'type'      => 'array',
			'meta_type' => 'single',
			'field'     => 'document_meta',
			'child'     => array(),
		);

		$this->schema['document_meta']['child']['id'] = array(
			'type' => 'integer',
		); // OK

		$this->schema['document_meta']['child']['unique_identifier'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['pompier_number'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['police_number'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['samu_number'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['emergency_number'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['date_start_intervention_PPP'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['date_end_intervention_PPP'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['society_title'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['society_siret_id'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['society_address'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['society_postcode'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['society_town'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervenants'] = array(
			'type' => 'array',
		); // OK

		$this->schema['document_meta']['child']['intervenants_info'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['interventions'] = array(
			'type' => 'array',
		); // OK

		$this->schema['document_meta']['child']['interventions_info'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['interventions_pre'] = array(
			'type' => 'array',
		); // OK

		$this->schema['document_meta']['child']['interventions_pre_info'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['titre_permis_feu'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['titre_plan_prevention'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['raison_plan_prevention'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['date_start_intervention_pre'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['date_end_intervention_pre'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervention_pre_info'] = array(
			'type' => 'string',
		); // OK

		// --------------------------
		$this->schema['document_meta']['child']['maitre_oeuvre_fname'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['maitre_oeuvre_lname'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['maitre_oeuvre_phone'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['maitre_oeuvre_signature_id'] = array(
			'type' => 'integer',
		); // OK

		$this->schema['document_meta']['child']['maitre_oeuvre_email'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['maitre_oeuvre_signature_date'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['maitre_oeuvre_signature'] = array(
			'type' => 'array',
		);
		// --------------------------

		$this->schema['document_meta']['child']['intervenant_exterieur_fname'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervenant_exterieur_lname'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervenant_exterieur_phone'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervenant_exterieur_email'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervenant_exterieur_signature_id'] = array(
			'type' => 'integer',
		); // OK

		$this->schema['document_meta']['child']['intervenant_exterieur_signature_date'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['intervenant_exterieur_signature'] = array(
			'type' => 'array',
		);

		$this->schema['document_meta']['child']['moyen_generaux_mis_disposition'] = array(
			'type' => 'string',
		); // OK

		$this->schema['document_meta']['child']['consigne_generale'] = array(
			'type' => 'string',
		); // OK

		parent::__construct( $object, $req_method );
	}
}
