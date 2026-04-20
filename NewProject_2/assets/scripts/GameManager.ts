import { _decorator, Component, Label, ProgressBar, profiler, director  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // 单例
    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
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
        
        console.log(`升级！当前等级: ${this.currentLevel}`);
        console.log(`伤害倍率: ${this._damageBonus}, 攻速倍率: ${this._attackSpeedBonus}, 射程倍率: ${this._rangeBonus}`);
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
}