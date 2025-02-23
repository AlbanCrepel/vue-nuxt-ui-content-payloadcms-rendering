export const usePayload: typeof useFetch = (request, opts) => {
  const runtimeConfig = useRuntimeConfig()
  return useFetch(request, {
    baseURL: runtimeConfig.public.payloadEndpoint,
    ...opts,
  })
}
