import { _decorator, Component, director, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    // 单例实例
    private static _instance: LevelManager = null;
    public static get instance(): LevelManager {
        return this._instance;
    }

    // 当前关卡信息（可在编辑器中配置）
    @property
    public currentLevelId: number = 1;

    @property
    public maxUnlockedLevel: number = 1;

    // 关卡数据存储
    private levelData: Map<number, LevelData> = new Map();

    // 关卡完成状态
    private levelCompletion: Map<number, LevelCompletion> = new Map();

    start() {
        LevelManager._instance = this;
        this.loadLevelData();
        this.loadLevelProgress();
        console.log("LevelManager 初始化完成");
    }

    // 设置当前关卡ID
    public setCurrentLevel(levelId: number): boolean {
        if (levelId <= 0 || levelId > this.maxUnlockedLevel) {
            console.warn(`关卡 ${levelId} 未解锁或无效`);
            return false;
        }
        this.currentLevelId = levelId;
        console.log(`当前关卡设置为: ${levelId}`);
        return true;
    }

    // 解锁下一关
    public unlockNextLevel(): boolean {
        const nextLevel = this.maxUnlockedLevel + 1;
        if (nextLevel <= this.getTotalLevels()) {
            this.maxUnlockedLevel = nextLevel;
            this.saveLevelProgress();
            console.log(`解锁关卡: ${nextLevel}`);
            return true;
        }
        return false;
    }

    // 完成当前关卡
    public completeCurrentLevel(score: number, stars: number = 1): boolean {
        const levelId = this.currentLevelId;

        // 更新完成状态
        const completion: LevelCompletion = {
            levelId: levelId,
            completed: true,
            score: score,
            stars: stars,
            bestScore: Math.max(score, this.getLevelBestScore(levelId))
        };

        this.levelCompletion.set(levelId, completion);

        // 解锁下一关
        if (levelId === this.maxUnlockedLevel) {
            this.unlockNextLevel();
        }

        this.saveLevelProgress();
        console.log(`关卡 ${levelId} 完成，得分: ${score}, 星星: ${stars}`);
        return true;
    }

    // 获取关卡完成状态
    public getLevelCompletion(levelId: number): LevelCompletion | null {
        return this.levelCompletion.get(levelId) || null;
    }

    // 获取关卡最高分
    public getLevelBestScore(levelId: number): number {
        const completion = this.levelCompletion.get(levelId);
        return completion ? completion.bestScore : 0;
    }

    // 获取关卡星星数
    public getLevelStars(levelId: number): number {
        const completion = this.levelCompletion.get(levelId);
        return completion ? completion.stars : 0;
    }

    // 加载关卡配置数据
    private loadLevelData(): void {
        // 尝试从JSON文件加载关卡配置
        try {
            // 使用resources.load加载JSON文件
            resources.load('data/levels', (err: any, data: any) => {
                if (err) {
                    console.warn("从JSON文件加载关卡配置失败，使用硬编码数据:", err);
                    this.loadHardcodedLevels();
                    return;
                }

                // 解析JSON数据
                const jsonData = data.json || data;
                const levels: LevelData[] = jsonData;

                // 将关卡数据存入Map
                for (const level of levels) {
                    this.levelData.set(level.id, level);
                }

                console.log(`从JSON文件加载了 ${levels.length} 个关卡配置`);
                this.validateProgress();
            });
        } catch (error) {
            console.warn("加载关卡配置失败，使用硬编码数据:", error);
            this.loadHardcodedLevels();
        }
    }

    // 加载硬编码关卡数据（备用）
    private loadHardcodedLevels(): void {
        const hardcodedLevels: LevelData[] = [
            {
                id: 1,
                name: "训练关",
                description: "学习基础操作，熟悉游戏机制",
                difficulty: 1,
                initialGold: 100,
                waveCount: 3,
                unlockRequirement: null,
                enemyTypes: ["basic"],
                maxTowers: 3
            },
            {
                id: 2,
                name: "森林关卡",
                description: "对抗快速敌人，需要更快的反应",
                difficulty: 2,
                initialGold: 150,
                waveCount: 5,
                unlockRequirement: "complete_level_1",
                enemyTypes: ["basic", "fast"],
                maxTowers: 4
            },
            {
                id: 3,
                name: "山地关卡",
                description: "面对装甲敌人，需要更强的火力",
                difficulty: 3,
                initialGold: 200,
                waveCount: 6,
                unlockRequirement: "complete_level_2",
                enemyTypes: ["basic", "fast", "armored"],
                maxTowers: 5
            },
            {
                id: 4,
                name: "天空关卡",
                description: "飞行敌人来袭，需要防空塔",
                difficulty: 4,
                initialGold: 250,
                waveCount: 7,
                unlockRequirement: "complete_level_3",
                enemyTypes: ["basic", "fast", "flying"],
                maxTowers: 6
            },
            {
                id: 5,
                name: "Boss关卡",
                description: "最终Boss战，考验你的策略",
                difficulty: 5,
                initialGold: 300,
                waveCount: 8,
                unlockRequirement: "complete_level_4",
                enemyTypes: ["basic", "fast", "armored", "flying", "boss"],
                maxTowers: 7
            }
        ];

        // 将关卡数据存入Map
        for (const level of hardcodedLevels) {
            this.levelData.set(level.id, level);
        }

        console.log(`加载了 ${hardcodedLevels.length} 个硬编码关卡配置`);
        this.validateProgress();
    }

    // 验证关卡进度数据
    private validateProgress(): void {
        const totalLevels = this.getTotalLevels();
        if (totalLevels > 0) {
            // 确保maxUnlockedLevel在有效范围内
            if (this.maxUnlockedLevel < 1) {
                this.maxUnlockedLevel = 1;
            } else if (this.maxUnlockedLevel > totalLevels) {
                this.maxUnlockedLevel = totalLevels;
            }
            console.log(`进度验证完成: maxUnlockedLevel=${this.maxUnlockedLevel}, totalLevels=${totalLevels}`);
        }
    }

    // 加载关卡进度
    private loadLevelProgress(): void {
        try {
            const saved = localStorage.getItem('td_level_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.maxUnlockedLevel = data.maxUnlockedLevel || 1;
                this.levelCompletion = new Map(data.completion || []);
                console.log("关卡进度加载成功");
            }
        } catch (error) {
            console.warn("加载关卡进度失败:", error);
        }
    }

    // 保存关卡进度
    private saveLevelProgress(): void {
        try {
            const data = {
                maxUnlockedLevel: this.maxUnlockedLevel,
                completion: Array.from(this.levelCompletion.entries())
            };
            localStorage.setItem('td_level_progress', JSON.stringify(data));
            console.log("关卡进度保存成功");
        } catch (error) {
            console.warn("保存关卡进度失败:", error);
        }
    }

    // 获取总关卡数（从配置加载）
    public getTotalLevels(): number {
        return this.levelData.size;
    }

    // 获取关卡配置数据
    public getLevelData(levelId: number): LevelData | null {
        return this.levelData.get(levelId) || null;
    }

    // 获取所有关卡数据
    public getAllLevelData(): LevelData[] {
        return Array.from(this.levelData.values());
    }

    // 重置所有进度
    public resetProgress(): void {
        this.maxUnlockedLevel = 1;
        this.levelCompletion.clear();
        this.saveLevelProgress();
        console.log("关卡进度已重置");
    }

    // 开始当前关卡游戏
    public startCurrentLevel(): void {
        console.log(`开始关卡 ${this.currentLevelId}`);
        // 根据关卡ID加载对应的场景
        const sceneName = `Level_${this.currentLevelId}`;
        director.loadScene(sceneName, (err: any) => {
            if (err) {
                console.error(`加载场景 ${sceneName} 失败:`, err);
                // 尝试加载默认场景
                director.loadScene('Game');
            }
        });
    }

    // 返回关卡选择界面
    public backToLevelSelect(): void {
        console.log("返回关卡选择界面");
        director.loadScene('LevelSelect', (err: any) => {
            if (err) {
                console.error("加载关卡选择场景失败:", err);
                // 尝试加载主菜单场景
                director.loadScene('MainMenu');
            }
        });
    }
}

// 关卡完成数据接口
interface LevelCompletion {
    levelId: number;
    completed: boolean;
    score: number;
    stars: number;
    bestScore: number;
}

// 关卡数据接口（从JSON加载）
interface LevelData {
    id: number;
    name: string;
    description: string;
    difficulty: number;
    initialGold: number;
    waveCount: number;
    unlockRequirement: string | null;
    enemyTypes: string[];
    maxTowers: number;
    // 其他关卡特定配置...
}