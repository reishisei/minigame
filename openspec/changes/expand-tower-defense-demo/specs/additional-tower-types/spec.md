## ADDED Requirements

### Requirement: Four new tower types
The game SHALL include four new tower types beyond the existing Archer, Musketeer, and Cannon, each with unique mechanics and strategic roles.

#### Scenario: Tower type variety
- **WHEN** player accesses the shop
- **THEN** four new tower options are available for purchase alongside existing towers

#### Scenario: Unique tower mechanics
- **WHEN** player examines each new tower type
- **THEN** each tower has distinct attributes (damage type, attack pattern, special ability) that differentiate it from existing towers

### Requirement: Mage tower with area damage
The game SHALL include a Mage tower that deals splash damage to multiple enemies within an area.

#### Scenario: Mage tower splash attack
- **WHEN** Mage tower attacks an enemy
- **THEN** all enemies within 100 pixels of the target receive 50% of the attack damage

#### Scenario: Mage tower visual feedback
- **WHEN** Mage tower performs an attack
- **THEN** a visual area effect shows the splash radius

### Requirement: Ice tower with slowing effect
The game SHALL include an Ice tower that slows enemy movement speed with its attacks.

#### Scenario: Ice tower slow effect
- **WHEN** Ice tower hits an enemy
- **THEN** the enemy's movement speed is reduced by 40% for 3 seconds

#### Scenario: Slow effect stacking prevention
- **WHEN** Ice tower hits an already slowed enemy
- **THEN** the slow duration is refreshed but the effect does not stack beyond 40%

### Requirement: Support tower with buffing ability
The game SHALL include a Support tower that provides buffs to nearby friendly towers.

#### Scenario: Support tower aura
- **WHEN** Support tower is placed
- **THEN** all towers within 200 pixels receive a 15% damage increase

#### Scenario: Buff visualization
- **WHEN** a tower is within Support tower's aura range
- **THEN** a visual indicator shows the buff is active

### Requirement: Sniper tower with long range
The game SHALL include a Sniper tower with extended range and high single-target damage.

#### Scenario: Sniper tower range
- **WHEN** Sniper tower is placed
- **THEN** its attack range is at least 800 pixels (significantly longer than other towers)

#### Scenario: Sniper attack speed trade-off
- **WHEN** Sniper tower attacks
- **THEN** its attack speed is slower than other towers (at least 3 seconds between attacks)

### Requirement: New tower integration with existing systems
All new tower types SHALL integrate with the existing Soldier class hierarchy, shop system, and upgrade mechanics.

#### Scenario: Tower purchasing consistency
- **WHEN** player purchases a new tower type
- **THEN** it uses the same gold currency and slot placement system as existing towers

#### Scenario: Tower upgrading consistency
- **WHEN** player upgrades a new tower type
- **THEN** it follows the same upgrade cost progression and stat improvements as existing towers