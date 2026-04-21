# GameManager 配置指南

## 概述
GameManager 是游戏的核心管理器，负责集成所有子系统并提供统一的访问接口。

## 配置步骤

### 1. 查找/创建 GameManager 节点
- 在 **层级管理器** 中找到现有的 GameManager 节点（通常位于场景根节点下）
- 如果没有，创建一个空节点并重命名为 "GameManager"

### 2. 添加脚本组件
- 选中 GameManager 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **GameManager**

### 3. 配置 UI 引用
将场景中的 UI 元素拖拽到对应属性：

| 属性 | 描述 | 对应节点 |
|------|------|----------|
| `goldLabel` | 金币显示文本 | 场景中的金币Label节点 |
| `expLabel` | 经验显示文本 | 场景中的经验Label节点 |
| `expBar` | 经验进度条 | 场景中的ProgressBar节点 |
| `levelLabel` | 等级显示文本 | 场景中的等级Label节点 |

### UI配置详细步骤

#### 3.1 查找UI节点
UI节点通常位于以下位置：
- **Canvas** 节点下的子节点
- **UI** 或 **HUD** 分组下
- 常见路径示例：
  ```
  Canvas
  ├── TopBar
  │   ├── GoldPanel
  │   │   └── GoldLabel (goldLabel)
  │   ├── ExpPanel
  │   │   ├── ExpLabel (expLabel)
  │   │   └── ExpProgressBar (expBar)
  │   └── LevelPanel
  │       └── LevelLabel (levelLabel)
  ```

**查找方法**：
1. 在 **层级管理器** 中展开 **Canvas** 节点
2. 找到包含UI文本或进度条的节点
3. 可以双击UI元素在场景视图中高亮显示

#### 3.2 绑定UI引用
**操作步骤**：
1. 选中 **GameManager** 节点
2. 在 **属性检查器** 中找到 GameManager 脚本组件
3. 找到 `goldLabel` 属性
4. 从 **层级管理器** 中拖拽对应的 Label 节点到 `goldLabel` 属性框
5. 重复此过程绑定所有UI引用

**属性类型说明**：
- `goldLabel`, `expLabel`, `levelLabel`：需要 **Label** 类型节点
- `expBar`：需要 **ProgressBar** 类型节点

**验证绑定**：
- 绑定成功后，属性框中会显示节点名称
- 如果绑定错误，属性框会显示 "(null)" 或错误图标

#### 3.3 UI节点不存在怎么办？
如果你的场景中没有这些UI节点：

**方案A：创建新的UI节点**
1. 右键点击 **Canvas** 节点 → **创建节点** → **创建Label**
2. 重命名为合适的名称（如 "GoldLabel"）
3. 设置文本内容（如 "金币: 100"）
4. 调整位置、大小、字体样式

**方案B：查找现有UI**
1. 使用 **搜索框** 搜索 "gold"、"exp"、"level" 等关键词
2. 检查UI节点的 **Label组件** 的 `string` 属性
3. 检查UI节点的名称，可能不是标准名称

**方案C：检查UI预制体**
如果UI使用预制体：
1. 查找UI预制体（如 "UIPanel.prefab"）
2. 编辑预制体，找到对应的Label节点
3. 返回场景绑定引用

#### 3.4 常见UI绑定问题
| 问题 | 症状 | 解决 |
|------|------|------|
| **节点类型错误** | 拖拽后属性显示错误图标 | 检查节点类型（Label/ProgressBar） |
| **节点层级太深** | 找不到正确的Label节点 | 展开所有子节点，检查UI结构 |
| **场景中有多个同名节点** | 绑定错误节点 | 使用唯一名称，或在场景视图中确认 |
| **属性框不接受拖拽** | 拖拽无效 | 确保拖拽的是节点，不是属性或组件 |
| **绑定后运行时报错** | "xxx is null" | 重新绑定，检查节点是否被删除/重命名 |

### 4. 配置基础属性
| 属性 | 默认值 | 说明 |
|------|--------|------|
| `gold` | 100 | 初始金币数量 |
| `currentExp` | 0 | 初始经验值 |
| `expToNextLevel` | 100 | 升级所需经验 |
| `currentLevel` | 1 | 初始等级 |
| `damagePerLevel` | 0.1 | 每级伤害加成 |
| `attackSpeedPerLevel` | 0.05 | 每级攻速加成 |
| `rangePerLevel` | 0.05 | 每级射程加成 |

## 验证配置
1. 运行游戏
2. 检查 UI 是否正确显示金币、经验、等级
3. 确认暂停/恢复功能正常工作

## 注意事项
- GameManager 使用单例模式，确保场景中只有一个实例
- 所有 UI 引用必须在编辑器中进行绑定
- GameManager 会自动初始化其他管理器，确保它们已正确配置