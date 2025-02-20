<?php
/**
 * La classe gérant les permis de feu
 *
 * @author    Evarisk <dev@evarisk.com>
 * @since     7.4.0
 * @version   7.4.0
 * @copyright 2019 Evarisk.
 * @package   DigiRisk
 */

namespace digi;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * La classe gérant les causeries
 */
class Permis_Feu_Class extends \eoxia\Post_Class {

	/**
	 * Le nom du modèle
	 *
	 * @var string
	 */
	protected $model_name = '\digi\Permis_Feu_Model';

	/**
	 * Le post type
	 *
	 * @var string
	 */
	protected $type = 'digi-permisfeu';

	/**
	 * La route pour accéder à l'objet dans la rest API
	 *
	 * @var string
	 */
	protected $base = 'permisfeu';

	/**
	 * La version de l'objet
	 *
	 * @var string
	 */
	protected $version = '0.1';

	/**
	 * La clé principale du modèle
	 *
	 * @var string
	 */
	protected $meta_key = '_wpdigi_permis_feu';

	/**
	 * Le préfixe de l'objet dans DigiRisk
	 *
	 * @var string
	 */
	public $element_prefix = 'C';

	public function get_link( $permis_feu, $step_number, $skip = false ) {
		return admin_url( 'admin-post.php?action=change_step_permis_feu&id=' . $permis_feu->data['id'] . '&step=' . $step_number );
	}

	public function add_information_to_permis_feu( $permis_feu ){
		$permis_feu->data[ 'intervention' ] = Permis_Feu_Intervention_Class::g()->get( array( 'post_parent' => $permis_feu->data[ 'id' ] ) ); // Recupere la liste des interventions

		if( $permis_feu->data[ 'maitre_oeuvre' ][ 'user_id' ] > 0 ){ // Maitre d'oeuvre data
			$id = $permis_feu->data[ 'maitre_oeuvre' ][ 'user_id' ];
			$permis_feu = $this->get_information_from_user( $id, $permis_feu, 'maitre_oeuvre' );
		}
		if( $permis_feu->data[ 'prevention_id' ] != 0 ){
			$prevention = Prevention_Class::g()->get( array( 'id' => $permis_feu->data[ 'prevention_id' ] ), true );
			if( ! empty( $prevention ) ){
				// $prevention = Prevention_Class::g()->add_information_to_prevention( $prevention ); // Trop lourd
				$permis_feu->data[ 'prevention_data' ] = $prevention->data;
			}
		}

		if( $permis_feu->data[ 'step' ] >= \eoxia\Config_Util::$init['digirisk']->permis_feu->steps->PERMIS_FEU_CLOSED ){
			$permis_feu->data[ 'is_end' ] = \eoxia\Config_Util::$init['digirisk']->permis_feu->status->PERMIS_FEU_IS_ENDED;
			$permis_feu->data[ 'step' ] = \eoxia\Config_Util::$init['digirisk']->permis_feu->steps->PERMIS_FEU_FORMER;
			Permis_feu_Class::g()->update( $permis_feu->data );
		}

		// Go supprimer les 5 prochaines lignes d'ici le 30/09/2019
		// Avec la fonction -> C'était pour update l'identifier de chaque prévention
		if( $permis_feu->data[ 'is_end' ] == \eoxia\Config_Util::$init['digirisk']->permis_feu->status->PERMIS_FEU_IS_ENDED ){
			if( $permis_feu->data[ 'unique_identifier_int' ] == 0 ){
				$permis_feu->data[ 'unique_identifier_int' ] = $this->find_this_unique_identifier( $permis_feu->data[ 'id' ], false );
				Permis_Feu_Class::g()->update( $permis_feu->data );
			}

			$permis_feu->data[ 'unique_identifier' ] = Setting_Class::g()->get_prefix_permis_feu() . $permis_feu->data[ 'unique_identifier_int' ];
		}
		// Jusqu'ici - Corentin (Meme function dans prevention.class.php)

		if( strlen( $permis_feu->data[ 'title' ] ) > 35 ){
			$permis_feu->data[ 'title' ] = substr( $permis_feu->data[ 'title' ], 0, 35 );
		}

		return $permis_feu;
	}

