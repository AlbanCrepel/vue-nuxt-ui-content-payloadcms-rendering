import {
  BoldFeature,
  FixedToolbarFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

export default lexicalEditor({
  admin: {
    hideGutter: false,
    hideInsertParagraphAtEnd: true,
  },
  features: () => [
    FixedToolbarFeature(),

    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),
    LinkFeature(),
  ],
})
