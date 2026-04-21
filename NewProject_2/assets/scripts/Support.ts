import { _decorator, Node, Vec3 } from 'cc';
import { Soldier } from './Soldier';
import { DamageType } from './damageTypes';
const { ccclass, property } = _decorator;

@ccclass('Support')
export class Support extends Soldier {
    @property
    public auraRadius: number = 150; // 光环半径

    @property
    public auraDamageBonus: number = 0.2; // 伤害加成比例（20%）

    @property
    public auraAttackSpeedBonus: number = 0.1; // 攻速加成比例（10%）

    @property
    public auraUpdateInterval: number = 1.0; // 光环更新间隔（秒）

    private auraTimer: number = 0;
    private buffedTowers: Set<Node> = new Set(); // 当前被增益的塔

    start() {
        this.soldierName = "支援塔";
        this.baseDamage = 5;
        this.baseAttackSpeed = 2.0;   // 2秒攻击一次（不主要攻击）
        this.baseRange = 100;         // 自身攻击范围小
        this.baseMaxHp = 80;
        this.buyCost = 220;
        this.upgradeCost = 180;
        this.damageType = DamageType.SUPPORT;  // 支援伤害类型

        super.start();

        this.auraTimer = this.auraUpdateInterval;
    }

    update(deltaTime: number) {
        // 调用父类更新（处理攻击）
        super.update(deltaTime);

        // 更新光环计时器
        this.auraTimer -= deltaTime;
        if (this.auraTimer <= 0) {
            this.updateAura();
            this.auraTimer = this.auraUpdateInterval;
        }
    }

    // 更新光环效果
    private updateAura(): void {
        const newBuffedTowers = new Set<Node>();

        // 查找范围内的所有友方塔
        this.findAllTowers(this.node.scene, (towerNode: Node) => {
            // 跳过自己
            if (towerNode === this.node) return;

            // 检查距离
            const towerPos = towerNode.worldPosition;
            const supportPos = this.node.worldPosition;
            const distance = Vec3.distance(towerPos, supportPos);

            if (distance <= this.auraRadius) {
                newBuffedTowers.add(towerNode);
                this.applyBuff(towerNode);
            }
        });

        // 移除不再在范围内的塔的增益
        this.removeExpiredBuffs(newBuffedTowers);

        this.buffedTowers = newBuffedTowers;
    }

    // 查找所有塔（包括 Soldier 及其子类）
    private findAllTowers(node: Node, callback: (tower: Node) => void): void {
        // 检查当前节点是否是塔
        const soldierComp = node.getComponent(Soldier);
        if (soldierComp) {
            callback(node);
        }

        // 递归查找所有子节点
        for (let i = 0; i < node.children.length; i++) {
            this.findAllTowers(node.children[i], callback);
        }
    }

    // 应用增益效果
    private applyBuff(towerNode: Node): void {
        const soldierScript = towerNode.getComponent(Soldier) as any;
        if (!soldierScript) return;

        // 标记已增益（实际增益效果需要在 Soldier 类中实现）
        // 这里可以设置一个标志，Soldier 在计算最终属性时检查
        if (!soldierScript.hasSupportBuff) {
            soldierScript.hasSupportBuff = true;
            soldierScript.supportDamageBonus = this.auraDamageBonus;
            soldierScript.supportAttackSpeedBonus = this.auraAttackSpeedBonus;
            console.log(`${this.soldierName} 增益友军塔，伤害+${this.auraDamageBonus * 100}%，攻速+${this.auraAttackSpeedBonus * 100}%`);
        }
    }

    // 移除过期增益
    private removeExpiredBuffs(newBuffedTowers: Set<Node>): void {
        for (const towerNode of this.buffedTowers) {
            if (!newBuffedTowers.has(towerNode)) {
                const soldierScript = towerNode.getComponent(Soldier) as any;
                if (soldierScript && soldierScript.hasSupportBuff) {
                    soldierScript.hasSupportBuff = false;
                    soldierScript.supportDamageBonus = 0;
                    soldierScript.supportAttackSpeedBonus = 0;
                    console.log(`${this.soldierName} 移除友军塔增益`);
                }
            }
        }
    }

    // 重写攻击方法（支援塔攻击力弱）
    protected attack(): void {
        if (!this.currentTarget || !this.currentTarget.isValid) return;

        const enemyScript = this.currentTarget.getComponent('Enemy') as any;
        if (enemyScript && enemyScript.takeDamage) {
            const damage = this.getFinalDamage();
            enemyScript.takeDamage(damage);
            console.log(`${this.soldierName} 攻击敌人，造成 ${damage} 伤害`);

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
}