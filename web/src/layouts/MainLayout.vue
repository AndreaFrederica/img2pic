<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Img2Pic - 像素艺术生成器 </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> 导航菜单 </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: '首页',
    caption: '项目介绍',
    icon: 'home',
    link: '/',
  },
  {
    title: '像素艺术生成',
    caption: '将图片转换为像素艺术',
    icon: 'brush',
    link: '/pixel-art',
  },
  {
    title: 'Github',
    caption: 'github.com/AndreaFrederica',
    icon: 'code',
    link: 'https://github.com/AndreaFrederica/img2pic',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
