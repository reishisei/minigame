# Shop 配置指南

## 概述
Shop 组件管理游戏内商店系统，提供防御塔的购买、升级和移除功能。已扩展支持所有新塔类型。

## 配置步骤

### 1. 查找/创建 Shop 节点
- 在 **层级管理器** 中找到现有的 Shop 节点（通常是一个包含商店面板的UI节点）
- 如果没有，需要创建商店UI界面

### 2. 添加脚本组件
- 选中 Shop 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **Shop**

### 3. 配置 UI 引用
将商店面板的UI元素拖拽到对应属性：

| 属性 | 描述 | 对应节点 |
|------|------|----------|
| `infoPanel` | 信息面板 | 显示塔信息的Panel节点 |
| `nameLabel` | 塔名称文本 | 塔名称Label |
| `descLabel` | 塔描述文本 | 塔描述Label |
| `costLabel` | 塔成本文本 | 成本Label |
| `damageLabel` | 伤害值文本 | 伤害Label |
| `attackSpeedLabel` | 攻速文本 | 攻速Label |
| `rangeLabel` | 射程文本 | 射程Label |
| `levelLabel` | 等级文本 | 等级Label |
| `upgradeCostLabel` | 升级成本文本 | 升级成本Label |

#### 3.1 商店UI结构详解
商店界面通常包含以下部分：

**典型商店UI结构**：
```
Shop (节点)
├── Panel (背景面板)
├── TitleLabel (商店标题)
├── CloseButton (关闭按钮)
├── TowerButtons (塔按钮容器)
│   ├── ArcherButton
│   ├── MusketeerButton
│   ├── CannonButton
│   ├── MageButton
│   ├── IceButton
│   ├── SupportButton
│   └── SniperButton
└── InfoPanel (信息面板)
    ├── NameLabel (塔名称)
    ├── DescLabel (描述)
    ├── StatsPanel (属性面板)
    │   ├── CostLabel
    │   ├── DamageLabel
    │   ├── AttackSpeedLabel
    │   ├── RangeLabel
    │   ├── LevelLabel
    │   └── UpgradeCostLabel
    ├── UpgradeButton (升级按钮)
    └── RemoveButton (移除按钮)
```

**3.2 查找UI节点步骤**
1. **找到Shop节点**：在层级管理器中搜索 "Shop" 或 "商店"
2. **找到InfoPanel**：通常是Shop节点的子节点，可能命名为 "InfoPanel"、"TowerInfo" 等
3. **找到Label节点**：
   - 展开InfoPanel的子节点
   - 查找Label组件（在属性检查器中查看）
   - 通过Label的文本内容识别（如"伤害："、"射程："）

**3.3 绑定UI引用详细步骤**
对于每个属性，按以下步骤绑定：
1. 选中 **Shop** 节点
2. 在属性检查器中找到Shop组件
3. 找到要绑定的属性（如 `nameLabel`）
4. 从层级管理器拖拽对应的Label节点到属性框
5. **验证绑定**：绑定成功后，属性框显示节点名称

**属性类型要求**：
- `infoPanel`：需要 **Panel** 或 **Node** 类型
- 所有 `xxxLabel` 属性：需要 **Label** 类型

**3.4 常见UI配置问题**

| 问题 | 原因 | 解决 |
|------|------|------|
| **找不到InfoPanel** | UI结构不同 | 查找Shop节点下的所有Panel节点 |
| **Label节点太多，分不清** | 名称不明确 | 查看Label的文本内容，或在场景中点击Label高亮 |
| **属性绑定后无效** | 节点类型错误 | 确保绑定的是Label节点，不是Button或Sprite |
| **运行时报错"xxx is null"** | 绑定丢失 | 重新绑定，检查节点是否被删除 |

**3.5 创建商店UI（如果不存在）**
如果你的场景中没有商店UI：

1. **创建基础商店**：
   - 右键Canvas → **创建节点** → **创建Panel**，重命名为 "Shop"
   - 添加Shop脚本组件

