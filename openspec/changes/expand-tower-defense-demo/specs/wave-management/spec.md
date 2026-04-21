## ADDED Requirements

### Requirement: Wave-based enemy spawning
The game SHALL replace the simple periodic enemy spawner with a wave-based system that manages enemy groups.

#### Scenario: Wave progression
- **WHEN** player starts a level
- **THEN** enemies spawn in defined waves rather than continuously

#### Scenario: Wave completion
- **WHEN** all enemies in a wave are defeated
- **THEN** a brief intermission occurs before the next wave begins

### Requirement: Wave composition definition
Each wave SHALL have a defined composition of enemy types and quantities.

#### Scenario: Wave variety
- **WHEN** different waves spawn
- **THEN** each wave has a unique mix of enemy types and quantities

#### Scenario: Progressive difficulty
- **WHEN** player progresses through waves
- **THEN** later waves contain more enemies, tougher enemy types, or special combinations

### Requirement: Wave timing control
The system SHALL control timing between waves and within waves.

#### Scenario: Inter-wave pause
- **WHEN** a wave is completed
- **THEN** there is a configurable pause (e.g., 10-30 seconds) before the next wave begins

#### Scenario: Intra-wave spacing
- **WHEN** enemies spawn within a wave
- **THEN** there can be configurable delays between individual enemy spawns

### Requirement: Wave information display
Players SHALL be informed about current and upcoming wave information.

#### Scenario: Wave counter
- **WHEN** player is in a level
- **THEN** the current wave number and total waves are displayed

#### Scenario: Next wave preview
- **WHEN** between waves
- **THEN** information about the next wave's enemy composition is available

#### Scenario: Wave progress indicator
- **WHEN** wave is active
- **THEN** a visual indicator shows how many enemies remain in the current wave

### Requirement: Special wave types
The system SHALL support special wave configurations for variety and challenge.

#### Scenario: Boss waves
- **WHEN** certain wave numbers are reached (e.g., every 10th wave)
- **THEN** the wave features one or more boss enemies

#### Scenario: Swarm waves
- **WHEN** swarm waves occur
- **THEN** the wave consists of many low-health enemies

#### Scenario: Mixed waves
- **WHEN** mixed waves occur
- **THEN** the wave includes strategic combinations of different enemy types

### Requirement: Wave data management
Wave configurations SHALL be data-driven and easily modifiable.

#### Scenario: Wave configuration files
- **WHEN** waves are defined for a level
- **THEN** their composition and timing are stored in JSON configuration files

#### Scenario: Level-wave association
- **WHEN** a level is loaded
- **THEN** its associated wave configurations are loaded from the level's data

### Requirement: Wave difficulty scaling
Wave difficulty SHALL scale appropriately with player progression and game mode.

#### Scenario: Level-based difficulty
- **WHEN** player advances to higher levels
- **THEN** waves in those levels have higher base difficulty

#### Scenario: Endless mode scaling
- **WHEN** player is in endless mode
- **THEN** wave difficulty increases progressively with each completed wave

### Requirement: Wave control options
Players SHALL have some control over wave timing during gameplay.

#### Scenario: Wave start control
- **WHEN** between waves
- **THEN** player can choose to start the next wave early (optional)

#### Scenario: Wave pause
- **WHEN** wave is active
- **THEN** player can pause the game, which also pauses wave spawning

### Requirement: Wave completion rewards
Completing waves SHALL provide appropriate rewards to the player.

#### Scenario: Wave completion bonus
- **WHEN** player completes a wave
- **THEN** they receive a gold bonus based on wave difficulty

#### Scenario: Special wave rewards
- **WHEN** player completes a special wave (boss wave, etc.)
- **THEN** they receive additional or special rewards

### Requirement: Wave system integration
The wave management system SHALL integrate cleanly with existing enemy and game systems.

#### Scenario: Enemy spawning compatibility
- **WHEN** wave system spawns enemies
- **THEN** they use the same enemy prefabs and initialization as the old spawner

#### Scenario: Game state integration
- **WHEN** waves are active
- **THEN** the game state (paused, game over, etc.) properly affects wave spawning