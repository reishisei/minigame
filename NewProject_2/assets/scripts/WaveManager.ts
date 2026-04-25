import { _decorator, Component, Prefab, instantiate, Label, ProgressBar } from 'cc';
import { GameManager } from './GameManager';
import { Wall } from './Wall';
import { LevelManager } from './LevelManager';
const { ccclass, property } = _decorator;

// 子波数据类（可在编辑器中配置）
@ccclass('SubwaveData')
export class SubwaveData {
    @property
    enemyType: string = "basic";  // "basic", "fast", "armored", "flying", "boss", "swarm"

    @property
    count: number = 1;

    @property
    spawnInterval: number = 0.5;  // 敌人之间的生成间隔（秒）

    @property
    delayAfter: number = 1.0;     // 子波后的延迟（秒）
}

// 波次配置类（可在编辑器中配置）
@ccclass('WaveConfig')
export class WaveConfig {
    @property
    name: string = "";

    @property({ type: [SubwaveData] })
    subwaves: SubwaveData[] = [];
}

// 波次数据接口（内部使用）
interface WaveData {
    name: string;
    subwaves: SubwaveData[];
}

@ccclass('WaveManager')
export class WaveManager extends Component {
    // 单例实例
    private static _instance: WaveManager = null;
    public static get instance(): WaveManager {
        return this._instance;
    }

    // 敌人预制体
    @property(Prefab)
    public basicEnemyPrefab: Prefab = null;

    @property(Prefab)
    public fastEnemyPrefab: Prefab = null;

    @property(Prefab)
    public armoredEnemyPrefab: Prefab = null;

    @property(Prefab)
    public flyingEnemyPrefab: Prefab = null;

    @property(Prefab)
    public bossEnemyPrefab: Prefab = null;

    @property(Prefab)
    public swarmEnemyPrefab: Prefab = null;

    // 波次配置
    @property({ type: [WaveConfig] })
    public waveConfigs: WaveConfig[] = [];

    // UI 引用
    @property(Label)
    public waveInfoLabel: Label = null;

    @property(Label)
    public enemyCountLabel: Label = null;

    @property(ProgressBar)
    public waveProgressBar: ProgressBar = null;

    // 当前波次状态
    private currentWaveIndex: number = 0;
    private currentWave: WaveData | null = null;
    private currentSubwaveIndex: number = 0;
    private enemiesRemaining: number = 0;
    private totalEnemiesInWave: number = 0;
    private isWaveActive: boolean = false;
    private isBetweenWaves: boolean = false;
    private betweenWaveTimer: number = 0;
    private spawnTimer: number = 0;

    // 敌人池
    private activeEnemies: Set<any> = new Set();

    start() {
        WaveManager._instance = this;

        // 如果没有配置，创建默认配置
        if (this.waveConfigs.length === 0) {
            this.createDefaultWaveConfigs();
        }

        // 开始第一波
        this.startNextWave();

        console.log("WaveManager 初始化完成");
    }

    update(deltaTime: number) {
        // 游戏暂停时不更新
        if (GameManager.instance?.isGamePaused) {
            return;
        }

        // 波次间休息
        if (this.isBetweenWaves) {
            this.betweenWaveTimer -= deltaTime;
            if (this.betweenWaveTimer <= 0) {
                this.isBetweenWaves = false;
                this.startNextWave();
            }
            this.updateWaveUI();
            return;
        }

        // 波次进行中
        if (this.isWaveActive && this.currentWave) {
            // 更新生成计时器
            this.spawnTimer -= deltaTime;

            // 检查是否需要生成敌人
            if (this.spawnTimer <= 0 && this.currentSubwaveIndex < this.currentWave.subwaves.length) {
                const subwave = this.currentWave.subwaves[this.currentSubwaveIndex];
                this.spawnSubwave(subwave);
                this.currentSubwaveIndex++;

                // 设置下一个生成计时器
                if (this.currentSubwaveIndex < this.currentWave.subwaves.length) {
                    this.spawnTimer = this.currentWave.subwaves[this.currentSubwaveIndex].delayAfter;
                }
            }

            // 检查波次是否完成
            if (this.currentSubwaveIndex >= this.currentWave.subwaves.length && this.enemiesRemaining <= 0) {
                this.completeCurrentWave();
            }

            this.updateWaveUI();
        }
    }

    // 开始下一波
    public startNextWave(): void {
        if (this.currentWaveIndex >= this.waveConfigs.length) {
            console.log("所有波次已完成！");
            // TODO: 关卡完成
            return;
        }

        const config = this.waveConfigs[this.currentWaveIndex];
        this.currentWave = this.createWaveData(config);
        this.currentSubwaveIndex = 0;
        this.enemiesRemaining = this.calculateTotalEnemies(this.currentWave);
        this.totalEnemiesInWave = this.enemiesRemaining;
        this.isWaveActive = true;
        this.isBetweenWaves = false;
        this.spawnTimer = 0; // 立即开始第一个子波

        console.log(`开始波次 ${this.currentWaveIndex + 1}: ${config.name}`);

        // 触发波次开始事件
        const gm = GameManager.instance;
        if (gm) {
            gm.waveStarted(this.currentWaveIndex + 1);
        }

        this.updateWaveUI();
    }

