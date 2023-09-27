<?php

declare(strict_types=1);

namespace Drupal\ckeditor_svg_icon\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\Core\Form\FormStateInterface;

/**
 * CKEditor 5 SvgIcon plugin.
 *
 * @internal
 *   Plugin classes are internal.
 */
class SvgIcon extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface {

  use CKEditor5PluginConfigurableTrait;

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'icon_sprite_path' => '',
    ];
  }

  /**
   * {@inheritdoc}
   *
   * Textfield for adding the path to the icon sprite.
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['icon_sprite_path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('SVG sprite path'),
      '#default_value' => $this->configuration['icon_sprite_path'],
      '#description' => $this->t('The relative path to the icon sprite. (ie. /themes/custom/THEME_NAME/dist/images/icons.svg)'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $sprite_path = $form_state->getValue('icon_sprite_path');
    assert(is_string($sprite_path));

    // Ensure that our SVG sprite actually exists, otherwise warn the user.
    if (!file_exists(DRUPAL_ROOT . $sprite_path)) {
      $form_state->setError($form['icon_sprite_path'], 'Oops! It looks like the path to that SVG sprite doesn\'t exists.');
    }
    $form_state->setValue('icon_sprite_path', $sprite_path);
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['icon_sprite_path'] = $form_state->getValue('icon_sprite_path');
  }

}
