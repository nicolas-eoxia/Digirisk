<?php namespace digi;

if ( !defined( 'ABSPATH' ) ) exit; ?>

<?php if ( !empty( $danger_category_list ) ) : ?>
	<input class="input-hidden-danger" type="hidden" name="risk[<?php echo $id; ?>][danger_id]" value='<?php echo $first_danger->id; ?>' />
	<toggle class="wp-digi-summon-list" data-target="wp-digi-select-list">
		<span><?php echo wp_get_attachment_image( $first_danger->thumbnail_id, 'thumbnail', false, array( 'title' => $first_danger->name ) ); ?></span>
		<i class="dashicons dashicons-arrow-down"></i>
		<div class="wp-digi-select-list digi-popup grid icon hidden">
		<?php foreach( $danger_category_list as $danger_category ): ?>
			<ul>
				<?php if( !empty( $danger_category->danger ) ): ?>
					<?php foreach( $danger_category->danger as $danger ): ?>
						<li class="child" data-id="<?php echo $danger->id; ?>"><?php echo wp_get_attachment_image( $danger->thumbnail_id, 'thumbnail', false, array( 'title' => $danger->name ) ); ?></li>
					<?php endforeach; ?>
				<?php endif; ?>
			</ul>
		<?php endforeach; ?>
		</div>
	</toggle>
<?php else: ?>
	<?php _e( 'There are no danger category to display here. Please create some danger category before.', 'digirisk' ); ?>
<?php endif; ?>