	public function display_maitre_oeuvre( $permis_feu ){
		\eoxia\View_Util::exec( 'digirisk', 'permis_feu', 'start/step-4-maitre-oeuvre', array(
			'permis_feu' => $permis_feu
		) );
	}

	public function update_maitre_oeuvre( $id, $user_info ){
		$permis_feu = Permis_Feu_Class::g()->get( array( 'id' => $id ), true );

		if( ! empty( $user_info ) ){
			$permis_feu->data[ 'maitre_oeuvre' ][ 'user_id' ] =  intval( $user_info->data->ID );
		}
		return Permis_Feu_Class::g()->update( $permis_feu->data );
	}

	public function get_information_from_user( $id, $permis_feu, $type_user ){
		$user_info = get_user_by( 'id', $id );
		$permis_feu->data[ $type_user ] = wp_parse_args( $user_info, $permis_feu->data[ $type_user ] );

		$avatar_color = array( 'e9ad4f', '50a1ed', 'e05353', 'e454a2', '47e58e', '734fe9' ); // Couleur
		$color = $id % count( $avatar_color );
		$permis_feu->data[ $type_user ][ 'data' ]->avator_color = $avatar_color[ $color ]; // De l'avatar

		$permis_feu->data[ $type_user ][ 'data' ]->first_name = $user_info->first_name != "" ? $user_info->first_name : $user_info->data->display_name; // De l'avatar
		$permis_feu->data[ $type_user ][ 'data' ]->last_name = $user_info->last_name != "" ? $user_info->last_name : $user_info->data->display_name; // De l'avatar

		if( $user_info->first_name != "" || $user_info->last_name != "" ){ // Inital
			$permis_feu->data[ $type_user ][ 'data' ]->initial = substr( $user_info->first_name, 0, 1 ) . ' ' . substr( $user_info->last_name, 0, 1 );
		}else{
			$permis_feu->data[ $type_user ][ 'data' ]->initial = substr( $user_info->display_name, 0, 1 );
		}

		$user_information = get_the_author_meta( 'digirisk_user_information_meta', $id );
		$phone_number = ! empty( $user_information['digi_phone_number_full'] ) ? $user_information['digi_phone_number_full'] : '';
		$phone_only_number = ! empty( $user_information['digi_phone_number'] ) ? $user_information['digi_phone_number'] : '';
		$permis_feu->data[ $type_user ][ 'data' ]->phone = $phone_number;
		$permis_feu->data[ $type_user ][ 'data' ]->phone_nbr = $phone_only_number;

		return $permis_feu;
	}

	public function add_signature_maitre_oeuvre( $permis_feu, $signature_data , $slug ) {
		$upload_dir = wp_upload_dir();

		// Association de la signature.
		if ( ! empty( $signature_data ) ) {
			$encoded_image = explode( ',', $signature_data )[1];
			$decoded_image = base64_decode( $encoded_image );
			file_put_contents( $upload_dir['basedir'] . '/digirisk/tmp/signature.png', $decoded_image );
			$file_id = \eoxia\File_Util::g()->move_file_and_attach( $upload_dir['basedir'] . '/digirisk/tmp/signature.png', $permis_feu->data['id'] );

			$permis_feu->data[$slug]['signature_id']   = $file_id;
			$permis_feu->data[$slug]['signature_date'] = current_time( 'mysql' );
		}

		return $permis_feu;
	}

