import { _decorator, Component, Node, color, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends Component {
    @property
    attackRange: number = 1000;      // 攻击范围（像素）

    @property
    attackCooldown: number = 0.5;     // 攻击间隔（秒）

    @property
    attackDamage: number = 3;       // 攻击力

    private currentCooldown: number = 0;
    private targetEnemy: Node = null;  // 当前锁定的敌人
    private graphics: Graphics = null;  // 用于绘制攻击范围

    start() {
        this.initGraphics();
    }

    update(deltaTime: number) {
        // 冷却时间倒计时
        if (this.currentCooldown > 0) {
            this.currentCooldown -= deltaTime;
        }

        // 寻找目标
        this.findTarget();

        // 如果有目标且冷却完成，攻击
        if (this.targetEnemy && this.currentCooldown <= 0) {
            this.attack();
            this.currentCooldown = this.attackCooldown;
        }

        this.drawAttackRange();
    }

    private initGraphics() {
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        // 设置线条样式
        this.graphics.lineWidth = 2;
        this.graphics.strokeColor = color(0, 255, 0, 150); // 半透明绿色
        this.graphics.fillColor = color(0, 255, 0, 30); // 更透明的绿色填充
    }

    private drawAttackRange() {
        if (!this.graphics) return;

        this.graphics.clear();
        this.graphics.circle(0, 0, this.attackRange);
        this.graphics.fill();
        this.graphics.stroke();
    }

    findTarget() {
        // 获取场景中所有敌人（通过节点名称查找）
        const canvas = this.node.parent;
        const enemies: Node[] = [];

        // 遍历 Canvas 下所有子节点，找到所有敌人节点
        // 注意：敌人在 EnemySpawner 下，需要递归查找
        this.findEnemies(canvas, enemies);

        // 筛选范围内的敌人
        let closestEnemy: Node = null;
        let closestDistance = this.attackRange + 1;

        for (const enemy of enemies) {
            const towerPos = this.node.worldPosition;
            const enemyPos = enemy.worldPosition;
            // 计算二维距离（忽略Z轴）
            const dx = enemyPos.x - towerPos.x;
            const dy = enemyPos.y - towerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.attackRange + 1e-3 && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        this.targetEnemy = closestEnemy;
    }

    findEnemies(node: Node, result: Node[]) {
        // 检查当前节点是否是敌人（通过组件判断）
        if (node.getComponent('Enemy')) {
            result.push(node);
        }
        // 递归查找子节点
        for (const child of node.children) {
            this.findEnemies(child, result);
        }
    }

    attack() {
        if (!this.targetEnemy) return;

        // 获取敌人的脚本组件并造成伤害
        const enemyScript = this.targetEnemy.getComponent('Enemy') as any;
        if (enemyScript && enemyScript.takeDamage) {
            enemyScript.takeDamage(this.attackDamage);
        }
    }

    // 可选：在编辑器中显示攻击范围（调试用）- 暂时注释
    // onDrawGizmos() {
    //     // 可视化攻击范围（仅编辑器）
    //     Gizmos.color = color(0, 255, 0, 100);  // 半透明绿色
    //     Gizmos.drawCircle(this.node.position, this.attackRange);
    // }
}