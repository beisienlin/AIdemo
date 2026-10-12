// Game Entities: Mario, Enemies, Items, and Particle Effects

// Floating Score Popups
class ScorePopup {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.vy = -50;
    this.life = 0.6;
    this.alpha = 1;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0.2) {
      this.alpha = Math.max(0, this.life / 0.2);
    }
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(this.text, Math.floor(this.x - cameraX), Math.floor(this.y));
    ctx.restore();
  }
}

// Bouncing Coin from '?' Block
class BlockCoin {
  constructor(x, y) {
    this.x = x;
    this.y = y - 8;
    this.vy = -180;
    this.gravity = 650;
    this.animTimer = 0;
    this.startY = y - 8;
    this.done = false;
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.y += this.vy * dt;
    this.animTimer += dt * 16;
    if (this.vy > 0 && this.y >= this.startY) {
      this.done = true;
    }
  }

  draw(ctx, cameraX) {
    const frame = (Math.floor(this.animTimer) % 4) + 1;
    const sprite = Sprites.get(`coin_${frame}`);
    if (sprite) {
      ctx.drawImage(sprite, Math.floor(this.x - cameraX), Math.floor(this.y));
    }
  }
}

// Brick Shard Particle
class BrickDebris {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = 700;
    this.angle = 0;
    this.rotSpeed = (Math.random() - 0.5) * 15;
    this.done = false;
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.rotSpeed * dt;
    if (this.y > 260) this.done = true;
  }

  draw(ctx, cameraX) {
    const sprite = Sprites.get('brick_debris');
    if (!sprite) return;
    ctx.save();
    ctx.translate(Math.floor(this.x - cameraX), Math.floor(this.y));
    ctx.rotate(this.angle);
    ctx.drawImage(sprite, -4, -4);
    ctx.restore();
  }
}

// Super Mushroom Item
class Mushroom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 16;
    this.h = 16;
    this.vx = 55;
    this.vy = 0;
    this.gravity = 750;
    this.emerging = true;
    this.emergeTargetY = y - 16;
    this.done = false;
  }

  update(dt, level) {
    if (this.emerging) {
      this.y -= 30 * dt;
      if (this.y <= this.emergeTargetY) {
        this.y = this.emergeTargetY;
        this.emerging = false;
      }
      return;
    }

    // Apply gravity
    this.vy = Math.min(350, this.vy + this.gravity * dt);

    // Horizontal Movement & Collisions
    const nextX = this.x + this.vx * dt;
    if (level.isSolid(nextX + (this.vx > 0 ? this.w : 0), this.y + 8)) {
      this.vx = -this.vx;
    } else {
      this.x = nextX;
    }

    // Vertical Movement & Collisions
    const nextY = this.y + this.vy * dt;
    if (this.vy > 0 && (level.isSolid(this.x + 2, nextY + this.h) || level.isSolid(this.x + this.w - 2, nextY + this.h))) {
      this.y = Math.floor((nextY + this.h) / 16) * 16 - this.h;
      this.vy = 0;
    } else {
      this.y = nextY;
    }

    if (this.y > 250) this.done = true;
  }

  draw(ctx, cameraX) {
    const sprite = Sprites.get('mushroom');
    if (sprite) {
      ctx.drawImage(sprite, Math.floor(this.x - cameraX), Math.floor(this.y));
    }
  }
}

