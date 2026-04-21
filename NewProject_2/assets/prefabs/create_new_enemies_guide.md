# 新敌人类预制体创建指南

以下五个新敌人类已实现，需要在 Cocos Creator 编辑器中创建对应的预制体：

## 已创建的脚本类
1. **FastEnemy** (快速敌人) - 高速低血量
2. **ArmoredEnemy** (装甲敌人) - 高血量，有伤害减免
3. **FlyingEnemy** (飞行敌人) - 飞行单位，有高度偏移
4. **BossEnemy** (Boss敌人) - 大型强敌，可能生成小兵
5. **SwarmEnemy** (群体敌人) - 小型群体单位，可能分裂

## 创建预制体步骤

### 1. 创建空节点
- 在场景中创建一个空节点
- 分别命名为 "FastEnemy", "ArmoredEnemy", "FlyingEnemy", "BossEnemy", "SwarmEnemy"

### 2. 添加组件
- 为每个节点添加对应的脚本组件：
  - FastEnemy 节点：添加 `FastEnemy` 脚本
  - ArmoredEnemy 节点：添加 `ArmoredEnemy` 脚本
  - FlyingEnemy 节点：添加 `FlyingEnemy` 脚本
  - BossEnemy 节点：添加 `BossEnemy` 脚本
  - SwarmEnemy 节点：添加 `SwarmEnemy` 脚本

### 3. 添加精灵(Sprite)组件
- 为每个节点添加 Sprite 组件
- 设置不同的颜色以区分类型：
  - FastEnemy: 青色 (0, 255, 255)
  - ArmoredEnemy: 灰色 (128, 128, 128)
  - FlyingEnemy: 粉红色 (255, 105, 180)
  - BossEnemy: 暗红色 (139, 0, 0) 并放大1.5倍
  - SwarmEnemy: 棕色 (165, 42, 42) 并缩小到0.7倍

### 4. 创建预制体
- 将每个节点拖拽到资源管理器中的 `assets/prefabs/` 文件夹
- 确保命名为：
  - FastEnemy.prefab
  - ArmoredEnemy.prefab
  - FlyingEnemy.prefab
  - BossEnemy.prefab
  - SwarmEnemy.prefab

### 5. 配置 WaveManager 组件
- 找到场景中的 WaveManager 节点
- 在 WaveManager 组件的属性面板中，将新创建的预制体拖拽到对应的属性：
  - fastEnemyPrefab: 拖拽 FastEnemy.prefab
  - armoredEnemyPrefab: 拖拽 ArmoredEnemy.prefab
  - flyingEnemyPrefab: 拖拽 FlyingEnemy.prefab
  - bossEnemyPrefab: 拖拽 BossEnemy.prefab
  - swarmEnemyPrefab: 拖拽 SwarmEnemy.prefab

## 敌人属性概览

| 敌人类型 | 速度 | 血量 | 城墙伤害 | 特殊能力 | 奖励(经验/金币) |
|----------|------|------|----------|----------|-----------------|
| 快速敌人 | 180 | 2 | 1 | 无 | 3 / 8 |
| 装甲敌人 | 60 | 10 | 2 | 50%伤害减免 | 8 / 15 |
| 飞行敌人 | 120 | 4 | 1 | 飞行高度+100，上下浮动 | 6 / 12 |
| Boss敌人 | 40 | 50 | 5 | 1.5倍大小，可能生成小兵 | 50 / 100 |
| 群体敌人 | 140 | 1 | 0.5 | 20%几率分裂，随机偏移移动 | 2 / 5 |

## 波次配置
WaveManager 的默认波次配置已包含部分新敌人类型。可以通过编辑 WaveManager 组件的 `waveConfigs` 属性来调整波次组成。

### 示例波次配置
```json
{
  "name": "混合波",
  "subwaves": [
    { "enemyType": "basic", "count": 3, "spawnInterval": 0.8, "delayAfter": 2 },
    { "enemyType": "fast", "count": 4, "spawnInterval": 0.4, "delayAfter": 3 },
    { "enemyType": "armored", "count": 2, "spawnInterval": 1.0, "delayAfter": 4 },
    { "enemyType": "flying", "count": 3, "spawnInterval": 0.6, "delayAfter": 0 }
  ]
}
```

## 测试建议

### 1. 功能测试
1. 运行游戏，观察波次生成
2. 验证每种敌人类型是否正确生成
3. 检查敌人属性（速度、血量）是否符合预期
4. 验证击杀奖励是否正确

### 2. 特殊效果测试
1. **装甲敌人**：攻击时观察伤害是否被减免50%
2. **飞行敌人**：观察是否有飞行高度和浮动动画
3. **Boss敌人**：观察尺寸是否放大，是否有特殊行为
4. **群体敌人**：观察移动时是否有随机偏移

### 3. 平衡性测试
1. 测试不同塔类对各种敌人的效果
2. 调整敌人属性以达到合适的难度曲线
3. 验证奖励与敌人强度的平衡性

## 扩展建议

### 1. 视觉效果增强
- 为每种敌人类型添加独特的精灵图像
- 添加攻击和死亡特效
- Boss敌人添加血条显示
- 飞行敌人添加翅膀动画

### 2. 行为扩展
- 装甲敌人：不同部位有不同护甲值
- 飞行敌人：可以被特定塔类（如弓箭手）更有效攻击
- Boss敌人：阶段转换（血量低于一定比例时改变行为）
- 群体敌人：真正的群体行为（多个敌人一起移动）

### 3. 伤害类型系统
- 实现伤害类型（物理、魔法、穿刺等）
- 敌人对不同伤害类型有不同抗性
- 塔类可以造成特定类型的伤害

## 注意事项
1. Boss敌人的小兵生成功能目前只有日志输出，需要实际实现生成逻辑
2. 群体敌人的分裂功能目前只有日志输出，需要实际实现分裂逻辑
3. 所有敌人的最终行为受 Enemy 基类控制
4. 修改敌人属性时，记得同时调整 GameManager 中的奖励数值以保持平衡