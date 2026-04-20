import { _decorator, Component, Prefab, instantiate, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab)
    enemyPrefab: Prefab = null;

    @property
    spawnInterval: number = 1.0;

    @property
    spawnRangeX: number = 375;

    start() {
        console.log("EnemySpawner 父节点位置:", this.node.position.x);
        this.schedule(this.spawnEnemy, this.spawnInterval);
    }

    spawnEnemy() {
        if (!this.enemyPrefab) return;

        const enemy = instantiate(this.enemyPrefab);
        this.node.addChild(enemy);

        const randomX = randomRangeInt(-this.spawnRangeX, this.spawnRangeX);
        enemy.setPosition(randomX, 500, 0);
    }
}