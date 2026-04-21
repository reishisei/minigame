import { _decorator, Component } from 'cc';
import { GameManager } from './GameManager';
import { SkillManager } from './SkillManager';
const { ccclass, property } = _decorator;

@ccclass('AchievementManager')
export class AchievementManager extends Component {
    // 单例实例
    private static _instance: AchievementManager = null;
    public static get instance(): AchievementManager {
        return this._instance;
    }

    // 成就数据
    private achievements: Map<string, Achievement> = new Map();
    private unlockedAchievements: Set<string> = new Set();
    private achievementProgress: Map<string, number> = new Map();

    // 统计数据
    private gameStats: GameStats = {
        totalEnemiesKilled: 0,
        totalGoldEarned: 0,
        totalTowersBuilt: 0,
        totalTowersUpgraded: 0,
        totalWavesCompleted: 0,
        totalLevelsCompleted: 0,
        totalPlayTime: 0,
        totalGamesPlayed: 0
    };

    start() {
        AchievementManager._instance = this;
        this.loadAchievementProgress();
        this.initializeAchievements();
        console.log("AchievementManager 初始化完成");
    }

    update(deltaTime: number) {
        // 更新游戏时间统计
        this.gameStats.totalPlayTime += deltaTime;
    }

    // 初始化成就定义
    private initializeAchievements(): void {
        // 击杀类成就
        this.registerAchievement({
            id: 'kill_10_enemies',
            title: '新手猎人',
            description: '击杀10个敌人',
            type: 'count',
            target: 'enemies_killed',
            requirement: 10,
            reward: { gold: 100, skillPoints: 1 },
            hidden: false
        });

        this.registerAchievement({
            id: 'kill_100_enemies',
            title: '熟练猎人',
            description: '击杀100个敌人',
            type: 'count',
            target: 'enemies_killed',
            requirement: 100,
            reward: { gold: 500, skillPoints: 3 },
            hidden: false
        });

        this.registerAchievement({
            id: 'kill_1000_enemies',
            title: '传奇猎人',
            description: '击杀1000个敌人',
            type: 'count',
            target: 'enemies_killed',
            requirement: 1000,
            reward: { gold: 2000, skillPoints: 10 },
            hidden: false
        });

        // 金币类成就
        this.registerAchievement({
            id: 'earn_1000_gold',
            title: '小有积蓄',
            description: '累计获得1000金币',
            type: 'count',
            target: 'gold_earned',
            requirement: 1000,
            reward: { gold: 200, skillPoints: 2 },
            hidden: false
        });

        // 塔类成就
        this.registerAchievement({
            id: 'build_10_towers',
            title: '建筑大师',
            description: '建造10座防御塔',
            type: 'count',
            target: 'towers_built',
            requirement: 10,
            reward: { gold: 300, skillPoints: 2 },
            hidden: false
        });

        this.registerAchievement({
            id: 'upgrade_tower_to_level_5',
            title: '精益求精',
            description: '将一座防御塔升级到5级',
            type: 'max_value',
            target: 'tower_level',
            requirement: 5,
            reward: { gold: 500, skillPoints: 3 },
            hidden: false
        });

        // 关卡类成就
        this.registerAchievement({
            id: 'complete_level_5',
            title: '冒险者',
            description: '完成第5关',
            type: 'level',
            target: 'levels_completed',
            requirement: 5,
            reward: { gold: 1000, skillPoints: 5 },
            hidden: false
        });

        this.registerAchievement({
            id: 'complete_all_levels',
            title: '塔防大师',
            description: '完成所有关卡',
            type: 'level',
            target: 'levels_completed',
            requirement: 10, // 假设有10关
            reward: { gold: 5000, skillPoints: 20 },
            hidden: false
        });

        // 波次类成就
        this.registerAchievement({
            id: 'complete_10_waves',
            title: '持久战',
            description: '完成10波敌人进攻',
            type: 'count',
            target: 'waves_completed',
            requirement: 10,
            reward: { gold: 400, skillPoints: 2 },
            hidden: false
        });

        // 隐藏成就
        this.registerAchievement({
            id: 'die_first_wave',
            title: '出师不利',
            description: '在第一波敌人进攻中失败',
            type: 'event',
            target: 'game_over_wave_1',
            requirement: 1,
            reward: { gold: 50, skillPoints: 1 },
            hidden: true
        });

        // 更多成就...
    }