	public function step_maitreoeuvre( $permis_feu ) {

		$mo_phone      = ! empty( $_POST['maitre-oeuvre-phone'] ) ? sanitize_text_field( $_POST['maitre-oeuvre-phone'] ) : '';
		$mo_phone_code = ! empty( $_POST['maitre-oeuvre-phone-callingcode'] ) ? sanitize_text_field( $_POST['maitre-oeuvre-phone-callingcode'] ) : '';
		$update = ! empty( $_POST['update'] ) ? false : true;

		$permis_feu->data['step'] = \eoxia\Config_Util::$init['digirisk']->permis_feu->steps->PERMIS_FEU_INFORMATION;

		if( $mo_phone != "" && $update ){
			$mo_phone_code = $mo_phone_code != "" ? '(' . $mo_phone_code . ')' : '';
			$permis_feu->data[ 'maitre_oeuvre' ][ 'phone' ] = $mo_phone_code . $mo_phone;

			if( $permis_feu->data[ 'maitre_oeuvre'][ 'user_id' ] ){

				$user_information = get_the_author_meta( 'digirisk_user_information_meta', $permis_feu->data[ 'maitre_oeuvre'][ 'user_id' ] );
				$user_information = ! empty( $user_information ) ? $user_information : array();
				$user_information[ 'digi_phone_number' ] = $mo_phone;
				$user_information[ 'digi_phone_number_full' ] = $mo_phone_code . $mo_phone;

				update_user_meta( $permis_feu->data[ 'maitre_oeuvre'][ 'user_id' ], 'digirisk_user_information_meta', $user_information );
			}
		}

		$permis_feu = Permis_Feu_Class::g()->update( $permis_feu->data );
		return Permis_Feu_Class::g()->add_information_to_permis_feu( $permis_feu );
	}

	public function display_prevention( $permis_feu ){
		\eoxia\View_Util::exec( 'digirisk', 'permis_feu', 'start/step-2-prevention', array(
			'permis_feu' => $permis_feu
		) );
	}

	public function generate_worktype_if_not_exist(){
		$default_core_option = array(
			'installed'                   => false,
			'db_version'                  => '1',
			'danger_installed'            => false,
			'recommendation_installed'    => false,
			'evaluation_method_installed' => false,
			'worktype_installed'          => false,
		);

		$core_option = get_option( \eoxia\Config_Util::$init['digirisk']->core_option, $default_core_option );

		if ( ! isset( $core_option['worktype_installed'] ) || ! $core_option['worktype_installed'] ){
			\eoxia\LOG_Util::log( 'Installeur composant - DEBUT: Création des catégories de types de travaux', 'digirisk' );
			if ( Worktype_Category_Default_Data_Class::g()->create() ) {
				\eoxia\LOG_Util::log( 'Installeur composant - FIN: Création des catégories de types de travaux SUCCESS', 'digirisk' );
				$core_option['worktype_installed'] = true;
			} else {
				\eoxia\LOG_Util::log( 'Installeur composant - FIN: Création des catégories de types de travaux ERROR', 'digirisk' );
			}
			update_option( \eoxia\Config_Util::$init['digirisk']->core_option, $core_option );
			return true;
		}
		return false;
	}

	public function display_intervenant_exterieur( $user = array(), $id = 0 ){
		$permis_feu = Permis_feu_Class::g()->get( array( 'id' => $id ), true );

		\eoxia\View_Util::exec( 'digirisk', 'permis_feu', 'start/step-4-intervenant-exterieur', array(
			'user' => $user,
			'permis_feu' => $permis_feu
		) );
	}

	public function save_info_maitre_oeuvre(){
		$id   = ! empty( $_POST['id'] ) ? (int) $_POST['id'] : 0;

		$i_name        = ! empty( $_POST['intervenant-name'] ) ? sanitize_text_field( $_POST['intervenant-name'] ) : '';
		$i_lastname    = ! empty( $_POST['intervenant-lastname'] ) ? sanitize_text_field( $_POST['intervenant-lastname'] ) : '';
		$i_phone       = ! empty( $_POST['intervenant-phone'] ) ? sanitize_text_field( $_POST['intervenant-phone'] ) : '';
		$i_phone_code  = ! empty( $_POST['intervenant-phone-callingcode'] ) ? sanitize_text_field( $_POST['intervenant-phone-callingcode'] ) : '';
		$i_mail  = ! empty( $_POST['intervenant-email'] ) ? sanitize_text_field( $_POST['intervenant-email'] ) : '';

		if( ! $i_name || ! $i_lastname || ! $i_phone || ! $i_mail ){
			wp_send_json_error( 'Erreur in intervenant exterieur' );
		}

		$permis_feu = Permis_feu_Class::g()->get( array( 'id' => $id ), true );

		$data_i = array(
			'firstname' => $i_name,
			'lastname'  => $i_lastname,
			'phone'     => '(' . $i_phone_code . ')' . $i_phone,
			'phone_nbr' => $i_phone,
			'email'     => $i_mail
		);

		$permis_feu->data[ 'intervenant_exterieur' ] = wp_parse_args( $data_i, $permis_feu->data[ 'intervenant_exterieur' ] );
		return Permis_feu_Class::g()->update( $permis_feu->data );
	}

