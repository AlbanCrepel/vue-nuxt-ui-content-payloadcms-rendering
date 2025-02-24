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
import type {SerializedHeadingNode, SerializedQuoteNode} from "@lexical/rich-text";
import type {SerializedBlockNode, SerializedLinkNode} from "~/shared/types/payload";

import {
  Icon,
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

import type {VNode} from "vue";

import {flatUnwrap} from "@nuxtjs/mdc/runtime";

function parseChildren(node: SerializedLexicalNode | SerializedBlockNode): ReturnType<typeof h>[] | ReturnType<typeof h> | string | undefined {
  // Text nodes are the easiest ones, they can be stepped through.
  // If another component is used within the text node, like the Prose* components,
  // I scope a VNode copy into _scopedVNode so we do not recurse into the callables.
  if (node.type === 'text') {
    const _pNode = node as SerializedTextNode;

    let _vNode: ReturnType<typeof h> | string = _pNode.text

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

  if (node.type === 'linebreak') {
    return h('br')
  }

  if (node.type === 'horizontalrule') {
    return h(ProseHr)
  }

  if (node.type === 'heading') {
    const _pNode = node as SerializedHeadingNode

    switch (_pNode.tag) {
      case 'h1':
        return h(ProseH1, () => _pNode.children.map(parseChildren))
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
    }
  }

  if (node.type === 'paragraph') {
    return h(ProseP, () => (node as SerializedParagraphNode).children.map(parseChildren))
  }

  if (node.type === 'quote') {
    return h(ProseBlockquote, () => (node as SerializedQuoteNode).children.map(parseChildren))
  }

  if (node.type === 'list') {
    const _pNode = node as SerializedListNode;

    if (_pNode.tag === 'ol') {
      return h(ProseOl, () => _pNode.children.map(parseChildren))
    }

    if (_pNode.tag === 'ul') {
      const isChecklist = _pNode.children.some((child) => 'checked' in child)

      return h(ProseUl, {
        class: isChecklist ? 'pl-0 list-none' : undefined,
      }, () => _pNode.children.map(parseChildren))
    }
  }

  if (node.type === 'listitem') {
    const _pNode = node as SerializedListItemNode

    // Does the list item identify as a checklist item?
    if ('checked' in _pNode) {
      return h(ProseLi, {
        role: 'checkbox',
        'aria-checked': _pNode.checked
      }, () => [
        // Prepend a checkbox icon reflecting its state
        h(Icon, {
          name: _pNode.checked ? 'i-lucide-square-check-big' : 'i-lucide-square',
          class: 'mr-2',
        }),
        ..._pNode.children.map(parseChildren)
      ])
    }

    return h(ProseLi, () => (node as SerializedListItemNode).children.map(parseChildren))
  }

  if (node.type === 'link') {
    const _pNode = node as SerializedLinkNode

    switch (_pNode.fields.linkType) {
      case 'custom':
        return h(ProseA, {
          href: _pNode.fields.url,
          target: _pNode.fields.newTab ? '_blank' : '_self',
        }, () => _pNode.children.map(parseChildren))
      case 'internal':
        return h(ProseA, {
          href: _pNode.fields.url,
        }, () => _pNode.children.map(parseChildren))
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
          title: _pNode.fields?.title ? () => _pNode.fields?.title : undefined,
          // Unwrap everything down to the first element, we do not want a wrapping paragraph
          description: () => parseRoot(_pNode.fields.description, {unwrap: ['*']}),
        })
    }
  }

  // Fallback to return an empty string
  return ''
}

function parseRoot(node: object, opts: { unwrap?: string[] | false } = {unwrap: false}): VNode | VNode[] {
  if ("root" in node && typeof node.root === "object") {
    const result = (node.root as SerializedRootNode)?.children.map(parseChildren) ?? [];

    // There are some use-cases where we need to unwrap, like entering the "message" for the Alert component,
    // but it will get wrapped within a p-tag that we do not want to render.

    // Typing is a mess, but in the end, we can assume that, if we use "unwrap", it is because we "know" it is wrapped,
    // so it has to be a VNode.
    // The single case where it could be a string (by node type "text") should never occur on the root level
    // of Lexical-constructed content.
    return (opts.unwrap ? flatUnwrap(result as VNode[], opts.unwrap) : result) as VNode[];
  }

  return h('div')
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
