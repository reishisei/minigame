import { _decorator, tween, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('FlyingEnemy')
export class FlyingEnemy extends Enemy {
    @property
    public flightHeight: number = 100; // 飞行高度偏移

    start() {
        // 设置飞行敌人属性
        this.enemyType = 'flying';
        this.moveSpeed = 120;  // 中等速度
        this.maxHp = 4;        // 中等血量
        this.damageToWall = 1; // 对城墙伤害正常

        // 调整起始位置，增加飞行高度
        const currentX = this.node.position.x;
        this.node.setPosition(currentX, this.startY + this.flightHeight, 0);

        super.start();

        console.log(`飞行敌人生成，速度: ${this.moveSpeed}, 血量: ${this.maxHp}, 飞行高度: ${this.flightHeight}`);
    }

    // 重写移动方法，添加飞行效果
    moveDown() {
        const distance = this.startY - this.endY;
        const duration = distance / this.moveSpeed;
        const targetX = this.node.position.x;
        const targetY = this.endY + this.flightHeight; // 保持飞行高度到底部

        // 添加轻微的上下浮动效果
        this.currentTween = tween(this.node)
            .to(duration, { position: new Vec3(targetX, targetY, 0) })
            .call(() => {
                this.reachWall();
            })
            .start();

        // 添加浮动动画
        this.addFloatAnimation();
    }

    // 添加浮动动画
    private addFloatAnimation(): void {
        // 创建上下浮动的缓动效果
        const floatHeight = 20;
        const floatDuration = 0.8;

        const floatTween = tween(this.node)
            .by(floatDuration, { position: new Vec3(0, floatHeight, 0) })
            .by(floatDuration, { position: new Vec3(0, -floatHeight, 0) })
            .union()
            .repeatForever()
            .start();
    }
}