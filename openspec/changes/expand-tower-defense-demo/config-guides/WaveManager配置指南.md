# WaveManager 配置指南

## 概述
WaveManager 替换原有的 EnemySpawner，提供更强大的波次管理系统，支持多种敌人类型和波次配置。

## 配置步骤

### 1. 查找/创建 WaveManager 节点
- 在 **层级管理器** 中找到 EnemySpawner 节点（建议重命名为 "WaveManager"）
- 如果没有，创建一个空节点并重命名为 "WaveManager"

### 2. 添加脚本组件
- 选中 WaveManager 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **WaveManager**

### 3. 创建敌人预制体
需要创建以下敌人预制体（基于现有的 Enemy.prefab）：

**重要提示**：每种敌人类型都有对应的脚本组件。创建预制体时，请使用对应的组件以获得完整功能。

1. **基本敌人**：复制 `Enemy.prefab` 并重命名为 `BasicEnemy.prefab`
   - **组件**：使用 `Enemy` 组件
   - 设置 `enemyType` 为 "basic"
   - 调整属性：`maxHp: 3`, `moveSpeed: 100`

2. **快速敌人**：复制 `Enemy.prefab` 并重命名为 `FastEnemy.prefab`
   - **组件**：使用 `FastEnemy` 组件（继承自 Enemy）
   - 注意：`FastEnemy` 组件会自动设置 `enemyType` 为 "fast"
   - 调整属性：`maxHp: 2`, `moveSpeed: 180`

3. **装甲敌人**：复制 `Enemy.prefab` 并重命名为 `ArmoredEnemy.prefab`
   - **组件**：使用 `ArmoredEnemy` 组件（继承自 Enemy）
   - 注意：必须使用 `ArmoredEnemy` 组件以获得护甲减免效果
   - 调整属性：`maxHp: 10`, `moveSpeed: 60`, `armorReduction: 0.5`

4. **飞行敌人**：复制 `Enemy.prefab` 并重命名为 `FlyingEnemy.prefab`
   - **组件**：使用 `FlyingEnemy` 组件（继承自 Enemy）
   - 注意：必须使用 `FlyingEnemy` 组件以获得飞行效果
   - 调整属性：`maxHp: 4`, `moveSpeed: 120`, `flightHeight: 100`

5. **Boss敌人**：复制 `Enemy.prefab` 并重命名为 `BossEnemy.prefab`
   - **组件**：使用 `BossEnemy` 组件（继承自 Enemy）
   - 注意：必须使用 `BossEnemy` 组件以获得Boss特殊能力
   - 调整属性：`maxHp: 50`, `moveSpeed: 40`, `bossScale: 1.5`

6. **群体敌人**：复制 `Enemy.prefab` 并重命名为 `SwarmEnemy.prefab`
   - **组件**：使用 `SwarmEnemy` 组件（继承自 Enemy）
   - 注意：必须使用 `SwarmEnemy` 组件以获得群体行为
   - 调整属性：`maxHp: 1`, `moveSpeed: 140`, `swarmSize: 1`

### 4. 组件配置详细步骤
对于每个敌人预制体，配置对应组件的步骤：

1. **复制基础预制体**：
   - 在资源管理器中找到 `Enemy.prefab`
   - 右键复制并重命名为对应的名称（如 `FastEnemy.prefab`）

2. **修改组件**：
   - 双击打开新的预制体进行编辑
   - 在层级管理器中选中敌人节点
   - 在属性检查器中找到现有的 `Enemy` 组件
   - 点击组件右上角的 **×** 删除该组件

3. **添加对应组件**：
   - 在属性检查器中点击 **添加组件**
   - 选择 **用户脚本组件** → 对应的组件（如 `FastEnemy`）
   - 重复此步骤添加所有需要的组件

4. **配置属性**：
   - 根据上述表格调整属性值
   - 注意：某些属性（如 `armorReduction`）只在特定组件中存在
   - 保存预制体

**替代方法**（如果删除组件导致问题）：
1. 创建新的空节点
2. 添加对应的敌人组件（如 `FastEnemy`）
3. 复制原 `Enemy.prefab` 的精灵、碰撞体等子节点
4. 配置属性并保存为新预制体

### 5. 配置预制体引用
将创建的预制体拖拽到对应属性：

