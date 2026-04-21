import { _decorator, Component, Vec3, tween, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property
    moveSpeed: number = 100;

    @property
    damageToWall: number = 1;
    
    @property
    maxHp: number = 3;  // 敌人血量

    @property
    enemyType: string = 'basic';  // 敌人类型: basic, fast, armored, flying, boss, swarm

    // 减速效果属性
    private originalSpeed: number = 100;
    private slowMultiplier: number = 1.0;
    private slowTimer: number = 0;

    private startY: number = 500;
    private endY: number = -300;
    private currentHp: number = 0;
    private isMoving: boolean = true;
    private currentTween: any = null;

    start() {
        // 保留已有的X坐标，只设置Y坐标
        const currentX = this.node.position.x;
        this.node.setPosition(currentX, this.startY, 0);
        this.currentHp = this.maxHp;
        this.moveDown();
        console.log(`敌人生成，位置: (${currentX}, ${this.startY})，血量: ${this.currentHp}`);
    }

    moveDown() {
        const distance = this.startY - this.endY;
        const duration = distance / this.moveSpeed;
        const targetX = this.node.position.x;

        this.currentTween = tween(this.node)
            .to(duration, { position: new Vec3(targetX, this.endY, 0) })
            .call(() => {
                this.reachWall();
            })
            .start();
    }

    // 受到攻击
    public takeDamage(damage: number) {
        this.currentHp -= damage;
        console.log(`敌人受到 ${damage} 伤害，剩余血量: ${this.currentHp}/${this.maxHp}`);
        
        // 受伤效果（闪烁）
        this.playHitEffect();
        
        if (this.currentHp <= 0) {
            this.die();
        }
    }

    // 受伤特效
    playHitEffect() {
        const sprite = this.node.getComponent('Sprite') as any;
        if (sprite) {
            const originalColor = sprite.color;
            sprite.color = { r: 255, g: 0, b: 0, a: 255 };
            setTimeout(() => {
                if (sprite && sprite.isValid) {
                    sprite.color = originalColor;
                }
            }, 100);
        }
    }

    reachWall() {
        if (!this.isMoving) return;
        this.isMoving = false;
        
        // 停止移动动画
        if (this.currentTween) {
            this.currentTween.stop();
        }
        
        console.log("敌人到达城墙");
        
        // 找到城墙并造成伤害
        const wall = this.node.scene.getComponentInChildren('Wall') as any;
        if (wall && wall.takeDamage) {
            wall.takeDamage(this.damageToWall);
        } else {
            console.log("未找到城墙组件");
        }
        
        // 销毁自己
        this.node.destroy();
    }

    die() {
        console.log("敌人死亡");

        // 使用新的奖励系统
        const gm = GameManager.instance;
        if (gm) {
            gm.enemyKilled(this.enemyType);
        } else {
            console.log("GameManager 未找到");
        }

        // 停止移动动画
        if (this.currentTween) {
            this.currentTween.stop();
        }

        this.node.destroy();
    }
    
    // 停止移动（用于暂停）
    public pauseMove() {
        if (this.currentTween) {
            this.currentTween.stop();
        }
        this.isMoving = false;
    }
    
    // 恢复移动（用于恢复）
    public resumeMove() {
        if (!this.isMoving && this.node.isValid) {
            this.isMoving = true;
            this.moveDown();
        }
    }
    
    onDestroy() {
        if (this.currentTween) {
            this.currentTween.stop();
        }
    }
}