import { _decorator, Node, Vec3 } from 'cc';
import { Soldier } from './Soldier';
import { DamageType } from './damageTypes';
const { ccclass, property } = _decorator;

@ccclass('Mage')
export class Mage extends Soldier {
    @property
    public splashRadius: number = 100; // 范围伤害半径

    @property
    public splashDamageRatio: number = 0.5; // 范围伤害比例（主目标的百分比）

    start() {
        this.soldierName = "法师";
        this.baseDamage = 15;
        this.baseAttackSpeed = 1.8;   // 1.8秒攻击一次
        this.baseRange = 250;
        this.baseMaxHp = 30;
        this.buyCost = 180;
        this.upgradeCost = 140;
        this.damageType = DamageType.MAGIC;  // 魔法伤害类型

        super.start();
    }

    // 重写攻击方法，实现范围伤害
    protected attack(): void {
        if (!this.currentTarget || !this.currentTarget.isValid) return;

        const enemyScript = this.currentTarget.getComponent('Enemy') as any;
        if (enemyScript && enemyScript.takeDamage) {
            const damage = this.getFinalDamage();

            // 对主目标造成伤害
            enemyScript.takeDamage(damage);
            console.log(`${this.soldierName} 攻击敌人，造成 ${damage} 伤害（主目标）`);

            // 范围伤害
            this.applySplashDamage(this.currentTarget, damage);

            // 攻击特效
            this.playAttackEffect();

            // 攻击轨迹
            if (this.showAttackLine) {
                this.showAttackLineEffect();
            }

            // 攻击粒子
            if (this.showAttackParticle) {
                this.showAttackParticleEffect();
            }
        }
    }

    // 应用范围伤害
    private applySplashDamage(mainTarget: Node, mainDamage: number): void {
        const splashDamage = mainDamage * this.splashDamageRatio;
        const mainTargetPos = mainTarget.worldPosition;

        // 查找所有敌人
        this.findAllEnemies(this.node.scene, (enemyNode: Node) => {
            // 跳过主目标
            if (enemyNode === mainTarget) return;

            // 检查距离
            const enemyPos = enemyNode.worldPosition;
            const distance = Vec3.distance(mainTargetPos, enemyPos);

            if (distance <= this.splashRadius) {
                const enemyScript = enemyNode.getComponent('Enemy') as any;
                if (enemyScript && enemyScript.takeDamage) {
                    enemyScript.takeDamage(splashDamage);
                    console.log(`${this.soldierName} 范围伤害，对附近敌人造成 ${splashDamage} 伤害`);
                }
            }
        });
    }
}