2. **创建信息面板**：
   - 右键Shop节点 → **创建节点** → **创建Panel**，重命名为 "InfoPanel"
   - 在InfoPanel下创建多个Label节点，命名并设置文本

3. **创建购买按钮**：
   - 右键Shop节点 → **创建节点** → **创建Button**，重命名为 "ArcherButton"
   - 重复创建其他塔的按钮

4. **配置按钮文本**：
   - 每个Button节点下通常有Label子节点
   - 设置Label文本，如 "弓箭手 (80金)"

### 4. 配置按钮事件
Shop 组件需要为每个购买按钮配置点击事件：

#### 基础塔购买按钮
| 按钮节点 | 对应方法 | 说明 |
|----------|----------|------|
| Archer按钮 | `onBuyArcher()` | 购买弓箭手 |
| Musketeer按钮 | `onBuyMusketeer()` | 购买火枪手 |
| Cannon按钮 | `onBuyCannon()` | 购买守城炮 |

#### 新塔购买按钮
| 按钮节点 | 对应方法 | 说明 |
|----------|----------|------|
| Mage按钮 | `onBuyMage()` | 购买法师塔（180金币，魔法伤害） |
| Ice按钮 | `onBuyIce()` | 购买寒冰塔（160金币，寒冰伤害） |
| Support按钮 | `onBuySupport()` | 购买支援塔（220金币，增益光环） |
| Sniper按钮 | `onBuySniper()` | 购买狙击塔（300金币，穿刺伤害） |

#### 功能按钮
| 按钮节点 | 对应方法 | 说明 |
|----------|----------|------|
| 升级按钮 | `onUpgrade()` | 升级当前选中的塔 |
| 移除按钮 | `onRemove()` | 移除当前选中的塔 |
| 关闭按钮 | `onClose()` | 关闭商店面板 |

**配置步骤**：
1. 选中按钮节点
2. 在 **属性检查器** 中找到 **Button** 组件
3. 在 **Click Events** 中添加新事件
4. 拖拽 Shop 节点到目标
5. 选择组件：`Shop`
6. 选择对应的方法

#### 4.1 按钮事件配置详细说明
按钮事件配置是商店功能的关键，需要为每个按钮正确配置。

**详细配置步骤（以ArcherButton为例）**：
1. **选中按钮节点**：在层级管理器中找到 "ArcherButton" 节点
2. **打开属性检查器**：
   - 找到 **Button** 组件（如果没有，添加Button组件）
   - 展开 **Click Events** 部分
3. **添加新事件**：
   - 点击 **Click Events** 的 **+** 按钮
   - 会创建一个新的事件槽位
4. **拖拽目标节点**：
   - 从层级管理器中拖拽 **Shop** 节点到事件槽位的 **Target** 字段
5. **选择组件**：
   - 在 **Component** 下拉菜单中选择 **Shop**
6. **选择方法**：
   - 在 **Handler** 下拉菜单中选择 **onBuyArcher**
7. **重复配置**：为所有按钮重复以上步骤

**可视化操作示意图**：
```
属性检查器 → Button组件 → Click Events
点击 [+] 按钮添加新事件：
┌─────────────────────┐
│ Target: [拖拽Shop节点] │
│ Component: Shop     │
│ Handler: onBuyArcher │
└─────────────────────┘
```

**4.2 按钮节点命名建议**
为了便于管理，建议按钮节点命名如下：
- `ArcherButton` → `onBuyArcher()`
- `MusketeerButton` → `onBuyMusketeer()`
- `CannonButton` → `onBuyCannon()`
- `MageButton` → `onBuyMage()`
- `IceButton` → `onBuyIce()`
- `SupportButton` → `onBuySupport()`
- `SniperButton` → `onBuySniper()`
- `UpgradeButton` → `onUpgrade()`
- `RemoveButton` → `onRemove()`
- `CloseButton` → `onClose()`

**4.3 常见按钮配置问题**

