<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Img2Pic - {{ t('app.title') }} </q-toolbar-title>

        <q-select
          v-model="locale"
          :options="languageOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
          outlined
          style="min-width: 140px; margin-right: 16px"
          class="language-select"
        >
          <template v-slot:prepend>
            <q-icon name="translate" size="sm" />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label class="text-dark">{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:selected-item="scope">
            <span class="text-white">{{ scope.opt.label }}</span>
          </template>
        </q-select>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> {{ t('nav.menu') }} </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { storageService } from 'src/utils/storage';

const { locale, t } = useI18n();

// Load saved language on component mount
const savedLanguage = storageService.loadLanguage();
if (savedLanguage) {
  locale.value = savedLanguage;
}

// Watch for language changes and save to localStorage
watch(locale, (newLocale) => {
  storageService.saveLanguage(newLocale);
});

// 语言选项
const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ru', label: 'Русский' },
];

const linksList = computed<EssentialLinkProps[]>(() => [
  {
    title: t('nav.home'),
    caption: t('nav.homeCaption'),
    icon: 'home',
    link: '/',
  },
  {
    title: t('nav.pixelArt'),
    caption: t('nav.pixelArtCaption'),
    icon: 'brush',
    link: '/pixel-art',
  },
  {
    title: t('nav.toolbox'),
    caption: t('nav.toolboxCaption'),
    icon: 'build',
    link: 'https://tools.sirrus.cc',
  },
  {
    title: t('nav.novelAssistant'),
    caption: t('nav.novelAssistantCaption'),
    icon: 'auto_stories',
    link: 'https://anh.sirrus.cc',
  },
  {
    title: t('nav.checklist'),
    caption: t('nav.checklistCaption'),
    icon: 'checklist',
    link: 'https://guides.sirrus.cc',
  },
  {
    title: t('nav.blog'),
    caption: t('nav.blogCaption'),
    icon: 'article',
    link: 'https://blog.sirrus.cc',
  },
  {
    title: t('nav.github'),
    caption: 'github.com/AndreaFrederica',
    icon: 'code',
    link: 'https://github.com/AndreaFrederica/img2pic',
  },
]);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.language-select :deep(.q-field__control),
.language-select :deep(.q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.language-select :deep(.q-field__native) {
  color: white;
}

.language-select :deep(.q-field__append),
.language-select :deep(.q-field__prepend) {
  color: white;
}

.language-select :deep(.q-field__focusable) {
  color: white;
}

/* 下拉菜单样式 */
.language-select :deep(.q-menu .q-item) {
  color: #333;
}

.language-select :deep(.q-menu .q-item:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

.language-select :deep(.q-menu) {
  background-color: var(--q-color-primary);
}
</style>
