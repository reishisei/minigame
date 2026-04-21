# AchievementManager 配置指南

## 概述
AchievementManager 管理游戏的成就系统，追踪玩家统计数据，解锁成就并发放奖励。

## 配置步骤

### 1. 创建 AchievementManager 节点
- 在 **层级管理器** 中创建空节点，重命名为 "AchievementManager"
- 建议放置在场景根节点下

### 2. 添加脚本组件
- 选中 AchievementManager 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **AchievementManager**

### 3. 配置基础属性
无需要在编辑器中配置的属性，所有配置都在代码中完成。

## 成就系统架构

### 成就类型
1. **累计类成就**：达到特定数量
   - 例：击杀10个敌人、获得1000金币
   - 类型：`count`

2. **最大值类成就**：达到特定数值
   - 例：塔升级到5级
   - 类型：`max_value`

3. **关卡类成就**：完成特定关卡
   - 例：完成第5关
   - 类型：`level`

4. **事件类成就**：触发特定事件
   - 例：在第一波失败
   - 类型：`event`
   - 隐藏成就

### 默认成就列表
AchievementManager 会自动初始化以下成就：

#### 击杀类成就
- `kill_10_enemies`：新手猎人 - 击杀10个敌人（100金币，1技能点）
- `kill_100_enemies`：熟练猎人 - 击杀100个敌人（500金币，3技能点）
- `kill_1000_enemies`：传奇猎人 - 击杀1000个敌人（2000金币，10技能点）

#### 金币类成就
- `earn_1000_gold`：小有积蓄 - 累计获得1000金币（200金币，2技能点）

#### 塔类成就
- `build_10_towers`：建筑大师 - 建造10座防御塔（300金币，2技能点）
- `upgrade_tower_to_level_5`：精益求精 - 将一座塔升级到5级（500金币，3技能点）

#### 关卡类成就
- `complete_level_5`：冒险者 - 完成第5关（1000金币，5技能点）
- `complete_all_levels`：塔防大师 - 完成所有关卡（5000金币，20技能点）

#### 波次类成就
- `complete_10_waves`：持久战 - 完成10波敌人进攻（400金币，2技能点）

#### 隐藏成就
- `die_first_wave`：出师不利 - 在第一波敌人进攻中失败（50金币，1技能点）

## 统计数据类型

| 统计项 | 描述 | 对应成就目标 |
|--------|------|--------------|
| `totalEnemiesKilled` | 总击杀数 | `enemies_killed` |
| `totalGoldEarned` | 总获得金币 | `gold_earned` |
| `totalTowersBuilt` | 总建造塔数 | `towers_built` |
| `totalTowersUpgraded` | 总升级次数 | `towers_upgraded` |
| `totalWavesCompleted` | 总完成波次 | `waves_completed` |
| `totalLevelsCompleted` | 总完成关卡 | `levels_completed` |
| `totalPlayTime` | 总游戏时间 | `play_time` |
| `totalGamesPlayed` | 总游戏次数 | `games_played` |

## 使用方法

### 更新统计数据
```typescript
// 敌人被击杀时
AchievementManager.instance?.updateStat('totalEnemiesKilled', 1);

// 获得金币时
AchievementManager.instance?.updateStat('totalGoldEarned', amount);

// 塔升级时（设置最大值）
AchievementManager.instance?.setStatMax('totalTowersUpgraded', newLevel);
```

### 触发事件成就
```typescript
// 游戏失败时检查是否第一波失败
if (waveNumber === 0) {
    AchievementManager.instance?.triggerAchievement('game_over_wave_1');
}
```

### 获取成就信息
```typescript
// 获取所有成就
const allAchievements = AchievementManager.instance?.getAllAchievements();

// 获取已解锁成就
const unlocked = AchievementManager.instance?.getUnlockedAchievements();

// 获取成就进度（0.0 - 1.0）
const progress = AchievementManager.instance?.getAchievementProgress('kill_10_enemies');

// 获取统计信息
const stats = AchievementManager.instance?.getGameStats();
```

## 成就通知
当成就解锁时，建议显示通知：
```typescript
// 在 unlockAchievement 方法中
this.showAchievementNotification(achievement);

// 建议实现UI通知
// 显示成就图标、标题和描述
// 3-5秒后自动消失
```

## 成就UI集成

### 成就菜单界面
建议创建成就菜单：
1. 显示所有成就（隐藏成就显示为???）
2. 区分已解锁/未解锁
3. 显示成就进度条
4. 显示成就奖励

### 游戏内通知
成就解锁时显示短暂通知。

### 详细UI配置指南

#### 1. 成就解锁通知
成就解锁时应在游戏内显示即时通知。

**通知UI设计**：
```
AchievementNotification (Panel节点)
├── Icon (成就图标Sprite)
├── TitleLabel (成就标题，如"新手猎人")
├── DescLabel (成就描述，如"击杀10个敌人")
├── RewardLabel (奖励文本，如"+100金币 +1技能点")
└── ProgressBar (进度条，可选)
```

**实现步骤**：
1. **创建通知预制体**：
   - 创建Panel节点，添加动画组件（淡入淡出）
   - 设置初始位置（如屏幕顶部或右下角）
   - 添加UI元素：图标、标题、描述、奖励

2. **成就解锁时显示**：
   ```typescript
   // 在AchievementManager的unlockAchievement方法中
   private showAchievementNotification(achievement: Achievement): void {
       // 创建或复用通知节点
       const notification = instantiate(this.notificationPrefab);
       this.node.addChild(notification);
       
       // 设置成就信息
       const ui = notification.getComponent("AchievementNotificationUI");
       if (ui) {
           ui.show(achievement);
       }
       
       // 3-5秒后自动消失
       this.scheduleOnce(() => {
           notification.destroy();
       }, 3.0);
   }
   ```

