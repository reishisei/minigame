import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    // 单例实例
    private static _instance: LevelManager = null;
    public static get instance(): LevelManager {
        return this._instance;
    }

    // 当前关卡信息
    @property
    private _currentLevelId: number = 1;

    @property
    private _maxUnlockedLevel: number = 1;

    // 关卡数据存储
    private levelData: Map<number, LevelData> = new Map();

    // 关卡完成状态
    private levelCompletion: Map<number, LevelCompletion> = new Map();

    start() {
        LevelManager._instance = this;
        this.loadLevelProgress();
        console.log("LevelManager 初始化完成");
    }

    // 获取当前关卡ID
    public get currentLevelId(): number {
        return this._currentLevelId;
    }

    // 设置当前关卡ID
    public setCurrentLevel(levelId: number): boolean {
        if (levelId <= 0 || levelId > this._maxUnlockedLevel) {
            console.warn(`关卡 ${levelId} 未解锁或无效`);
            return false;
        }
        this._currentLevelId = levelId;
        console.log(`当前关卡设置为: ${levelId}`);
        return true;
    }

    // 获取最大解锁关卡
    public get maxUnlockedLevel(): number {
        return this._maxUnlockedLevel;
    }

    // 解锁下一关
    public unlockNextLevel(): boolean {
        const nextLevel = this._maxUnlockedLevel + 1;
        if (nextLevel <= this.getTotalLevels()) {
            this._maxUnlockedLevel = nextLevel;
            this.saveLevelProgress();
            console.log(`解锁关卡: ${nextLevel}`);
            return true;
        }
        return false;
    }

    // 完成当前关卡
    public completeCurrentLevel(score: number, stars: number = 1): boolean {
        const levelId = this._currentLevelId;

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
        if (levelId === this._maxUnlockedLevel) {
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

    // 加载关卡进度
    private loadLevelProgress(): void {
        // TODO: 从本地存储加载进度
        try {
            const saved = localStorage.getItem('td_level_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this._maxUnlockedLevel = data.maxUnlockedLevel || 1;
                this.levelCompletion = new Map(data.completion || []);
                console.log("关卡进度加载成功");
            }
        } catch (error) {
            console.warn("加载关卡进度失败:", error);
        }
    }

    // 保存关卡进度
    private saveLevelProgress(): void {
        // TODO: 保存到本地存储
        try {
            const data = {
                maxUnlockedLevel: this._maxUnlockedLevel,
                completion: Array.from(this.levelCompletion.entries())
            };
            localStorage.setItem('td_level_progress', JSON.stringify(data));
            console.log("关卡进度保存成功");
        } catch (error) {
            console.warn("保存关卡进度失败:", error);
        }
    }

    // 获取总关卡数（硬编码或从配置加载）
    public getTotalLevels(): number {
        // TODO: 从配置加载
        return 10; // 默认10关
    }

    // 重置所有进度
    public resetProgress(): void {
        this._maxUnlockedLevel = 1;
        this.levelCompletion.clear();
        this.saveLevelProgress();
        console.log("关卡进度已重置");
    }

    // 开始当前关卡游戏
    public startCurrentLevel(): void {
        console.log(`开始关卡 ${this._currentLevelId}`);
        // TODO: 根据关卡ID加载对应的场景或配置
        // director.loadScene(`Level_${this._currentLevelId}`);
    }

    // 返回关卡选择界面
    public backToLevelSelect(): void {
        console.log("返回关卡选择界面");
        // director.loadScene('LevelSelect');
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
    // 其他关卡特定配置...
}