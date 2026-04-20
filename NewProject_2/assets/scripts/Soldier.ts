import { _decorator, Component, Node, Sprite, Color, Vec3, tween, Label, Graphics } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Soldier')
export class Soldier extends Component {
    // ========== 基础属性 ==========
    @property
    public soldierName: string = "士兵";
    
    @property
    public baseDamage: number = 10;
    
    @property
    public baseAttackSpeed: number = 1.0;  // 攻击间隔（秒）
    
    @property
    public baseRange: number = 200;
    
    @property
    public baseMaxHp: number = 50;
    
    @property
    public buyCost: number = 100;
    @property
    public upgradeCost: number = 80;
    
    // ========== 攻击轨迹设置 ==========
    @property
    public showAttackLine: boolean = true;  // 是否显示攻击线
    
    @property
    public showAttackParticle: boolean = true;  // 是否显示攻击粒子
    
    @property(Color)
    public attackLineColor: Color = new Color(255, 255, 0, 255);  // 黄色线条
    
    @property
    public attackLineWidth: number = 3;  // 线条宽度
    
    // ========== 升级属性 ==========
    private level: number = 1;
    private upgradeDamageBonus: number = 0;      // 每级+5伤害
    private upgradeAttackSpeedBonus: number = 0; // 每级+10%攻速
    
    // ========== 运行时属性 ==========
    private currentHp: number = 0;
    private attackTimer: number = 0;
    private currentTarget: Node = null;
    
    // ========== UI 组件 ==========
    @property(Sprite)
    public sprite: Sprite = null;
    
    @property(Label)
    public levelLabel: Label = null;  // 等级文字（可选）
    
    start() {
        // 安全检查：自动获取 Sprite 组件
        if (!this.sprite) {
            this.sprite = this.node.getComponent(Sprite);
            if (!this.sprite) {
                console.warn(`${this.soldierName} 没有 Sprite 组件，尝试添加`);
                this.sprite = this.node.addComponent(Sprite);
            }
        }
        
        this.currentHp = this.getFinalMaxHp();
        this.attackTimer = 0;
        this.updateVisual();
        this.updateLevelLabel();
        console.log(`${this.soldierName} 已创建，位置: ${this.node.position}, 范围: ${this.baseRange}, 伤害: ${this.getFinalDamage()}`);
    }
    
    update(deltaTime: number) {
        // 游戏暂停时不攻击
        if (GameManager.instance?.isGamePaused) {
            return;
        }
        
        // 攻击冷却倒计时
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        
        // 寻找目标
        this.findTarget();
        
        // 如果有目标且冷却完成，攻击
        if (this.currentTarget && this.currentTarget.isValid && this.attackTimer <= 0) {
            this.attack();
            this.attackTimer = this.getFinalAttackSpeed();
        }
    }
    
    // ========== 属性计算（基础 × 全局倍率 + 升级加成） ==========
    
    getFinalDamage(): number {
        const bonus = GameManager.instance?.damageBonus || 1;
        return (this.baseDamage + this.upgradeDamageBonus) * bonus;
    }
    
    getFinalAttackSpeed(): number {
        const bonus = GameManager.instance?.attackSpeedBonus || 1;
        // 攻速：值越小攻击越快，升级加成减少间隔
        return (this.baseAttackSpeed / (1 + this.upgradeAttackSpeedBonus)) / bonus;
    }
    
    getFinalRange(): number {
        const bonus = GameManager.instance?.rangeBonus || 1;
        return this.baseRange * bonus;
    }
    
    getFinalMaxHp(): number {
        return this.baseMaxHp;
    }
    
    // ========== 目标查找 ==========
    
    findTarget() {
        // 从场景根节点查找所有敌人
        const scene = this.node.scene;
        if (!scene) return;

        let closestEnemy: Node = null;
        let closestDistance = this.getFinalRange() + 1;
        const soldierPos = this.node.worldPosition;

        this.findAllEnemies(scene, (enemyNode) => {
            // 检查敌人是否有效
            if (!enemyNode || !enemyNode.isValid) return;

            const enemyPos = enemyNode.worldPosition;
            // 只攻击上方的敌人（Y坐标大于士兵）
            if (enemyPos.y <= soldierPos.y) return;

            // 计算距离
            const distance = Vec3.distance(soldierPos, enemyPos);

            // 如果在攻击范围内且比当前目标更近
            if (distance <= this.getFinalRange() && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemyNode;
            }
        });

        this.currentTarget = closestEnemy;
    }
    
    findAllEnemies(node: Node, callback: (enemy: Node) => void) {
        // 检查当前节点是否是敌人
        const enemyComp = node.getComponent('Enemy');
        if (enemyComp) {
            callback(node);
        }
        // 递归查找所有子节点
        for (let i = 0; i < node.children.length; i++) {
            this.findAllEnemies(node.children[i], callback);
        }
    }
    
    // ========== 攻击 ==========
    