    // 生成子波
    private spawnSubwave(subwave: SubwaveData): void {
        console.log(`生成子波: ${subwave.enemyType} × ${subwave.count}`);

        for (let i = 0; i < subwave.count; i++) {
            this.scheduleOnce(() => {
                this.spawnEnemy(subwave.enemyType);
            }, i * subwave.spawnInterval);
        }
    }

    // 生成单个敌人
    private spawnEnemy(enemyType: string): void {
        let prefab: Prefab | null = null;

        // 统一转为小写，避免配置大小写不一致导致无法匹配
        enemyType = enemyType.toLowerCase();

        switch (enemyType) {
            case "basic":
                prefab = this.basicEnemyPrefab;
                break;
            case "fast":
                prefab = this.fastEnemyPrefab;
                break;
            case "armored":
                prefab = this.armoredEnemyPrefab;
                break;
            case "flying":
                prefab = this.flyingEnemyPrefab;
                break;
            case "boss":
                prefab = this.bossEnemyPrefab;
                break;
            case "swarm":
                prefab = this.swarmEnemyPrefab;
                break;
            default:
                prefab = this.basicEnemyPrefab;
        }

        if (!prefab) {
            console.warn(`敌人预制体未设置: ${enemyType}`);
            return;
        }

        const enemy = instantiate(prefab);
        this.node.addChild(enemy);

        // 随机X位置
        const spawnRangeX = 375; // 与 EnemySpawner 一致
        const randomX = Math.random() * spawnRangeX * 2 - spawnRangeX;
        enemy.setPosition(randomX, 500, 0);

        // 注册敌人死亡回调
        const enemyScript = enemy.getComponent('Enemy') as any;
        if (enemyScript) {
            // 设置敌人类型
            enemyScript.enemyType = enemyType;

            const originalDie = enemyScript.die;
            enemyScript.die = () => {
                this.onEnemyDied(enemy);
                if (originalDie) {
                    originalDie.call(enemyScript);
                }
            };
        }

        this.activeEnemies.add(enemy);
        console.log(`生成敌人: ${enemyType}`);
    }

    // 敌人死亡回调
    private onEnemyDied(enemyNode?: any): void {
        this.enemiesRemaining--;
        this.updateWaveUI();

        if (this.enemiesRemaining < 0) {
            this.enemiesRemaining = 0;
        }

        // 从活动敌人集合中移除
        if (enemyNode && this.activeEnemies.has(enemyNode)) {
            this.activeEnemies.delete(enemyNode);
        }

        console.log(`敌人死亡，剩余: ${this.enemiesRemaining}`);
    }

    // 完成当前波次
    private completeCurrentWave(): void {
        this.isWaveActive = false;
        this.currentWaveIndex++;

        // 检查城墙是否存活
        const wall = this.getWallComponent();
        if (wall && !wall.isAlive()) {
            console.log("城墙已被摧毁，游戏结束！");
            // 触发游戏结束事件
            const gm = GameManager.instance;
            if (gm) {
                gm.gameOver(false);
            }
            return;
        }

        // 波次间休息时间
        this.isBetweenWaves = true;
        this.betweenWaveTimer = 5; // 5秒休息

        // 奖励金币并触发波次完成事件
        const gm = GameManager.instance;
        if (gm) {
            const bonusGold = 50 + this.currentWaveIndex * 10;
            gm.addGold(bonusGold);
            console.log(`波次完成奖励: ${bonusGold} 金币`);

            gm.waveCompleted(this.currentWaveIndex);
        }

        console.log(`波次 ${this.currentWaveIndex} 完成！`);

        // 如果所有波次完成，触发关卡完成
        if (this.currentWaveIndex >= this.waveConfigs.length) {
            this.completeAllWaves();
        }
    }

    // 完成所有波次
    private completeAllWaves(): void {
        console.log("所有波次已完成！");

        // 检查城墙是否存活
        const wall = this.getWallComponent();
        if (wall && !wall.isAlive()) {
            console.log("城墙已被摧毁，游戏结束！");
            // 触发游戏结束事件
            const gm = GameManager.instance;
            if (gm) {
                gm.gameOver(false);
            }
            return;
        }

        console.log("关卡胜利！");

        // 触发关卡完成事件
        const gm = GameManager.instance;
        if (gm) {
            // 计算得分（基于剩余城墙血量、波次完成情况等）
            const score = this.calculateLevelScore();
            const stars = this.calculateStars(score);
            gm.levelCompleted(LevelManager.instance?.currentLevelId || 1, score, stars);
        }
    }

