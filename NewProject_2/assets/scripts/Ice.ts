import { _decorator, Node, Vec3 } from 'cc';
import { Soldier } from './Soldier';
import { DamageType } from './damageTypes';
const { ccclass, property } = _decorator;

@ccclass('Ice')
export class Ice extends Soldier {
    @property
    public slowDuration: number = 3.0; // 减速持续时间（秒）

    @property
    public slowFactor: number = 0.5;   // 减速比例（移动速度乘以该值）

    start() {
        this.soldierName = "寒冰塔";
        this.baseDamage = 8;
        this.baseAttackSpeed = 1.2;   // 1.2秒攻击一次
        this.baseRange = 200;
        this.baseMaxHp = 40;
        this.buyCost = 160;
        this.upgradeCost = 120;
        this.damageType = DamageType.ICE;  // 寒冰伤害类型

        super.start();
    }

    // 重写攻击方法，实现减速效果
    protected attack(): void {
        if (!this.currentTarget || !this.currentTarget.isValid) return;

        const enemyScript = this.currentTarget.getComponent('Enemy') as any;
        if (enemyScript && enemyScript.takeDamage) {
            const damage = this.getFinalDamage();

            // 造成伤害
            enemyScript.takeDamage(damage);
            console.log(`${this.soldierName} 攻击敌人，造成 ${damage} 伤害并减速`);

            // 应用减速效果
            this.applySlowEffect(this.currentTarget);

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

    // 应用减速效果
    private applySlowEffect(target: Node): void {
        const enemyScript = target.getComponent('Enemy') as any;
        if (!enemyScript) return;

        // 如果敌人已有减速效果，先清除之前的
        if (enemyScript.slowEffectTimer) {
            clearTimeout(enemyScript.slowEffectTimer);
        }

        // 保存原始速度
        const originalSpeed = enemyScript.moveSpeed;
        const slowedSpeed = originalSpeed * this.slowFactor;

        // 应用减速
        enemyScript.moveSpeed = slowedSpeed;
        console.log(`${this.soldierName} 减速敌人，移动速度从 ${originalSpeed} 降低到 ${slowedSpeed}`);

        // 设置恢复计时器
        enemyScript.slowEffectTimer = setTimeout(() => {
            if (enemyScript && enemyScript.isValid) {
                enemyScript.moveSpeed = originalSpeed;
                console.log(`${this.soldierName} 减速效果结束，敌人速度恢复为 ${originalSpeed}`);
                delete enemyScript.slowEffectTimer;
            }
        }, this.slowDuration * 1000);
    }
}