| 问题 | 症状 | 解决 |
|------|------|------|
| **按钮点击无反应** | 点击按钮无任何效果 | 检查Click Events配置，确保方法名正确 |
| **方法下拉菜单为空** | 无法选择Shop的方法 | 确保Target已绑定Shop节点，且Shop脚本组件存在 |
| **多个按钮需要配置** | 重复操作繁琐 | 可以复制Button组件的事件配置到其他按钮 |
| **按钮没有Button组件** | 无法配置Click Events | 为节点添加Button组件 |
| **方法执行但无效果** | 点击有反应但无购买 | 检查Shop脚本逻辑，确保有足够金币等条件 |

**4.4 验证按钮配置**
测试每个按钮的功能：
1. **购买按钮**：点击后扣除金币，在选中槽位放置塔
2. **升级按钮**：塔存在时显示升级信息，点击后升级
3. **移除按钮**：移除塔并返还部分金币
4. **关闭按钮**：关闭商店面板，恢复游戏

**4.5 快捷配置技巧**
如果有很多按钮需要配置：
1. 先配置一个按钮（如ArcherButton）
2. 选中该按钮的Button组件
3. 右键 → **复制组件**
4. 选中其他按钮节点
5. 右键 → **粘贴组件**（会复制Click Events配置）
6. 修改Handler为对应的方法

### 5. 配置选中槽位引用
Shop 需要知道当前选中的槽位：
- 在代码中通过 `setSelectedSlot()` 方法设置
- 通常由 Slot 组件的 `onSlotClick()` 方法调用

## 与 Slot 组件集成
Shop 与 Slot 组件配合工作：
1. 玩家点击 Slot → Slot 调用 `onSlotClick()`
2. Slot 通知 Shop 选择当前槽位（`setSelectedSlot()`）
3. Shop 显示商店面板并暂停游戏
4. 玩家在商店中选择操作（购买/升级/移除）
5. Shop 调用 Slot 的对应方法

## 信息显示逻辑
当选中槽位时，Shop 显示以下信息：
- **空槽位**：显示可购买的塔信息
- **有塔槽位**：显示当前塔的属性和升级选项

## 验证配置
1. 运行游戏
2. 点击槽位打开商店
3. 测试所有购买按钮功能
4. 测试升级和移除功能
5. 检查信息显示是否正确
6. 验证商店关闭后游戏恢复

## 常见问题

### 1. 按钮点击无反应
**症状**：点击商店按钮无反应
**解决**：检查Button组件和Click Events配置

### 2. 信息显示错误
**症状**：塔信息显示不正确
**解决**：检查UI元素引用，确保节点类型正确

### 3. 选中槽位不更新
**症状**：商店显示的信息不是当前选中的槽位
**解决**：检查 `setSelectedSlot()` 调用

### 4. 新塔类型无法购买
**症状**：新塔按钮点击后无效果
**解决**：检查Slot组件中是否有对应的Prefab引用

## 扩展功能

### 1. 塔类型解锁系统
可以扩展塔类型解锁机制：
```typescript
// 在 Shop 组件中添加解锁检查
private isTowerUnlocked(towerType: string): boolean {
    // 检查玩家是否已解锁该塔类型
    return unlockedTowers.has(towerType);
}
```

### 2. 动态价格系统
根据游戏进度调整塔的价格：
```typescript
// 根据关卡或波次调整价格
public getTowerPrice(towerType: string): number {
    const basePrice = this.towerPrices[towerType];
    const waveFactor = GameManager.waveManager?.currentWaveIndex || 1;
    return basePrice * (1 + (waveFactor - 1) * 0.1);
}
```

### 3. 推荐系统
根据当前敌人类型推荐塔类型：
```typescript
// 分析当前波次敌人类型，推荐克制塔
public getRecommendedTower(): string {
    const currentEnemies = GameManager.waveManager?.getCurrentEnemyTypes();
    // 根据敌人抗性推荐塔类型
    // 例如：装甲敌人多 → 推荐法师塔（魔法伤害）
}
```

## 性能优化建议
1. **UI更新频率**：只在状态变化时更新UI，避免每帧更新
2. **事件监听**：合理使用事件系统，避免内存泄漏
3. **资源加载**：延迟加载塔的详细信息，提高商店打开速度