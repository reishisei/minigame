import { _decorator, Component, Node, Prefab, instantiate, Sprite, Color, Label } from 'cc';
import { Soldier } from './Soldier';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {
    @property
    public slotIndex: number = 0;
    
    // 士兵预制体
    @property(Prefab)
    public archerPrefab: Prefab = null;
    @property(Prefab)
    public musketeerPrefab: Prefab = null;
    @property(Prefab)
    public cannonPrefab: Prefab = null;
    @property(Prefab)
    public magePrefab: Prefab = null;
    @property(Prefab)
    public icePrefab: Prefab = null;
    @property(Prefab)
    public supportPrefab: Prefab = null;
    @property(Prefab)
    public sniperPrefab: Prefab = null;
    
    // UI 元素
    @property(Sprite)
    public highlightSprite: Sprite = null;      // 选中高亮
    @property(Sprite)
    public borderSprite: Sprite = null;         // 边框（有士兵时显示）
    @property(Sprite)
    public soldierIcon: Sprite = null;          // 士兵图标
    @property(Label)
    public levelLabel: Label = null;            // 等级文字
    @property(Label)
    public typeLabel: Label = null;             // 士兵类型文字
    
    private currentSoldier: Node = null;
    private currentSoldierScript: Soldier = null;
    private currentSoldierType: string = "";
    
    start() {
        // 初始化 UI 状态
        if (this.borderSprite) {
            this.borderSprite.node.active = false;
        }
        if (this.soldierIcon) {
            this.soldierIcon.node.active = false;
        }
        if (this.levelLabel) {
            this.levelLabel.node.active = false;
        }
        if (this.typeLabel) {
            this.typeLabel.node.active = false;
        }

        // 中间槽位（slotIndex为1）在游戏开始时自动放置弓箭手
        if (this.slotIndex === 1) {
            this.scheduleOnce(() => {
                if (!this.currentSoldier) {
                    this.placeSoldier("archer");
                }
            }, 0.1); // 延迟0.1秒确保GameManager已初始化
        }
    }
    
    // 点击槽位时调用（由编辑器 Button 组件触发）
    onSlotClick() {
        console.log(`点击槽位 ${this.slotIndex}`);
        
        // 从场景根节点查找 Shop 组件
        const shop = this.node.scene.getComponentInChildren('Shop') as any;
        if (shop) {
            shop.selectSlot(this);
        } else {
            console.log("没有找到 Shop 组件");
        }
    }
    
    // 放置士兵
    public placeSoldier(soldierType: string): boolean {
        // 检查是否已有士兵
        if (this.currentSoldier) {
            console.log("槽位已有士兵");
            return false;
        }
        
        let prefab: Prefab = null;
        let cost = 0;
        let typeName = "";
        let iconColor = new Color(255, 255, 255, 255);
        
        switch (soldierType) {
            case "archer":
                prefab = this.archerPrefab;
                cost = 80;
                typeName = "弓箭手";
                iconColor = new Color(0, 255, 0);  // 绿色
                break;
            case "musketeer":
                prefab = this.musketeerPrefab;
                cost = 150;
                typeName = "火枪手";
                iconColor = new Color(255, 136, 0);  // 橙色
                break;
            case "cannon":
                prefab = this.cannonPrefab;
                cost = 250;
                typeName = "守城炮";
                iconColor = new Color(255, 0, 0);  // 红色
                break;
            case "mage":
                prefab = this.magePrefab;
                cost = 180;
                typeName = "法师";
                iconColor = new Color(128, 0, 255);  // 紫色
                break;
            case "ice":
                prefab = this.icePrefab;
                cost = 160;
                typeName = "寒冰塔";
                iconColor = new Color(0, 200, 255);  // 浅蓝色
                break;
            case "support":
                prefab = this.supportPrefab;
                cost = 220;
                typeName = "支援塔";
                iconColor = new Color(255, 255, 0);  // 黄色
                break;
            case "sniper":
                prefab = this.sniperPrefab;
                cost = 300;
                typeName = "狙击塔";
                iconColor = new Color(255, 255, 255);  // 白色
                break;
        }
        
        if (!prefab) {
            console.log("预制体为空");
            return false;
        }
        
        // 检查金币
        const gm = GameManager.instance;
        if (!gm || !gm.spendGold(cost)) {
            console.log("金币不足");
            return false;
        }
        
        // 创建士兵
        this.currentSoldier = instantiate(prefab);
        this.currentSoldier.setParent(this.node);
        this.currentSoldier.setPosition(0, 0, 0);
        this.currentSoldierScript = this.currentSoldier.getComponent(Soldier);
        this.currentSoldierType = soldierType;
        
        // 更新 UI 显示
        this.updateSlotUI(true, typeName, iconColor);

        // 触发塔建造事件
        const gm2 = GameManager.instance;
        if (gm2) {
            gm2.towerBuilt(soldierType);
        }

        console.log(`在槽位 ${this.slotIndex} 放置了 ${typeName}`);
        return true;
    }
    
    // 升级士兵
    public upgradeSoldier(): boolean {
        if (!this.currentSoldierScript) {
            console.log("槽位没有士兵");
            return false;
        }

        const result = this.currentSoldierScript.upgrade();
        if (result) {
            this.updateLevelDisplay();

            // 触发塔升级事件
            const gm = GameManager.instance;
            if (gm) {
                const newLevel = this.currentSoldierScript.getLevel();
                gm.towerUpgraded(this.currentSoldierType, newLevel);
            }
        }
        return result;
    }
    
    // 移除士兵
    public removeSoldier() {
        if (this.currentSoldier) {
            this.currentSoldier.destroy();
            this.currentSoldier = null;
            this.currentSoldierScript = null;
            this.currentSoldierType = "";
            
            // 更新 UI 显示
            this.updateSlotUI(false, "", null);
        }
    }
    
    // 更新槽位 UI
    private updateSlotUI(occupied: boolean, typeName: string = "", iconColor: Color = null) {
        // 边框
        if (this.borderSprite) {
            this.borderSprite.node.active = occupied;
            if (occupied && iconColor) {
                this.borderSprite.color = iconColor;
            }
        }
        
        // 图标
        if (this.soldierIcon) {
            this.soldierIcon.node.active = occupied;
            if (occupied && iconColor) {
                this.soldierIcon.color = iconColor;
            }
        }
        
        // 类型文字
        if (this.typeLabel) {
            this.typeLabel.node.active = occupied;
            if (occupied) {
                this.typeLabel.string = typeName;
            }
        }
        
        // 等级文字
        if (this.levelLabel) {
            this.levelLabel.node.active = occupied;
            if (occupied) {
                this.levelLabel.string = "Lv.1";
            }
        }
    }
    
    // 更新等级显示
    private updateLevelDisplay() {
        if (this.levelLabel && this.currentSoldierScript) {
            const level = (this.currentSoldierScript as any).level || 1;
            this.levelLabel.string = `Lv.${level}`;
        }
    }
    
    // 获取当前士兵信息
    public getSoldierInfo(): string {
        if (this.currentSoldierScript) {
            return this.currentSoldierScript.getInfo();
        }
        return "空槽位 - 点击购买";
    }
    
    // 高亮显示
    public setHighlight(highlight: boolean) {
        if (this.highlightSprite) {
            this.highlightSprite.node.active = highlight;
        }
    }
    
    // 获取当前士兵类型
    public getCurrentSoldierType(): string {
        return this.currentSoldierType;
    }
    
    // 检查槽位是否被占用
    public isOccupied(): boolean {
        return this.currentSoldier !== null;
    }
}