3. **多个成就队列**：
   - 如果同时解锁多个成就，使用队列依次显示
   - 每个通知显示3秒，间隔0.5秒

#### 2. 成就菜单界面
成就菜单显示所有成就的详细信息。

**界面结构**：
```
AchievementMenu (Panel节点)
├── TitleLabel (成就菜单标题)
├── Tabs (分类选项卡)
│   ├── AllTab (全部)
│   ├── UnlockedTab (已解锁)
│   ├── InProgressTab (进行中)
│   └── HiddenTab (隐藏成就)
├── AchievementList (滚动容器)
│   ├── AchievementItem1 (成就项1)
│   │   ├── Icon
│   │   ├── StatusBadge (已解锁/未解锁)
│   │   ├── TitleLabel
│   │   ├── DescLabel
│   │   ├── ProgressBar (进度条)
│   │   ├── ProgressText (进度文本)
│   │   └── RewardLabel
│   └── ... (更多成就项)
└── CloseButton (关闭按钮)
```

**成就项状态**：
- **已解锁**：全彩显示，显示"已解锁"徽章
- **进行中**：显示进度条和进度百分比
- **未解锁**：灰色显示，显示解锁要求
- **隐藏成就**：显示为"???"，解锁后显示详情

#### 3. 成就进度显示
在成就菜单中显示详细的进度信息。

**进度条实现**：
```typescript
// 成就项UI组件
updateProgress(achievement: Achievement): void {
    const progress = AchievementManager.instance?.getAchievementProgress(achievement.id) || 0;
    
    // 更新进度条
    if (this.progressBar) {
        this.progressBar.progress = progress;
    }
    
    // 更新进度文本
    if (this.progressLabel) {
        if (achievement.type === 'count') {
            const current = Math.floor(progress * achievement.requirement);
            this.progressLabel.string = `${current}/${achievement.requirement}`;
        } else {
            this.progressLabel.string = `${Math.floor(progress * 100)}%`;
        }
    }
}
```

#### 4. 游戏内成就提示
在游戏过程中提示接近完成的成就：

**接近完成提示**：
- 当成就进度达到80%时，显示小提示
- 如："再击杀2个敌人即可解锁'新手猎人'成就"
- 提示显示在屏幕边缘，不干扰游戏

#### 5. 统计数据显示
显示玩家的整体统计数据：

**统计面板**：
```
GameStatsPanel (Panel节点)
├── TotalPlayTimeLabel (总游戏时间)
├── TotalEnemiesKilledLabel (总击杀数)
├── TotalGoldEarnedLabel (总获得金币)
├── TotalTowersBuiltLabel (总建造塔数)
├── TotalWavesCompletedLabel (总完成波次)
└── AchievementCountLabel (成就解锁数/总数)
```

#### 6. 奖励发放反馈
成就奖励发放时提供视觉反馈：

1. **金币奖励**：
   - 显示金币增加动画
   - 播放金币音效

2. **技能点奖励**：
   - 显示技能点增加动画
   - 更新技能点显示UI

3. **特殊奖励**：
   - 显示解锁的新内容（新塔、新关卡等）
   - 播放特殊音效

#### 7. 移动端优化
移动设备上的成就UI优化：
- 成就项大小适合点击
- 简化成就菜单布局
- 使用卡片式设计，便于滑动

#### 8. 与现有UI集成
将成就系统集成到现有游戏UI中：

1. **主菜单集成**：
   - 在主菜单添加"成就"按钮
   - 显示已解锁成就数量，如"成就 (12/50)"

2. **游戏内集成**：
   - 在游戏HUD添加成就快捷入口
   - 显示最近解锁的成就

3. **暂停菜单集成**：
   - 在暂停菜单添加成就选项
   - 玩家可以在游戏过程中查看成就

#### 9. 成就分享功能（可选）
高级功能：允许玩家分享成就
- 生成成就截图
- 分享到社交媒体
- 显示成就获取时间

## 验证配置
1. 运行游戏
2. 击杀敌人触发成就
3. 建造和升级塔
4. 完成关卡和波次
5. 检查成就解锁和奖励发放

## 扩展自定义成就

### 添加新成就
在 `initializeAchievements()` 方法中添加：
```typescript
this.registerAchievement({
    id: 'new_achievement_id',
    title: '成就标题',
    description: '成就描述',
    type: 'count', // count, max_value, level, event
    target: 'enemies_killed', // 统计目标或事件ID
    requirement: 50, // 要求数值
    reward: {
        gold: 200,
        skillPoints: 2
    },
    hidden: false // 是否隐藏
});
```

### 添加新统计类型
如果需要新的统计类型：
1. 在 `GameStats` 接口中添加新属性
2. 在 `getStatTarget()` 方法中添加映射
3. 在游戏相应位置调用 `updateStat()`

## 奖励发放机制
成就奖励通过以下方式发放：
1. **金币奖励**：通过 GameManager.addGold() 发放
2. **技能点奖励**：通过 SkillManager.addSkillPoints() 发放
3. **其他奖励**：可扩展（解锁新塔、新关卡等）

## 注意事项
- 成就进度保存在本地存储（`td_achievement_progress`）
- 隐藏成就在解锁前不显示
- 事件类成就需要手动触发
- 建议成就难度逐步增加，保持玩家动力