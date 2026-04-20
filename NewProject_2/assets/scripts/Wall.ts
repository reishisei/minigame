import { _decorator, Component, Label, director } from 'cc';
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
            alert("游戏结束！城墙已被摧毁")
            console.log("游戏结束！城墙已被摧毁");
            director.pause();
        }
    }

    private updateUI() {
        console.log('currentHp', this.currentHp)
        if (this.hpLabel) {
            this.hpLabel.string = `城墙: ${this.currentHp}/${this.maxHp}`;
        }
    }
}