// Goomba (Kuribo) Enemy
class Goomba {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 16;
    this.h = 16;
    this.vx = -38;
    this.vy = 0;
    this.gravity = 800;
    this.state = 'WALK'; // 'WALK', 'FLAT', 'DEAD'
    this.flatTimer = 0;
    this.animTimer = 0;
    this.done = false;
  }

  update(dt, level) {
    if (this.state === 'FLAT') {
      this.flatTimer += dt;
      if (this.flatTimer > 0.45) this.done = true;
      return;
    }

    if (this.state === 'DEAD') {
      this.vy += this.gravity * dt;
      this.y += this.vy * dt;
      if (this.y > 260) this.done = true;
      return;
    }

    this.animTimer += dt * 6;
    this.vy = Math.min(380, this.vy + this.gravity * dt);

    // Horizontal move & tile bounce
    const nextX = this.x + this.vx * dt;
    const checkX = this.vx > 0 ? nextX + this.w : nextX;
    if (level.isSolid(checkX, this.y + 4) || level.isSolid(checkX, this.y + 12)) {
      this.vx = -this.vx;
    } else {
      this.x = nextX;
    }

    // Vertical move & ground collision
    const nextY = this.y + this.vy * dt;
    if (this.vy > 0 && (level.isSolid(this.x + 2, nextY + this.h) || level.isSolid(this.x + this.w - 2, nextY + this.h))) {
      this.y = Math.floor((nextY + this.h) / 16) * 16 - this.h;
      this.vy = 0;
    } else {
      this.y = nextY;
    }

    if (this.y > 250) this.done = true;
  }

  stomp() {
    this.state = 'FLAT';
    this.vx = 0;
    this.vy = 0;
  }

  kickKill(dir = 1) {
    this.state = 'DEAD';
    this.vx = dir * 80;
    this.vy = -180;
  }

  draw(ctx, cameraX) {
    let sprite;
    if (this.state === 'FLAT') {
      sprite = Sprites.get('goomba_flat');
    } else if (this.state === 'DEAD') {
      sprite = Sprites.get('goomba_walk1');
    } else {
      const f = (Math.floor(this.animTimer) % 2) === 0 ? 'goomba_walk1' : 'goomba_walk2';
      sprite = Sprites.get(f);
    }

    if (sprite) {
      ctx.save();
      if (this.state === 'DEAD') {
        ctx.translate(Math.floor(this.x - cameraX) + 8, Math.floor(this.y) + 8);
        ctx.scale(1, -1);
        ctx.drawImage(sprite, -8, -8);
      } else {
        ctx.drawImage(sprite, Math.floor(this.x - cameraX), Math.floor(this.y));
      }
      ctx.restore();
    }
  }
}

// Koopa Troopa Enemy
class Koopa {
  constructor(x, y) {
    this.x = x;
    this.y = y - 8; // 24px high
    this.w = 16;
    this.h = 24;
    this.vx = -35;
    this.vy = 0;
    this.gravity = 800;
    this.state = 'WALK'; // 'WALK', 'SHELL_IDLE', 'SHELL_SLIDE', 'DEAD'
    this.animTimer = 0;
    this.done = false;
  }

  update(dt, level, enemies, addScore) {
    this.vy = Math.min(380, this.vy + this.gravity * dt);

    if (this.state === 'DEAD') {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.y > 260) this.done = true;
      return;
    }

    if (this.state === 'WALK') {
      this.animTimer += dt * 6;
      const nextX = this.x + this.vx * dt;
      const checkX = this.vx > 0 ? nextX + this.w : nextX;
      if (level.isSolid(checkX, this.y + 6) || level.isSolid(checkX, this.y + 20)) {
        this.vx = -this.vx;
      } else {
        this.x = nextX;
      }
    } else if (this.state === 'SHELL_SLIDE') {
      const nextX = this.x + this.vx * dt;
      const checkX = this.vx > 0 ? nextX + this.w : nextX;
      if (level.isSolid(checkX, this.y + 8)) {
        this.vx = -this.vx;
        Sound.playBump();
      } else {
        this.x = nextX;
      }

      // Hit other enemies while sliding!
      for (const enemy of enemies) {
        if (enemy !== this && !enemy.done && enemy.state !== 'DEAD' && enemy.state !== 'FLAT') {
          if (Math.abs(enemy.x - this.x) < 14 && Math.abs(enemy.y - this.y) < 16) {
            enemy.kickKill(this.vx > 0 ? 1 : -1);
            Sound.playKick();
            addScore(200, enemy.x, enemy.y);
          }
        }
      }
    }

