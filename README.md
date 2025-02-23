# Vue / Nuxt / Nuxt UI / Payload CMS API integration

Simple example project to actually render stuff from [Payload CMS](https://payloadcms.com/), not just retrieve it.

## Goals

- Use Nuxt [useFetch](https://nuxt.com/docs/getting-started/data-fetching) to retrieve.
- Use [Nuxt MDC](https://nuxt.com/modules/mdc) and their [Prose*](https://github.com/nuxt-modules/mdc?tab=readme-ov-file#prose-components) components to render (in replacement for [Nuxt Content](https://content.nuxt.com/)).
- Use Payload CMS REST API to retrieve a [Rich Text](https://payloadcms.com/docs/fields/rich-text) field based on Lexical.
- Implement, map and render a [Nuxt UI Alert](https://ui3.nuxt.dev/components/alert) through
  a [Payload Block](https://payloadcms.com/docs/fields/blocks) mounted inside the [Rich Text](https://payloadcms.com/docs/fields/rich-text) field.

## Remarks

This repo is not a plugin, but a solution finding playground. If you have better approaches, ideas or suggestions,
please feel free to PR them, so others can benefit from them.

While the `app/composables/usePayload.ts` is offered, this project uses a REST API snapshot result from Payload found in `data/example.json`.
That result is a simple dump of a request of `/api/example/1?depth=1&locale=en`

The Payload block and editor setup for the AlertBlock can be found in `payload/` for reference what was used to create it within the CMS system.

The mapping towards the Nuxt UI Alert component can be found in `app/components/PayloadRichText.ts:156`.

Project layout is based on [Nuxt 4 future](https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4) compatibility,
so everything worthwhile will end up in `app/`.

## Further references

Most findings are adaptations of different sources:

- [How Payload solves this through JSX](https://github.com/payloadcms/public-demo/blob/master/src/app/_components/RichText/serialize/index.tsx)
- [How Nuxt MDC uses Prose* components that I want to use](https://github.com/nuxt-modules/mdc?tab=readme-ov-file#prose-components)
