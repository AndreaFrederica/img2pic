<template>
  <div class="inline-image-viewer">
    <!-- 背景组件 -->
    <div class="viewer-background" @wheel="onWheel" @dblclick="resetView">
      <div
        class="viewer-canvas"
        ref="canvasRef"
        @mousedown="onPointerDown"
        @touchstart.passive="onTouchStart"
        @touchmove.prevent.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <div v-if="imageSrc" class="viewer-transform" :style="transformStyle">
          <!-- 基于 Quasar 的图片组件 -->
          <q-img
            :src="imageSrc"
            :alt="imageName || 'image'"
            class="viewer-img"
            fit="contain"
            :draggable="false"
          />
        </div>

        <!-- 双指缩放中心点指示器 -->
        <div
          v-if="settingsStore.shouldShowPinchCenter && isPinching && canvasRef"
          class="pinch-center-indicator"
          :style="pinchCenterStyle"
        ></div>
      </div>
    </div>

    <!-- 悬浮的工具栏 -->
    <div class="viewer-toolbar">
      <q-btn flat round dense icon="zoom_in" @click="zoomIn">
        <q-tooltip>放大</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="zoom_out" @click="zoomOut">
        <q-tooltip>缩小</q-tooltip>
      </q-btn>

      <q-separator vertical spaced />

      <q-btn flat round dense icon="rotate_90_degrees_ccw" @click="rotateLeft">
        <q-tooltip>向左旋转 90°</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="rotate_90_degrees_cw" @click="rotateRight">
        <q-tooltip>向右旋转 90°</q-tooltip>
      </q-btn>

      <q-separator vertical spaced />

      <q-btn flat round dense icon="flip" @click="flipHorizontal">
        <q-tooltip>水平翻转</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="flip_camera_android" @click="flipVertical">
        <q-tooltip>垂直翻转</q-tooltip>
      </q-btn>

      <q-space />

      <div class="scale-indicator">{{ Math.round(scale * 100) }}%</div>

      <q-btn flat dense class="q-ml-xs" icon="restore" @click="resetView">
        <q-tooltip>重置视图（双击画布也可）</q-tooltip>
      </q-btn>
    </div>

    <div class="viewer-footer">
      <div class="file-name" :title="imageName">{{ imageName }}</div>
      <div class="viewer-hint">鼠标滚轮缩放 · 触摸板捏合/平移 · 拖拽查看 · 双击重置</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSettingsStore } from '../stores/settings';
import type { ImageViewState } from '../types/editorState';

const props = defineProps<{
  src: string;
  name?: string;
  state?: ImageViewState | undefined;
}>();

const emit = defineEmits<{
  'update:state': [ImageViewState];
}>();

const settingsStore = useSettingsStore();

const canvasRef = ref<HTMLElement | null>(null);

const BASE_SCALE = 0.9;
const scale = ref(1);
const rotation = ref(0); // deg
const offsetX = ref(0);
const offsetY = ref(0);
const flipX = ref(false);
const flipY = ref(false);

const MIN_SCALE = 0.05;
const MAX_SCALE = 8;
const ZOOM_STEP = 0.15;

// 拖拽状态（鼠标/单指触摸）
const isPanning = ref(false);
const panLastX = ref(0);
const panLastY = ref(0);

// 双指缩放状态
const isPinching = ref(false);
const initialPinchDistance = ref(0);
const initialPinchScale = ref(1);
const pinchCenterX = ref(0);
const pinchCenterY = ref(0);

// 双指旋转状态
const initialPinchAngle = ref(0);
const initialPinchRotation = ref(0);

// 双指平移状态
const pinchOffsetX = ref(0);
const pinchOffsetY = ref(0);

const imageSrc = computed(() => props.src);
const imageName = computed(() => props.name);

