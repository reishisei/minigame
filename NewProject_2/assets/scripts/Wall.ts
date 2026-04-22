import { _decorator, Component, Label, director } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {
    @property
    maxHp: number = 10;

    @property(Label)
    hpLabel: Label = null;

    private currentHp: number = 0;

    start() {
        this.currentHp = this.maxHp;
        this.updateUI();
    }

    public takeDamage(damage: number = 1) {
        this.currentHp -= damage;
        this.updateUI();

        if (this.currentHp <= 0) {
            console.log("游戏结束！城墙已被摧毁");

            // 触发游戏结束事件
            const gm = GameManager.instance;
            if (gm) {
                gm.gameOver(false);
            }

            // 暂停游戏
            director.pause();
        }
    }

    private updateUI() {
        console.log('currentHp', this.currentHp)
        if (this.hpLabel) {
            this.hpLabel.string = `城墙: ${this.currentHp}/${this.maxHp}`;
        }
    }

    // 获取当前血量
    public getCurrentHp(): number {
        return this.currentHp;
    }

    // 检查城墙是否存活
    public isAlive(): boolean {
        return this.currentHp > 0;
    }
}