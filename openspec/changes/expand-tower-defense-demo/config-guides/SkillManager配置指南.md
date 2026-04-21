# SkillManager 配置指南

## 概述
SkillManager 管理游戏的技能系统，包括技能点获取、技能学习、技能树和效果应用。

## 配置步骤

### 1. 创建 SkillManager 节点
- 在 **层级管理器** 中创建空节点，重命名为 "SkillManager"
- 建议放置在场景根节点下

### 2. 添加脚本组件
- 选中 SkillManager 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **SkillManager**

### 3. 配置基础属性
| 属性 | 默认值 | 说明 |
|------|--------|------|
| `_skillPoints` | 0 | 当前技能点数量（代码控制） |

## 技能系统架构

### 技能类型
1. **塔类技能**：针对特定塔类型的增强
   - 弓箭手技能分支
   - 火枪手技能分支  
   - 守城炮技能分支

2. **全局技能**：影响所有塔或游戏机制的技能
   - 金币增益
   - 经验增益
   - 其他全局效果

### 默认技能树
SkillManager 会自动初始化以下技能：

#### 弓箭手技能分支
- `archer_damage_1`：强弓 - 伤害+20%（2技能点）
- `archer_attack_speed_1`：速射 - 攻速+15%（2技能点）
- `archer_range_1`：远射 - 射程+10%（3技能点，需前置）
- `archer_critical_strike`：致命一击 - 20%双倍伤害（5技能点，需前置）

#### 火枪手技能分支
- `musketeer_damage_1`：精准射击 - 伤害+25%（3技能点）
- `musketeer_penetration`：穿透射击 - 穿透1个敌人（4技能点）
- `musketeer_explosive_rounds`：爆炸弹丸 - 小范围爆炸（6技能点，需前置）

#### 守城炮技能分支
- `cannon_damage_1`：重炮 - 伤害+30%（4技能点）
- `cannon_splash_radius`：溅射范围 - 爆炸范围+20%（3技能点）
- `cannon_stun_effect`：眩晕效果 - 15%几率眩晕（5技能点，需前置）

#### 全局技能
- `global_gold_bonus`：金币增益 - 金币获取+10%（5技能点）
- `global_exp_bonus`：经验增益 - 经验获取+10%（5技能点，需前置）

## 使用方法

### 技能点管理
```typescript
// 获取当前技能点
const points = SkillManager.instance?.skillPoints;

// 添加技能点
SkillManager.instance?.addSkillPoints(5);

// 消耗技能点（自动检查）
const success = SkillManager.instance?.spendSkillPoints(3);
```

### 学习技能
```typescript
// 学习技能（自动检查前置条件和技能点）
const learned = SkillManager.instance?.learnSkill("archer_damage_1");

if (learned) {
    console.log("技能学习成功！");
}
```

### 检查技能状态
```typescript
// 检查技能是否已学习
const isLearned = SkillManager.instance?.isSkillLearned("archer_damage_1");

// 获取技能效果
const effects = SkillManager.instance?.getSkillEffects("archer", "stat_boost");

// 获取塔类可用技能
const archerSkills = SkillManager.instance?.getTowerSkills("archer");
const globalSkills = SkillManager.instance?.getGlobalSkills();
```

## 技能效果应用

### 属性提升效果
技能效果会自动应用到对应的塔：
2. 塔在计算最终属性时检查技能效果

### 能力解锁效果
解锁的能力需要在塔的代码中实现：
```typescript
// 在塔的攻击方法中检查能力
if (SkillManager.instance?.isSkillLearned("archer_critical_strike")) {
    // 20%几率造成双倍伤害
    if (Math.random() < 0.2) {
        damage *= 2;
    }
}
```

## 技能UI集成

### 技能树界面
建议创建技能树UI界面：
1. 显示所有可用技能
2. 高亮已学习技能
3. 显示技能前置条件
4. 提供学习按钮

### 技能点显示
在游戏UI中显示当前技能点数量。

### 详细UI配置指南

#### 1. 技能点显示UI
技能点通常显示在游戏界面的顶部或侧边栏。

**配置步骤**：
1. **创建技能点Label**：
   - 在Canvas下创建Label节点，重命名为 "SkillPointsLabel"
   - 设置文本格式，如 "技能点: 0"
   - 调整位置和样式

2. **与SkillManager集成**：
   - 创建一个UI管理器脚本或在现有脚本中添加：
   ```typescript
   // 在GameManager或其他UI管理器中
   updateSkillPointsUI() {
       const skillPoints = SkillManager.instance?.skillPoints || 0;
       if (this.skillPointsLabel) {
           this.skillPointsLabel.string = `技能点: ${skillPoints}`;
       }
   }
   ```

3. **更新时机**：
   - 玩家升级时（每级获得1技能点）
   - 学习技能消耗技能点时
   - 成就奖励技能点时

#### 2. 技能树界面设计
技能树界面可以是单独的菜单或游戏内面板。

