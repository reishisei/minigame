import { _decorator } from 'cc';
import { Soldier } from './Soldier';
const { ccclass, property } = _decorator;

@ccclass('Archer')
export class Archer extends Soldier {
    start() {
        this.soldierName = "弓箭手";
        this.baseDamage = 2;
        this.baseAttackSpeed = 1;   // 0.8秒攻击一次
        this.baseRange = 500;
        this.baseMaxHp = 40;
        this.buyCost = 80;
        this.upgradeCost = 60;
        console.log("弓箭手已创建，位置:", this.node.position);
        
        super.start();
    }
    update(deltaTime: number) {
        super.update(deltaTime);
    }
}