	public function display_list_intervenant( $id ){
		$permis_feu = Permis_Feu_Class::g()->get( array( 'id' => $id ), true );

		\eoxia\View_Util::exec( 'digirisk', 'permis_feu', 'start/step-3-table-users', array(
			'permis_feu' => $permis_feu
		) );
	}

	public function generate_document_odt_prevention( $permis_feu ){

		$legal_display = Legal_Display_Class::g()->get( array(
			'posts_per_page' => 1
		), true );

		if ( empty( $legal_display ) ) {
			$legal_display = Legal_Display_Class::g()->get( array(
				'schema' => true,
			), true );
		}

		$society = Society_Class::g()->get( array(
			'posts_per_page' => 1,
		), true );

		$data = array(
			'legal_display' => $legal_display,
			'society' => $society
		);

		$response = Sheet_Permis_Feu_Class::g()->prepare_document( $permis_feu, $data );
		$response = Sheet_Permis_Feu_Class::g()->create_document( $response['document']->data['id'] );
		return $response;
	}

	public function update_information_permis_feu( $permis_feu, $data = array() ){
		if( ! isset( $data[ 'title' ] ) || $data[ 'title' ] == '' ){
			$data[ 'title' ] = esc_html__( 'Aucun titre', 'digirisk' );
		}

		if( ! isset( $data[ 'date_start' ] ) || $data[ 'date_start' ] == '' ){
			$data[ 'date_start' ] = date( 'Y-m-d', strtotime( 'now' ) );
		}

		if( strtotime( $data[ 'date_start' ] ) > strtotime( $data[ 'date_end' ] ) ){
			$data[ 'date_end' ] = date( 'Y-m-d', strtotime( $data[ 'date_start' ] ) + 86400 );
		}

		if( ! isset( $data[ 'date_end__is_define' ] ) || $data[ 'date_end__is_define' ] == '' ){
			$data[ 'end_date_is_define' ] == 'undefined';
		}

		$permis_feu_data = wp_parse_args( $data, $permis_feu->data );

		return Permis_feu_Class::g()->update( $permis_feu_data );
	}

	public function import_data_prevention( $permis_feu ){
		$text_info = array(
			'intervenants' => '',
			'society'      => ''
		);
		if( $permis_feu->data[ 'prevention_id' ] != 0 ){
			$prevention = Prevention_Class::g()->get( array( 'id' => $permis_feu->data[ 'prevention_id' ] ), true );

			if( empty( $permis_feu->data[ 'intervenants' ] ) ){
				$permis_feu->data[ 'intervenants' ] = $prevention->data[ 'intervenants' ];
				$text_info[ 'intervenants' ] = esc_html__( sprintf( 'Récupération des intervenants définies dans le plan de prévention ( %1$d )', count( $permis_feu->data[ 'intervenants' ] ) ), 'dirigisk' );
			}

			$return = $this->check_if_society_can_be_update( $permis_feu->data[ 'society_outside' ], $prevention->data[ 'society_outside' ] );
			$permis_feu->data[ 'society_outside' ] = $return[ 'society' ];
			$text_info[ 'society' ] = $return[ 'txt' ];

			$permis_feu = Permis_feu_Class::g()->update( $permis_feu->data );
		}

		return array( 'permis_feu' => $permis_feu, 'text_info' => $text_info );
	}