    // 注册成就
    private registerAchievement(achievement: Achievement): void {
        this.achievements.set(achievement.id, achievement);
    }

    // 更新统计
    public updateStat(statName: keyof GameStats, value: number): void {
        const oldValue = this.gameStats[statName];
        this.gameStats[statName] += value;

        // 检查成就
        this.checkAchievements(statName, oldValue, this.gameStats[statName]);
    }

    // 设置统计（最大值）
    public setStatMax(statName: keyof GameStats, value: number): void {
        if (value > this.gameStats[statName]) {
            const oldValue = this.gameStats[statName];
            this.gameStats[statName] = value;

            // 检查成就
            this.checkAchievements(statName, oldValue, value);
        }
    }

    // 检查成就
    private checkAchievements(statName: keyof GameStats, oldValue: number, newValue: number): void {
        for (const [id, achievement] of this.achievements) {
            // 如果成就已解锁，跳过
            if (this.unlockedAchievements.has(id)) {
                continue;
            }

            // 检查成就目标是否匹配
            if (this.getStatTarget(achievement) !== statName) {
                continue;
            }

            // 根据成就类型检查
            let isUnlocked = false;

            switch (achievement.type) {
                case 'count':
                    // 累计值达到要求
                    if (newValue >= achievement.requirement) {
                        isUnlocked = true;
                    }
                    break;

                case 'max_value':
                    // 最大值达到要求
                    if (newValue >= achievement.requirement && oldValue < achievement.requirement) {
                        isUnlocked = true;
                    }
                    break;

                case 'level':
                    // 完成特定关卡
                    if (newValue >= achievement.requirement && oldValue < achievement.requirement) {
                        isUnlocked = true;
                    }
                    break;

                case 'event':
                    // 事件触发（通过triggerAchievement处理）
                    break;
            }

            if (isUnlocked) {
                this.unlockAchievement(id);
            }
        }
    }

    // 获取成就对应的统计目标
    private getStatTarget(achievement: Achievement): keyof GameStats | null {
        const targetMap: Record<string, keyof GameStats> = {
            'enemies_killed': 'totalEnemiesKilled',
            'gold_earned': 'totalGoldEarned',
            'towers_built': 'totalTowersBuilt',
            'towers_upgraded': 'totalTowersUpgraded',
            'tower_level': 'totalTowersUpgraded', // 注意：这里简化处理
            'waves_completed': 'totalWavesCompleted',
            'levels_completed': 'totalLevelsCompleted',
            'play_time': 'totalPlayTime',
            'games_played': 'totalGamesPlayed'
        };

        return targetMap[achievement.target] || null;
    }

    // 触发事件类成就
    public triggerAchievement(eventId: string): void {
        for (const [id, achievement] of this.achievements) {
            if (achievement.type === 'event' &&
                achievement.target === eventId &&
                !this.unlockedAchievements.has(id)) {

                this.unlockAchievement(id);
                break;
            }
        }
    }

    // 解锁成就
    private unlockAchievement(achievementId: string): void {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) {
            console.warn(`成就未找到: ${achievementId}`);
            return;
        }

        this.unlockedAchievements.add(achievementId);

        // 发放奖励
        this.grantAchievementReward(achievement);

        // 保存进度
        this.saveAchievementProgress();

        // 显示成就通知
        this.showAchievementNotification(achievement);

