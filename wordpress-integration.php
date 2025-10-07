<?php
/**
 * Alec ChatBot Widget - WordPress Integration
 * 
 * Add this code to your WordPress theme's functions.php file
 * or create a custom plugin with this code.
 */

// Add widget script to footer
function alec_chatbot_widget_script() {
    ?>
    <!-- Alec ChatBot Widget -->
    <link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
    <script src="https://chat.alecasgari.com/widget.iife.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (window.AlecChatBot) {
                const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
                    webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
                    theme: {
                        primaryColor: '<?php echo get_theme_mod('chatbot_primary_color', '#059669'); ?>',
                        position: '<?php echo get_theme_mod('chatbot_position', 'bottom-right'); ?>',
                        title: '<?php echo get_theme_mod('chatbot_title', 'AI Assistant'); ?>',
                        placeholder: '<?php echo get_theme_mod('chatbot_placeholder', 'Type your message...'); ?>'
                    },
                    features: {
                        resizable: <?php echo get_theme_mod('chatbot_resizable', 'true'); ?>,
                        typingAnimation: <?php echo get_theme_mod('chatbot_typing_animation', 'true'); ?>,
                        connectionStatus: <?php echo get_theme_mod('chatbot_connection_status', 'true'); ?>,
                        autoOpen: <?php echo get_theme_mod('chatbot_auto_open', 'false'); ?>
                    },
                    callbacks: {
                        onMessage: function(message) {
                            // Google Analytics integration
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'chat_message', {
                                    'event_category': 'engagement',
                                    'event_label': 'widget'
                                });
                            }
                        },
                        onOpen: function() {
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'chat_open', {
                                    'event_category': 'engagement',
                                    'event_label': 'widget'
                                });
                            }
                        }
                    }
                });
                chatbot.init();
            }
        });
    </script>
    <?php
}
add_action('wp_footer', 'alec_chatbot_widget_script');

// Add customizer options (optional)
function alec_chatbot_customizer($wp_customize) {
    // Add section
    $wp_customize->add_section('alec_chatbot', array(
        'title' => 'Alec ChatBot Widget',
        'priority' => 30,
    ));

    // Primary color setting
    $wp_customize->add_setting('chatbot_primary_color', array(
        'default' => '#059669',
        'sanitize_callback' => 'sanitize_hex_color',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'chatbot_primary_color', array(
        'label' => 'Primary Color',
        'section' => 'alec_chatbot',
    )));

    // Position setting
    $wp_customize->add_setting('chatbot_position', array(
        'default' => 'bottom-right',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('chatbot_position', array(
        'label' => 'Position',
        'section' => 'alec_chatbot',
        'type' => 'select',
        'choices' => array(
            'bottom-right' => 'Bottom Right',
            'bottom-left' => 'Bottom Left',
            'top-right' => 'Top Right',
            'top-left' => 'Top Left',
        ),
    ));

    // Title setting
    $wp_customize->add_setting('chatbot_title', array(
        'default' => 'AI Assistant',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('chatbot_title', array(
        'label' => 'Widget Title',
        'section' => 'alec_chatbot',
        'type' => 'text',
    ));
}
add_action('customize_register', 'alec_chatbot_customizer');
?>