	public function check_if_society_can_be_update( $pf_society, $pp_society ){

		$modif = false;
		$txt = '';

		if( $pf_society[ 'name' ] == "" && $pp_society[ 'name' ] != "" ){
			$modif = true;
			$pf_society[ 'name' ] = $pp_society[ 'name' ];
		}

		if( $pf_society[ 'siret' ] == "" && $pp_society[ 'siret' ] != "" ){
			$modif = true;
			$pf_society[ 'siret' ] = $pp_society[ 'siret' ];
		}

		if( $pf_society[ 'address' ] == "" && $pp_society[ 'address' ] != "" ){
			$modif = true;
			$pf_society[ 'address' ] = $pp_society[ 'address' ];
		}

		if( $pf_society[ 'postal' ] == "" && $pp_society[ 'postal' ] != "" ){
			$modif = true;
			$pf_society[ 'postal' ] = $pp_society[ 'postal' ];
		}

		if( $pf_society[ 'town' ] == "" && $pp_society[ 'town' ] != "" ){
			$modif = true;
			$pf_society[ 'town' ] = $pp_society[ 'town' ];
		}

		if( $modif ){
			$txt = esc_html__( 'Récupération des informations de société définies dans le plan de prévention', 'dirigisk' );
		}

		return array( 'society' => $pf_society, 'txt' => $txt );
	}

	public function import_intervenant_prevention( $permis_feu ){
		$text_info = array(
			'intervenant_exterieur' => ''
		);

		if( $permis_feu->data[ 'prevention_id' ] != 0 ){
			$prevention = Prevention_Class::g()->get( array( 'id' => $permis_feu->data[ 'prevention_id' ] ), true );

			$intervenant = $permis_feu->data[ 'intervenant_exterieur' ];
			if( $intervenant[ 'firstname' ] == "" || $intervenant[ 'lastname' ] == "" || $intervenant[ 'lastname' ] == "" || $intervenant[ 'phone_nbr' ] == "" || $intervenant[ 'email' ] == "" ){
				$text_info[ 'intervenant_exterieur' ] = esc_html__( 'Récupération des informations de l\'intervenant définie dans le plan de prévention', 'dirigisk' );

				if( $intervenant[ 'firstname' ] == "" ){
					$permis_feu->data[ 'intervenant_exterieur' ][ 'firstname' ] = $prevention->data[ 'intervenant_exterieur' ][ 'firstname' ];
				}

				if( $intervenant[ 'lastname' ] == "" ){
					$permis_feu->data[ 'intervenant_exterieur' ][ 'lastname' ] = $prevention->data[ 'intervenant_exterieur' ][ 'lastname' ];
				}

				if( $intervenant[ 'lastname' ] == "" ){
					$permis_feu->data[ 'intervenant_exterieur' ][ 'lastname' ] = $prevention->data[ 'intervenant_exterieur' ][ 'lastname' ];
				}

				if( $intervenant[ 'phone_nbr' ] == "" ){
					$permis_feu->data[ 'intervenant_exterieur' ][ 'phone_nbr' ] = $prevention->data[ 'intervenant_exterieur' ][ 'phone_nbr' ];
					$permis_feu->data[ 'intervenant_exterieur' ][ 'phone' ] = $prevention->data[ 'intervenant_exterieur' ][ 'phone' ];
				}

				if( $intervenant[ 'email' ] == "" ){
					$permis_feu->data[ 'intervenant_exterieur' ][ 'email' ] = $prevention->data[ 'intervenant_exterieur' ][ 'email' ];
				}
			}


			$permis_feu = Permis_feu_Class::g()->update( $permis_feu->data );
		}

		return array( 'permis_feu' => $permis_feu, 'text_info' => $text_info );
	}

	public function prepare_permis_feu_to_odt_prevention( $prevention ){

		$raison_du_plan_de_prevention = "";
		if( $prevention->data['more_than_400_hours'] ){
			$raison_du_plan_de_prevention = esc_html__( 'Plus de 400 heures' );
		}
		if( $prevention->data['imminent_danger'] ){
			if( $raison_du_plan_de_prevention != "" ){
				$raison_du_plan_de_prevention .= ", " . esc_html__( 'Danger grave et imminent' );
			}else{
				$raison_du_plan_de_prevention = esc_html__( 'Danger grave et imminent' );
			}
		}
		$raison_du_plan_de_prevention = $raison_du_plan_de_prevention != "" ? $raison_du_plan_de_prevention : 'Non-précisé';

		$args = array(
			'titre_plan_prevention' => $prevention->data[ 'title' ],
			'raison_plan_prevention' => $raison_du_plan_de_prevention,
			'date_start_intervention_pre' => date( 'd/m/Y', strtotime( $prevention->data[ 'date_start' ][ 'rendered' ][ 'mysql' ] ) ),
			'date_end_intervention_pre' => date( 'd/m/Y', strtotime( $prevention->data[ 'date_end' ][ 'rendered' ][ 'mysql' ] ) )
		);

		return $args;
	}

