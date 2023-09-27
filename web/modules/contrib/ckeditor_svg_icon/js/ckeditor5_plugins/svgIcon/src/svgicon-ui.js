/**
 * @file registers the svgIcon toolbar button and binds functionality to it.
 */

import {Plugin} from 'ckeditor5/src/core';
import {ButtonView, ContextualBalloon, clickOutsideHandler} from 'ckeditor5/src/ui';
import FormView from './svgicon-view';
import icon from '../../../../icons/toolbar.svg';

export default class SvgIconUI extends Plugin {

  /**
   * @inheritdoc
   */
  static get requires() {
    return [ContextualBalloon];
  }

  /**
   * @inheritdoc
   */
  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.formView = this._createFormView();

    editor.ui.componentFactory.add('svgIcon', (locale) => {
      const command = editor.commands.get('insertSvgIcon');
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t('Icon'),
        icon,
        tooltip: true,
      });

      // Bind the state of the button to the command.
      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      // Show the balloon popup when the toolbar button is clicked.
      this.listenTo(buttonView, 'execute', () => {
        this._showUI();
      });

      return buttonView;
    });
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView(editor.locale);

    // On submit send the user data to the writer, then hide the form view.
    this.listenTo(formView, 'submit', () => {
      const name = formView.nameInputView.fieldView.element.value;
      const size = formView.sizeInputView.fieldView.element.value;

      editor.model.change(writer => {
        editor.execute('insertSvgIcon', {
          'name': name,
          'size': size
        });
      });

      this._hideUI();
    });

    // Hide the form view after clicking the "Cancel" button.
    this.listenTo(formView, 'cancel', () => {
      this._hideUI();
    });

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI()
    });

    return formView;
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM.
    target = () => view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );

    return {
      target
    };
  }

  _showUI() {
    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData()
    });

    this.formView.focus();
  }

  _hideUI() {
    this.formView.nameInputView.fieldView.value = '';
    this.formView.sizeInputView.fieldView.value = '';
    this.formView.element.reset();
    this._balloon.remove(this.formView);

    // Focus the editing view after closing the form view.
    this.editor.editing.view.focus();
  }
}
