<template>
  <div class="relative min-h-[100dvh] min-h-screen">
    <a
      href="#main-content"
      class="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-block focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#0f2942] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00cfc8] focus:ring-offset-2"
    >
      Skip to main content
    </a>
    <main
      id="main-content"
      class="min-h-[100dvh] min-h-screen bg-slate-page px-4 py-4 text-slate-ink md:px-5 md:py-6"
      tabindex="-1"
    >
      <div class="mx-auto w-full lg:w-2/3">
        <slot />
      </div>
    </main>
  </div>
</template>