    // Vertical move & ground
    const nextY = this.y + this.vy * dt;
    if (this.vy > 0 && (level.isSolid(this.x + 2, nextY + this.h) || level.isSolid(this.x + this.w - 2, nextY + this.h))) {
      this.y = Math.floor((nextY + this.h) / 16) * 16 - this.h;
      this.vy = 0;
    } else {
      this.y = nextY;
    }

    if (this.y > 250) this.done = true;
  }

  stomp() {
    if (this.state === 'WALK') {
      this.state = 'SHELL_IDLE';
      this.vx = 0;
      this.h = 16;
      this.y += 8;
    } else if (this.state === 'SHELL_SLIDE') {
      this.state = 'SHELL_IDLE';
      this.vx = 0;
    } else if (this.state === 'SHELL_IDLE') {
      this.kick(1);
    }
  }

  kick(dir = 1) {
    this.state = 'SHELL_SLIDE';
    this.vx = dir * 210;
    Sound.playKick();
  }

  kickKill(dir = 1) {
    this.state = 'DEAD';
    this.vx = dir * 80;
    this.vy = -180;
  }

  draw(ctx, cameraX) {
    let sprite;
    if (this.state === 'WALK') {
      const f = (Math.floor(this.animTimer) % 2) === 0 ? 'koopa_walk1' : 'koopa_walk2';
      sprite = Sprites.get(f);
    } else {
      sprite = Sprites.get('koopa_shell');
    }

    if (sprite) {
      ctx.save();
      const drawX = Math.floor(this.x - cameraX);
      const drawY = Math.floor(this.y);
      if (this.vx > 0 && this.state === 'WALK') {
        ctx.translate(drawX + 16, drawY);
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, 0, 0);
      } else {
        ctx.drawImage(sprite, drawX, drawY);
      }
      ctx.restore();
    }
  }
}

// The Player: Mario
class Mario {
  constructor(x, y) {
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.w = 12; // Precise collision box
    this.h = 16;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1: Right, -1: Left
    this.grounded = false;
    this.isSuper = false;
    this.isDucking = false;
    this.state = 'NORMAL'; // 'NORMAL', 'TRANSFORM', 'DYING', 'FLAGPOLE', 'CASTLE_WALK'

    this.runAnimTimer = 0;
    this.skidding = false;
    this.invulnerableTimer = 0;
    this.transformTimer = 0;
    this.coyoteTime = 0;
    this.jumpHold = false;
    this.slideY = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
  }