	public function prepare_permis_feu_to_odt_intervention( $permis_feu ){

		$data_interventions = array();
		$nbr = 0;

		if( ! empty( $permis_feu->data[ 'intervention' ] ) ){
			foreach( $permis_feu->data[ 'intervention' ] as $intervention ){
				$worktype = Worktype_Category_Class::g()->get( array( 'id' => $intervention->data[ 'worktype' ] ), true );
				$data_temp = array(
					'key_unique'    => $intervention->data[ 'key_unique' ],
					'unite_travail' => Prevention_Intervention_Class::g()->return_name_workunit( $intervention->data[ 'unite_travail' ] ),
					'action'        => $intervention->data[ 'action_realise' ],
					'type_de_travaux' => $worktype->data[ 'name' ],
					'materiel'    => $intervention->data[ 'materiel_utilise' ]
				);
				$data_interventions[] = $data_temp;
			}
			$nbr = count( $permis_feu->data[ 'intervention' ] );
		}else{
			$data_interventions[0] = array(
				'key_unique' => '',
				'unite_travail' => '',
				'action' => '',
				'type_de_travaux' => '',
				'materiel' => ''
			);
			// $interventions_info = esc_html__( 'Aucune intervention définie' );
		}
		$interventions_info = (string) $nbr;

		return array( 'data' => $data_interventions, 'text' => $interventions_info );
	}

	public function get_identifier_permis_feu( $with_prefix = false ){
		$unique_key = 0;
		$list_permis_feu = get_posts( array(
			'post_status'    => array( 'publish', 'inherit', 'any', 'trash' ),
			'posts_per_page' => -1,
			'post_type'      => $this->get_type(),
			'meta_key'   => '_wpdigi_permis_feu_is_end',
			'meta_value' => \eoxia\Config_Util::$init['digirisk']->permis_feu->status->PERMIS_FEU_IS_ENDED,
		) );
		$nbr_permis_feu = count( $list_permis_feu ) + 1;
		if( $with_prefix ){
			$prefix_permis_feu = Setting_Class::g()->get_prefix_permis_feu();
			$unique_key = $prefix_permis_feu . $nbr_permis_feu;
		}else{
			$unique_key = $nbr_permis_feu;
		}
		return $unique_key;
	}

	public function find_this_unique_identifier( $id, $with_prefix = false  ){ // A SUPPRIMER POUR LE 30/09
		$list_permis_feu = get_posts( array(
			'post_status'    => array( 'publish', 'inherit', 'any' ),
			'posts_per_page' => -1,
			'post_type'      => $this->get_type(),
			'meta_key'   => '_wpdigi_permis_feu_is_end',
			'meta_value' => \eoxia\Config_Util::$init['digirisk']->permis_feu->status->PERMIS_FEU_IS_ENDED,
		) );
		$i = 0;
		if( ! empty( $list_permis_feu ) ){
			foreach( $list_permis_feu as $permis_feu ){
				if( $permis_feu->ID == $id ){
					$nbr_permis_feu = count( $list_permis_feu ) - $i;
					if( $with_prefix ){
						$prefix_permis_feu = Setting_Class::g()->get_prefix_permis_feu();
						$unique_key = $prefix_permis_feu . $nbr_permis_feu;
					}else{
						$unique_key = $nbr_permis_feu;
					}
					return $unique_key;
				}else{
					$i ++;
				}
			}
		}

		$nbr_permis_feu = 0;
		if( $with_prefix ){
			$prefix_permis_feu = Setting_Class::g()->get_prefix_permis_feu();
			$unique_key = $prefix_permis_feu . $nbr_permis_feu;
		}else{
			$unique_key = $nbr_permis_feu;
		}
		return $unique_key;
	}  // A SUPPRIMER
}

Permis_Feu_Class::g();
