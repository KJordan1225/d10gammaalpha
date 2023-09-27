/* eslint-disable import/no-extraneous-dependencies */
import { Plugin } from 'ckeditor5/src/core';
import { Widget } from 'ckeditor5/src/widget';
import InsertSvgIconCommand from './svgicon-insertcommand';

// cSpell:ignore SvgIconInsertCommand
/**
 * Builds the <i class="icon"><svg><use> component using an SVG sprite.
 *
 * @private
 */
class SvgIconEditing extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [Widget];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'SvgIconEditing';
  }

  /**
   * @inheritdoc
   */
  init() {
    const editor = this.editor;
    const schema = editor.model.schema;

    editor.commands.add(
      'insertSvgIcon',
      new InsertSvgIconCommand(editor),
    );

    // Allow attributes to get converted (upcasted/downcasted)
    editor.conversion.attributeToAttribute({ model: 'class', view: 'class' } );
    editor.conversion.attributeToAttribute({ model: 'fill', view: 'fill' } );
    editor.conversion.attributeToAttribute({ model: 'role', view: 'role' } );
    editor.conversion.attributeToAttribute({ model: 'viewBox', view: 'viewBox' } );
    editor.conversion.attributeToAttribute({ model: 'xmlns:xlink', view: 'xmlns:xlink' } );
    editor.conversion.attributeToAttribute({ model: 'xlink:href', view: 'xlink:href' } );

    //
    // SvgIcon (target elements: <i class="icon">)
    //
    schema.register('svgIcon', {
      isObject: true,
      isInline: true,
      allowChildren: '$text',
      inheritAllFrom: '$text',
      allowAttributes: [ 'class' ],
    });

    editor.conversion.for('upcast').elementToElement({
      model: 'svgIcon',
      view: {
        name: 'i',
        classes: 'icon',
      },
      converterPriority: 'highest',
    });

    editor.conversion.for('downcast').elementToElement({
      model: 'svgIcon',
      view: 'i',
      converterPriority: 'highest',
    });

    //
    // SvgIcon > SVG (<svg>)
    //
    const svgIconSvg = {
      model: 'svgIconSvg',
      view: 'svg',
    };
    schema.register('svgIconSvg', {
      allowIn: 'svgIcon',
      allowChildren: '$text',
      allowAttributes: [ 'fill', 'role', 'viewBox', 'xmlns:xlink' ],
    });
    editor.conversion.for('upcast').elementToElement(svgIconSvg);
    editor.conversion.for('downcast').elementToElement(svgIconSvg);

    //
    // SvgIcon > SVG > Use (<use>)
    //
    const svgIconSvgUse = {
      model: 'svgIconSvgUse',
      view: 'use',
    };
    schema.register('svgIconSvgUse', {
      allowIn: 'svgIconSvg',
      allowAttributes: [ 'xlink:href' ],
    });
    editor.conversion.for('upcast').elementToElement(svgIconSvgUse);
    editor.conversion.for('downcast').elementToElement(svgIconSvgUse);

    //
    // <i> starting attribute becomes the wrapper.
    //
    editor.conversion.for('downcast').attributeToElement({
      model: 'htmlI',
      view: 'span',
      converterPriority: 'highest',
    });

    // Disallow svgIcon inside itself.
    schema.addChildCheck((context, childDefinition) => {
      if (
        context.endsWith('svgIconSvgUse') &&
        (childDefinition.name === 'svgIcon')
      ) {
        return false;
      }
    });
  }
}

export default SvgIconEditing;
