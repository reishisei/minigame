# LevelManager 配置指南

## 概述
LevelManager 管理游戏的关卡系统，包括关卡进度、解锁状态、完成奖励和本地存储。

## 配置步骤

### 1. 创建 LevelManager 节点
- 在 **层级管理器** 中创建空节点，重命名为 "LevelManager"
- 建议放置在场景根节点下

### 2. 添加脚本组件
- 选中 LevelManager 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **LevelManager**

### 3. 配置基础属性
| 属性 | 默认值 | 说明 |
|------|--------|------|
| `_currentLevelId` | 1 | 当前关卡ID（代码控制） |
| `_maxUnlockedLevel` | 1 | 最大解锁关卡（代码控制） |

## 使用说明

### 关卡数据存储
LevelManager 使用本地存储保存进度，键名：`td_level_progress`

存储数据结构：
```json
{
  "maxUnlockedLevel": 3,
  "completion": [
    [1, {"levelId": 1, "completed": true, "score": 1000, "stars": 3, "bestScore": 1000}],
    [2, {"levelId": 2, "completed": true, "score": 850, "stars": 2, "bestScore": 850}]
  ]
}
```

### 主要方法
```typescript
// 设置当前关卡
LevelManager.instance?.setCurrentLevel(2);

// 完成当前关卡
LevelManager.instance?.completeCurrentLevel(score, stars);

// 解锁下一关
LevelManager.instance?.unlockNextLevel();

// 获取关卡信息
const completion = LevelManager.instance?.getLevelCompletion(1);
const bestScore = LevelManager.instance?.getLevelBestScore(1);
const stars = LevelManager.instance?.getLevelStars(1);
```

### 关卡完成流程
1. 玩家完成波次（WaveManager.completeAllWaves()）
2. 计算得分和星星评级
3. 调用 `LevelManager.instance?.completeCurrentLevel(score, stars)`
4. LevelManager 保存进度并解锁下一关

## 关卡设计建议
1. **关卡难度曲线**：逐渐增加敌人数量和类型
2. **关卡目标**：明确通关条件（生存时间、击杀数量等）
3. **奖励系统**：根据表现给予不同星星评级
4. **解锁机制**：完成当前关卡解锁下一关

## 扩展功能
### 多场景关卡
如果需要不同场景的关卡：
```typescript
// 加载对应关卡场景
director.loadScene(`Level_${levelId}`);
```

### 关卡配置数据
建议创建关卡配置文件：
```json
// assets/data/levels.json
[
  {
    "id": 1,
    "name": "训练关",
    "description": "学习基础操作",
    "difficulty": 1,
    "initialGold": 100,
    "waveCount": 3,
    "unlockRequirement": null
  },
  {
    "id": 2,
    "name": "森林关卡",
    "description": "对抗快速敌人",
    "difficulty": 2,
    "initialGold": 150,
    "waveCount": 5,
    "unlockRequirement": "complete_level_1"
  }
]
```

## 验证配置
1. 运行游戏
2. 测试关卡完成和进度保存
3. 重启游戏验证进度加载
4. 测试关卡解锁逻辑

## 注意事项
- LevelManager 使用单例模式，确保场景中只有一个实例
- 进度数据保存在本地存储，玩家清除浏览器数据会重置进度
- 建议在游戏开始时调用 `loadLevelProgress()` 加载进度