## ADDED Requirements

### Requirement: Dual-layer skill system
The game SHALL implement two distinct skill layers: tower-specific active abilities and global passive upgrades.

#### Scenario: Skill system access
- **WHEN** player accesses the skills menu
- **THEN** both tower skills and global skills sections are available

#### Scenario: Skill point currency
- **WHEN** player earns skill points
- **THEN** they can be spent on either tower skills or global skills

### Requirement: Skill point acquisition
Players SHALL earn skill points through gameplay progression.

#### Scenario: Level completion reward
- **WHEN** player completes a level
- **THEN** they receive skill points based on level difficulty

#### Scenario: Achievement rewards
- **WHEN** player unlocks an achievement
- **THEN** they may receive skill points as part of the reward

### Requirement: Tower-specific active skills
Each tower type SHALL have at least one unique active skill that can be unlocked and upgraded.

#### Scenario: Tower skill availability
- **WHEN** player selects a tower in the skills menu
- **THEN** its available active skills are displayed

#### Scenario: Active skill activation
- **WHEN** player activates a tower's active skill during gameplay
- **THEN** the skill executes with appropriate visual and gameplay effects

#### Scenario: Active skill cooldown
- **WHEN** player uses a tower's active skill
- **THEN** the skill enters a cooldown period before it can be used again

### Requirement: Global passive skills
The game SHALL include global passive skills that provide benefits across all towers or game systems.

#### Scenario: Global skill categories
- **WHEN** player views global skills
- **THEN** skills are organized into categories (economy, combat, utility, etc.)

#### Scenario: Passive effect application
- **WHEN** player unlocks a global passive skill
- **THEN** its effect is automatically applied to all relevant game systems

### Requirement: Skill unlock progression
Skills SHALL be unlocked in a logical progression with increasing costs.

#### Scenario: Skill unlock requirements
- **WHEN** player attempts to unlock a skill
- **THEN** they must meet prerequisite conditions (minimum player level, other skills unlocked, etc.)

#### Scenario: Skill cost scaling
- **WHEN** player unlocks higher-tier skills
- **THEN** they require more skill points than lower-tier skills

### Requirement: Skill upgrade levels
Skills SHALL support multiple upgrade levels with improving effects.

#### Scenario: Skill upgrading
- **WHEN** player upgrades an already unlocked skill
- **THEN** its effect strength or efficiency increases

#### Scenario: Upgrade cost progression
- **WHEN** player upgrades a skill to higher levels
- **THEN** each successive upgrade costs more skill points

### Requirement: Skill reset functionality
Players SHALL be able to reset their skill allocations with appropriate cost or limitation.

#### Scenario: Skill reset availability
- **WHEN** player accesses the skills menu
- **THEN** an option to reset skills is available (with appropriate cost or cooldown)

#### Scenario: Reset confirmation
- **WHEN** player initiates a skill reset
- **THEN** they are prompted for confirmation before proceeding

### Requirement: Skill effect clarity
All skill effects SHALL be clearly communicated to the player.

#### Scenario: Skill description
- **WHEN** player views a skill in the skills menu
- **THEN** its current effect, upgrade potential, and cost are clearly displayed

#### Scenario: Active skill visualization
- **WHEN** an active skill is available for use
- **THEN** its readiness state is visually indicated on the tower or in the UI

### Requirement: Skill system integration
The skill system SHALL integrate with existing tower and game systems without breaking existing functionality.

#### Scenario: Tower skill compatibility
- **WHEN** a tower skill is unlocked
- **THEN** it works correctly with the tower's existing attack and upgrade systems

#### Scenario: Global skill balance
- **WHEN** global skills are unlocked
- **THEN** they provide balanced benefits without making the game trivial