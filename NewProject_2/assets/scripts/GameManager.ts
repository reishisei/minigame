import { _decorator, Component, Label, ProgressBar, profiler, director  } from 'cc';
import { LevelManager } from './LevelManager';
import { WaveManager } from './WaveManager';
import { SkillManager } from './SkillManager';
import { AchievementManager } from './AchievementManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // 单例
    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    // 其他管理器引用
    public static get levelManager(): LevelManager | null {
        return LevelManager.instance;
    }

    public static get waveManager(): WaveManager | null {
        return WaveManager.instance;
    }

    public static get skillManager(): SkillManager | null {
        return SkillManager.instance;
    }

    public static get achievementManager(): AchievementManager | null {
        return AchievementManager.instance;
    }

    public static get audioManager(): AudioManager | null {
        return AudioManager.instance;
    }

    public isGamePaused: boolean = false;  // 新增：暂停标志

    // ========== 金币系统 ==========
    @property
    public gold: number = 100;  // 初始金币

    // ========== 经验系统 ==========
    @property
    public currentExp: number = 0;
    @property
    public expToNextLevel: number = 100;
    @property
    public currentLevel: number = 1;

    // ========== 全局属性倍率 ==========
    private _damageBonus: number = 1.0;
    private _attackSpeedBonus: number = 1.0;
    private _rangeBonus: number = 1.0;

    // 每级增加的属性
    @property
    public damagePerLevel: number = 0.1;   // 每级+10%伤害
    @property
    public attackSpeedPerLevel: number = 0.05; // 每级+5%攻速
    @property
    public rangePerLevel: number = 0.05;   // 每级+5%射程

    // UI 引用
    @property(Label)
    public goldLabel: Label = null;
    @property(Label)
    public expLabel: Label = null;
    @property(ProgressBar)
    public expBar: ProgressBar = null;
    @property(Label)
    public levelLabel: Label = null;

    start() {
        profiler.hideStats();
        GameManager._instance = this;
        this.initializeManagers();
        this.updateUI();
    }

    // 暂停游戏
    public pauseGame() {
        this.isGamePaused = true;
        director.pause();
        console.log("游戏暂停");
    }
    
    // 恢复游戏
    public resumeGame() {
        this.isGamePaused = false;
        director.resume();
        console.log("游戏恢复");
    }

    // 增加金币
    public addGold(amount: number) {
        this.gold += amount;
        this.updateUI();
        console.log(`获得 ${amount} 金币，当前金币: ${this.gold}`);

        // 更新成就系统
        if (amount > 0) {
            GameManager.achievementManager?.updateStat('totalGoldEarned', amount);
        }
    }

    // 消耗金币（返回是否成功）
    public spendGold(amount: number): boolean {
        if (this.gold >= amount) {
            this.gold -= amount;
            this.updateUI();
            return true;
        }
        console.log(`金币不足，需要 ${amount}，当前 ${this.gold}`);
        return false;
    }

    // 增加经验
    public addExp(amount: number) {
        this.currentExp += amount;
        
        // 检查升级
        while (this.currentExp >= this.expToNextLevel) {
            this.levelUp();
        }
        
        this.updateUI();
        console.log(`获得 ${amount} 经验，当前经验: ${this.currentExp}/${this.expToNextLevel}`);
    }

    // 敌人被击杀
    public enemyKilled(enemyType: string = 'basic'): void {
        // 更新成就系统
        GameManager.achievementManager?.updateStat('totalEnemiesKilled', 1);

        // 根据敌人类型给予不同奖励
        let expReward = 5;
        let goldReward = 10;

        switch (enemyType) {
            case 'fast':
                expReward = 3;
                goldReward = 8;
                break;
            case 'armored':
                expReward = 8;
                goldReward = 15;
                break;
            case 'flying':
                expReward = 6;
                goldReward = 12;
                break;
            case 'boss':
                expReward = 50;
                goldReward = 100;
                break;
            case 'swarm':
                expReward = 2;
                goldReward = 5;
                break;
        }

        // 给予奖励
        this.addExp(expReward);
        this.addGold(goldReward);

        // 播放音效
        GameManager.audioManager?.playEnemyDeathSound();

        console.log(`击杀 ${enemyType} 敌人，获得 ${expReward} 经验, ${goldReward} 金币`);
    }

    // 升级
    private levelUp() {
        this.currentExp -= this.expToNextLevel;
        this.currentLevel++;

        // 重新计算升级所需经验（递增）
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.2);

        // 更新全局属性倍率
        this._damageBonus = 1 + (this.currentLevel - 1) * this.damagePerLevel;
        this._attackSpeedBonus = 1 + (this.currentLevel - 1) * this.attackSpeedPerLevel;
        this._rangeBonus = 1 + (this.currentLevel - 1) * this.rangePerLevel;

        // 奖励技能点
        const skillPointsEarned = 1; // 每级1技能点
        GameManager.skillManager?.addSkillPoints(skillPointsEarned);

        // 更新成就系统
        GameManager.achievementManager?.setStatMax('totalTowersUpgraded', this.currentLevel);

        console.log(`升级！当前等级: ${this.currentLevel}`);
        console.log(`伤害倍率: ${this._damageBonus}, 攻速倍率: ${this._attackSpeedBonus}, 射程倍率: ${this._rangeBonus}`);
        console.log(`获得 ${skillPointsEarned} 技能点`);
    }

    // 获取全局属性倍率
    public get damageBonus(): number { return this._damageBonus; }
    public get attackSpeedBonus(): number { return this._attackSpeedBonus; }
    public get rangeBonus(): number { return this._rangeBonus; }

    // 更新 UI
    private updateUI() {
        if (this.goldLabel) {
            this.goldLabel.string = `金币: ${Math.floor(this.gold)}`;
        }
        if (this.expLabel) {
            this.expLabel.string = `Lv.${this.currentLevel} ${this.currentExp}/${this.expToNextLevel}`;
        }
        if (this.expBar) {
            this.expBar.progress = this.currentExp / this.expToNextLevel;
        }
        if (this.levelLabel) {
            this.levelLabel.string = `等级 ${this.currentLevel}`;
        }
    }

    // ========== 事件集成方法 ==========

    // 塔建造事件
    public towerBuilt(towerType: string): void {
        // 更新成就系统
        GameManager.achievementManager?.updateStat('totalTowersBuilt', 1);

        // 播放音效
        GameManager.audioManager?.playTowerPlaceSound();

        console.log(`建造了 ${towerType} 塔`);
    }

    // 塔升级事件
    public towerUpgraded(towerType: string, newLevel: number): void {
        // 更新成就系统
        GameManager.achievementManager?.setStatMax('totalTowersUpgraded', newLevel);

        // 播放音效
        GameManager.audioManager?.playTowerUpgradeSound();

        console.log(`${towerType} 塔升级到 ${newLevel} 级`);
    }

    // 波次开始事件
    public waveStarted(waveNumber: number): void {
        // 播放音效
        GameManager.audioManager?.playWaveStartSound();

        console.log(`波次 ${waveNumber} 开始`);
    }

    // 波次完成事件
    public waveCompleted(waveNumber: number): void {
        // 更新成就系统
        GameManager.achievementManager?.updateStat('totalWavesCompleted', 1);

        // 播放音效
        GameManager.audioManager?.playWaveCompleteSound();

        console.log(`波次 ${waveNumber} 完成`);
    }

    // 关卡完成事件
    public levelCompleted(levelId: number, score: number, stars: number): void {
        // 更新成就系统
        GameManager.achievementManager?.updateStat('totalLevelsCompleted', 1);

        // 更新关卡管理器
        GameManager.levelManager?.completeCurrentLevel(score, stars);

        // 播放音效
        GameManager.audioManager?.playLevelCompleteSound();

        // 给予技能点奖励
        const skillPointsReward = stars * 2; // 每颗星2技能点
        GameManager.skillManager?.addSkillPoints(skillPointsReward);

        console.log(`关卡 ${levelId} 完成，得分: ${score}, 星星: ${stars}, 获得 ${skillPointsReward} 技能点`);
    }

    // 游戏结束事件
    public gameOver(isWin: boolean): void {
        if (isWin) {
            console.log("游戏胜利！");
            // 播放胜利音效
        } else {
            console.log("游戏失败");
            // 播放失败音效
            GameManager.audioManager?.playGameOverSound();

            // 触发隐藏成就（如果在第一波失败）
            const waveNumber = GameManager.waveManager ? (GameManager.waveManager as any).currentWaveIndex : 0;
            if (waveNumber === 0) {
                GameManager.achievementManager?.triggerAchievement('game_over_wave_1');
            }
        }

        // 更新游戏统计
        GameManager.achievementManager?.updateStat('totalGamesPlayed', 1);
    }

    // 按钮点击事件
    public buttonClicked(): void {
        // 播放UI音效
        GameManager.audioManager?.playButtonClickSound();
    }

    // 初始化所有管理器
    public initializeManagers(): void {
        // 这个方法应该在游戏开始时调用，确保所有管理器都已初始化
        console.log("初始化所有管理器...");

        // 各个管理器会在它们的 start() 方法中自行初始化
        // 这里主要是确保单例引用已设置
    }

    // 重置游戏状态
    public resetGameState(): void {
        this.gold = 100;
        this.currentExp = 0;
        this.expToNextLevel = 100;
        this.currentLevel = 1;
        this._damageBonus = 1.0;
        this._attackSpeedBonus = 1.0;
        this._rangeBonus = 1.0;

        // 重置其他管理器
        GameManager.levelManager?.resetProgress();
        GameManager.waveManager?.reset();
        GameManager.skillManager?.resetProgress();
        GameManager.achievementManager?.resetProgress();
        GameManager.audioManager?.resetSettings();

        this.updateUI();
        console.log("游戏状态已重置");
    }
}