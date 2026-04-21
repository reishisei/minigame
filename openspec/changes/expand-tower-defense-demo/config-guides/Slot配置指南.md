# Slot 配置指南

## 概述
Slot 组件管理防御塔槽位，包括塔的放置、升级、移除和UI显示。已集成新的事件系统。

## 配置步骤

### 1. 查找 Slot 节点
- 在 **层级管理器** 中找到所有 Slot 节点（通常有多个，如 Slot1, Slot2, Slot3...）
- 确保每个槽位节点有唯一的 `slotIndex`

### 2. 更新脚本组件
- 选中 Slot 节点
- 在 **属性检查器** 中找到现有的 Slot 脚本组件
- 确保脚本版本已更新到最新（包含事件集成）

### 3. 配置预制体引用
将塔的预制体拖拽到对应属性：

| 属性 | 预制体 | 说明 |
|------|--------|------|
| `archerPrefab` | Archer.prefab | 弓箭手预制体 |
| `musketeerPrefab` | Musketeer.prefab | 火枪手预制体 |
| `cannonPrefab` | Cannon.prefab | 守城炮预制体 |
| `magePrefab` | Mage.prefab | 法师预制体（180金币，魔法伤害） |
| `icePrefab` | Ice.prefab | 寒冰塔预制体（160金币，寒冰伤害） |
| `supportPrefab` | Support.prefab | 支援塔预制体（220金币，支援类型） |
| `sniperPrefab` | Sniper.prefab | 狙击塔预制体（300金币，穿刺伤害） |

**注意**：确保这些预制体存在且已正确配置 Soldier 脚本。

### 4. 配置 UI 元素
将节点拖拽到对应属性：

| 属性 | 描述 | 节点类型 |
|------|------|----------|
| `highlightSprite` | 选中高亮效果 | Sprite |
| `borderSprite` | 塔类型边框 | Sprite |
| `soldierIcon` | 塔图标 | Sprite |
| `levelLabel` | 等级文字 | Label |
| `typeLabel` | 塔类型文字 | Label |

#### 4.1 Slot UI结构详解
每个Slot节点通常包含以下子节点：

**典型Slot UI结构**：
```
Slot1 (节点，带Button组件)
├── Background (背景Sprite)
├── Border (边框Sprite，对应borderSprite)
├── Icon (图标Sprite，对应soldierIcon)
├── LevelText (等级Label，对应levelLabel)
├── TypeText (类型Label，对应typeLabel)
└── Highlight (高亮Sprite，对应highlightSprite，通常隐藏)
```

**4.2 查找和绑定UI元素**
**操作步骤**：
1. **选中Slot节点**：在层级管理器中找到Slot节点（如Slot1、Slot2等）
2. **展开子节点**：展开Slot节点查看所有子节点
3. **识别UI元素**：
   - **Sprite节点**：检查是否有边框、图标、高亮效果的Sprite
   - **Label节点**：查找显示等级和类型的文本
4. **绑定属性**：
   - 在属性检查器中找到Slot组件
   - 将对应的子节点拖拽到属性框

**属性绑定示例**：
- `borderSprite` → 拖拽边框Sprite节点
- `soldierIcon` → 拖拽图标Sprite节点
- `highlightSprite` → 拖拽高亮效果Sprite节点
- `levelLabel` → 拖拽等级文本Label节点
- `typeLabel` → 拖拽类型文本Label节点

**4.3 如果UI元素不存在**
如果Slot节点缺少某些UI元素：

**创建缺失的UI**：
1. **创建Sprite**：
   - 右键Slot节点 → **创建节点** → **创建Sprite**
   - 重命名为合适名称（如"Border"、"Icon"、"Highlight"）
   - 设置SpriteFrame（图片资源）
2. **创建Label**：
   - 右键Slot节点 → **创建节点** → **创建Label**
   - 重命名为"LevelText"或"TypeText"
   - 设置文本内容（如"Lv.1"、"弓箭手"）

**4.4 UI状态管理说明**
Slot组件根据状态控制UI显示：

| 状态 | borderSprite | soldierIcon | levelLabel | typeLabel | highlightSprite |
|------|--------------|-------------|------------|-----------|-----------------|
| **空槽位** | 隐藏 | 隐藏 | 隐藏 | 隐藏 | 隐藏 |
| **有塔状态** | 显示（颜色按塔类型） | 显示 | 显示（Lv.X） | 显示 | 隐藏 |
| **选中状态** | 显示 | 显示 | 显示 | 显示 | 显示 |

**4.5 验证UI绑定**
运行游戏测试：
1. 空槽位：所有UI元素应隐藏
2. 放置塔：边框、图标、等级、类型应显示
3. 点击槽位：高亮Sprite应显示
4. 移除塔：UI应恢复空槽位状态

### 5. 配置槽位索引
为每个槽位设置唯一的 `slotIndex`：
- Slot1: `slotIndex = 0`
- Slot2: `slotIndex = 1`（默认放置弓箭手）
- Slot3: `slotIndex = 2`
- 以此类推...

### 6. 配置按钮事件
每个 Slot 节点应该有按钮组件来触发点击：
1. 确保 Slot 节点有 **Button** 组件
2. 在 **Click Events** 中添加事件
3. 拖拽 Slot 节点到目标
4. 选择组件：`Slot`
5. 选择方法：`onSlotClick`

#### 6.1 按钮事件配置详解
Slot节点需要配置点击事件才能与商店交互。

**详细配置步骤**：
1. **检查Button组件**：
   - 选中Slot节点（如Slot1）
   - 在属性检查器中查看是否有 **Button** 组件
   - 如果没有，点击 **添加组件** → **UI** → **Button**

