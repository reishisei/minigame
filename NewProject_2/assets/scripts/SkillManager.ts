import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillManager')
export class SkillManager extends Component {
    // 单例实例
    private static _instance: SkillManager = null;
    public static get instance(): SkillManager {
        return this._instance;
    }

    // 技能点
    @property
    private _skillPoints: number = 0;

    // 技能树
    private skillTree: SkillTree = {
        towers: new Map<string, TowerSkillBranch>(),
        global: new Map<string, GlobalSkill>()
    };

    // 已激活技能
    private activeSkills: Set<string> = new Set();

    // 技能效果应用器
    private skillEffects: Map<string, SkillEffect> = new Map();

    // 技能定义注册表
    private skillDefinitions: Map<string, SkillDefinition> = new Map();

    start() {
        SkillManager._instance = this;
        this.loadSkillProgress();
        this.initializeDefaultSkillTree();
        console.log("SkillManager 初始化完成");
    }

    // 获取当前技能点
    public get skillPoints(): number {
        return this._skillPoints;
    }

    // 添加技能点
    public addSkillPoints(amount: number): void {
        if (amount <= 0) return;

        this._skillPoints += amount;
        this.saveSkillProgress();
        console.log(`获得 ${amount} 技能点，当前: ${this._skillPoints}`);
    }

    // 消耗技能点
    public spendSkillPoints(amount: number): boolean {
        if (this._skillPoints < amount) {
            console.log(`技能点不足，需要 ${amount}，当前 ${this._skillPoints}`);
            return false;
        }

        this._skillPoints -= amount;
        this.saveSkillProgress();
        console.log(`消耗 ${amount} 技能点，剩余: ${this._skillPoints}`);
        return true;
    }

    // 学习技能
    public learnSkill(skillId: string): boolean {
        // 检查是否已学习
        if (this.activeSkills.has(skillId)) {
            console.log(`技能 ${skillId} 已学习`);
            return false;
        }

        // 获取技能定义
        const skill = this.findSkillById(skillId);
        if (!skill) {
            console.warn(`技能未找到: ${skillId}`);
            return false;
        }

        // 检查前置条件
        if (!this.checkSkillPrerequisites(skillId)) {
            console.log(`技能 ${skillId} 的前置条件未满足`);
            return false;
        }

        // 检查技能点
        if (!this.spendSkillPoints(skill.cost)) {
            return false;
        }

        // 激活技能
        this.activeSkills.add(skillId);
        this.applySkillEffect(skill);

        // 如果是塔类技能，添加到对应塔的分支
        if (skill.type === 'tower') {
            const towerSkill = skill as TowerSkill;
            const towerBranch = this.skillTree.towers.get(towerSkill.towerType);
            if (towerBranch) {
                towerBranch.learnedSkills.push(skillId);
            }
        }

        this.saveSkillProgress();
        console.log(`技能学习成功: ${skill.name}`);
        return true;
    }

    // 检查技能前置条件
    private checkSkillPrerequisites(skillId: string): boolean {
        const skill = this.findSkillById(skillId);
        if (!skill) return false;

        // 检查前置技能
        for (const prereqId of skill.prerequisites) {
            if (!this.activeSkills.has(prereqId)) {
                return false;
            }
        }

        return true;
    }

    // 应用技能效果
    private applySkillEffect(skill: SkillDefinition): void {
        const effect = skill.effect as SkillEffectDefinition;

        // 根据技能类型应用效果
        switch (effect.type) {
            case 'stat_boost':
                this.applyStatBoostEffect(skill);
                break;
            case 'ability_unlock':
                this.applyAbilityUnlockEffect(skill);
                break;
            case 'global_modifier':
                this.applyGlobalModifierEffect(skill);
                break;
            default:
                console.warn(`未知技能效果类型: ${(effect as any).type}`);
        }
    }

    // 应用属性提升效果
    private applyStatBoostEffect(skill: SkillDefinition): void {
        const effect = skill.effect as StatBoostEffect;
        const effectId = `${skill.id}_effect`;

        this.skillEffects.set(effectId, {
            id: effectId,
            type: 'stat_boost',
            target: effect.target,
            stat: effect.stat,
            value: effect.value,
            isPercentage: effect.isPercentage
        });

        console.log(`应用属性提升: ${effect.stat} +${effect.value}${effect.isPercentage ? '%' : ''} 到 ${effect.target}`);
    }

