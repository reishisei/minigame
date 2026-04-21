import { _decorator, Node, Vec3 } from 'cc';
import { Soldier } from './Soldier';
import { DamageType, calculateFinalDamage } from './damageTypes';
const { ccclass, property } = _decorator;

@ccclass('Sniper')
export class Sniper extends Soldier {
    @property
    public criticalChance: number = 0.25; // 暴击几率（25%）

    @property
    public criticalMultiplier: number = 3.0; // 暴击伤害倍数

    @property
    public penetrationCount: number = 1; // 穿透敌人数量（0表示不穿透）

    start() {
        this.soldierName = "狙击塔";
        this.baseDamage = 60;
        this.baseAttackSpeed = 3.0;   // 3秒攻击一次（很慢）
        this.baseRange = 800;         // 超远射程
        this.baseMaxHp = 50;
        this.buyCost = 300;
        this.upgradeCost = 250;
        this.damageType = DamageType.PIERCING;  // 穿刺伤害类型

        super.start();
    }

    // 重写攻击方法，实现暴击和穿透
    protected attack(): void {
        if (!this.currentTarget || !this.currentTarget.isValid) return;

        // 计算是否暴击
        const isCritical = Math.random() < this.criticalChance;
        let damage = this.getFinalDamage();

        if (isCritical) {
            damage *= this.criticalMultiplier;
            console.log(`${this.soldierName} 暴击！`);
        }

        // 攻击主目标
        const enemyScript = this.currentTarget.getComponent('Enemy') as any;
        if (enemyScript && enemyScript.takeDamage) {
            // 获取敌人类型并应用伤害类型抗性
            const enemyType = enemyScript.enemyType || 'basic';
            const finalDamage = calculateFinalDamage(damage, enemyType, this.damageType);
            enemyScript.takeDamage(finalDamage);
            console.log(`${this.soldierName} (${this.damageType}) 攻击 ${enemyType} 敌人，造成 ${finalDamage} 伤害${isCritical ? '（暴击）' : ''}`);
        }

        // 穿透效果：继续攻击后面的敌人
        if (this.penetrationCount > 0) {
            this.applyPenetrationDamage(this.currentTarget, damage);
        }

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

    // 应用穿透伤害
    private applyPenetrationDamage(firstTarget: Node, damage: number): void {
        // 获取攻击方向（从塔到目标）
        const towerPos = this.node.worldPosition;
        const firstTargetPos = firstTarget.worldPosition;
        const direction = new Vec3(firstTargetPos.x - towerPos.x, firstTargetPos.y - towerPos.y, 0);
        direction.normalize();

        // 查找所有敌人，按距离排序
        const enemies: Array<{node: Node, distance: number}> = [];
        this.findAllEnemies(this.node.scene, (enemyNode: Node) => {
            // 跳过第一个目标
            if (enemyNode === firstTarget) return;

            const enemyPos = enemyNode.worldPosition;
            const distance = Vec3.distance(towerPos, enemyPos);

            // 检查敌人在攻击线上（简单的方向检查）
            const toEnemy = new Vec3(enemyPos.x - towerPos.x, enemyPos.y - towerPos.y, 0);
            toEnemy.normalize();
            const dot = Vec3.dot(direction, toEnemy);

            // 如果夹角很小（接近1），认为在攻击线上
            if (dot > 0.98) {
                enemies.push({node: enemyNode, distance});
            }
        });

        // 按距离排序
        enemies.sort((a, b) => a.distance - b.distance);

        // 对前 penetrationCount 个敌人造成伤害
        for (let i = 0; i < Math.min(this.penetrationCount, enemies.length); i++) {
            const enemyScript = enemies[i].node.getComponent('Enemy') as any;
            if (enemyScript && enemyScript.takeDamage) {
                // 穿透伤害递减
                const penetrationDamage = damage * (1 - (i * 0.3)); // 每次穿透减少30%伤害
                enemyScript.takeDamage(penetrationDamage);
                console.log(`${this.soldierName} 穿透攻击第${i + 1}个敌人，造成 ${penetrationDamage} 伤害`);
            }
        }
    }
}