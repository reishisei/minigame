## ADDED Requirements

### Requirement: Multiple enemy types
The game SHALL include at least five distinct enemy types with varying behaviors, strengths, and weaknesses.

#### Scenario: Enemy type variety in waves
- **WHEN** enemy waves spawn
- **THEN** different enemy types appear based on wave composition

#### Scenario: Enemy visual differentiation
- **WHEN** different enemy types appear on screen
- **THEN** each type has distinct visual appearance for easy identification

### Requirement: Fast enemy type
The game SHALL include a Fast enemy that moves quickly but has low health.

#### Scenario: Fast enemy movement
- **WHEN** Fast enemy spawns
- **THEN** its movement speed is at least 200% of the basic enemy speed

#### Scenario: Fast enemy fragility
- **WHEN** Fast enemy is attacked
- **THEN** it has 50% less health than the basic enemy

### Requirement: Armored enemy type
The game SHALL include an Armored enemy with high damage resistance but slow movement.

#### Scenario: Armored enemy damage reduction
- **WHEN** Armored enemy is attacked by physical damage towers
- **THEN** it takes 50% less damage

#### Scenario: Armored enemy vulnerability to magic
- **WHEN** Armored enemy is attacked by magic damage towers (Mage)
- **THEN** it takes normal damage (no resistance)

### Requirement: Flying enemy type
The game SHALL include a Flying enemy that can bypass ground-based obstacles and some towers.

#### Scenario: Flying enemy movement
- **WHEN** Flying enemy spawns
- **THEN** it follows a path above ground level

#### Scenario: Flying enemy tower vulnerability
- **WHEN** Flying enemy is within range
- **THEN** only towers with anti-air capability (Archer, Sniper) can attack it

### Requirement: Boss enemy type
The game SHALL include a Boss enemy with very high health that appears in later waves.

#### Scenario: Boss enemy spawn timing
- **WHEN** player reaches wave 10 or higher
- **THEN** Boss enemies may appear in wave compositions

#### Scenario: Boss enemy durability
- **WHEN** Boss enemy spawns
- **THEN** it has at least 10 times the health of a basic enemy

#### Scenario: Boss enemy reward
- **WHEN** Boss enemy is defeated
- **THEN** it drops significantly more gold and experience than regular enemies

### Requirement: Swarm enemy type
The game SHALL include a Swarm enemy that appears in large groups with very low individual health.

#### Scenario: Swarm enemy group size
- **WHEN** Swarm enemies spawn
- **THEN** they appear in groups of at least 5 enemies

#### Scenario: Swarm enemy fragility
- **WHEN** Swarm enemy is attacked
- **THEN** it has 20% of the basic enemy's health

### Requirement: Enemy behavior consistency
All enemy types SHALL inherit from the base Enemy class and integrate with existing damage and movement systems.

#### Scenario: Enemy death consistency
- **WHEN** any enemy type is defeated
- **THEN** it drops gold and experience according to its type's configured values

#### Scenario: Enemy pathfinding consistency
- **WHEN** any enemy type moves
- **THEN** it follows the same path system as basic enemies