import { _decorator, Node, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('BossEnemy')
export class BossEnemy extends Enemy {
    @property
    public bossScale: number = 1.5; // Boss 尺寸放大

    @property
    public minionSpawnChance: number = 0.3; // 生成小兵几率

    @property
    public minionSpawnInterval: number = 5.0; // 生成小兵间隔

    private minionSpawnTimer: number = 0;

    start() {
        // 设置Boss敌人属性
        this.enemyType = 'boss';
        this.moveSpeed = 40;    // 非常慢
        this.maxHp = 50;        // 非常高血量
        this.damageToWall = 5;  // 对城墙伤害很高

        // 放大Boss尺寸
        this.node.setScale(this.bossScale, this.bossScale, 1);

        super.start();

        this.minionSpawnTimer = this.minionSpawnInterval;

        console.log(`Boss敌人生成，速度: ${this.moveSpeed}, 血量: ${this.maxHp}, 尺寸: ${this.bossScale}x`);
    }

    update(deltaTime: number) {
        super.update?.();

        // 更新小兵生成计时器
        this.minionSpawnTimer -= deltaTime;
        if (this.minionSpawnTimer <= 0) {
            this.trySpawnMinions();
            this.minionSpawnTimer = this.minionSpawnInterval;
        }
    }

    // 尝试生成小兵
    private trySpawnMinions(): void {
        if (Math.random() < this.minionSpawnChance) {
            this.spawnMinions();
        }
    }

    // 生成小兵
    private spawnMinions(): void {
        console.log('Boss生成小兵！');
        // 在实际实现中，这里应该生成小兵敌人
        // 暂时只记录日志
    }

    // 重写受伤方法，添加Boss特效
    public takeDamage(damage: number): void {
        super.takeDamage(damage);

        // Boss受伤时可能有特殊效果
        if (this.currentHp < this.maxHp * 0.3) {
            console.log('Boss进入狂暴状态！');
            // 血量低于30%时可能触发狂暴效果
        }
    }

    // 重写死亡方法，添加Boss死亡特效
    die() {
        console.log('Boss被击败！');
        // 这里可以添加Boss死亡特效
        super.die();
    }
}