<template>
  <q-page class="q-pa-md">
    <!-- Hero Section -->
    <div class="row items-center q-py-xl">
      <div class="col-12 col-md-6 text-center">
        <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
          Img2Pic
        </h1>
        <h2 class="text-h4 text-weight-regular q-mb-lg">
          {{ $t('home.subtitle') }}
        </h2>
        <div class="row items-center justify-center q-mb-xl">
          <p class="text-body1 text-grey-7" style="margin: 0;">
            {{ $t('home.description') }}
          </p>
          <q-icon
            name="help"
            size="sm"
            color="primary"
            class="q-ml-md cursor-pointer"
          >
            <q-tooltip class="bg-primary text-white">
              {{ $t('home.description') }}
            </q-tooltip>
          </q-icon>
        </div>
        <q-btn
          color="primary"
          size="lg"
          :label="$t('home.startConversion')"
          icon="brush"
          @click="$router.push('/pixel-art')"
          class="q-mr-md"
        />
        <q-btn
          outline
          color="primary"
          size="lg"
          :label="$t('home.learnMore')"
          icon="info"
          @click="showFeatures = !showFeatures"
        />
      </div>
      <div class="col-12 col-md-6 text-center">
        <q-icon name="image" size="200px" color="primary" />
      </div>
    </div>

    <!-- Features Section -->
    <div v-if="showFeatures" class="row q-py-xl q-my-xl">
      <div class="col-12 text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">{{ $t('home.features.title') }}</h2>
      </div>

      <div class="row q-gutter-md justify-center">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="auto_awesome" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">{{ $t('home.features.energyAlgorithm.title') }}</div>
              <p class="text-body2 text-grey-7">
                {{ $t('home.features.energyAlgorithm.description') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="edge_detection" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">{{ $t('home.features.edgeDetection.title') }}</div>
              <p class="text-body2 text-grey-7">
                {{ $t('home.features.edgeDetection.description') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="grid_on" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">{{ $t('home.features.gridSampling.title') }}</div>
              <p class="text-body2 text-grey-7">
                {{ $t('home.features.gridSampling.description') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="palette" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">{{ $t('home.features.colorQuantization.title') }}</div>
              <p class="text-body2 text-grey-7">
                {{ $t('home.features.colorQuantization.description') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="tune" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">{{ $t('home.features.parameterAdjustment.title') }}</div>
              <p class="text-body2 text-grey-7">
                {{ $t('home.features.parameterAdjustment.description') }}
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="download" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">{{ $t('home.features.oneClickExport.title') }}</div>
              <p class="text-body2 text-grey-7">
                {{ $t('home.features.oneClickExport.description') }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Quick Start Section -->
    <div class="row q-py-xl q-my-xl bg-grey-1">
      <div class="col-12 text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">{{ $t('home.quickStart.title') }}</h2>
      </div>

      <div class="row items-center justify-center">
        <div class="col-12 col-md-8">
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step
              :name="1"
              :title="$t('home.quickStart.steps.selectImage.title')"
              icon="image"
              :done="step > 1"
            >
              {{ $t('home.quickStart.steps.selectImage.description') }}
            </q-step>

            <q-step
              :name="2"
              :title="$t('home.quickStart.steps.selectAlgorithm.title')"
              icon="settings"
              :done="step > 2"
            >
              {{ $t('home.quickStart.steps.selectAlgorithm.description') }}
            </q-step>

            <q-step
              :name="3"
              :title="$t('home.quickStart.steps.processImage.title')"
              icon="play_arrow"
              :done="step > 3"
            >
              {{ $t('home.quickStart.steps.processImage.description') }}
            </q-step>

            <q-step
              :name="4"
              :title="$t('home.quickStart.steps.downloadResult.title')"
              icon="download"
            >
              {{ $t('home.quickStart.steps.downloadResult.description') }}
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useI18n } from 'vue-i18n';

// const { t } = useI18n();
const showFeatures = ref(false);
const step = ref(1);
</script>