    // 应用能力解锁效果
    private applyAbilityUnlockEffect(skill: SkillDefinition): void {
        const effect = skill.effect as AbilityUnlockEffect;
        const effectId = `${skill.id}_effect`;

        this.skillEffects.set(effectId, {
            id: effectId,
            type: 'ability_unlock',
            target: effect.target,
            ability: effect.ability
        });

        console.log(`解锁能力: ${effect.ability} 到 ${effect.target}`);
    }

    // 应用全局修饰器效果
    private applyGlobalModifierEffect(skill: SkillDefinition): void {
        const effect = skill.effect as GlobalModifierEffect;
        const effectId = `${skill.id}_effect`;

        this.skillEffects.set(effectId, {
            id: effectId,
            type: 'global_modifier',
            modifier: effect.modifier,
            value: effect.value
        });

        console.log(`应用全局修饰器: ${effect.modifier} = ${effect.value}`);
    }

    // 获取技能效果
    public getSkillEffects(target?: string, type?: string): SkillEffect[] {
        const effects: SkillEffect[] = [];

        for (const effect of this.skillEffects.values()) {
            if (target && effect.target !== target) continue;
            if (type && effect.type !== type) continue;
            effects.push(effect);
        }

        return effects;
    }

    // 检查技能是否已学习
    public isSkillLearned(skillId: string): boolean {
        return this.activeSkills.has(skillId);
    }

    // 获取塔类可用技能
    public getTowerSkills(towerType: string): TowerSkill[] {
        const skills: TowerSkill[] = [];
        const branch = this.skillTree.towers.get(towerType);

        if (branch) {
            for (const skillId of branch.availableSkills) {
                const skill = this.findSkillById(skillId);
                if (skill && skill.type === 'tower') {
                    skills.push(skill as TowerSkill);
                }
            }
        }

        return skills;
    }

    // 获取全局技能
    public getGlobalSkills(): GlobalSkill[] {
        const skills: GlobalSkill[] = [];

        for (const skill of this.skillTree.global.values()) {
            skills.push(skill);
        }

        return skills;
    }

    // 初始化默认技能树
    private initializeDefaultSkillTree(): void {
        // 弓箭手技能分支
        const archerBranch: TowerSkillBranch = {
            towerType: 'archer',
            availableSkills: [
                'archer_damage_1',
                'archer_attack_speed_1',
                'archer_range_1',
                'archer_critical_strike'
            ],
            learnedSkills: []
        };
        this.skillTree.towers.set('archer', archerBranch);

        // 火枪手技能分支
        const musketeerBranch: TowerSkillBranch = {
            towerType: 'musketeer',
            availableSkills: [
                'musketeer_damage_1',
                'musketeer_penetration',
                'musketeer_explosive_rounds'
            ],
            learnedSkills: []
        };
        this.skillTree.towers.set('musketeer', musketeerBranch);

        // 守城炮技能分支
        const cannonBranch: TowerSkillBranch = {
            towerType: 'cannon',
            availableSkills: [
                'cannon_damage_1',
                'cannon_splash_radius',
                'cannon_stun_effect'
            ],
            learnedSkills: []
        };
        this.skillTree.towers.set('cannon', cannonBranch);

        // 全局技能
        this.skillTree.global.set('global_gold_bonus', {
            id: 'global_gold_bonus',
            name: '金币增益',
            description: '增加10%金币获取',
            type: 'global',
            cost: 5,
            prerequisites: [],
            effect: {
                type: 'global_modifier',
                modifier: 'gold_gain',
                value: 1.1
            }
        });

        this.skillTree.global.set('global_exp_bonus', {
            id: 'global_exp_bonus',
            name: '经验增益',
            description: '增加10%经验获取',
            type: 'global',
            cost: 5,
            prerequisites: ['global_gold_bonus'],
            effect: {
                type: 'global_modifier',
                modifier: 'exp_gain',
                value: 1.1
            }
        });

        // 注册所有技能定义
        this.registerSkillDefinitions();
    }