    // 计算关卡得分
    private calculateLevelScore(): number {
        let score = 1000; // 基础分

        // 基于剩余城墙血量加分
        const wall = this.getWallComponent();
        if (wall && wall.isAlive()) {
            const hpPercentage = wall.getCurrentHp() / wall.maxHp;
            score += Math.floor(hpPercentage * 500); // 最多加500分
        }

        // 基于波次完成速度加分（假设有计时器）
        // 这里可以添加基于完成时间的加分

        // 基于击杀效率加分（总敌人数量 vs 到达城墙的敌人数量）
        // 这里可以添加更复杂的逻辑

        console.log(`关卡得分计算: ${score}`);
        return score;
    }

    // 计算星星数量（基于得分）
    private calculateStars(score: number): number {
        if (score >= 1500) {
            return 3;
        } else if (score >= 1200) {
            return 2;
        } else if (score >= 1000) {
            return 1;
        }
        return 0;
    }

    // 更新UI
    private updateWaveUI(): void {
        if (!this.waveInfoLabel && !this.enemyCountLabel && !this.waveProgressBar) {
            return;
        }

        if (this.waveInfoLabel) {
            if (this.isBetweenWaves) {
                this.waveInfoLabel.string = `波次间休息: ${Math.ceil(this.betweenWaveTimer)}秒`;
            } else if (this.currentWave) {
                const totalWaves = this.waveConfigs.length;
                this.waveInfoLabel.string = `波次 ${this.currentWaveIndex + 1}/${totalWaves}`;
            }
        }

        if (this.enemyCountLabel) {
            this.enemyCountLabel.string = `剩余敌人: ${this.enemiesRemaining}`;
        }

        if (this.waveProgressBar) {
            if (this.totalEnemiesInWave > 0) {
                const progress = 1 - (this.enemiesRemaining / this.totalEnemiesInWave);
                this.waveProgressBar.progress = progress;
            }
        }
    }

    // 计算波次总敌人数量
    private calculateTotalEnemies(wave: WaveData): number {
        let total = 0;
        for (const subwave of wave.subwaves) {
            total += subwave.count;
        }
        return total;
    }

    // 创建默认波次配置
    private createDefaultWaveConfigs(): void {
        this.waveConfigs = [
            {
                name: "训练波",
                subwaves: [
                    { enemyType: "basic", count: 5, spawnInterval: 0.5, delayAfter: 3 }
                ]
            },
            {
                name: "快速敌人波",
                subwaves: [
                    { enemyType: "basic", count: 3, spawnInterval: 0.8, delayAfter: 2 },
                    { enemyType: "fast", count: 3, spawnInterval: 0.5, delayAfter: 4 }
                ]
            },
            {
                name: "混合波",
                subwaves: [
                    { enemyType: "basic", count: 5, spawnInterval: 0.7, delayAfter: 2 },
                    { enemyType: "armored", count: 2, spawnInterval: 1.0, delayAfter: 3 },
                    { enemyType: "fast", count: 4, spawnInterval: 0.4, delayAfter: 0 }
                ]
            }
        ];
    }

    // 从配置创建波次数据
    private createWaveData(config: WaveConfig): WaveData {
        return {
            name: config.name,
            subwaves: [...config.subwaves]
        };
    }

    // 获取当前波次信息
    public getCurrentWaveInfo(): string {
        if (!this.currentWave) return "无活跃波次";

        const totalWaves = this.waveConfigs.length;
        return `波次 ${this.currentWaveIndex + 1}/${totalWaves}: ${this.currentWave.name}\n剩余敌人: ${this.enemiesRemaining}`;
    }

    // 跳过波次间等待（调试用）
    public skipBetweenWaveWait(): void {
        if (this.isBetweenWaves) {
            this.betweenWaveTimer = 0;
        }
    }

    // 重置波次管理器
    public reset(): void {
        this.currentWaveIndex = 0;
        this.currentWave = null;
        this.currentSubwaveIndex = 0;
        this.enemiesRemaining = 0;
        this.totalEnemiesInWave = 0;
        this.isWaveActive = false;
        this.isBetweenWaves = false;
        this.betweenWaveTimer = 0;
        this.spawnTimer = 0;

        // 清理所有敌人
        for (const enemy of this.activeEnemies) {
            if (enemy && enemy.isValid) {
                enemy.destroy();
            }
        }
        this.activeEnemies.clear();

        console.log("WaveManager 已重置");
    }

    // 获取城墙组件
    private getWallComponent(): Wall | null {
        // 在场景中查找城墙节点
        const wallNode = this.node.scene.getChildByName('Wall');
        if (!wallNode) {
            console.warn("未找到城墙节点");
            return null;
        }

        const wall = wallNode.getComponent(Wall);
        if (!wall) {
            console.warn("城墙节点上没有Wall组件");
            return null;
        }

        return wall;
    }
}