| 属性 | 预制体 |
|------|--------|
| `basicEnemyPrefab` | BasicEnemy.prefab |
| `fastEnemyPrefab` | FastEnemy.prefab |
| `armoredEnemyPrefab` | ArmoredEnemy.prefab |
| `flyingEnemyPrefab` | FlyingEnemy.prefab |
| `bossEnemyPrefab` | BossEnemy.prefab |
| `swarmEnemyPrefab` | SwarmEnemy.prefab |

### 6. 配置 UI 引用（可选）
| 属性 | 描述 | 对应节点 |
|------|------|----------|
| `waveInfoLabel` | 波次信息文本 | 场景中的波次信息Label |
| `enemyCountLabel` | 敌人数量文本 | 场景中的敌人计数Label |
| `waveProgressBar` | 波次进度条 | 场景中的波次进度ProgressBar |

#### UI配置详细说明
WaveManager的UI引用是可选的，但强烈建议配置以获得更好的游戏体验。

**6.1 UI节点定位**
波次UI通常位于游戏界面的顶部或底部区域：
```
Canvas
├── WaveUI (或 GameHUD/WavePanel)
│   ├── WaveInfoLabel (waveInfoLabel)
│   ├── EnemyCountLabel (enemyCountLabel)  
│   └── WaveProgressBar (waveProgressBar)
```

**查找方法**：
1. 搜索节点名称包含 "wave"、"enemy"、"progress" 的节点
2. 检查Label组件的文本内容（可能显示为"波次 1/5"、"剩余敌人: 10"）
3. 进度条通常是ProgressBar组件，可以拖动滑块

**6.2 如果UI节点不存在**
如果场景中没有波次UI，有以下选择：

**方案A：创建新UI（推荐）**
1. 右键 **Canvas** → **创建节点** → **创建Panel**，重命名为 "WaveUI"
2. 在Panel下创建3个节点：
   - **Label** → 重命名为 "WaveInfoLabel" → 设置文本："波次 1/5"
   - **Label** → 重命名为 "EnemyCountLabel" → 设置文本："剩余敌人: 0"
   - **ProgressBar** → 重命名为 "WaveProgressBar" → 设置初始进度：0
3. 调整位置和样式

**方案B：不配置UI（使用控制台日志）**
如果不配置UI，WaveManager仍会正常工作，但：
- 波次信息只在控制台显示
- 玩家无法直观看到波次进度
- 可以使用控制台的console.log查看状态

**6.3 绑定UI引用步骤**
1. 选中 **WaveManager** 节点
2. 在 **属性检查器** 中找到WaveManager组件
3. 将 **层级管理器** 中的Label节点拖拽到对应的属性框：
   - `waveInfoLabel` → 波次信息Label节点
   - `enemyCountLabel` → 敌人计数Label节点
   - `waveProgressBar` → 进度条ProgressBar节点

**6.4 UI显示逻辑**
配置UI后，WaveManager会自动更新：
- `waveInfoLabel`：显示"波次 X/Y" 或 "波次间休息: N秒"
- `enemyCountLabel`：显示"剩余敌人: N"
- `waveProgressBar`：显示波次进度（0~1）

**6.5 验证UI绑定**
运行游戏后检查：
1. 波次开始时，`waveInfoLabel` 是否显示正确波次
2. 敌人生成后，`enemyCountLabel` 是否更新
3. 敌人被击杀时，进度条是否增加
4. 波次间休息时，是否显示休息倒计时

### 7. 配置波次数据
在 **波次配置数组** 中添加波次：

**示例配置：**
```javascript
[
  {
    "name": "训练波",
    "subwaves": [
      {
        "enemyType": "basic",
        "count": 5,
        "spawnInterval": 0.5,
        "delayAfter": 3
      }
    ]
  },
  {
    "name": "快速敌人波",
    "subwaves": [
      {
        "enemyType": "basic",
        "count": 3,
        "spawnInterval": 0.8,
        "delayAfter": 2
      },
      {
        "enemyType": "fast",
        "count": 3,
        "spawnInterval": 0.5,
        "delayAfter": 4
      }
    ]
  }
]
```

## 验证配置
1. 运行游戏
2. 检查敌人是否正确生成
3. 确认波次间休息时间
4. 验证UI显示（如果配置了UI引用）

## 注意事项
- WaveManager 会自动生成默认波次配置，但建议自定义
- 确保所有预制体都已正确设置 enemyType 属性
- 波次配置可在运行时通过代码动态修改