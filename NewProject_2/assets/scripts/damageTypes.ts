// 伤害类型系统

/**
 * 伤害类型枚举
 */
export enum DamageType {
    PHYSICAL = 'physical',      // 物理伤害（弓箭手、火枪手、守城炮）
    MAGIC = 'magic',           // 魔法伤害（法师）
    ICE = 'ice',               // 寒冰伤害（寒冰塔）
    PIERCING = 'piercing',     // 穿刺伤害（狙击塔）
    SUPPORT = 'support'        // 支援类型（不造成伤害）
}

/**
 * 伤害类型配置
 */
export const DamageTypeConfig = {
    [DamageType.PHYSICAL]: {
        name: '物理',
        color: '#FFA500', // 橙色
        icon: '⚔️'
    },
    [DamageType.MAGIC]: {
        name: '魔法',
        color: '#8000FF', // 紫色
        icon: '✨'
    },
    [DamageType.ICE]: {
        name: '寒冰',
        color: '#00C8FF', // 浅蓝色
        icon: '❄️'
    },
    [DamageType.PIERCING]: {
        name: '穿刺',
        color: '#FFFFFF', // 白色
        icon: '🎯'
    },
    [DamageType.SUPPORT]: {
        name: '支援',
        color: '#FFFF00', // 黄色
        icon: '⭐'
    }
};

/**
 * 敌人抗性配置
 * 值说明：
 * - 1.0: 正常伤害
 * - >1.0: 弱点（受到更多伤害）
 * - <1.0: 抗性（受到更少伤害）
 * - 0.0: 免疫（不受伤害）
 */
export const EnemyResistance = {
    // 基础敌人
    basic: {
        [DamageType.PHYSICAL]: 1.0,
        [DamageType.MAGIC]: 1.0,
        [DamageType.ICE]: 1.0,
        [DamageType.PIERCING]: 1.0
    },
    // 快速敌人
    fast: {
        [DamageType.PHYSICAL]: 1.2,  // 对物理伤害脆弱
        [DamageType.MAGIC]: 0.8,     // 对魔法伤害有抗性
        [DamageType.ICE]: 0.5,       // 对寒冰伤害很脆弱（减速效果更好）
        [DamageType.PIERCING]: 1.5   // 对穿刺伤害非常脆弱
    },
    // 装甲敌人
    armored: {
        [DamageType.PHYSICAL]: 0.3,  // 对物理伤害高抗性
        [DamageType.MAGIC]: 1.5,     // 对魔法伤害脆弱
        [DamageType.ICE]: 1.0,       // 对寒冰伤害正常
        [DamageType.PIERCING]: 0.7   // 对穿刺伤害有抗性
    },
    // 飞行敌人
    flying: {
        [DamageType.PHYSICAL]: 0.8,  // 对物理伤害有轻微抗性
        [DamageType.MAGIC]: 1.3,     // 对魔法伤害脆弱
        [DamageType.ICE]: 1.0,       // 对寒冰伤害正常
        [DamageType.PIERCING]: 1.8   // 对穿刺伤害非常脆弱（狙击塔有效）
    },
    // Boss敌人
    boss: {
        [DamageType.PHYSICAL]: 0.7,  // 对物理伤害有抗性
        [DamageType.MAGIC]: 1.2,     // 对魔法伤害脆弱
        [DamageType.ICE]: 0.9,       // 对寒冰伤害轻微抗性
        [DamageType.PIERCING]: 1.0   // 对穿刺伤害正常
    },
    // 群体敌人
    swarm: {
        [DamageType.PHYSICAL]: 1.5,  // 对物理伤害非常脆弱
        [DamageType.MAGIC]: 1.0,     // 对魔法伤害正常
        [DamageType.ICE]: 2.0,       // 对寒冰伤害极度脆弱（群体减速）
        [DamageType.PIERCING]: 0.5   // 对穿刺伤害有抗性（单个穿透效果差）
    }
};

/**
 * 获取敌人对某种伤害类型的抗性系数
 */
export function getEnemyResistance(enemyType: string, damageType: DamageType): number {
    const resistance = EnemyResistance[enemyType as keyof typeof EnemyResistance];
    if (!resistance) {
        return 1.0; // 默认无抗性
    }
    return resistance[damageType] || 1.0;
}

/**
 * 计算最终伤害（考虑抗性）
 */
export function calculateFinalDamage(baseDamage: number, enemyType: string, damageType: DamageType): number {
    const resistance = getEnemyResistance(enemyType, damageType);
    const finalDamage = baseDamage * resistance;

    console.log(`伤害计算: ${baseDamage} × ${resistance} (${enemyType}对${damageType}抗性) = ${finalDamage}`);

    return finalDamage;
}