    attack() {
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
    
    // 攻击特效（缩放 + 颜色闪烁）
    playAttackEffect() {
        if (!this.sprite) return;
        
        // 缩放效果
        tween(this.sprite.node)
            .to(0.08, { scale: new Vec3(1.5, 1.5, 1) })
            .to(0.08, { scale: new Vec3(1, 1, 1) })
            .start();
        
        // 颜色闪烁
        const originalColor = this.sprite.color.clone();
        tween(this.sprite)
            .to(0.05, { color: new Color(255, 255, 255, 255) })
            .to(0.05, { color: originalColor })
            .start();
    }
    
    // 攻击轨迹线（Graphics 绘制）
    showAttackLineEffect() {
        if (!this.currentTarget || !this.currentTarget.isValid || !this.node.parent) return;

        // 创建临时线条节点
        const lineNode = new Node("AttackLine");
        lineNode.setParent(this.node.parent);

        // 添加 Graphics 组件用于绘制线条
        const graphics = lineNode.addComponent(Graphics);

        // 获取起点和终点的世界坐标
        const startWorldPos = this.node.worldPosition;
        const endWorldPos = this.currentTarget.worldPosition;

        // 转换为父节点的局部坐标
        const parentNode = this.node.parent;
        const startLocalPos = new Vec3();
        const endLocalPos = new Vec3();
        parentNode.inverseTransformPoint(startLocalPos, startWorldPos);
        parentNode.inverseTransformPoint(endLocalPos, endWorldPos);

        // 绘制线条（使用局部坐标）
        graphics.lineWidth = this.attackLineWidth;
        graphics.strokeColor = this.attackLineColor;
        graphics.moveTo(startLocalPos.x, startLocalPos.y);
        graphics.lineTo(endLocalPos.x, endLocalPos.y);
        graphics.stroke();

        // 0.15 秒后消失
        this.scheduleOnce(() => {
            if (lineNode && lineNode.isValid) {
                lineNode.destroy();
            }
        }, 0.15);
    }
    
    // 攻击粒子（飞向目标）
    showAttackParticleEffect() {
        if (!this.currentTarget || !this.currentTarget.isValid || !this.node.parent) return;

        // 创建粒子节点
        const particleNode = new Node("AttackParticle");
        particleNode.setParent(this.node.parent);

        // 设置粒子位置（使用世界坐标转换到父节点局部坐标）
        const startWorldPos = this.node.worldPosition;
        const parentNode = this.node.parent;
        const startLocalPos = new Vec3();
        parentNode.inverseTransformPoint(startLocalPos, startWorldPos);
        particleNode.setPosition(startLocalPos);

        // 添加 Sprite 作为粒子
        const sprite = particleNode.addComponent(Sprite);
        if (sprite) {
            sprite.color = this.attackLineColor;
        }

        // 向目标移动（使用目标的世界坐标转换到父节点局部坐标）
        const endWorldPos = this.currentTarget.worldPosition;
        const endLocalPos = new Vec3();
        parentNode.inverseTransformPoint(endLocalPos, endWorldPos);

        const distance = Vec3.distance(startLocalPos, endLocalPos);
        const duration = Math.max(0.05, distance / 600);  // 飞行速度 600/秒

        tween(particleNode)
            .to(duration, { position: endLocalPos })
            .call(() => {
                if (particleNode && particleNode.isValid) {
                    particleNode.destroy();
                }
            })
            .start();
        
        // 同时缩小
        tween(particleNode)
            .to(duration, { scale: new Vec3(0.3, 0.3, 1) })
            .start();
    }
    
    // ========== 受伤与死亡 ==========
    
    public takeDamage(damage: number) {
        this.currentHp -= damage;
        console.log(`${this.soldierName} 受到 ${damage} 伤害，剩余血量: ${this.currentHp}/${this.getFinalMaxHp()}`);
        
        // 受伤闪烁
        this.playHitEffect();
        
        if (this.currentHp <= 0) {
            this.die();
        }
    }
    
    // 受伤特效（闪烁）
    playHitEffect() {
        if (!this.sprite) return;
        
        const originalColor = this.sprite.color.clone();
        tween(this.sprite)
            .to(0.05, { color: new Color(255, 0, 0, 255) })
            .to(0.05, { color: originalColor })
            .start();
    }
    
    die() {
        console.log(`${this.soldierName} 阵亡`);
        this.node.destroy();
    }
    
    // ========== 升级 ==========
    
    public upgrade(): boolean {
        const gm = GameManager.instance;
        if (!gm || !gm.spendGold(this.upgradeCost)) {
            console.log("升级失败：金币不足");
            return false;
        }
        
        this.level++;
        this.upgradeDamageBonus += 5;       // 每级+5伤害
        this.upgradeAttackSpeedBonus += 0.1; // 每级+10%攻速
        
        console.log(`${this.soldierName} 升级到 ${this.level} 级！伤害+5，攻速+10%`);
        this.updateVisual();
        this.updateLevelLabel();
        return true;
    }
    
    // ========== UI 更新 ==========
    
    updateVisual() {
        if (!this.sprite) return;
        // 等级越高颜色越亮
        const brightness = 0.5 + this.level * 0.1;
        this.sprite.color = new Color(255 * brightness, 255 * brightness, 255, 255);
    }
    
    updateLevelLabel() {
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${this.level}`;
        }
    }
    
    // ========== 信息获取 ==========
    
    public getInfo(): string {
        return `${this.soldierName} Lv.${this.level}
伤害: ${this.getFinalDamage().toFixed(1)}
攻速: ${(1/this.getFinalAttackSpeed()).toFixed(1)}次/秒
射程: ${this.getFinalRange().toFixed(0)}`;
    }
    
    public getLevel(): number {
        return this.level;
    }
}