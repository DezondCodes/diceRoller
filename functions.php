function generate_coupon($discount) {
    $coupon_code = 'DISCOUNT-' . strtoupper(wp_generate_password(8, false));
    $discount_type = 'percent'; // Type: fixed_cart, percent, fixed_product, percent_product

    $coupon = array(
        'post_title' => $coupon_code,
        'post_content' => '',
        'post_status' => 'publish',
        'post_author' => 1,
        'post_type' => 'shop_coupon'
    );

    $new_coupon_id = wp_insert_post($coupon);

    // Add meta
    update_post_meta($new_coupon_id, 'discount_type', $discount_type);
    update_post_meta($new_coupon_id, 'coupon_amount', $discount);
    update_post_meta($new_coupon_id, 'individual_use', 'no');
    update_post_meta($new_coupon_id, 'product_ids', '');
    update_post_meta($new_coupon_id, 'exclude_product_ids', '');
    update_post_meta($new_coupon_id, 'usage_limit', '1');
    update_post_meta($new_coupon_id, 'expiry_date', date('Y-m-d', strtotime('+1 week')));
    update_post_meta($new_coupon_id, 'apply_before_tax', 'yes');
    update_post_meta($new_coupon_id, 'free_shipping', 'no');

    return $coupon_code;
}

function register_custom_api_endpoints() {
    register_rest_route('custom/v1', '/generate-coupon', array(
        'methods' => 'GET',
        'callback' => 'generate_coupon_endpoint',
    ));
}

function generate_coupon_endpoint(WP_REST_Request $request) {
    $discount = $request->get_param('discount');
    if (!$discount) {
        return new WP_Error('no_discount', 'Discount parameter is required', array('status' => 400));
    }
    $coupon_code = generate_coupon($discount);
    return rest_ensure_response(array('coupon_code' => $coupon_code));
}

add_action('rest_api_init', 'register_custom_api_endpoints');