    // 注册技能定义
    private registerSkillDefinitions(): void {
        // 弓箭手技能
        this.registerSkill({
            id: 'archer_damage_1',
            name: '强弓',
            description: '弓箭手伤害增加20%',
            type: 'tower',
            cost: 2,
            prerequisites: [],
            towerType: 'archer',
            effect: {
                type: 'stat_boost',
                target: 'archer',
                stat: 'damage',
                value: 0.2,
                isPercentage: true
            }
        } as TowerSkill);

        this.registerSkill({
            id: 'archer_attack_speed_1',
            name: '速射',
            description: '弓箭手攻击速度增加15%',
            type: 'tower',
            cost: 2,
            prerequisites: [],
            towerType: 'archer',
            effect: {
                type: 'stat_boost',
                target: 'archer',
                stat: 'attack_speed',
                value: 0.15,
                isPercentage: true
            }
        } as TowerSkill);

        this.registerSkill({
            id: 'archer_range_1',
            name: '远射',
            description: '弓箭手射程增加10%',
            type: 'tower',
            cost: 3,
            prerequisites: ['archer_damage_1'],
            towerType: 'archer',
            effect: {
                type: 'stat_boost',
                target: 'archer',
                stat: 'range',
                value: 0.1,
                isPercentage: true
            }
        } as TowerSkill);

        this.registerSkill({
            id: 'archer_critical_strike',
            name: '致命一击',
            description: '弓箭手有20%几率造成双倍伤害',
            type: 'tower',
            cost: 5,
            prerequisites: ['archer_damage_1', 'archer_attack_speed_1'],
            towerType: 'archer',
            effect: {
                type: 'ability_unlock',
                target: 'archer',
                ability: 'critical_strike'
            }
        } as TowerSkill);

        // 更多技能定义...
    }

    // 查找技能
    private findSkillById(skillId: string): SkillDefinition | null {
        return this.skillDefinitions.get(skillId) || null;
    }

    // 注册技能（内部使用）
    private registerSkill(skill: SkillDefinition): void {
        this.skillDefinitions.set(skill.id, skill);
    }

    // 加载技能进度
    private loadSkillProgress(): void {
        try {
            const saved = localStorage.getItem('td_skill_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this._skillPoints = data.skillPoints || 0;
                this.activeSkills = new Set(data.activeSkills || []);
                console.log("技能进度加载成功");
            }
        } catch (error) {
            console.warn("加载技能进度失败:", error);
        }
    }

    // 保存技能进度
    private saveSkillProgress(): void {
        try {
            const data = {
                skillPoints: this._skillPoints,
                activeSkills: Array.from(this.activeSkills)
            };
            localStorage.setItem('td_skill_progress', JSON.stringify(data));
            console.log("技能进度保存成功");
        } catch (error) {
            console.warn("保存技能进度失败:", error);
        }
    }

    // 重置技能进度
    public resetProgress(): void {
        this._skillPoints = 0;
        this.activeSkills.clear();
        this.skillEffects.clear();
        this.saveSkillProgress();
        console.log("技能进度已重置");
    }
}

// ========== 类型定义 ==========

interface SkillTree {
    towers: Map<string, TowerSkillBranch>;
    global: Map<string, GlobalSkill>;
}

interface TowerSkillBranch {
    towerType: string;
    availableSkills: string[];
    learnedSkills: string[];
}

interface SkillDefinition {
    id: string;
    name: string;
    description: string;
    type: 'tower' | 'global';
    cost: number;
    prerequisites: string[];
    effect: SkillEffectDefinition;
}

interface TowerSkill extends SkillDefinition {
    type: 'tower';
    towerType: string;
}

interface GlobalSkill extends SkillDefinition {
    type: 'global';
}

type SkillEffectDefinition = StatBoostEffect | AbilityUnlockEffect | GlobalModifierEffect;

interface StatBoostEffect {
    type: 'stat_boost';
    target: string;  // tower type or 'global'
    stat: string;    // 'damage', 'attack_speed', 'range', 'health', etc.
    value: number;
    isPercentage: boolean;
}

interface AbilityUnlockEffect {
    type: 'ability_unlock';
    target: string;
    ability: string; // 'critical_strike', 'splash_damage', 'slow', etc.
}

interface GlobalModifierEffect {
    type: 'global_modifier';
    modifier: string; // 'gold_gain', 'exp_gain', 'tower_cost', etc.
    value: number;
}

interface SkillEffect {
    id: string;
    type: string;
    target?: string;
    [key: string]: any;
}