  update(dt, input, level, onAction) {
    // Handling Transformation Flash Animation
    if (this.state === 'TRANSFORM') {
      this.transformTimer -= dt;
      if (this.transformTimer <= 0) {
        this.state = 'NORMAL';
      }
      return;
    }

    // Handling Dying Animation
    if (this.state === 'DYING') {
      this.vy += 850 * dt;
      this.y += this.vy * dt;
      return;
    }

    // Handling Flagpole sliding
    if (this.state === 'FLAGPOLE') {
      if (this.y < 168) {
        this.y += 110 * dt;
      } else {
        this.y = 168;
        this.state = 'CASTLE_WALK';
        this.facing = 1;
      }
      return;
    }

    // Automatic walking towards Castle after flagpole
    if (this.state === 'CASTLE_WALK') {
      this.runAnimTimer += dt * 10;
      this.x += 65 * dt;
      // Reached inside castle
      if (this.x >= (level.castleDoorX || 3280)) {
        onAction('VICTORY');
      }
      return;
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // --- Movement Physics ---
    const accel = 520;
    const friction = 0.86;
    const maxSpeed = input.run ? 195 : 125;

    // Ducking (Only Super Mario)
    if (this.isSuper) {
      if (input.down && this.grounded) {
        this.isDucking = true;
        this.h = 16;
      } else {
        // If releasing down, check if ceiling blocks standing up
        const headCheck = level.isSolid(this.x + 4, this.y - 10) || level.isSolid(this.x + this.w - 2, this.y - 10);
        if (headCheck) {
          this.isDucking = true;
          this.h = 16;
        } else {
          this.isDucking = false;
          this.h = 28;
        }
      }
    } else {
      this.isDucking = false;
      this.h = 16;
    }

    // Horizontal Input
    if (!this.isDucking) {
      if (input.left) {
        if (this.vx > 25) {
          this.skidding = true;
          this.vx -= accel * 1.6 * dt;
        } else {
          this.skidding = false;
          this.vx = Math.max(-maxSpeed, this.vx - accel * dt);
          this.facing = -1;
        }
      } else if (input.right) {
        if (this.vx < -25) {
          this.skidding = true;
          this.vx += accel * 1.6 * dt;
        } else {
          this.skidding = false;
          this.vx = Math.min(maxSpeed, this.vx + accel * dt);
          this.facing = 1;
        }
      } else {
        this.skidding = false;
        this.vx *= Math.pow(friction, dt * 60);
        if (Math.abs(this.vx) < 5) this.vx = 0;
      }
    } else {
      // Slide while ducking
      this.vx *= Math.pow(0.92, dt * 60);
      if (Math.abs(this.vx) < 5) this.vx = 0;
    }

    // Animation running timer
    if (Math.abs(this.vx) > 10 && this.grounded) {
      this.runAnimTimer += dt * (Math.abs(this.vx) / 10);
    } else {
      this.runAnimTimer = 0;
    }

    // Coyote time for responsive jumps
    if (this.grounded) {
      this.coyoteTime = 0.08;
    } else {
      this.coyoteTime -= dt;
    }

    // Jumping
    if (input.jumpPressed && (this.grounded || this.coyoteTime > 0)) {
      this.vy = -340;
      this.grounded = false;
      this.coyoteTime = 0;
      this.jumpHold = true;
      if (this.isSuper) Sound.playSuperJump();
      else Sound.playJump();
    }

    if (!input.jump) {
      this.jumpHold = false;
    }

    // Variable Jump Gravity: Lower gravity while holding jump ascending
    const gravity = (this.jumpHold && this.vy < 0) ? 580 : 1000;
    this.vy = Math.min(420, this.vy + gravity * dt);

    // --- Horizontal Tile Collisions ---
    const nextX = this.x + this.vx * dt;
    // Don't allow moving left past camera left bound
    const minX = Math.max(0, level.cameraX);
    const clampedNextX = Math.max(minX, nextX);

    // Collision check boxes (feet, center, top)
    const checkRight = clampedNextX + this.w + 2;
    const checkLeft = clampedNextX + 2;
    const topY = this.y + 4;
    const midY = this.y + this.h / 2;
    const botY = this.y + this.h - 2;

    if (this.vx > 0) {
      if (level.isSolid(checkRight, topY) || level.isSolid(checkRight, midY) || level.isSolid(checkRight, botY)) {
        this.x = Math.floor(checkRight / 16) * 16 - this.w - 2;
        this.vx = 0;
      } else {
        this.x = clampedNextX;
      }
    } else if (this.vx < 0) {
      if (level.isSolid(checkLeft, topY) || level.isSolid(checkLeft, midY) || level.isSolid(checkLeft, botY)) {
        this.x = Math.floor(checkLeft / 16) * 16 + 16 - 2;
        this.vx = 0;
      } else {
        this.x = clampedNextX;
      }
    } else {
      this.x = clampedNextX;
    }

    // --- Vertical Tile Collisions ---
    const nextY = this.y + this.vy * dt;
    this.grounded = false;

    if (this.vy > 0) { // Falling down
      const footLeft = this.x + 3;
      const footRight = this.x + this.w - 1;
      const checkBottom = nextY + this.h;

      if (level.isSolid(footLeft, checkBottom) || level.isSolid(footRight, checkBottom)) {
        this.y = Math.floor(checkBottom / 16) * 16 - this.h;
        this.vy = 0;
        this.grounded = true;
      } else {
        this.y = nextY;
      }
    } else if (this.vy < 0) { // Jumping up (Hitting blocks)
      const headLeft = this.x + 4;
      const headRight = this.x + this.w - 2;
      const checkTop = nextY;

      const hitTileL = level.getTileAt(headLeft, checkTop);
      const hitTileR = level.getTileAt(headRight, checkTop);

      if (hitTileL.solid || hitTileR.solid) {
        this.y = Math.floor(checkTop / 16) * 16 + 16;
        this.vy = 40; // Rebound down

        // Hit tile from below!
        const hitTile = hitTileL.solid ? hitTileL : hitTileR;
        onAction('HIT_BLOCK', hitTile);
      } else {
        this.y = nextY;
      }
    } else {
      this.y = nextY;
    }

    // Check bottom pit death
    if (this.y > 230) {
      this.die();
      onAction('MARIO_FELL');
    }

    // Check Flagpole
    if (level.flagpoleX && this.x >= level.flagpoleX - 6 && this.x <= level.flagpoleX + 10 && this.state === 'NORMAL') {
      this.state = 'FLAGPOLE';
      this.vx = 0;
      this.vy = 0;
      this.x = level.flagpoleX - 6;
      Sound.playFlagpole();
      onAction('HIT_FLAGPOLE', { y: this.y });
    }
  }

  powerUp() {
    if (!this.isSuper) {
      this.isSuper = true;
      this.h = 28;
      this.y -= 14;
      this.state = 'TRANSFORM';
      this.transformTimer = 0.8;
      Sound.playPowerup();
    }
  }

  takeDamage() {
    if (this.invulnerableTimer > 0) return;

    if (this.isSuper) {
      this.isSuper = false;
      this.h = 16;
      this.y += 12;
      this.invulnerableTimer = 2.2;
      this.state = 'TRANSFORM';
      this.transformTimer = 0.6;
      Sound.playPowerdown();
    } else {
      this.die();
    }
  }

  die() {
    if (this.state === 'DYING') return;
    this.state = 'DYING';
    this.vx = 0;
    this.vy = -360;
    this.lives--;
    Sound.playDie();
  }

  draw(ctx, cameraX) {
    if (this.invulnerableTimer > 0) {
      // Blinking effect
      if (Math.floor(this.invulnerableTimer * 20) % 2 === 0) return;
    }

    let spriteName = 'mario_idle';

    if (this.state === 'DYING') {
      spriteName = 'mario_die';
    } else if (this.isSuper) {
      if (this.isDucking) {
        spriteName = 'super_duck';
      } else if (!this.grounded) {
        spriteName = 'super_jump';
      } else if (this.skidding) {
        spriteName = 'super_skid';
      } else if (Math.abs(this.vx) > 10) {
        const frame = (Math.floor(this.runAnimTimer) % 3) + 1;
        spriteName = `super_run${frame}`;
      } else {
        spriteName = 'super_idle';
      }
    } else {
      if (!this.grounded) {
        spriteName = 'mario_jump';
      } else if (this.skidding) {
        spriteName = 'mario_skid';
      } else if (Math.abs(this.vx) > 10) {
        const frame = (Math.floor(this.runAnimTimer) % 3) + 1;
        spriteName = `mario_run${frame}`;
      } else {
        spriteName = 'mario_idle';
      }
    }

    // Flash during power up transformation
    if (this.state === 'TRANSFORM' && Math.floor(this.transformTimer * 25) % 2 === 0) {
      spriteName = this.isSuper ? 'mario_idle' : 'super_idle';
    }

    const sprite = Sprites.get(spriteName) || Sprites.get('mario_idle');
    if (!sprite) return;

    ctx.save();
    const drawX = Math.floor(this.x - cameraX) - 2;
    // Align super mario properly
    const drawY = Math.floor(this.y) - (this.isSuper && !this.isDucking ? 4 : 0);

    if (this.facing === -1) {
      ctx.translate(drawX + 16, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0);
    } else {
      ctx.drawImage(sprite, drawX, drawY);
    }
    ctx.restore();
  }
}
