# AI 像素风格图像处理工具集

本项目提供了一套专门处理 AI 生成的"像素风格"图像的工具，能够将伪像素风格转换为真正的像素艺术。

## 工具概览

### 1. `energ` - 能量图网格检测与像素化

**功能**：基于梯度能量图和滑动窗口峰值检测的高级网格识别系统

**特点**：
- 自动检测像素尺寸（自相关算法）
- 滑动窗口机制检测局部能量尖峰
- 网格线插值补全
- 方向性能量增强
- 多种采样模式（中心点/平均/加权）

**核心算法**：
- 梯度能量计算：`E = |∇x| + |∇y|`
- 1D 滑动窗口峰值检测
- 网格线自动插值
- 边缘完整性保证

### 2. `edge_detect_pixelize.py` - 边缘检测像素化

**功能**：基于 Sobel 边缘检测的简化网格识别

**特点**：
- 简单快速的边缘检测
- 基于投影的网格线检测
- 颜色量化
- 调试模式可视化

**核心算法**：
- Sobel 边缘检测
- 一维投影和平滑
- 局部最大值检测

## 安装依赖

```bash
# 使用 pixi（推荐）
pixi install

# 或手动安装
pip install numpy pillow opencv-python
```

## 使用方法

### `energ` - 高级网格检测

```bash
# 基本使用
python energ --in input.png --out output.png

# 自动检测像素尺寸
python energ --in input.png --pixel-size 0

# 手动指定参数
python energ --in input.png \
  --gap-size 8 \
  --gap-tolerance 2 \
  --min-energy 0.15 \
  --window-size 16 \
  --enhance-energy \
  --enhance-directional \
  --enhance-horizontal 2.0 \
  --enhance-vertical 1.5

# 生成像素艺术
python energ --in input.png --sample \
  --sample-mode weighted \
  --sample-weight-ratio 0.6

# 输出纯能量图（用于调试）
python energ --in input.png --save-energy

# 结合其他参数使用
python energ --in input.png \
  --save-energy \
  --enhance-energy \
  --window-size 16 \
  --sample

# 输出原生分辨率像素图（每个采样点1个像素）
python energ --in input.png --sample --upscale 1

# 自定义升采样倍数（放大3倍）
python energ --in input.png --sample --upscale 3

# 结合使用
python energ --in input.png \
  --sample \
  --upscale 2 \
  --sample-mode center

# 智能颜色量化（自动颜色数）
python energ --in input.png --sample --quantize

# 强制16色调色板
python energ --in input.png --sample --quantize --colors 16

# 完整组合使用
python energ --in input.png \
  --sample \
  --upscale 3 \
  --quantize \
  --quantize-mode smart \
  --colors 32

# 调整相似度阈值（默认0.8）
python energ --in input.png --sample --quantize --similarity-threshold 0.9

# 强制16色调色板，高相似度阈值（减少颜色合并）
python energ --in input.png --sample --quantize --colors 16 --similarity-threshold 0.95
```

#### 主要参数说明

- `--gap-size`: 预期的网格线间距（像素）
- `--gap-tolerance`: 间距容差（±像素）
- `--min-energy`: 最小能量阈值（0~1）
- `--window-size`: 滑动窗口大小（0=自动）
- `--enhance-energy`: 启用能量增强
- `--enhance-directional`: 方向性增强
- `--save-energy`: 保存纯能量图用于调试
- `--sample`: 生成像素艺术
- `--sample-mode`: 采样模式（center/average/weighted）
- `--upscale`: 像素图升采样倍数（0=使用自动检测的pixel-size，1=原生分辨率，>1=自定义倍数）
- `--native-res`: 输出原生分辨率像素图（每个采样点1个像素，不放大）
- `--quantize`: 启用像素艺术颜色量化
- `--quantize-mode`: 量化模式（smart=智能合并，force=强制颜色数）
- `--colors`: 目标颜色数量（0=自动，>0=强制精确数量）
- `--similarity-threshold`: 智能合并模式的相似度阈值（0.0-1.0）

### `edge_detect_pixelize.py` - 简化边缘检测

