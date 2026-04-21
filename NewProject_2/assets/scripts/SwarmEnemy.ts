import { _decorator, Node, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('SwarmEnemy')
export class SwarmEnemy extends Enemy {
    @property
    public swarmSize: number = 1; // 群体大小（实际是单个，但可能生成多个）

    @property
    public splitChance: number = 0.2; // 分裂几率

    start() {
        // 设置群体敌人属性
        this.enemyType = 'swarm';
        this.moveSpeed = 140;   // 较快
        this.maxHp = 1;         // 非常低血量
        this.damageToWall = 0.5; // 对城墙伤害很低

        // 缩小尺寸
        this.node.setScale(0.7, 0.7, 1);

        super.start();

        console.log(`群体敌人生成，速度: ${this.moveSpeed}, 血量: ${this.maxHp}, 群体大小: ${this.swarmSize}`);
    }

    // 重写受伤方法，可能分裂
    public takeDamage(damage: number): void {
        super.takeDamage(damage);

        // 检查是否死亡
        if (this.currentHp <= 0) {
            // 死亡时可能分裂成更小的敌人
            this.trySplitOnDeath();
        }
    }

    // 死亡时尝试分裂
    private trySplitOnDeath(): void {
        if (Math.random() < this.splitChance && this.swarmSize > 1) {
            console.log('群体敌人分裂！');
            // 在实际实现中，这里应该生成更小的敌人
            // 暂时只记录日志
        }
    }

    // 重写移动方法，添加群体行为
    moveDown() {
        const distance = this.startY - this.endY;
        const duration = distance / this.moveSpeed;
        const targetX = this.node.position.x;

        // 添加轻微的随机偏移，模拟群体行为
        const randomOffset = (Math.random() - 0.5) * 30; // ±15像素随机偏移

        this.currentTween = tween(this.node)
            .to(duration, { position: new Vec3(targetX + randomOffset, this.endY, 0) })
            .call(() => {
                this.reachWall();
            })
            .start();
    }
}