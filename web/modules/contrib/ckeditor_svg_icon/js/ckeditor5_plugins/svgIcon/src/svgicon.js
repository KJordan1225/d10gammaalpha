/* eslint-disable import/no-extraneous-dependencies */
// cspell:ignore svgicon

import { Plugin } from 'ckeditor5/src/core';
import SvgIconEditing from './svgicon-editing';
import SvgIconUI from './svgicon-ui';

/**
 * Drupal-specific plugin to build a custom icon based on an SVG sprite.
 *
 * @private
 */
class SvgIcon extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [SvgIconEditing, SvgIconUI];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'SvgIcon';
  }
}

export default SvgIcon;
