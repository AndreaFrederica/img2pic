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
    title: '工具箱',
    caption: '实用工具集合',
    icon: 'build',
    link: 'https://tools.sirrus.cc',
  },
  {
    title: '小说助手',
    caption: '让你的VSCode变成小说写作利器',
    icon: 'auto_stories',
    link: 'https://anh.sirrus.cc',
  },
  {
    title: '检查单助手',
    caption: '检查单管理工具',
    icon: 'checklist',
    link: 'https://guides.sirrus.cc',
  },
  {
    title: '博客',
    caption: '技术博客',
    icon: 'article',
    link: 'https://blog.sirrus.cc',
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
