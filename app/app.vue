<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} · Score Slate` : "Score Slate",
});

useSeoMeta({
  ogSiteName: "Score Slate",
  ogType: "website",
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
