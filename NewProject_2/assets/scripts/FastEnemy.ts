import { _decorator } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('FastEnemy')
export class FastEnemy extends Enemy {
    start() {
        // 设置快速敌人属性
        this.enemyType = 'fast';
        this.moveSpeed = 180;  // 比基础敌人快80%
        this.maxHp = 2;        // 血量较少
        this.damageToWall = 1; // 对城墙伤害不变

        super.start();

        console.log(`快速敌人生成，速度: ${this.moveSpeed}, 血量: ${this.maxHp}`);
    }
}