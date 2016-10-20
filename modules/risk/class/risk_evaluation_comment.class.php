<?php namespace digi;

if ( !defined( 'ABSPATH' ) ) exit;

class risk_evaluation_comment_class extends comment_class {

	protected $model_name   = '\digi\risk_evaluation_comment_model';
	protected $meta_key     = '_wpdigi_risk_evaluation_comment';
	protected $comment_type	= 'digi-riskevalcomment';

	protected $base					= 'digirisk/risk-evaluation-comment';
	protected $version			= '0.1';

	protected function construct() {
		add_filter( 'json_endpoints', array( $this, 'callback_register_route' ) );
	}

}

risk_evaluation_comment_class::g();
