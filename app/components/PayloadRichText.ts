import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
  type SerializedLexicalNode,
  type SerializedParagraphNode,
  type SerializedRootNode,
  type SerializedTextNode,
} from "lexical";

import type {SerializedListItemNode, SerializedListNode} from "@lexical/list";
import type {SerializedBlockNode, SerializedLinkNode} from "~/shared/types/payload";
import type {SerializedHeadingNode, SerializedQuoteNode} from "@lexical/rich-text";

import {
  ProseA,
  ProseBlockquote,
  ProseCode,
  ProseEm,
  ProseH1,
  ProseH2,
  ProseH3,
  ProseH4,
  ProseH5,
  ProseH6,
  ProseHr,
  ProseLi,
  ProseOl,
  ProseP,
  ProseStrong,
  ProseUl,
  UAlert
} from "#components";

function parseChildren(node: SerializedLexicalNode): ReturnType<typeof h>[] | ReturnType<typeof h> | undefined {
  // Text nodes are the easiest ones, they can be stepped through.
  // If another component is used within the text node, like the Prose* components
  // I scope a VNode copy into _scopedVNode so we do not recurse into the callables.
  if (node.type === 'text') {
    const _pNode = node as SerializedTextNode;

    let _vNode: ReturnType<typeof h> = h('span', _pNode.text)

    if (_pNode.format & IS_BOLD) {
      const _scopedVNode = _vNode
      _vNode = h(ProseStrong, () => _scopedVNode)
    }

    if (_pNode.format & IS_ITALIC) {
      const _scopedVNode = _vNode

      _vNode = h(ProseEm, () => _scopedVNode)
    }

    if (_pNode.format & IS_UNDERLINE) {
      _vNode = h('span', {class: 'underline'}, [_vNode])
    }

    if (_pNode.format & IS_SUBSCRIPT) {
      _vNode = h('sub', _vNode)
    }

    if (_pNode.format & IS_SUPERSCRIPT) {
      _vNode = h('sup', _vNode)
    }

    if (_pNode.format & IS_STRIKETHROUGH) {
      _vNode = h('span', {class: 'line-through'}, _vNode)
    }

    if (_pNode.format & IS_CODE) {
      const _scopedVNode = _vNode

      _vNode = h(ProseCode, () => _scopedVNode)
    }

    return _vNode
  }

  if (node.type === 'heading') {
    const _pNode = node as SerializedHeadingNode

    switch (_pNode.tag) {
      case 'h2':
        return h(ProseH2, () => _pNode.children.map(parseChildren))
      case 'h3':
        return h(ProseH3, () => _pNode.children.map(parseChildren))
      case 'h4':
        return h(ProseH4, () => _pNode.children.map(parseChildren))
      case 'h5':
        return h(ProseH5, () => _pNode.children.map(parseChildren))
      case 'h6':
        return h(ProseH6, () => _pNode.children.map(parseChildren))
      default:
        return h(ProseH1, () => _pNode.children.map(parseChildren))
    }
  }

  if (node.type === 'paragraph') {
    const _pNode = node as SerializedParagraphNode

    return h(ProseP, () => _pNode.children.map(parseChildren))
  }

  if (node.type === 'quote') {
    const _pNode = node as SerializedQuoteNode

    return h(ProseBlockquote, () => _pNode.children.map(parseChildren))
  }

  if (node.type === 'list') {
    const _pNode = node as SerializedListNode;

    switch (_pNode.tag) {
      case 'ol':
        return h(ProseOl, () => _pNode.children.map(parseChildren))
      case 'ul':
        return h(ProseUl, () => _pNode.children.map(parseChildren))
    }
  }

  if (node.type === 'horizontalrule') {
    return h(ProseHr)
  }

  if (node.type === 'listitem') {
    const _pNode = node as SerializedListItemNode;
    return h(ProseLi, () => _pNode.children.map(parseChildren))
  }

  if (node.type === 'link') {
    const _pNode = node as SerializedLinkNode

    switch (_pNode.fields.linkType) {
      case 'custom':
        return [h(ProseA, {
          href: _pNode.fields.url,
          target: _pNode.fields.newTab ? '_blank' : '_self',
        }, () => _pNode.children.map(parseChildren))]
      case 'internal':
        return [h(ProseA, {
          href: _pNode.fields.url,
        }, () => _pNode.children.map(parseChildren))]
    }
  }

  if (node.type === 'block') {
    const _pNode = node as SerializedBlockNode

    switch (_pNode.fields.blockType) {
      case 'Alert':
        return h(UAlert, {
          variant: _pNode.fields.variant,
          color: _pNode.fields.color,
        }, {
          title: () => _pNode.fields?.title,
          description: () => parseRoot(_pNode.fields.description)
        })
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

    return () => h('div', parseRoot(props.content))
  }
}