        console.log(`成就解锁: ${achievement.title} - ${achievement.description}`);
    }

    // 发放成就奖励
    private grantAchievementReward(achievement: Achievement): void {
        const reward = achievement.reward;

        // 发放金币奖励
        if (reward.gold > 0) {
            GameManager.instance?.addGold(reward.gold);
            console.log(`成就奖励: ${reward.gold} 金币`);
        }

        // 发放技能点奖励
        if (reward.skillPoints > 0) {
            SkillManager.instance?.addSkillPoints(reward.skillPoints);
            console.log(`成就奖励: ${reward.skillPoints} 技能点`);
        }

        // 其他奖励类型...
    }

    // 显示成就通知
    private showAchievementNotification(achievement: Achievement): void {
        // TODO: 实现UI通知
        console.log(`🎉 成就达成: ${achievement.title} 🎉`);
    }

    // 获取成就信息
    public getAchievement(achievementId: string): Achievement | null {
        return this.achievements.get(achievementId) || null;
    }

    // 获取所有成就
    public getAllAchievements(): Achievement[] {
        return Array.from(this.achievements.values());
    }

    // 获取已解锁成就
    public getUnlockedAchievements(): Achievement[] {
        const unlocked: Achievement[] = [];
        for (const id of this.unlockedAchievements) {
            const achievement = this.achievements.get(id);
            if (achievement) {
                unlocked.push(achievement);
            }
        }
        return unlocked;
    }

    // 获取成就进度
    public getAchievementProgress(achievementId: string): number {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) return 0;

        // 对于已解锁的成就，进度为100%
        if (this.unlockedAchievements.has(achievementId)) {
            return 1.0;
        }

        const statTarget = this.getStatTarget(achievement);
        if (!statTarget) return 0;

        const currentValue = this.gameStats[statTarget];
        return Math.min(currentValue / achievement.requirement, 1.0);
    }

    // 获取统计信息
    public getGameStats(): GameStats {
        return { ...this.gameStats };
    }

    // 加载成就进度
    private loadAchievementProgress(): void {
        try {
            const saved = localStorage.getItem('td_achievement_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.unlockedAchievements = new Set(data.unlockedAchievements || []);
                this.gameStats = data.gameStats || this.gameStats;
                console.log("成就进度加载成功");
            }
        } catch (error) {
            console.warn("加载成就进度失败:", error);
        }
    }

    // 保存成就进度
    private saveAchievementProgress(): void {
        try {
            const data = {
                unlockedAchievements: Array.from(this.unlockedAchievements),
                gameStats: this.gameStats
            };
            localStorage.setItem('td_achievement_progress', JSON.stringify(data));
            console.log("成就进度保存成功");
        } catch (error) {
            console.warn("保存成就进度失败:", error);
        }
    }

    // 重置成就进度
    public resetProgress(): void {
        this.unlockedAchievements.clear();
        this.gameStats = {
            totalEnemiesKilled: 0,
            totalGoldEarned: 0,
            totalTowersBuilt: 0,
            totalTowersUpgraded: 0,
            totalWavesCompleted: 0,
            totalLevelsCompleted: 0,
            totalPlayTime: 0,
            totalGamesPlayed: 0
        };
        this.saveAchievementProgress();
        console.log("成就进度已重置");
    }
}

// ========== 类型定义 ==========

interface Achievement {
    id: string;
    title: string;
    description: string;
    type: 'count' | 'max_value' | 'level' | 'event';
    target: string;  // 对应的统计目标或事件ID
    requirement: number;
    reward: AchievementReward;
    hidden: boolean;  // 是否隐藏成就（解锁前不显示）
}

interface AchievementReward {
    gold: number;
    skillPoints: number;
    // 可以扩展其他奖励类型
}

interface GameStats {
    totalEnemiesKilled: number;
    totalGoldEarned: number;
    totalTowersBuilt: number;
    totalTowersUpgraded: number;
    totalWavesCompleted: number;
    totalLevelsCompleted: number;
    totalPlayTime: number;
    totalGamesPlayed: number;
}