2. **配置Click Events**：
   - 展开Button组件的 **Click Events** 部分
   - 点击 **+** 按钮添加新事件
   - 事件数量应为1（如果已有事件，检查是否正确）

3. **设置事件目标**：
   - 从层级管理器拖拽 **同一个Slot节点** 到 **Target** 字段
   - 注意：这里的目标是Slot节点自身，不是Shop节点

4. **选择组件和方法**：
   - **Component**：选择 **Slot**
   - **Handler**：选择 **onSlotClick**

**可视化配置**：
```
属性检查器 → Button组件 → Click Events
点击 [+] 按钮：
┌──────────────────────────┐
│ Target: [拖拽Slot1节点]    │
│ Component: Slot          │
│ Handler: onSlotClick     │
└──────────────────────────┘
```

**6.2 为所有Slot节点配置**
如果有多个Slot节点（Slot1、Slot2、Slot3...）：
1. 先配置Slot1的按钮事件
2. 选中Slot1的Button组件
3. 右键 → **复制组件**
4. 选中Slot2节点
5. 右键 → **粘贴组件**（复制Click Events配置）
6. 确保Target自动更新为Slot2节点

**6.3 验证按钮配置**
测试按钮功能：
1. 运行游戏
2. 点击Slot节点
3. 商店面板应打开
4. 当前Slot应显示选中状态（高亮）
5. 商店信息应显示该槽位的状态

**6.4 常见问题**

| 问题 | 症状 | 解决 |
|------|------|------|
| **点击无反应** | 点击Slot无任何效果 | 检查Button组件和Click Events配置 |
| **商店不打开** | 点击后商店面板不显示 | 检查Shop节点是否激活，Slot与Shop的通信 |
| **选中状态不显示** | 点击后高亮不出现 | 检查highlightSprite绑定和显示逻辑 |
| **多Slot配置繁琐** | 每个Slot都要配置 | 使用复制粘贴组件功能 |

**6.5 自动放置槽位说明**
`slotIndex = 1` 的槽位（通常是Slot2）会在游戏开始时自动放置弓箭手：
- 这依赖于GameManager的初始化
- 自动放置后，该槽位的UI应更新显示弓箭手信息
- 如果自动放置失败，检查GameManager是否正常初始化

## 事件集成说明

### 塔建造事件
当放置塔时，自动触发：
```typescript
// 在 placeSoldier 方法中
GameManager.instance?.towerBuilt(soldierType);
```
这会：
1. 更新成就系统（`totalTowersBuilt` +1）
2. 播放塔放置音效

### 塔升级事件
当升级塔时，自动触发：
```typescript
// 在 upgradeSoldier 方法中
GameManager.instance?.towerUpgraded(this.currentSoldierType, newLevel);
```
这会：
1. 更新成就系统（`totalTowersUpgraded` 最大值）
2. 播放塔升级音效

## 自动放置机制
`slotIndex` 为 1 的槽位（第二个槽位）会在游戏开始时自动放置弓箭手：
```typescript
if (this.slotIndex === 1) {
    this.scheduleOnce(() => {
        if (!this.currentSoldier) {
            this.placeSoldier("archer");
        }
    }, 0.1);
}
```

## UI 状态管理
Slot 组件管理以下UI状态：

### 空槽位状态
- 边框隐藏
- 图标隐藏
- 等级文字隐藏
- 类型文字隐藏

### 有塔状态
- 边框显示（颜色对应塔类型）
- 图标显示（颜色对应塔类型）
- 等级文字显示（Lv.1, Lv.2...）
- 类型文字显示（弓箭手、火枪手、守城炮）

### 选中状态
- 高亮Sprite显示
- 通常在商店打开时显示

## 与 Shop 组件集成
Slot 与 Shop 组件配合工作：
1. 玩家点击 Slot → 调用 `onSlotClick()`
2. Slot 通知 Shop 选择当前槽位
3. Shop 显示商店面板并暂停游戏
4. 玩家在商店中选择操作
5. Shop 调用 Slot 的对应方法

## 验证配置
1. 运行游戏
2. 点击槽位打开商店
3. 购买不同塔类型
4. 升级塔
5. 移除塔
6. 检查UI更新
7. 验证事件触发（音效、成就）

## 常见问题

### 1. 预制体引用丢失
**症状**：购买塔时报错"预制体为空"
**解决**：重新拖拽预制体到属性

### 2. UI 元素不显示
**症状**：塔放置后UI不更新
**解决**：检查UI元素引用，确保节点类型正确

### 3. 按钮点击无反应
**症状**：点击槽位无反应
**解决**：检查Button组件和Click Events配置

### 4. 自动放置不工作
**症状**：第二个槽位没有自动放置弓箭手
**解决**：检查 `slotIndex` 是否为 1，GameManager是否已初始化

## 性能优化建议
1. **对象池**：频繁创建/销毁塔时考虑使用对象池
2. **UI更新**：避免每帧更新UI，只在状态变化时更新
3. **事件监听**：合理使用事件系统，避免过度耦合

## 扩展功能
### 支持新塔类型
1. 创建新塔预制体（继承 Soldier）
2. 在 `placeSoldier` 方法中添加新 case
3. 配置预制体引用
4. 在 Shop 中添加购买按钮

### 槽位解锁系统
可以扩展槽位解锁机制：
```typescript
@property
public unlocked: boolean = true;

// 在 onSlotClick 中检查
if (!this.unlocked) {
    // 显示解锁提示或要求
    return;
}
```