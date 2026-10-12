// Core Game Engine & Controller

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    // Set internal resolution: 256x224 (Classic NES standard)
    this.canvas.width = 256;
    this.canvas.height = 224;

    this.state = 'TITLE'; // 'TITLE', 'PLAYING', 'PAUSED', 'GAMEOVER', 'LEVEL_CLEAR'
    this.highScore = parseInt(localStorage.getItem('mario_high_score') || '0', 10);
    this.lastTime = 0;
    this.qAnimTimer = 0;
    this.timer = 300;
    this.timeCounter = 0;
    this.isRespawning = false;

    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      jumpPressed: false,
      run: false
    };

    this.cameraX = 0;
    this.mario = new Mario(40, 160);
    this.level = new Level();
    this.enemies = [];
    this.items = [];
    this.particles = [];
    this.scorePopups = [];

    this.initEnemyDefs();
    this.bindEvents();
  }

  initEnemyDefs() {
    this.enemySpawns = [
      { type: 'goomba', x: 22 * 16, y: 11 * 16 },
      { type: 'goomba', x: 40 * 16, y: 11 * 16 },
      { type: 'goomba', x: 51 * 16, y: 11 * 16 },
      { type: 'goomba', x: 53 * 16, y: 11 * 16 },
      { type: 'goomba', x: 80 * 16, y: 11 * 16 },
      { type: 'goomba', x: 82 * 16, y: 11 * 16 },
      { type: 'goomba', x: 97 * 16, y: 11 * 16 },
      { type: 'koopa',  x: 107 * 16, y: 11 * 16 },
      { type: 'goomba', x: 114 * 16, y: 11 * 16 },
      { type: 'goomba', x: 116 * 16, y: 11 * 16 },
      { type: 'goomba', x: 125 * 16, y: 11 * 16 },
      { type: 'goomba', x: 127 * 16, y: 11 * 16 },
      { type: 'goomba', x: 174 * 16, y: 11 * 16 },
      { type: 'goomba', x: 176 * 16, y: 11 * 16 }
    ];
  }

  startNewGame() {
    this.mario.reset(40, 160);
    this.mario.score = 0;
    this.mario.coins = 0;
    this.mario.lives = 3;
    this.timer = 300;
    this.cameraX = 0;
    this.level = new Level();
    this.enemies = [];
    this.items = [];
    this.particles = [];
    this.scorePopups = [];
    this.initEnemyDefs();
    this.state = 'PLAYING';
    Sound.startBGM();
  }

  scheduleRespawn(delayMs = 1200) {
    if (this.isRespawning) return;
    this.isRespawning = true;
    setTimeout(() => {
      this.respawnMario();
    }, delayMs);
  }

  respawnMario() {
    this.isRespawning = false;
    if (this.mario.lives <= 0) {
      this.state = 'GAMEOVER';
      Sound.stopBGM();
      return;
    }
    // Respawn small mario safely behind camera advance
    const spawnX = Math.max(40, this.cameraX + 20);
    this.mario.reset(spawnX, 160);
    this.timer = 300;
    Sound.startBGM();
  }

  addScore(points, x, y) {
    this.mario.score += points;
    if (this.mario.score > this.highScore) {
      this.highScore = this.mario.score;
      localStorage.setItem('mario_high_score', this.highScore.toString());
    }
    if (x !== undefined && y !== undefined) {
      this.scorePopups.push(new ScorePopup(x, y, `+${points}`));
    }
  }

  bindEvents() {
    // Keyboard Input
    window.addEventListener('keydown', (e) => {
      Sound.ensureContext();

      if (e.code === 'KeyP') {
        this.togglePause();
        return;
      }
      if (e.code === 'KeyM') {
        const muted = Sound.toggleMute();
        this.updateMuteBtn(muted);
        return;
      }
      if (e.code === 'KeyC') {
        this.toggleCRT();
        return;
      }

      if (this.state === 'TITLE' && (e.code === 'Space' || e.code === 'Enter')) {
        this.startNewGame();
        return;
      }

      if (this.state === 'GAMEOVER' && (e.code === 'Space' || e.code === 'Enter')) {
        this.startNewGame();
        return;
      }

      if (this.state === 'LEVEL_CLEAR' && (e.code === 'Space' || e.code === 'Enter')) {
        this.startNewGame();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.input.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.input.right = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') this.input.down = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space' || e.code === 'KeyZ') {
        if (!this.input.jump) this.input.jumpPressed = true;
        this.input.jump = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX') {
        this.input.run = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.input.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.input.right = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') this.input.down = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space' || e.code === 'KeyZ') {
        this.input.jump = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX') {
        this.input.run = false;
      }
    });

    // Virtual Gamepad Support (Touch & Mouse)
    const bindTouch = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => {
        e.preventDefault();
        Sound.ensureContext();
        el.classList.add('active');
        onDown();
      };
      const end = (e) => {
        e.preventDefault();
        el.classList.remove('active');
        onUp();
      };
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
    };

    bindTouch('v-left', () => { this.input.left = true; }, () => { this.input.left = false; });
    bindTouch('v-right', () => { this.input.right = true; }, () => { this.input.right = false; });
    bindTouch('v-down', () => { this.input.down = true; }, () => { this.input.down = false; });
    bindTouch('v-jump', () => {
      if (!this.input.jump) this.input.jumpPressed = true;
      this.input.jump = true;
      if (this.state === 'TITLE' || this.state === 'GAMEOVER' || this.state === 'LEVEL_CLEAR') {
        this.startNewGame();
      }
    }, () => { this.input.jump = false; });
    bindTouch('v-run', () => { this.input.run = true; }, () => { this.input.run = false; });

    // Buttons
    const btnStart = document.getElementById('btnStart');
    if (btnStart) btnStart.onclick = () => {
      Sound.ensureContext();
      this.startNewGame();
    };

    const btnPause = document.getElementById('btnPause');
    if (btnPause) btnPause.onclick = () => this.togglePause();

    const btnMute = document.getElementById('btnMute');
    if (btnMute) btnMute.onclick = () => {
      const muted = Sound.toggleMute();
      this.updateMuteBtn(muted);
    };

    const btnCrt = document.getElementById('btnCrt');
    if (btnCrt) btnCrt.onclick = () => this.toggleCRT();
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      Sound.stopBGM();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      Sound.startBGM();
    }
  }

  toggleCRT() {
    const frame = document.querySelector('.screen-frame');
    if (frame) frame.classList.toggle('crt-off');
  }

  updateMuteBtn(muted) {
    const btn = document.getElementById('btnMute');
    if (btn) btn.innerText = muted ? '🔇 靜音' : '🔊 音效';
  }

  onMarioAction(action, data) {
    if (action === 'HIT_BLOCK') {
      const { tile, tx, ty } = data;
      if (tile.type === 'qblock' && !tile.hit) {
        tile.hit = true;
        this.level.bumpBlock(tx, ty);
        if (tile.item === 'mushroom') {
          this.items.push(new Mushroom(tx * 16, ty * 16));
          Sound.playSprout();
        } else {
          // Coin block
          this.particles.push(new BlockCoin(tx * 16, ty * 16));
          this.mario.coins++;
          this.addScore(200, tx * 16, (ty - 1) * 16);
          Sound.playCoin();
        }
      } else if (tile.type === 'brick') {
        if (this.mario.isSuper) {
          // Smash brick into 4 shards
          this.level.tiles[ty][tx] = null;
          const bx = tx * 16;
          const by = ty * 16;
          this.particles.push(new BrickDebris(bx, by, -55, -230));
          this.particles.push(new BrickDebris(bx + 8, by, 55, -230));
          this.particles.push(new BrickDebris(bx, by + 8, -75, -150));
          this.particles.push(new BrickDebris(bx + 8, by + 8, 75, -150));
          Sound.playBreakBlock();
          this.addScore(50, bx, by);
        } else {
          this.level.bumpBlock(tx, ty);
          Sound.playBump();
        }
      }
    } else if (action === 'HIT_FLAGPOLE') {
      Sound.stopBGM();
      const bonus = Math.max(100, Math.floor((168 - data.y) * 25));
      this.addScore(bonus, this.level.flagpoleX - 10, data.y);
      // Drop flag along pole
      this.level.flagY = 168 - 16;
    } else if (action === 'VICTORY') {
      this.state = 'LEVEL_CLEAR';
      Sound.playStageClear();
    } else if (action === 'MARIO_FELL') {
      this.scheduleRespawn(1600);
    }
  }

  spawnEnemies() {
    const spawnWindow = this.cameraX + 270;
    for (let i = this.enemySpawns.length - 1; i >= 0; i--) {
      const def = this.enemySpawns[i];
      if (def.x <= spawnWindow) {
        if (def.type === 'goomba') {
          this.enemies.push(new Goomba(def.x, def.y));
        } else if (def.type === 'koopa') {
          this.enemies.push(new Koopa(def.x, def.y));
        }
        this.enemySpawns.splice(i, 1);
      }
    }
  }

  update(dt) {
    this.qAnimTimer += dt;

    if (this.state !== 'PLAYING') return;

    // Time countdown
    this.timeCounter += dt;
    if (this.timeCounter >= 1) {
      this.timeCounter = 0;
      this.timer--;
      if (this.timer <= 0) {
        this.mario.die();
        this.scheduleRespawn(1600);
      }
    }

    // Mario update
    this.level.cameraX = this.cameraX;
    this.mario.update(dt, this.input, this.level, (act, data) => this.onMarioAction(act, data));

    // Reset jumpPressed flag after update consumes it
    this.input.jumpPressed = false;

    // Check if Mario died off screen
    if (this.mario.state === 'DYING' && this.mario.y > 270) {
      this.scheduleRespawn(700);
      this.mario.y = 999; // avoid repeated triggers
    }

    // Smooth Camera Tracking (Classic NES: cannot scroll left)
    const targetCameraX = this.mario.x - 90;
    if (targetCameraX > this.cameraX) {
      this.cameraX = Math.min(this.level.flagpoleX - 80, targetCameraX);
    }

    // Spawn enemies entering the screen
    this.spawnEnemies();

    // Update Level
    this.level.update(dt);

    // Update Enemies
    for (const enemy of this.enemies) {
      if (enemy.type === 'koopa' || enemy instanceof Koopa) {
        enemy.update(dt, this.level, this.enemies, (pts, x, y) => this.addScore(pts, x, y));
      } else {
        enemy.update(dt, this.level);
      }
    }

    // Enemy Collisions with Mario
    for (const enemy of this.enemies) {
      if (enemy.done || enemy.state === 'DEAD' || this.mario.state !== 'NORMAL') continue;

      const mBox = {
        l: this.mario.x + 2,
        r: this.mario.x + this.mario.w,
        t: this.mario.y,
        b: this.mario.y + this.mario.h
      };

      const eBox = {
        l: enemy.x + 2,
        r: enemy.x + enemy.w - 2,
        t: enemy.y,
        b: enemy.y + enemy.h
      };

      // Overlap check
      if (mBox.r >= eBox.l && mBox.l <= eBox.r && mBox.b >= eBox.t && mBox.t <= eBox.b) {
        // Did Mario land on top of enemy? (Stomp)
        if (this.mario.vy > 0 && mBox.b <= eBox.t + 10) {
          enemy.stomp();
          this.mario.vy = this.input.jump ? -280 : -190;
          Sound.playStomp();
          this.addScore(100, enemy.x, enemy.y);
        } else {
          // Mario hit enemy from side
          if (enemy instanceof Koopa && enemy.state === 'SHELL_IDLE') {
            enemy.kick(this.mario.facing);
          } else if (enemy.state !== 'FLAT') {
            this.mario.takeDamage();
          }
        }
      }
    }

    // Remove finished enemies
    this.enemies = this.enemies.filter(e => !e.done);

    // Update Items (Mushroom)
    for (const item of this.items) {
      item.update(dt, this.level);
      // Collide with Mario
      if (!item.emerging && !item.done && this.mario.state === 'NORMAL') {
        if (Math.abs(item.x - this.mario.x) < 14 && Math.abs(item.y - this.mario.y) < 18) {
          item.done = true;
          this.mario.powerUp();
          this.addScore(1000, item.x, item.y);
        }
      }
    }
    this.items = this.items.filter(i => !i.done);

    // Update Particles & Popups
    for (const p of this.particles) p.update(dt);
    this.particles = this.particles.filter(p => !p.done);

    for (const pop of this.scorePopups) pop.update(dt);
    this.scorePopups = this.scorePopups.filter(pop => pop.life > 0);
  }

  drawHUD() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;

    // Line 1: Labels
    this.ctx.fillText("MARIO", 16, 14);
    this.ctx.fillText("WORLD", 120, 14);
    this.ctx.fillText("TIME", 200, 14);

    // Line 2: Values
    const scoreStr = this.mario.score.toString().padStart(6, '0');
    this.ctx.fillText(scoreStr, 16, 24);

    // Coin icon & count
    const coinSprite = Sprites.get('coin_1');
    if (coinSprite) {
      this.ctx.drawImage(coinSprite, 80, 16, 8, 8);
    }
    const coinStr = `x${this.mario.coins.toString().padStart(2, '0')}`;
    this.ctx.fillText(coinStr, 92, 24);

    this.ctx.fillText("1-1", 128, 24);

    const timeStr = Math.max(0, this.timer).toString().padStart(3, '0');
    this.ctx.fillText(timeStr, 204, 24);

    // Lives count indicator on top right
    const marioHead = Sprites.get('mario_idle');
    if (marioHead) {
      this.ctx.drawImage(marioHead, 160, 16, 8, 8);
      this.ctx.fillText(`x${this.mario.lives}`, 172, 24);
    }
  }

  draw() {
    // 1. Clear background sky
    this.ctx.fillStyle = '#5c94fc';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Draw Level & Scenery
    this.level.draw(this.ctx, this.cameraX, this.qAnimTimer);

    // 3. Draw Items
    for (const item of this.items) item.draw(this.ctx, this.cameraX);

    // 4. Draw Enemies
    for (const enemy of this.enemies) enemy.draw(this.ctx, this.cameraX);

    // 5. Draw Mario
    this.mario.draw(this.ctx, this.cameraX);

    // 6. Draw Particles & Score Popups
    for (const p of this.particles) p.draw(this.ctx, this.cameraX);
    for (const pop of this.scorePopups) pop.draw(this.ctx, this.cameraX);

    // 7. Draw HUD
    this.drawHUD();

    // 8. Overlay Screens (Title, GameOver, Clear, Pause)
    if (this.state === 'TITLE') {
      this.drawTitleScreen();
    } else if (this.state === 'PAUSED') {
      this.drawPauseScreen();
    } else if (this.state === 'GAMEOVER') {
      this.drawGameOverScreen();
    } else if (this.state === 'LEVEL_CLEAR') {
      this.drawVictoryScreen();
    }
  }

  drawTitleScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Title Logo Box
    this.ctx.fillStyle = '#ffcc00';
    this.ctx.font = '14px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("SUPER MARIO", 128, 65);

    this.ctx.fillStyle = '#ff3b30';
    this.ctx.font = '9px "Press Start 2P", monospace';
    this.ctx.fillText("RETRO CLASSIC", 128, 82);

    // Mario Pixel Art in Center
    const mSprite = Sprites.get('mario_jump');
    if (mSprite) {
      this.ctx.drawImage(mSprite, 120, 96, 16, 16);
    }

    // High Score
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillText(`TOP - ${this.highScore.toString().padStart(6, '0')}`, 128, 130);

    // Flashing Prompt
    if (Math.floor(this.qAnimTimer * 2) % 2 === 0) {
      this.ctx.fillStyle = '#00ffcc';
      this.ctx.fillText("PRESS SPACE TO START", 128, 155);
    }

    this.ctx.fillStyle = '#aaa';
    this.ctx.font = '6px "Press Start 2P", monospace';
    this.ctx.fillText("ARROW / WASD : MOVE", 128, 180);
    this.ctx.fillText("SPACE / Z : JUMP | SHIFT : RUN", 128, 192);

    this.ctx.textAlign = 'left';
  }

  drawPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ffcc00';
    this.ctx.font = '12px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("GAME PAUSED", 128, 110);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillText("PRESS 'P' TO RESUME", 128, 130);
    this.ctx.textAlign = 'left';
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ff3b30';
    this.ctx.font = '13px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("GAME OVER", 128, 90);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillText(`SCORE : ${this.mario.score}`, 128, 120);

    if (Math.floor(this.qAnimTimer * 2) % 2 === 0) {
      this.ctx.fillStyle = '#ffcc00';
      this.ctx.fillText("PRESS SPACE TO RETRY", 128, 155);
    }
    this.ctx.textAlign = 'left';
  }

  drawVictoryScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ffcc00';
    this.ctx.font = '11px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("STAGE CLEAR!", 128, 70);

    this.ctx.fillStyle = '#00ff66';
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillText("CONGRATULATIONS!", 128, 92);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillText(`FINAL SCORE : ${this.mario.score}`, 128, 122);
    this.ctx.fillText(`COINS : ${this.mario.coins}`, 128, 138);

    if (Math.floor(this.qAnimTimer * 2) % 2 === 0) {
      this.ctx.fillStyle = '#ffcc00';
      this.ctx.fillText("PRESS SPACE TO PLAY AGAIN", 128, 170);
    }
    this.ctx.textAlign = 'left';
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  run() {
    Sprites.init();
    requestAnimationFrame((t) => this.loop(t));
  }
}

// Instantiate Game on Page Load
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.run();
});
