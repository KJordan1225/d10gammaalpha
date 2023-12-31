<?php

namespace Drupal\gin_toolbar_custom_menu\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\ConfigFormBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\system\Entity\Menu;
use Drupal\Core\Cache\Cache;

/**
 * Configure settings for this site.
 */
class GinToolbarCustomMenuSettings extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'gin_toolbar_custom_menu_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['gin_toolbar_custom_menu.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('gin_toolbar_custom_menu.settings');
    $roles = [];
    $menus = Menu::loadMultiple();

    foreach ($menus as &$menu) {
      $menu = $menu->label();
    }
    $result = user_roles(1);
    foreach ($result as $row => $value) {
      $roles[$row] = $row;
    }

    $form['gin_toolbar_custom_menu'] = [
      '#type' => 'details',
      '#title' => $this->t('Custom menu'),
      '#open' => TRUE,
    ];

    $form['gin_toolbar_custom_menu']['menu'] = [
      '#type' => 'select',
      '#title' => $this->t('Menu'),
      '#default_value' => $config->get('menu'),
      '#options' => ['' => '-- ' . $this->t('Select menu') . ' --'] + $menus,
    ];

    $form['gin_toolbar_custom_menu']['role'] = [
      '#type' => 'select',
      '#title' => $this->t('Roles'),
      '#default_value' => $config->get('role'),
      '#options' => $roles,
      '#multiple' => TRUE,
    ];

    if (!empty($config->get('menu'))) {
      $form['gin_toolbar_custom_menu']['icons'] = [
        '#type' => 'details',
        '#title' => $this->t('Icons'),
        '#open' => TRUE,
        '#tree' => TRUE,
      ];

      $svgfile = file_get_contents(DRUPAL_ROOT . '/' . \Drupal::service('extension.list.module')->getPath('gin_toolbar_custom_menu') . '/images/sprite.svg');
      if ($svgfile) {
        $svg = new \SimpleXMLElement($svgfile);
        $svg->registerXPathNamespace('svg', 'http://www.w3.org/2000/svg');
        $result = $svg->xpath('//svg:view');
        $icons = ['' => '-- ' . $this->t('Select menu') . ' --'];
        foreach ($result as $value) {
          $icons[$value->attributes()->id . ''] = $value->attributes()->id . '';
        }
        $menu_tree = \Drupal::service('toolbar.menu_tree');
        $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($config->get('menu'));
        $tree = $menu_tree->load($config->get('menu'), $parameters);
        $default_icons = $config->get('icons');
        foreach ($tree as $element) {
          $definition = $element->link->getPluginDefinition();
          $id = str_replace('.', '_', $definition['id']);
          $form['gin_toolbar_custom_menu']['icons'][$id] = [
            '#type' => 'select',
            '#options' => $icons,
            '#title' => $definition["title"],
            '#default_value' => !empty($default_icons[$id]) ? $default_icons[$id] : '',
          ];
        }
      }
    }

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('gin_toolbar_custom_menu.settings')
      ->set('menu', $form_state->getValue('menu'))
      ->set('role', $form_state->getValue('role'))
      ->set('icons', $form_state->getValue('icons'))
      ->save();

    Cache::invalidateTags(['gin_toolbar_custom_menu:settings']);
    parent::submitForm($form, $form_state);
  }

}
