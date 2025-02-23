// Payload CMS based Block definitions
// from https://github.com/payloadcms/payload/blob/4224c680023707fff7d67cacd9dbd75b77f4128c/packages/richtext-lexical/src/features/blocks/server/nodes/BlocksNode.tsx#L18

import type {SerializedElementNode, Spread} from "lexical";

type BaseBlockFields<TBlockFields extends JsonObject = JsonObject> = {
  /** Block form data */
  blockName: string;
  blockType: string;
} & TBlockFields;

export type BlockFields<TBlockFields extends JsonObject = JsonObject> = {
  id: string;
} & BaseBlockFields<TBlockFields>;

export type SerializedBlockNode<TBlockFields extends JsonObject = JsonObject> = Spread<{
  children?: never;
  fields: BlockFields<TBlockFields>;
  type: 'block';
}, SerializedDecoratorBlockNode>;

// Payload CMS based Link definitions
// from https://github.com/payloadcms/payload/blob/4224c680023707fff7d67cacd9dbd75b77f4128c/packages/richtext-lexical/src/features/link/nodes/types.ts#L21

export type LinkFields = {
  [key: string]: JsonValue;
  doc?: {
    relationTo: string;
    value: {
      [key: string]: JsonValue;
      id: DefaultDocumentIDType;
    } | DefaultDocumentIDType;
  } | null;
  linkType: 'custom' | 'internal';
  newTab: boolean;
  url?: string;
};

export type SerializedLinkNode<T extends SerializedLexicalNode = SerializedLexicalNode> = Spread<{
  fields: LinkFields;
  id?: string;
  type: 'link';
}, SerializedElementNode<T>>;