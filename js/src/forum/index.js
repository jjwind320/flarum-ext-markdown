/*!
 * Includes modified code from GitHub Markdown Toolbar Element
 * https://github.com/github/markdown-toolbar-element/
 *
 * Original Copyright GitHub, Inc.
 * Released under the MIT license
 * https://github.com/github/markdown-toolbar-element/blob/master/LICENSE
 */

import { extend } from 'flarum/extend';
import TextEditor from 'flarum/components/TextEditor';
import MarkdownArea from 'mdarea';

import './polyfills';
import MarkdownToolbar from './components/MarkdownToolbar';
import MarkdownButton from './components/MarkdownButton';

app.initializers.add('flarum-markdown', function(app) {

  let index = 1;

  extend(TextEditor.prototype, 'init', function() {
    this.textareaId = 'textarea'+(index++);
  });

  extend(TextEditor.prototype, 'view', function(vdom) {
    vdom.children[0].attrs.id = this.textareaId;
  });

  extend(TextEditor.prototype, 'configTextarea', function(value, element, isInitialized, context) {
    if (isInitialized) return;

    const editor = new MarkdownArea(element);
    editor.disableInline();
    editor.ignoreTab();

    context.onunload = function() {
      editor.destroy();
    };
  });

  extend(TextEditor.prototype, 'toolbarItems', function(items) {
    const tooltip = name => app.translator.trans(`flarum-markdown.forum.composer.${name}_tooltip`);

    items.add('markdown', (
      <MarkdownToolbar for={this.textareaId}>
        <MarkdownButton title={tooltip('header')} icon="fas fa-heading" style={{ prefix: '[h3]', suffix: '[/h3]' }} />
        <MarkdownButton title={tooltip('bold')} icon="fas fa-bold" style={{ prefix: '[b]', suffix: '[/b]', trimFirst: true }} hotkey="b" />
        <MarkdownButton title={tooltip('italic')} icon="fas fa-italic" style={{ prefix: '[i]', suffix: '[/i]', trimFirst: true }} hotkey="i" />
        <MarkdownButton title="居中" icon="fas fa-align-center" style={{ prefix: '[center]', suffix: '[/center]', trimFirst: true }} />
        <MarkdownButton title={tooltip('quote')} icon="fas fa-quote-left" style={{ prefix: '[quote]', suffix: '[/quote]', multiline: true, surroundWithNewlines: true }} />
        <MarkdownButton title={tooltip('link')} icon="fas fa-link" style={{ prefix: '[url=链接网址]', suffix: '[/url]', replaceNext: '链接网址', scanFor: 'https?://' }} />
        <MarkdownButton title="影像阅片" icon="fas fa-laptop-medical" style={{ prefix: '[pacs=阅片地址]', suffix: '', replaceNext: '阅片地址', scanFor: 'https?://viewer.weiyun.rimag.com.cn/' }} />
      </MarkdownToolbar>
    ), 100);
  });
});
