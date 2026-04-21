import { _decorator, Component, Prefab, instantiate, Label, ProgressBar } from 'cc';
import { GameManager } from './GameManager';
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
                this.onEnemyDied();
                if (originalDie) {
                    originalDie.call(enemyScript);
                }
            };
        }

        this.activeEnemies.add(enemy);
        console.log(`生成敌人: ${enemyType}`);
    }

    // 敌人死亡回调
    private onEnemyDied(): void {
        this.enemiesRemaining--;
        this.updateWaveUI();

        if (this.enemiesRemaining < 0) {
            this.enemiesRemaining = 0;
        }

        console.log(`敌人死亡，剩余: ${this.enemiesRemaining}`);
    }

    // 完成当前波次
    private completeCurrentWave(): void {
        this.isWaveActive = false;
        this.currentWaveIndex++;

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
        console.log("所有波次已完成！关卡胜利！");
        // TODO: 触发关卡完成事件
        // LevelManager.instance.completeCurrentLevel(1000, 3);
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
}