const transformStyle = computed(() => {
  const sx = scale.value * (flipX.value ? -1 : 1);
  const sy = scale.value * (flipY.value ? -1 : 1);

  return {
    transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0) rotate(${rotation.value}deg) scale(${sx * BASE_SCALE}, ${sy * BASE_SCALE})`,
  };
});

// 双指缩放中心点样式（用于调试）
const pinchCenterStyle = computed(() => {
  if (!canvasRef.value) return {};

  const rect = canvasRef.value.getBoundingClientRect();
  const centerX = rect.width / 2 + pinchCenterX.value;
  const centerY = rect.height / 2 + pinchCenterY.value;

  return {
    left: `${centerX}px`,
    top: `${centerY}px`,
  };
});

function clampScale(next: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
}

function applyState(state?: ImageViewState) {
  if (!state) return;
  scale.value = state.scale ?? 1;
  rotation.value = state.rotation ?? 0;
  offsetX.value = state.offsetX ?? 0;
  offsetY.value = state.offsetY ?? 0;
  flipX.value = state.flipX ?? false;
  flipY.value = state.flipY ?? false;
}

function emitState() {
  emit('update:state', {
    scale: scale.value,
    rotation: rotation.value,
    offsetX: offsetX.value,
    offsetY: offsetY.value,
    flipX: flipX.value,
    flipY: flipY.value,
  });
}

function zoomIn() {
  scale.value = clampScale(scale.value * (1 + ZOOM_STEP));
  emitState();
}

function zoomOut() {
  scale.value = clampScale(scale.value * (1 - ZOOM_STEP));
  emitState();
}

function rotateLeft() {
  rotation.value -= 90;
  emitState();
}

function rotateRight() {
  rotation.value += 90;
  emitState();
}

function flipHorizontal() {
  flipX.value = !flipX.value;
  emitState();
}

function flipVertical() {
  flipY.value = !flipY.value;
  emitState();
}

function resetView() {
  scale.value = 1;
  rotation.value = 0;
  offsetX.value = 0;
  offsetY.value = 0;
  flipX.value = false;
  flipY.value = false;
  emitState();
}

// 滚轮事件处理（区分触摸板捏合、触摸板平移和鼠标滚轮）
function onWheel(e: WheelEvent) {
  if (!props.src) return;
  e.preventDefault();
  e.stopPropagation();

  // 1. 判定是否为触摸板捏合手势（Ctrl+滚轮）
  if (e.ctrlKey) {
    // console.log('🤏 触摸板捏合缩放', {
    //   ctrlKey: e.ctrlKey,
    //   deltaX: e.deltaX,
    //   deltaY: e.deltaY,
    //   deltaMode: e.deltaMode,
    //   deltaModeText: e.deltaMode === 0 ? 'PIXEL' : e.deltaMode === 1 ? 'LINE' : 'PAGE',
    // });

    // 触摸板捏合缩放 - 以鼠标为中心缩放
    const delta = e.deltaY;
    // 触摸板捏合的 delta 通常较小，进一步降低敏感度
    const factor = delta > 0 ? 1 - ZOOM_STEP * 0.2 : 1 + ZOOM_STEP * 0.2;
    const newScale = clampScale(scale.value * factor);

    // 获取画布边界信息
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();

    // 计算鼠标在画布中的相对位置
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // 计算世界坐标
    const worldX = (mouseX - offsetX.value) / scale.value;
    const worldY = (mouseY - offsetY.value) / scale.value;

    // 应用新缩放
    scale.value = newScale;

    // 重新计算偏移量，使缩放中心保持在鼠标位置
    offsetX.value = mouseX - worldX * scale.value;
    offsetY.value = mouseY - worldY * scale.value;
    emitState();
    return;
  }

  // 2. 判定是否为普通物理鼠标滚轮
  // 使用 deltaMode 和 delta 绝对值来区分
  const isMouseWheel = e.deltaMode === 1 || Math.abs(e.deltaY) >= 50;

  if (isMouseWheel) {
    // console.log('🖱️ 普通鼠标滚轮缩放', {
    //   ctrlKey: e.ctrlKey,
    //   deltaX: e.deltaX,
    //   deltaY: e.deltaY,
    //   deltaMode: e.deltaMode,
    //   deltaModeText: e.deltaMode === 0 ? 'PIXEL' : e.deltaMode === 1 ? 'LINE' : 'PAGE',
    //   absDeltaY: Math.abs(e.deltaY),
    //   reason: e.deltaMode === 1 ? 'deltaMode=1(LINE)' : `absDeltaY=${Math.abs(e.deltaY)} >= 50`,
    // });

    // 普通鼠标滚轮 - 执行缩放
    const delta = e.deltaY;
    const factor = delta > 0 ? 1 - ZOOM_STEP : 1 + ZOOM_STEP;
    const newScale = clampScale(scale.value * factor);

    // 获取画布边界信息
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();

    // 计算鼠标在画布中的相对位置
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // 计算世界坐标
    const worldX = (mouseX - offsetX.value) / scale.value;
    const worldY = (mouseY - offsetY.value) / scale.value;

    // 应用新缩放
    scale.value = newScale;

    // 重新计算偏移量，使缩放中心保持在鼠标位置
    offsetX.value = mouseX - worldX * scale.value;
    offsetY.value = mouseY - worldY * scale.value;
    emitState();
  } else {
    // console.log('👆 触摸板双指滑动/Magic Mouse平移', {
    //   ctrlKey: e.ctrlKey,
    //   deltaX: e.deltaX,
    //   deltaY: e.deltaY,
    //   deltaMode: e.deltaMode,
    //   deltaModeText: e.deltaMode === 0 ? 'PIXEL' : e.deltaMode === 1 ? 'LINE' : 'PAGE',
    //   absDeltaY: Math.abs(e.deltaY),
    //   reason: e.deltaMode === 0 ? 'deltaMode=0(PIXEL)' : `absDeltaY=${Math.abs(e.deltaY)} < 50`,
    // });

    // 触摸板双指滑动 / Magic Mouse - 执行平移
    // 触摸板可以同时提供 deltaX 和 deltaY
    const moveX = e.deltaX;
    const moveY = e.deltaY;

    offsetX.value += moveX;
    offsetY.value += moveY;
    emitState();
  }
}

// 鼠标拖拽
function onPointerDown(e: MouseEvent) {
  if (!props.src) return;
  // 只响应左键
  if (e.button !== 0) return;
  isPanning.value = true;
  panLastX.value = e.clientX;
  panLastY.value = e.clientY;

  const onMove = (ev: MouseEvent) => {
    if (!isPanning.value) return;
    const dx = ev.clientX - panLastX.value;
    const dy = ev.clientY - panLastY.value;
    panLastX.value = ev.clientX;
    panLastY.value = ev.clientY;
    offsetX.value += dx;
    offsetY.value += dy;
  };

  const onUp = () => {
    isPanning.value = false;
    emitState();
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

// 触摸辅助函数
function getTouchDistance(t1: Touch, t2: Touch) {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.hypot(dx, dy);
}

function getTouchAngle(t1: Touch, t2: Touch) {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function onTouchStart(e: TouchEvent) {
  if (!props.src) return;
  if (e.touches.length === 1) {
    // 单指拖拽
    isPanning.value = true;
    const t = e.touches[0]!;
    panLastX.value = t.clientX;
    panLastY.value = t.clientY;
  } else if (e.touches.length === 2) {
    // 双指手势
    isPinching.value = true;
    const [t1, t2] = [e.touches[0]!, e.touches[1]!];

    // 保存当前变换状态
    initialPinchDistance.value = getTouchDistance(t1, t2);
    initialPinchScale.value = scale.value;
    initialPinchRotation.value = rotation.value;
    initialPinchAngle.value = getTouchAngle(t1, t2);

    // 计算双指中心位置
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    const centerX = (t1.clientX + t2.clientX) / 2;
    const centerY = (t1.clientY + t2.clientY) / 2;

    // 保存双指中心相对于画布的坐标
    pinchCenterX.value = centerX - rect.left - rect.width / 2;
    pinchCenterY.value = centerY - rect.top - rect.height / 2;

    // 保存初始偏移量
    pinchOffsetX.value = offsetX.value;
    pinchOffsetY.value = offsetY.value;
  }
}

function onTouchMove(e: TouchEvent) {
  if (!props.src) return;
  if (isPinching.value && e.touches.length === 2) {
    const [t1, t2] = [e.touches[0]!, e.touches[1]!];
    const dist = getTouchDistance(t1, t2);
    const currentAngle = getTouchAngle(t1, t2);

    if (initialPinchDistance.value > 0) {
      // 计算当前双指中心位置
      if (!canvasRef.value) return;
      const rect = canvasRef.value.getBoundingClientRect();
      const centerX = (t1.clientX + t2.clientX) / 2;
      const centerY = (t1.clientY + t2.clientY) / 2;
      const currentCenterX = centerX - rect.left - rect.width / 2;
      const currentCenterY = centerY - rect.top - rect.height / 2;

      // 1. 缩放
      const ratio = dist / initialPinchDistance.value;
      const newScale = clampScale(initialPinchScale.value * ratio);

      // 2. 旋转
      const angleDiff = currentAngle - initialPinchAngle.value;
      const newRotation = initialPinchRotation.value + angleDiff;

      // 3. 平移 - 计算中心点移动
      const centerMoveX = currentCenterX - pinchCenterX.value;
      const centerMoveY = currentCenterY - pinchCenterY.value;

      // 应用新的变换
      scale.value = newScale;
      rotation.value = newRotation;

      // 计算基于初始状态的偏移
      // 初始世界坐标位置（相对于变换中心）
      const worldX = pinchCenterX.value / initialPinchScale.value;
      const worldY = pinchCenterY.value / initialPinchScale.value;

      // 新的变换中心偏移
      const transformCenterX = worldX * newScale;
      const transformCenterY = worldY * newScale;

      // 最终偏移 = 初始偏移 + 中心移动 + 变换调整
      offsetX.value = pinchOffsetX.value + centerMoveX + (currentCenterX - transformCenterX);
      offsetY.value = pinchOffsetY.value + centerMoveY + (currentCenterY - transformCenterY);
    }
  } else if (isPanning.value && e.touches.length === 1) {
    const t = e.touches[0]!;
    const dx = t.clientX - panLastX.value;
    const dy = t.clientY - panLastY.value;
    panLastX.value = t.clientX;
    panLastY.value = t.clientY;
    offsetX.value += dx;
    offsetY.value += dy;
  }
}

function onTouchEnd() {
  if (!props.src) return;
  if (isPinching.value) {
    isPinching.value = false;
    initialPinchDistance.value = 0;
    initialPinchAngle.value = 0;
    pinchOffsetX.value = 0;
    pinchOffsetY.value = 0;
    emitState();
  }
  if (isPanning.value) {
    isPanning.value = false;
    emitState();
  }
}

watch(
  () => props.state,
  (state) => {
    applyState(state);
  },
  { immediate: true, deep: true },
);
</script>

<style scoped>
.inline-image-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 背景组件 - 占满整个容器 */
.viewer-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid var(--vscode-border);
  border-radius: 0;
  overflow: hidden;
  background: var(--vscode-editor-background);
  z-index: 1;
}

.viewer-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none; /* 让自定义拖拽/缩放生效 */
}

.viewer-transform {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.viewer-img {
  max-width: 100%;
  max-height: 100%;
  pointer-events: none; /* 事件交给容器处理 */
}

/* 悬浮的工具栏 */
.viewer-toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 8px;
  background: var(--vscode-sideBar-background);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  border: 1px solid var(--vscode-border);
}

.scale-indicator {
  font-size: 12px;
  color: var(--vscode-muted);
}

/* 底部信息栏 */
.viewer-footer {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--vscode-muted);
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--vscode-sideBar-background);
  backdrop-filter: blur(10px);
  border: 1px solid var(--vscode-border);
  z-index: 10;
}

.file-name {
  color: var(--vscode-text);
  font-weight: 600;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.viewer-hint {
  font-size: 11px;
}

/* 双指缩放中心点指示器（调试用） */
.pinch-center-indicator {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #ff4444;
  border-radius: 50%;
  background: rgba(255, 68, 68, 0.8);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.9);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
  }
}
</style>
