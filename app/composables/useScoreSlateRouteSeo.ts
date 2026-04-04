/**
 * When `NUXT_PUBLIC_SITE_URL` is set, emits canonical + og:url (+ optional og:image).
 * See `docs/infrastructure/seo.md`.
 */
export function useScoreSlateRouteSeo() {
  const route = useRoute();
  const config = useRuntimeConfig();

  const pageUrl = computed(() => {
    const base = String(config.public.siteUrl ?? "").replace(/\/$/, "");
    if (!base) {
      return "";
    }
    return `${base}${route.path}`;
  });

  const ogImage = computed(() => {
    const raw = String(config.public.ogImageUrl ?? "").trim();
    return raw || undefined;
  });

  useSeoMeta({
    ogUrl: () => pageUrl.value || undefined,
    ogImage: () => ogImage.value,
  });

  useHead(() =>
    pageUrl.value
      ? { link: [{ rel: "canonical", href: pageUrl.value }] }
      : {},
  );
}