**界面结构建议**：
```
SkillTreePanel (Panel节点)
├── TitleLabel (技能树标题)
├── SkillPointsDisplay (技能点显示)
├── Tabs (技能分支选项卡)
│   ├── ArcherTab (弓箭手技能)
│   ├── MusketeerTab (火枪手技能)
│   ├── CannonTab (守城炮技能)
│   └── GlobalTab (全局技能)
├── SkillGrid (技能网格容器)
│   ├── SkillNode1 (技能节点1)
│   │   ├── Icon (技能图标)
│   │   ├── NameLabel (技能名称)
│   │   ├── DescLabel (技能描述)
│   │   ├── CostLabel (技能点消耗)
│   │   └── LearnButton (学习按钮)
│   └── ... (更多技能节点)
└── CloseButton (关闭按钮)
```

**技能节点状态**：
- **未解锁**：灰色，显示前置要求
- **可学习**：正常颜色，有足够技能点
- **已学习**：高亮/金色边框，显示"已学习"

#### 3. 技能树UI实现步骤
1. **创建UI结构**：
   - 使用Cocos Creator创建Panel、Button、Label等节点
   - 设计技能节点的排列方式（树状或网格）

2. **绑定技能数据**：
   ```typescript
   // 获取技能数据
   const archerSkills = SkillManager.instance?.getTowerSkills("archer");
   const globalSkills = SkillManager.instance?.getGlobalSkills();
   ```

3. **技能节点交互**：
   - 点击技能节点显示详细信息
   - 点击学习按钮调用 `SkillManager.instance?.learnSkill(skillId)`
   - 学习后更新UI状态

4. **前置条件可视化**：
   - 用连线表示技能依赖关系
   - 未满足前置条件时显示锁图标

#### 4. 技能效果提示
在游戏中显示技能效果：

1. **塔信息增强**：
   - 在塔的属性面板中显示技能加成
   - 如："伤害: 10 (+20% 强弓技能)"

2. **战斗中的技能效果**：
   - 关键技能触发时显示特效（如暴击、眩晕）
   - 显示技能名称和效果

#### 5. 技能重置功能（可选）
高级功能：允许玩家重置技能点
- 添加"重置技能"按钮
- 消耗金币或特殊道具
- 重置所有已学技能，返还技能点

#### 6. 移动端优化
如果支持移动设备：
- 技能节点大小要适合点击
- 简化技能树布局
- 使用滑动查看更多技能

### UI与代码集成示例
```typescript
// 技能树UI管理器示例
@ccclass('SkillTreeUI')
export class SkillTreeUI extends Component {
    @property(Label)
    skillPointsLabel: Label = null;
    
    @property(Node)
    skillNodePrefab: Node = null;
    
    @property(Node)
    skillGrid: Node = null;
    
    start() {
        this.updateSkillPoints();
        this.populateSkillTree();
    }
    
    updateSkillPoints() {
        const points = SkillManager.instance?.skillPoints || 0;
        this.skillPointsLabel.string = `技能点: ${points}`;
    }
    
    populateSkillTree() {
        // 清空现有节点
        this.skillGrid.removeAllChildren();
        
        // 获取弓箭手技能
        const skills = SkillManager.instance?.getTowerSkills("archer") || [];
        
        // 为每个技能创建UI节点
        skills.forEach(skill => {
            const node = instantiate(this.skillNodePrefab);
            this.skillGrid.addChild(node);
            
            // 配置技能节点UI
            const ui = node.getComponent("SkillNodeUI");
            if (ui) {
                ui.setSkill(skill);
            }
        });
    }
    
    onLearnSkill(skillId: string) {
        const learned = SkillManager.instance?.learnSkill(skillId);
        if (learned) {
            this.updateSkillPoints();
            this.populateSkillTree(); // 刷新UI
        }
    }
}
```

## 验证配置
1. 运行游戏
2. 通过升级获得技能点
3. 测试技能学习功能
4. 验证技能效果应用

## 扩展自定义技能

### 添加新技能
在 `initializeAchievements()` 方法后添加：
```typescript
// 注册新技能
this.registerSkill({
    id: 'new_skill_id',
    name: '技能名称',
    description: '技能描述',
    type: 'tower', // 或 'global'
    cost: 3,
    prerequisites: ['prerequisite_skill_id'],
    towerType: 'archer', // 仅塔类技能需要
    effect: {
        type: 'stat_boost',
        target: 'archer',
        stat: 'damage',
        value: 0.15,
        isPercentage: true
    }
});

// 添加到技能分支
const branch = this.skillTree.towers.get('archer');
if (branch) {
    branch.availableSkills.push('new_skill_id');
}
```

## 注意事项
- 技能点通过玩家升级获得（每级1点）
- 技能进度保存在本地存储（`td_skill_progress`）
- 技能效果是永久性的，除非重置进度
- 建议设计平衡的技能树，避免过强技能过早可用