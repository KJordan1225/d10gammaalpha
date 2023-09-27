/* eslint-disable import/no-extraneous-dependencies */
/* cspell:words labeledfieldview buttonview */

import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler
} from 'ckeditor5/src/ui';
import {icons} from 'ckeditor5/src/core';
import '../../../../css/ckeditor_svg_icon.admin.css';

/**
 * A class rendering the information required from user input.
 *
 * @extends module:ui/view~View
 *
 * @internal
 */
export default class SvgIconView extends View {
  /**
   * @inheritdoc
   */
  constructor(locale) {
    super(locale);

    this.nameInputView = this._createInput('Name (ie. chevron.down)');
    this.sizeInputView = this._createInput('Size (ie. lg)');

    // Create the save and cancel buttons.
    this.saveButtonView = this._createButton(
      'Save', icons.check, 'ck-button-save'
    );
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton(
      'Cancel', icons.cancel, 'ck-button-cancel'
    );
    // Delegate ButtonView#execute to FormView#cancel.
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    this.childViews = this.createCollection([
      this.nameInputView,
      this.sizeInputView,
      this.saveButtonView,
      this.cancelButtonView
    ]);

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-svgicon-form'],
        tabindex: '-1'
      },
      children: this.childViews
    });
  }

  /**
   * @inheritdoc
   */
  render() {
    super.render();

    // Submit the form when the user clicked the save button
    // or pressed enter in the input.
    submitHandler({
      view: this
    });
  }

  /**
   * @inheritdoc
   */
  focus() {
    this.childViews.first.focus();
  }

  // Create a generic input field.
  _createInput(label) {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
    labeledInput.label = label;
    return labeledInput;
  }

  // Create a generic button.
  _createButton(label, icon, className) {
    const button = new ButtonView();

    button.set({
      label,
      icon,
      tooltip: true,
      class: className
    });

    return button;
  }
}
