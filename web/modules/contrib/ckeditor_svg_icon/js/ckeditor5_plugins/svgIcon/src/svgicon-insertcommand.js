/**
 * @file defines InsertSvgIconCommand, which is executed when the svgIcon
 * toolbar button is pressed.
 */
import {Command} from 'ckeditor5/src/core';

export default class InsertSvgIconCommand extends Command {

  /**
   * @inheritdoc
   */
  execute(attributes) {
    const {model} = this.editor;

    model.change((writer) => {
      // Insert <svgIcon>*</svgIcon> at the current selection position
      // in a way that will result in creating a valid model structure.
      model.insertContent(createSvgIcon(writer, attributes));
    });
  }

  /**
   * @inheritdoc
   */
  refresh() {
    const {model} = this.editor;
    const {selection} = model.document;

    // Determine if the cursor (selection) is in a position where adding a
    // svgIcon is permitted. This is based on the schema of the model(s)
    // currently containing the cursor.
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      'svgIcon',
    );

    // If the cursor is not in a location where a svgIcon can be added, return
    // null so the addition doesn't happen.
    this.isEnabled = allowedIn !== null && allowedIn.name !== 'svgIconSvg';
  }
}

function createSvgIcon(writer, attributes) {
  // Create instances of the three elements registered with the editor in
  // svgicon-editing.js.
  const svgIcon = writer.createElement('svgIcon');
  const svgIconSvg = writer.createElement('svgIconSvg');
  const svgIconSvgUse = writer.createElement('svgIconSvgUse');

  // Get our data from user input to pass to our elements.
  const iconName = cleanClass(attributes.name);
  const iconSize = cleanClass(attributes.size);

  // Add <i> classes from the contexual menu.
  writer.setAttribute('class', [
    'icon',
    iconName ? 'icon-' + iconName : '',
    iconSize ? 'icon-' + iconSize : '',
  ], svgIcon);

  // Add <svg> classes from the contexual menu.
  writer.setAttribute('fill', 'currentColor', svgIconSvg);
  writer.setAttribute('role', 'img', svgIconSvg);
  writer.setAttribute('viewBox', '0 0 20 20', svgIconSvg);
  writer.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink', svgIconSvg);

  // Add <use> classes from the contexual menu.
  writer.setAttribute('xlink:href', '#' + iconName, svgIconSvgUse);

  // Append the <svg> and <use> elements to our <i> element.
  writer.append(svgIconSvg, svgIcon);
  writer.append(svgIconSvgUse, svgIconSvg);

  // Return the element to be added to the editor.
  return svgIcon;
}

function cleanClass(name) {
  return name.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '-');
}
