<?php
/*
Plugin Name: Custom Coupon Generator (Dice roller)
Description: A plugin to generate WooCommerce coupons via a custom REST API endpoint.
Version: 1.0
Author: Arman "DezonD" Dabiri
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Generate a unique coupon code
function generate_coupon($discount, $user_id) {
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
    update_post_meta($new_coupon_id, 'generated_by', $user_id); // Track user who generated the coupon

    return $coupon_code;
}

// Register custom REST API endpoint
function register_custom_api_endpoints() {
    register_rest_route('custom/v1', '/generate-coupon', array(
        'methods' => 'POST',
        'callback' => 'generate_coupon_endpoint',
        'permission_callback' =>  function () {
            return is_user_logged_in();
        },
    ));
}

// Handle the API request
function generate_coupon_endpoint(WP_REST_Request $request) {
    // Verify nonce
    $nonce = $request->get_header('X-WP-Nonce');
    if (!wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error('invalid_nonce', 'Invalid nonce', ['status' => 403]);
    }

    $user_id = get_current_user_id();
    $user = wp_get_current_user();

     // Validate user role
    if (!in_array('customer', $user->roles)) {
       return new WP_Error('forbidden', 'You do not have permission to generate a coupon', ['status' => 403]);
    }

    // Rate limiting
    $transient_key = 'coupon_limit_' . $user_id;
    $coupon_count = get_transient($transient_key);
    if ($coupon_count >= 3) {
        return new WP_Error('rate_limit', 'You have reached the maximum number of coupon requests for today', ['status' => 429]);
    }

    // Validate discount
    $discount = intval($request->get_param('discount'));
    if ($discount < 10 || $discount > 100) {
        return new WP_Error('invalid_discount', 'Discount must be between 10 and 100', ['status' => 400]);
    }

    // Generate coupon
    $coupon_code = generate_coupon($discount, $user_id);
    set_transient($transient_key, $coupon_count + 1, 24 * HOUR_IN_SECONDS);

    return rest_ensure_response(array('coupon_code' => $coupon_code));
}

// Enqueue JavaScript and localize settings
function enqueue_dice_roller_scripts() {
    wp_enqueue_script('dice-roller-script', plugins_url('dice-roller.js', __FILE__), [], '1.0', true);
    wp_localize_script('dice-roller-script', 'diceRollerApi', [
        'apiUrl' => esc_url_raw(rest_url('custom/v1/generate-coupon')),
        'nonce' => wp_create_nonce('wp_rest')
    ]);
}

// Hook everything into WordPress
add_action('rest_api_init', 'register_custom_api_endpoints');
add_action('wp_enqueue_scripts', 'enqueue_dice_roller_scripts');