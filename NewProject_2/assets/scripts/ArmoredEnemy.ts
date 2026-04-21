import { _decorator } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('ArmoredEnemy')
export class ArmoredEnemy extends Enemy {
    @property
    public armorReduction: number = 0.5; // 50%伤害减免

    start() {
        // 设置装甲敌人属性
        this.enemyType = 'armored';
        this.moveSpeed = 60;   // 比基础敌人慢40%
        this.maxHp = 10;       // 高血量
        this.damageToWall = 2; // 对城墙伤害更高

        super.start();

        console.log(`装甲敌人生成，速度: ${this.moveSpeed}, 血量: ${this.maxHp}, 护甲减免: ${this.armorReduction * 100}%`);
    }

    // 重写受伤方法，应用护甲减免
    public takeDamage(damage: number): void {
        const reducedDamage = damage * (1 - this.armorReduction);
        console.log(`装甲敌人护甲生效，伤害从 ${damage} 减少到 ${reducedDamage}`);
        super.takeDamage(reducedDamage);
    }
}