# 商店系统集成指南

## 代码已实现
以下新塔类的购买方法已在 `Shop.ts` 中实现：

```typescript
onBuyMage() {
    if (this.selectedSlot) {
        if (this.selectedSlot.placeSoldier("mage")) {
            this.updateInfo();
            this.onClose();
        }
    }
}

onBuyIce() {
    if (this.selectedSlot) {
        if (this.selectedSlot.placeSoldier("ice")) {
            this.updateInfo();
            this.onClose();
        }
    }
}

onBuySupport() {
    if (this.selectedSlot) {
        if (this.selectedSlot.placeSoldier("support")) {
            this.updateInfo();
            this.onClose();
        }
    }
}

onBuySniper() {
    if (this.selectedSlot) {
        if (this.selectedSlot.placeSoldier("sniper")) {
            this.updateInfo();
            this.onClose();
        }
    }
}
```

## UI 集成步骤

### 1. 定位商店面板
- 在场景编辑器中找到 `Shop` 节点或 `shopPanel`
- 该面板应该包含现有的购买按钮（弓箭手、火枪手、守城炮）

### 2. 添加新按钮
为每个新塔类添加按钮：

#### 按钮1: 购买法师
- 创建新的 Button 节点（可从现有按钮复制）
- 设置按钮文本："法师 180G"
- 设置按钮颜色：紫色 (#8000FF)
- 添加点击事件：
  - 组件：Shop
  - 方法：onBuyMage

#### 按钮2: 购买寒冰塔
- 创建新的 Button 节点
- 设置按钮文本："寒冰塔 160G"
- 设置按钮颜色：浅蓝色 (#00C8FF)
- 添加点击事件：
  - 组件：Shop
  - 方法：onBuyIce

#### 按钮3: 购买支援塔
- 创建新的 Button 节点
- 设置按钮文本："支援塔 220G"
- 设置按钮颜色：黄色 (#FFFF00)
- 添加点击事件：
  - 组件：Shop
  - 方法：onBuySupport

#### 按钮4: 购买狙击塔
- 创建新的 Button 节点
- 设置按钮文本："狙击塔 300G"
- 设置按钮颜色：白色 (#FFFFFF)
- 添加点击事件：
  - 组件：Shop
  - 方法：onBuySniper

### 3. 调整布局
根据现有按钮的布局方式，可能需要：
- 调整按钮位置，确保不重叠
- 可能需要使用 Grid Layout 或手动排列
- 考虑面板大小是否足够容纳更多按钮

### 4. Slot 组件配置
确保所有 Slot 节点都已配置新塔类的预制体：

1. 选择每个 Slot 节点（通常命名为 Slot_0, Slot_1, Slot_2 等）
2. 在 Inspector 中找到 Slot 组件
3. 将对应的预制体拖拽到属性槽：
   - magePrefab: Mage.prefab
   - icePrefab: Ice.prefab
   - supportPrefab: Support.prefab
   - sniperPrefab: Sniper.prefab

## 测试步骤

### 1. 功能测试
1. 运行游戏
2. 点击空槽位打开商店
3. 尝试购买每种新塔类
4. 验证塔是否正确放置
5. 验证金币扣除是否正确

### 2. 特殊效果测试
1. **法师**：攻击敌人时观察周围敌人是否也受到伤害
2. **寒冰塔**：攻击敌人后观察敌人移动速度是否变慢
3. **支援塔**：放置在友军塔附近，观察友军塔属性是否提升
4. **狙击塔**：观察是否有暴击效果，能否穿透多个敌人

### 3. UI 测试
1. 商店面板是否正确显示所有按钮
2. 按钮点击反馈是否正常
3. 购买后商店是否自动关闭
4. 信息面板是否正确更新

## 调试信息

### 控制台日志
游戏运行时，控制台会显示以下调试信息：

**购买时：**
```
在槽位 X 放置了 [塔类型]
```

**攻击时：**
```
法师 攻击敌人，造成 [伤害] 伤害（主目标）
法师 范围伤害，对附近敌人造成 [伤害] 伤害

寒冰塔 攻击敌人，造成 [伤害] 伤害并减速
寒冰塔 减速敌人，移动速度从 [原速度] 降低到 [新速度]

支援塔 增益友军塔，伤害+20%，攻速+10%

狙击塔 攻击敌人，造成 [伤害] 伤害（暴击）
狙击塔 穿透攻击第X个敌人，造成 [伤害] 伤害
```

### 常见问题排查

#### 问题1: 按钮点击无反应
- 检查按钮事件是否正确绑定到 Shop 组件的对应方法
- 确认 Shop 组件存在于场景中
- 检查控制台是否有错误信息

#### 问题2: 购买失败但金币足够
- 检查预制体是否正确配置到 Slot 组件
- 确认预制体包含对应的脚本组件（Mage、Ice、Support、Sniper）
- 检查塔类名称拼写是否正确（"mage", "ice", "support", "sniper"）

#### 问题3: 特殊效果不生效
- 检查特殊效果的参数设置（半径、持续时间、比例等）
- 验证目标是否在效果范围内
- 查看控制台是否有相关日志输出

#### 问题4: 商店面板布局混乱
- 调整按钮位置和大小
- 考虑使用布局组件（VerticalLayout, HorizontalLayout, GridLayout）
- 调整面板大小以适应更多按钮

## 性能考虑
- Support 塔每 1 秒更新一次光环效果，性能影响较小
- Mage 塔的范围伤害需要计算距离，敌人数量多时可能有性能影响
- 建议测试大量敌人时游戏帧率是否稳定

## 扩展建议
未来可考虑：
1. 塔类图标和更精美的视觉效果
2. 塔类升级后的特殊效果增强
3. 塔类组合效果（如寒冰+法师=冰冻效果）
4. 塔类技能系统（主动技能）