```bash
# 基本使用
python edge_detect_pixelize.py --in input.png

# 调整参数
python edge_detect_pixelize.py --in input.png \
  --edge-threshold 0.1 \
  --min-grid-size 4 \
  --max-grid-size 16 \
  --upscale 4 \
  --colors 16

# 调试模式
python edge_detect_pixelize.py --in input.png --debug
```

#### 主要参数说明

- `--edge-threshold`: 边缘检测阈值（0.0-1.0）
- `--min-grid-size`: 最小网格尺寸
- `--max-grid-size`: 最大网格尺寸
- `--upscale`: 放大倍数
- `--colors`: 调色板大小
- `--no-quant`: 跳过颜色量化
- `--debug`: 保存调试图像

## 算法对比

| 特性 | `energ` | `edge_detect_pixelize.py` |
|------|---------|---------------------------|
| 检测精度 | 高（滑动窗口+能量增强） | 中（简单边缘检测） |
| 速度 | 中等 | 快 |
| 自适应能力 | 强（自动尺寸检测） | 弱（固定参数） |
| 局部峰值检测 | ✅ | ❌ |
| 网格插值 | ✅ | ❌ |
| 方向性增强 | ✅ | ❌ |
| 多种采样模式 | ✅ | ❌ |
| 颜色量化 | ❌ | ✅ |

## 适用场景

### 推荐使用 `energ`：
- 复杂的 AI 生成像素风格图像
- 需要高精度网格检测
- 图像中存在局部能量尖峰
- 需要自适应参数调整
- 要求高质量的像素艺术输出

### 推荐使用 `edge_detect_pixelize.py`：
- 简单的像素风格图像
- 需要快速处理
- 边缘清晰的图像
- 需要颜色量化效果
- 调试和可视化需求

## 输出说明

### `energ` 输出：
- `*_energy_grid.png`: 能量图 + 检测的网格线 + 网格中心点
- `*_pure_energy.png`: 纯能量图（如果启用 `--save-energy`，用于调试）
- `*_energy_grid_pixel_art.png`: 生成的像素艺术（如果启用 `--sample`）

### `edge_detect_pixelize.py` 输出：
- `*_edge_pixel.png`: 像素化结果
- `*_debug.png`: 调试图像（如果启用 `--debug`）

## 技术细节

### 滑动窗口机制
`energ` 使用滑动窗口来检测局部能量尖峰，解决了传统全局阈值方法无法检测局部峰值的问题：

```python
# 窗口大小可调节
window_size = max(gap_size, 5)  # 自动模式
step = max(1, gap_size // 2)    # 50% 重叠

# 滑动检测
for start in range(0, len(profile) - window_size + 1, step):
    window = profile[start:end]
    # 在窗口内找局部最大值
```

### 能量增强
支持方向性能量增强，针对不同类型的像素风格优化：

```python
# 水平边缘增强
horizontal_enhancement = np.abs(gy) * (horizontal_factor - 1.0)

# 垂直边缘增强  
vertical_enhancement = np.abs(gx) * (vertical_factor - 1.0)
```

### 自动尺寸检测
使用自相关算法自动检测像素尺寸：

```python
def _detect_pixel_size(energy, min_s, max_s):
    # 计算投影
    px = energy.sum(axis=0)
    py = energy.sum(axis=1)
    
    # 去趋势
    px = _detrend_1d(px)
    py = _detrend_1d(py)
    
    # 自相关评分
    for s in range(min_s, max_s + 1):
        score = _autocorr_score(px, s) + _autocorr_score(py, s)
```

## 开发说明

项目结构：
```
├── energ                          # 主要的能量图网格检测工具
├── edge_detect_pixelize.py        # 简化的边缘检测工具
├── grid_sampling_pixelize.py      # 网格采样像素化工具
├── sample_from_grid_centers.py    # 从网格中心采样工具
├── demo_pixelize.py               # 演示脚本
├── generate_e                     # 生成脚本
├── sample                         # 采样相关脚本
├── pixi.toml                     # 项目依赖配置
├── README.md                     # 本文档
├── LICENSE                       # 许可证
├── screenshots/                  # 截图目录
├── image/                        # 图像目录
├── out/                          # 输出目录
└── .gitignore                    # Git忽略文件
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这些工具！

## 许可证

本项目采用 MIT 许可证。