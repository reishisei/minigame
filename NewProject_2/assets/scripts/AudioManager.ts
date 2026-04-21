import { _decorator, Component, AudioSource, AudioClip, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    // 单例实例
    private static _instance: AudioManager = null;
    public static get instance(): AudioManager {
        return this._instance;
    }

    // 音频源
    @property(AudioSource)
    public backgroundMusicSource: AudioSource = null;

    @property(AudioSource)
    public soundEffectSource: AudioSource = null;

    @property(AudioSource)
    public uiSoundSource: AudioSource = null;

    @property(AudioSource)
    public voiceSource: AudioSource = null;

    // 音频剪辑
    @property(AudioClip)
    public backgroundMusic: AudioClip = null;

    @property(AudioClip)
    public towerPlaceSound: AudioClip = null;

    @property(AudioClip)
    public towerUpgradeSound: AudioClip = null;

    @property(AudioClip)
    public enemyDeathSound: AudioClip = null;

    @property(AudioClip)
    public enemyHitSound: AudioClip = null;

    @property(AudioClip)
    public buttonClickSound: AudioClip = null;

    @property(AudioClip)
    public waveStartSound: AudioClip = null;

    @property(AudioClip)
    public waveCompleteSound: AudioClip = null;

    @property(AudioClip)
    public levelCompleteSound: AudioClip = null;

    @property(AudioClip)
    public gameOverSound: AudioClip = null;

    // 音量设置
    @property
    private _masterVolume: number = 1.0;

    @property
    private _musicVolume: number = 0.8;

    @property
    private _sfxVolume: number = 1.0;

    @property
    private _uiVolume: number = 1.0;

    @property
    private _voiceVolume: number = 1.0;

    // 音频池（用于音效播放）
    private soundEffectPool: AudioSource[] = [];
    private readonly POOL_SIZE: number = 10;

    // 状态
    private isMuted: boolean = false;
    private isMusicPaused: boolean = false;

    start() {
        AudioManager._instance = this;
        this.loadAudioSettings();
        this.initializeAudioPool();
        this.playBackgroundMusic();
        console.log("AudioManager 初始化完成");
    }

    // 初始化音频池
    private initializeAudioPool(): void {
        for (let i = 0; i < this.POOL_SIZE; i++) {
            const audioNode = new Node(`SoundEffect_${i}`);
            audioNode.setParent(this.node);
            const audioSource = audioNode.addComponent(AudioSource);
            this.soundEffectPool.push(audioSource);
        }
        console.log(`音频池初始化完成，大小: ${this.POOL_SIZE}`);
    }

    // 播放背景音乐
    public playBackgroundMusic(): void {
        if (!this.backgroundMusicSource || !this.backgroundMusic) return;

        this.backgroundMusicSource.clip = this.backgroundMusic;
        this.backgroundMusicSource.loop = true;
        this.backgroundMusicSource.volume = this._musicVolume * this._masterVolume;

        if (!this.isMuted && !this.isMusicPaused) {
            this.backgroundMusicSource.play();
            console.log("背景音乐开始播放");
        }
    }

    // 暂停背景音乐
    public pauseBackgroundMusic(): void {
        if (this.backgroundMusicSource && this.backgroundMusicSource.playing) {
            this.backgroundMusicSource.pause();
            this.isMusicPaused = true;
            console.log("背景音乐已暂停");
        }
    }

    // 恢复背景音乐
    public resumeBackgroundMusic(): void {
        if (this.backgroundMusicSource && !this.backgroundMusicSource.playing) {
            this.backgroundMusicSource.play();
            this.isMusicPaused = false;
            console.log("背景音乐已恢复");
        }
    }

    // 停止背景音乐
    public stopBackgroundMusic(): void {
        if (this.backgroundMusicSource) {
            this.backgroundMusicSource.stop();
            console.log("背景音乐已停止");
        }
    }

    // 播放音效
    public playSoundEffect(clip: AudioClip, volume: number = 1.0): void {
        if (!clip || this.isMuted) return;

        // 从池中获取可用的音频源
        const audioSource = this.getAvailableAudioSource();
        if (!audioSource) {
            console.warn("没有可用的音频源");
            return;
        }

        audioSource.clip = clip;
        audioSource.volume = volume * this._sfxVolume * this._masterVolume;
        audioSource.play();

        console.log(`播放音效: ${clip.name}`);
    }

    // 播放UI音效
    public playUISound(clip: AudioClip, volume: number = 1.0): void {
        if (!clip || this.isMuted) return;

        if (this.uiSoundSource) {
            this.uiSoundSource.clip = clip;
            this.uiSoundSource.volume = volume * this._uiVolume * this._masterVolume;
            this.uiSoundSource.play();
        } else {
            this.playSoundEffect(clip, volume);
        }

        console.log(`播放UI音效: ${clip.name}`);
    }

    // 播放语音
    public playVoice(clip: AudioClip, volume: number = 1.0): void {
        if (!clip || this.isMuted) return;

        if (this.voiceSource) {
            this.voiceSource.clip = clip;
            this.voiceSource.volume = volume * this._voiceVolume * this._masterVolume;
            this.voiceSource.play();
        } else {
            this.playSoundEffect(clip, volume);
        }

        console.log(`播放语音: ${clip.name}`);
    }

    // 从池中获取可用的音频源
    private getAvailableAudioSource(): AudioSource | null {
        for (const audioSource of this.soundEffectPool) {
            if (!audioSource.playing) {
                return audioSource;
            }
        }

        // 如果所有都在使用，创建新的（动态扩展）
        const audioNode = new Node(`SoundEffect_Extra_${this.soundEffectPool.length}`);
        audioNode.setParent(this.node);
        const audioSource = audioNode.addComponent(AudioSource);
        this.soundEffectPool.push(audioSource);

        console.log(`音频池扩展至: ${this.soundEffectPool.length}`);
        return audioSource;
    }

    // ========== 音量控制 ==========

    // 获取音量
    public get masterVolume(): number { return this._masterVolume; }
    public get musicVolume(): number { return this._musicVolume; }
    public get sfxVolume(): number { return this._sfxVolume; }
    public get uiVolume(): number { return this._uiVolume; }
    public get voiceVolume(): number { return this._voiceVolume; }

    // 设置音量
    public setMasterVolume(volume: number): void {
        this._masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
        this.saveAudioSettings();
        console.log(`主音量设置为: ${this._masterVolume}`);
    }

    public setMusicVolume(volume: number): void {
        this._musicVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
        this.saveAudioSettings();
        console.log(`音乐音量设置为: ${this._musicVolume}`);
    }

    public setSfxVolume(volume: number): void {
        this._sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveAudioSettings();
        console.log(`音效音量设置为: ${this._sfxVolume}`);
    }

    public setUIVolume(volume: number): void {
        this._uiVolume = Math.max(0, Math.min(1, volume));
        this.saveAudioSettings();
        console.log(`UI音量设置为: ${this._uiVolume}`);
    }

    public setVoiceVolume(volume: number): void {
        this._voiceVolume = Math.max(0, Math.min(1, volume));
        this.saveAudioSettings();
        console.log(`语音音量设置为: ${this._voiceVolume}`);
    }

    // 更新所有音量
    private updateAllVolumes(): void {
        this.updateMusicVolume();
        // 音效音量在播放时实时计算
    }

    // 更新音乐音量
    private updateMusicVolume(): void {
        if (this.backgroundMusicSource) {
            this.backgroundMusicSource.volume = this._musicVolume * this._masterVolume;
        }
    }

    // ========== 静音控制 ==========

    // 切换静音
    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.muteAll();
            console.log("全部静音");
        } else {
            this.unmuteAll();
            console.log("取消静音");
        }

        this.saveAudioSettings();
        return this.isMuted;
    }

    // 静音所有音频
    private muteAll(): void {
        // 保存当前音量
        const savedMasterVolume = this._masterVolume;
        this.setMasterVolume(0);

        // 停止所有音频源
        this.stopAllSounds();
    }

    // 取消静音所有音频
    private unmuteAll(): void {
        // 恢复音量（从设置加载）
        this.loadAudioSettings();
    }

    // 停止所有声音
    private stopAllSounds(): void {
        if (this.backgroundMusicSource) {
            this.backgroundMusicSource.stop();
        }

        for (const audioSource of this.soundEffectPool) {
            if (audioSource.playing) {
                audioSource.stop();
            }
        }

        if (this.uiSoundSource) {
            this.uiSoundSource.stop();
        }

        if (this.voiceSource) {
            this.voiceSource.stop();
        }
    }

    // ========== 预定义音效方法 ==========

    public playTowerPlaceSound(): void {
        if (this.towerPlaceSound) {
            this.playSoundEffect(this.towerPlaceSound, 0.8);
        }
    }

    public playTowerUpgradeSound(): void {
        if (this.towerUpgradeSound) {
            this.playSoundEffect(this.towerUpgradeSound, 0.7);
        }
    }

    public playEnemyDeathSound(): void {
        if (this.enemyDeathSound) {
            this.playSoundEffect(this.enemyDeathSound, 0.6);
        }
    }

    public playEnemyHitSound(): void {
        if (this.enemyHitSound) {
            this.playSoundEffect(this.enemyHitSound, 0.5);
        }
    }

    public playButtonClickSound(): void {
        if (this.buttonClickSound) {
            this.playUISound(this.buttonClickSound, 0.3);
        }
    }

    public playWaveStartSound(): void {
        if (this.waveStartSound) {
            this.playSoundEffect(this.waveStartSound, 0.7);
        }
    }

    public playWaveCompleteSound(): void {
        if (this.waveCompleteSound) {
            this.playSoundEffect(this.waveCompleteSound, 0.8);
        }
    }

    public playLevelCompleteSound(): void {
        if (this.levelCompleteSound) {
            this.playSoundEffect(this.levelCompleteSound, 1.0);
        }
    }

    public playGameOverSound(): void {
        if (this.gameOverSound) {
            this.playSoundEffect(this.gameOverSound, 0.9);
        }
    }

    // ========== 设置持久化 ==========

    // 加载音频设置
    private loadAudioSettings(): void {
        try {
            const saved = localStorage.getItem('td_audio_settings');
            if (saved) {
                const data = JSON.parse(saved);
                this._masterVolume = data.masterVolume ?? 1.0;
                this._musicVolume = data.musicVolume ?? 0.8;
                this._sfxVolume = data.sfxVolume ?? 1.0;
                this._uiVolume = data.uiVolume ?? 1.0;
                this._voiceVolume = data.voiceVolume ?? 1.0;
                this.isMuted = data.isMuted ?? false;

                this.updateAllVolumes();
                console.log("音频设置加载成功");
            }
        } catch (error) {
            console.warn("加载音频设置失败:", error);
        }
    }

    // 保存音频设置
    private saveAudioSettings(): void {
        try {
            const data = {
                masterVolume: this._masterVolume,
                musicVolume: this._musicVolume,
                sfxVolume: this._sfxVolume,
                uiVolume: this._uiVolume,
                voiceVolume: this._voiceVolume,
                isMuted: this.isMuted
            };
            localStorage.setItem('td_audio_settings', JSON.stringify(data));
            console.log("音频设置保存成功");
        } catch (error) {
            console.warn("保存音频设置失败:", error);
        }
    }

    // 重置音频设置
    public resetSettings(): void {
        this._masterVolume = 1.0;
        this._musicVolume = 0.8;
        this._sfxVolume = 1.0;
        this._uiVolume = 1.0;
        this._voiceVolume = 1.0;
        this.isMuted = false;

        this.updateAllVolumes();
        this.saveAudioSettings();
        console.log("音频设置已重置");
    }

    // ========== 音频池管理 ==========

    // 清理音频池
    public cleanupAudioPool(): void {
        // 停止所有音频源
        for (const audioSource of this.soundEffectPool) {
            if (audioSource.playing) {
                audioSource.stop();
            }
        }
        console.log("音频池已清理");
    }

    // 获取音频池状态
    public getAudioPoolStatus(): { total: number, playing: number } {
        let playing = 0;
        for (const audioSource of this.soundEffectPool) {
            if (audioSource.playing) {
                playing++;
            }
        }
        return { total: this.soundEffectPool.length, playing };
    }
}