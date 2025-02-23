import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
  type SerializedElementNode,
  type SerializedLexicalNode,
  type SerializedParagraphNode,
  type SerializedRootNode,
  type SerializedTextNode,
  type Spread,
} from "lexical";

import type {SerializedListItemNode, SerializedListNode} from "@lexical/list";

import type {SerializedHeadingNode, SerializedQuoteNode,} from "@lexical/rich-text";
import {
  LazyProseH6,
  ProseA,
  ProseBlockquote,
  ProseCode,
  ProseEm,
  ProseH1,
  ProseH2,
  ProseH3,
  ProseH4,
  ProseH5,
  ProseHr,
  ProseLi,
  ProseOl,
  ProseP,
  ProseStrong,
  ProseUl
} from "#components";

function parseChildren(node: SerializedLexicalNode): ReturnType<typeof h>[] | ReturnType<typeof h> | undefined {
  if (node.type === 'text') {
    const _n = node as SerializedTextNode;

    let _t: ReturnType<typeof h> = h('span', _n.text)

    if (_n.format & IS_BOLD) {
      const _ts = _t
      _t = h(ProseStrong, () => _ts)
    }

    if (_n.format & IS_ITALIC) {
      const _ts = _t

      _t = h(ProseEm, () => _ts)
    }

    if (_n.format & IS_UNDERLINE) {
      _t = h('span', {
        class: 'underline'
      }, [_t])
    }

    if (_n.format & IS_SUBSCRIPT) {
      _t = h('sub', _t)
    }

    if (_n.format & IS_SUPERSCRIPT) {
      _t = h('sup', _t)
    }

    if (_n.format & IS_STRIKETHROUGH) {
      _t = h('span', {
        class: 'line-through'
      }, _t)
    }

    // px-1.5 py-0.5 text-sm font-mono font-medium rounded-[calc(var(--ui-radius)*1.5)] inline-block border border-[var(--ui-border-muted)] text-[var(--ui-text-highlighted)] bg-[var(--ui-bg-muted)]
    if (_n.format & IS_CODE) {
      const _ts = _t

      _t = h(ProseCode, () => _ts)
    }

    return _t
  }

  if (node.type === 'heading') {
    const _n = node as SerializedHeadingNode

    switch (_n.tag) {
      case 'h2':
        return h(ProseH2, () => _n.children.map(parseChildren))
      case 'h3':
        return h(ProseH3, () => _n.children.map(parseChildren))
      case 'h4':
        return h(ProseH4, () => _n.children.map(parseChildren))
      case 'h5':
        return h(ProseH5, () => _n.children.map(parseChildren))
      case 'h6':
        return h(LazyProseH6, () => _n.children.map(parseChildren))
      default:
        return h(ProseH1, () => _n.children.map(parseChildren))
    }
  }

  if (node.type === 'paragraph') {
    const _n = node as SerializedParagraphNode

    return h(ProseP, () => _n.children.map(parseChildren))
  }

  if (node.type === 'quote') {
    const _n = node as SerializedQuoteNode

    return h(ProseBlockquote, () => _n.children.map(parseChildren))
  }

  if (node.type === 'list') {
    const _n = node as SerializedListNode;

    switch (_n.tag) {
      case 'ol':
        return h(ProseOl, () => _n.children.map(parseChildren))
      case 'ul':
        return h(ProseUl, () => _n.children.map(parseChildren))
    }
  }

  if (node.type === 'horizontalrule') {
    return h(ProseHr)
  }

  if (node.type === 'listitem') {
    const _n = node as SerializedListItemNode;
    return h(ProseLi, () => _n.children.map(parseChildren))
  }

  if (node.type === 'link') {
    const _n = node as Spread<{
      fields: {
        [key: string]: any;
        doc?: {
          relationTo: string;
          value: {
            [key: string]: any;
            id: string;
          } | string;
        } | null;
        linkType: 'custom' | 'internal';
        newTab: boolean;
        url?: string;
      };
      id?: string;
      type: 'link';
    }, SerializedElementNode>;

    switch (_n.fields.linkType) {
      case 'custom':
        return [h(ProseA, {
          href: _n.fields.url,
          target: _n.fields.newTab ? '_blank' : '_self',
        }, () => _n.children.map(parseChildren))]
      case 'internal':
        return [h(ProseA, {
          href: _n.fields.url,
        }, () => _n.children.map(parseChildren))]
    }
  }
}

function parseRoot(node: object) {
  if ("root" in node && typeof node.root === "object") {
    return (node.root as SerializedRootNode)?.children.map(parseChildren) ?? [];
  }

  return []
}

type Props = {
  content: {
    type: Object | undefined,
    required: true
  }
}

export default {
  props: {
    content: {
      type: Object,
      required: true
    }
  },

  setup(props: Props) {
    if (typeof props.content !== 'object') {
      return () => ''
    }

    return () => h('div', [
      ...parseRoot(props.content)
    ])
  }
}

