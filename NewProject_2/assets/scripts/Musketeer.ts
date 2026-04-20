import { _decorator } from 'cc';
import { Soldier } from './Soldier';
const { ccclass, property } = _decorator;

@ccclass('Musketeer')
export class Musketeer extends Soldier {
    start() {
        this.soldierName = "火枪手";
        this.baseDamage = 20;
        this.baseAttackSpeed = 1.5;   // 1.5秒攻击一次（较慢）
        this.baseRange = 300;          // 射程更远
        this.baseMaxHp = 60;
        this.buyCost = 150;
        this.upgradeCost = 120;
        
        super.start();
    }
}