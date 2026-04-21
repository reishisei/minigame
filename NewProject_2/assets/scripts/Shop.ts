import { _decorator, Component, Button, Label, Node, director } from 'cc';
import { Slot } from './Slot';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Shop')
export class Shop extends Component {
    @property(Label)
    public infoLabel: Label = null;
    
    @property(Node)
    public shopPanel: Node = null;
    
    private selectedSlot: Slot = null;
    private wasPaused: boolean = false;  // 记录暂停状态
    
    start() {
        if (this.shopPanel) {
            this.shopPanel.active = false;
        }
    }
    
    public selectSlot(slot: Slot) {
        console.log("selectSlot 被调用，槽位:", slot.slotIndex);
        this.selectedSlot = slot;
        this.showShop(true);
        this.updateInfo();
    
        // 使用 GameManager 暂停
        const gm = GameManager.instance;
        if (gm && !gm.isGamePaused) {
            gm.pauseGame();
        }
    }
    
    public showShop(show: boolean) {
        if (this.shopPanel) {
            this.shopPanel.active = show;
        }
    }
    
    updateInfo() {
        if (this.infoLabel && this.selectedSlot) {
            this.infoLabel.string = this.selectedSlot.getSoldierInfo();
        }
    }
    
    // 关闭商店时恢复游戏
    onClose() {
        if (this.selectedSlot) {
            this.selectedSlot.setHighlight(false);
            this.selectedSlot = null;
        }
        this.showShop(false);
    
        // 使用 GameManager 恢复
        const gm = GameManager.instance;
        if (gm && gm.isGamePaused) {
            gm.resumeGame();
        }
    }
    
    // 购买后刷新信息并关闭商店
    onBuyArcher() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("archer")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }
    
    onBuyMusketeer() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("musketeer")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }
    
    onBuyCannon() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("cannon")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }

    onBuyMage() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("mage")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }

    onBuyIce() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("ice")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }

    onBuySupport() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("support")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }

    onBuySniper() {
        if (this.selectedSlot) {
            if (this.selectedSlot.placeSoldier("sniper")) {
                this.updateInfo();
                this.onClose(); // 购买成功后自动关闭商店
            }
        }
    }

    onUpgrade() {
        if (this.selectedSlot) {
            if (this.selectedSlot.upgradeSoldier()) {
                this.updateInfo();
            }
        }
    }
    
    onRemove() {
        if (this.selectedSlot) {
            this.selectedSlot.removeSoldier();
            this.updateInfo();
            this.onClose();  // 移除后自动关闭商店并恢复游戏
        }
    }
}