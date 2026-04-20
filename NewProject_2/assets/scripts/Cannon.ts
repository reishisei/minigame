import { _decorator } from 'cc';
import { Soldier } from './Soldier';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends Soldier {
    start() {
        this.soldierName = "守城炮";
        this.baseDamage = 40;
        this.baseAttackSpeed = 2.5;   // 2.5秒攻击一次（很慢）
        this.baseRange = 350;          // 射程最远
        this.baseMaxHp = 100;
        this.buyCost = 250;
        this.upgradeCost = 200;
        
        super.start();
    }
}