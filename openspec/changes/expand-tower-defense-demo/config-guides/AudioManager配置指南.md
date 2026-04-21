# AudioManager 配置指南

## 概述
AudioManager 管理游戏中的所有音频，包括背景音乐、音效、UI声音和语音，提供音量控制和音频池化功能。

## 配置步骤

### 1. 创建 AudioManager 节点
- 在 **层级管理器** 中创建空节点，重命名为 "AudioManager"
- 建议放置在场景根节点下

### 2. 添加脚本组件
- 选中 AudioManager 节点
- 在 **属性检查器** 中点击 **添加组件**
- 选择 **用户脚本组件** → **AudioManager**

### 3. 添加音频源组件
AudioManager 需要多个 AudioSource 组件：

1. **背景音乐音频源**：
   - 在 AudioManager 节点上添加 **AudioSource** 组件
   - 重命名为 "BackgroundMusicSource"
   - 拖拽到 `backgroundMusicSource` 属性

2. **音效音频源**：
   - 在 AudioManager 节点上添加 **AudioSource** 组件
   - 重命名为 "SoundEffectSource"
   - 拖拽到 `soundEffectSource` 属性

3. **UI声音音频源**：
   - 在 AudioManager 节点上添加 **AudioSource** 组件
   - 重命名为 "UISoundSource"
   - 拖拽到 `uiSoundSource` 属性

4. **语音音频源**：
   - 在 AudioManager 节点上添加 **AudioSource** 组件
   - 重命名为 "VoiceSource"
   - 拖拽到 `voiceSource` 属性

### 4. 导入音频资源
将音频文件（.mp3/.wav）导入到项目：

1. 在 **资源管理器** 中创建文件夹：`assets/audio/`
2. 导入音频文件到该文件夹
3. 为每个音频文件创建 **AudioClip** 资源

### 5. 配置音频剪辑引用
将 AudioClip 拖拽到对应属性：

| 属性 | 描述 | 建议文件名 |
|------|------|------------|
| `backgroundMusic` | 背景音乐 | bgm_main.mp3 |
| `towerPlaceSound` | 塔放置音效 | sfx_tower_place.mp3 |
| `towerUpgradeSound` | 塔升级音效 | sfx_tower_upgrade.mp3 |
| `enemyDeathSound` | 敌人死亡音效 | sfx_enemy_death.mp3 |
| `enemyHitSound` | 敌人受击音效 | sfx_enemy_hit.mp3 |
| `buttonClickSound` | 按钮点击音效 | sfx_button_click.mp3 |
| `waveStartSound` | 波次开始音效 | sfx_wave_start.mp3 |
| `waveCompleteSound` | 波次完成音效 | sfx_wave_complete.mp3 |
| `levelCompleteSound` | 关卡完成音效 | sfx_level_complete.mp3 |
| `gameOverSound` | 游戏结束音效 | sfx_game_over.mp3 |

### 6. 配置音量设置（可选）
| 属性 | 默认值 | 说明 |
|------|--------|------|
| `_masterVolume` | 1.0 | 主音量（代码控制） |
| `_musicVolume` | 0.8 | 音乐音量（代码控制） |
| `_sfxVolume` | 1.0 | 音效音量（代码控制） |
| `_uiVolume` | 1.0 | UI音量（代码控制） |
| `_voiceVolume` | 1.0 | 语音音量（代码控制） |

## 验证配置
1. 运行游戏
2. 检查背景音乐是否自动播放
3. 测试音效播放（塔放置、敌人死亡等）
4. 验证音量控制功能

## 使用方法
### 代码中播放音效
```typescript
// 播放预定义音效
AudioManager.instance?.playTowerPlaceSound();
AudioManager.instance?.playEnemyDeathSound();

// 播放自定义音效
AudioManager.instance?.playSoundEffect(myAudioClip, 0.8);
```

### 音量控制
```typescript
// 设置音量
AudioManager.instance?.setMasterVolume(0.7);
AudioManager.instance?.setMusicVolume(0.5);

// 切换静音
const isMuted = AudioManager.instance?.toggleMute();
```

## 注意事项
- 音频文件大小不宜过大，建议使用压缩格式
- 背景音乐建议使用循环播放的音频
- 音效建议使用短小精悍的音频（< 2秒）
- 音频池最多支持10个同时播放的音效，可根据需求调整