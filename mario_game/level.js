// World 1-1 Level Map & Collision System

class Level {
  constructor() {
    this.widthInTiles = 215;
    this.heightInTiles = 14;
    this.tileSize = 16;
    this.cameraX = 0;
    this.flagpoleX = 198 * 16;
    this.castleDoorX = 204 * 16;

    this.tiles = [];
    this.blockBounces = {}; // Key: `${tx},${ty}`, Value: { offsetY, timer }
    this.floatingCoins = [];
    this.scenery = [];
    this.flagY = 32; // Flag starts at top of pole

    this.initLevel();
  }

  initLevel() {
    // 2D Array initialized to empty (null)
    this.tiles = [];
    for (let y = 0; y < this.heightInTiles; y++) {
      this.tiles[y] = new Array(this.widthInTiles).fill(null);
    }

    // 1. Build Ground with Classic SMB Pits (Gaps)
    // Pit 1: x = 69-70, Pit 2: x = 86-88, Pit 3: x = 153-154
    for (let x = 0; x < this.widthInTiles; x++) {
      const isPit = (x >= 69 && x <= 70) || (x >= 86 && x <= 88) || (x >= 153 && x <= 154);
      if (!isPit) {
        this.tiles[12][x] = { type: 'ground', solid: true };
        this.tiles[13][x] = { type: 'ground', solid: true };
      }
    }

    // 2. Build Pipes
    this.createPipe(28, 2);  // Pipe 1 (height 2)
    this.createPipe(38, 3);  // Pipe 2 (height 3)
    this.createPipe(46, 4);  // Pipe 3 (height 4)
    this.createPipe(57, 4);  // Pipe 4 (height 4)
    this.createPipe(163, 2); // Pipe 5 (height 2)
    this.createPipe(179, 2); // Pipe 6 (height 2)

    // 3. Blocks & Question Boxes
    // Early cluster
    this.setBlock(16, 8, 'qblock', 'coin');
    this.setBlock(20, 8, 'brick');
    this.setBlock(21, 8, 'qblock', 'mushroom'); // Famous 1st Mushroom!
    this.setBlock(22, 8, 'brick');
    this.setBlock(23, 8, 'qblock', 'coin');
    this.setBlock(24, 8, 'brick');
    this.setBlock(22, 4, 'qblock', 'coin'); // High Question Block

    // Cluster 2: row of bricks with mystery block
    this.setBlock(77, 8, 'brick');
    this.setBlock(78, 8, 'qblock', 'mushroom');
    this.setBlock(79, 8, 'brick');

    // High brick platform
    for (let x = 80; x <= 87; x++) {
      this.setBlock(x, 4, 'brick');
    }

    // Cluster 3
    for (let x = 91; x <= 93; x++) {
      this.setBlock(x, 4, 'brick');
    }
    this.setBlock(94, 4, 'qblock', 'coin');
    this.setBlock(94, 8, 'brick');
    this.setBlock(100, 8, 'brick');
    this.setBlock(101, 8, 'qblock', 'coin');
    this.setBlock(106, 8, 'qblock', 'coin');
    this.setBlock(109, 8, 'qblock', 'coin');
    this.setBlock(109, 4, 'qblock', 'coin');
    this.setBlock(112, 8, 'qblock', 'coin');

    this.setBlock(118, 8, 'brick');
    this.setBlock(121, 4, 'brick');
    this.setBlock(122, 4, 'brick');
    this.setBlock(123, 4, 'brick');

    this.setBlock(128, 4, 'brick');
    this.setBlock(129, 8, 'brick');
    this.setBlock(130, 8, 'brick');
    this.setBlock(131, 4, 'brick');

    // 4. Stepped Pyramids (Stairs)
    // Pyramid 1 (Up 4 steps, Down 4 steps)
    this.createStairUp(134, 11, 4);
    this.createStairDown(140, 11, 4);

    // Pyramid 2 (Up 4 steps, Down before pit)
    this.createStairUp(148, 11, 4);
    this.createStairDown(155, 11, 4);

    // Final Grand Staircase before Flagpole (8 steps up!)
    this.createStairUp(181, 11, 8);
    // Flat top and step block base for pole
    this.tiles[11][198] = { type: 'stone_block', solid: true };

    // 5. Flagpole
    this.flagpoleX = 198 * 16;
    this.flagY = 2 * 16; // Top of pole

    // 6. Castle
    this.buildCastle(202, 11);

    // 7. Background Scenery (Clouds, Bushes)
    this.scenery = [
      // Clouds
      { type: 'cloud', x: 8 * 16, y: 3 * 16 },
      { type: 'cloud', x: 19 * 16, y: 2 * 16 },
      { type: 'cloud', x: 36 * 16, y: 3 * 16 },
      { type: 'cloud', x: 56 * 16, y: 2 * 16 },
      { type: 'cloud', x: 74 * 16, y: 3 * 16 },
      { type: 'cloud', x: 103 * 16, y: 2 * 16 },
      { type: 'cloud', x: 124 * 16, y: 3 * 16 },
      { type: 'cloud', x: 144 * 16, y: 2 * 16 },
      { type: 'cloud', x: 170 * 16, y: 3 * 16 },
      // Bushes
      { type: 'bush', x: 11 * 16, y: 11 * 16 },
      { type: 'bush', x: 23 * 16, y: 11 * 16 },
      { type: 'bush', x: 41 * 16, y: 11 * 16 },
      { type: 'bush', x: 59 * 16, y: 11 * 16 },
      { type: 'bush', x: 89 * 16, y: 11 * 16 },
      { type: 'bush', x: 106 * 16, y: 11 * 16 },
      { type: 'bush', x: 137 * 16, y: 11 * 16 },
      { type: 'bush', x: 167 * 16, y: 11 * 16 }
    ];
  }

  createPipe(x, height) {
    const topY = 12 - height;
    // Pipe Rim
    this.tiles[topY][x] = { type: 'pipe_tl', solid: true };
    this.tiles[topY][x + 1] = { type: 'pipe_tr', solid: true };

    // Pipe Body Shaft
    for (let y = topY + 1; y < 12; y++) {
      this.tiles[y][x] = { type: 'pipe_bl', solid: true };
      this.tiles[y][x + 1] = { type: 'pipe_br', solid: true };
    }
  }

  setBlock(x, y, type, item = null) {
    this.tiles[y][x] = {
      type: type,
      item: item,
      solid: true,
      hit: false
    };
  }

  createStairUp(startX, baseY, steps) {
    for (let s = 0; s < steps; s++) {
      const x = startX + s;
      for (let y = baseY; y >= baseY - s; y--) {
        this.tiles[y][x] = { type: 'stone_block', solid: true };
      }
    }
  }

  createStairDown(startX, baseY, steps) {
    for (let s = 0; s < steps; s++) {
      const x = startX + s;
      for (let y = baseY; y >= baseY - (steps - 1 - s); y--) {
        this.tiles[y][x] = { type: 'stone_block', solid: true };
      }
    }
  }

  buildCastle(x, baseY) {
    this.castleDoorX = (x + 2) * 16;
    for (let cy = baseY - 4; cy <= baseY; cy++) {
      for (let cx = x; cx <= x + 4; cx++) {
        if (cx >= x && cx <= x + 4 && cy <= baseY) {
          // Doorway
          if (cx === x + 2 && (cy === baseY || cy === baseY - 1)) {
            this.tiles[cy][cx] = { type: 'castle_door', solid: false };
          } else {
            this.tiles[cy][cx] = { type: 'castle_brick', solid: true };
          }
        }
      }
    }
  }

  isSolid(worldX, worldY) {
    const tx = Math.floor(worldX / this.tileSize);
    const ty = Math.floor(worldY / this.tileSize);
    if (tx < 0 || tx >= this.widthInTiles || ty < 0 || ty >= this.heightInTiles) {
      return false;
    }
    const tile = this.tiles[ty][tx];
    return tile !== null && tile.solid === true;
  }

  getTileAt(worldX, worldY) {
    const tx = Math.floor(worldX / this.tileSize);
    const ty = Math.floor(worldY / this.tileSize);
    if (tx < 0 || tx >= this.widthInTiles || ty < 0 || ty >= this.heightInTiles) {
      return { tile: null, tx, ty, solid: false };
    }
    const tile = this.tiles[ty][tx];
    return {
      tile: tile,
      tx: tx,
      ty: ty,
      solid: tile !== null && tile.solid === true
    };
  }

  bumpBlock(tx, ty) {
    const key = `${tx},${ty}`;
    this.blockBounces[key] = {
      offsetY: -7,
      timer: 0.16
    };
  }

  update(dt) {
    // Update block bumps
    for (const key in this.blockBounces) {
      const b = this.blockBounces[key];
      b.timer -= dt;
      if (b.timer > 0.08) {
        b.offsetY = -7;
      } else if (b.timer > 0) {
        b.offsetY = -3;
      } else {
        delete this.blockBounces[key];
      }
    }
  }

  draw(ctx, cameraX, qAnimTimer) {
    const startCol = Math.max(0, Math.floor(cameraX / this.tileSize));
    const endCol = Math.min(this.widthInTiles - 1, Math.floor((cameraX + 270) / this.tileSize));

    // 1. Draw Background Scenery
    for (const s of this.scenery) {
      if (s.x + 32 >= cameraX && s.x - 32 <= cameraX + 260) {
        const sprite = Sprites.get(s.type === 'cloud' ? 'cloud_m' : 'bush_m');
        if (sprite) {
          ctx.drawImage(sprite, Math.floor(s.x - cameraX), Math.floor(s.y));
          // Scenery repeats / wider clusters
          ctx.drawImage(sprite, Math.floor(s.x - cameraX) + 12, Math.floor(s.y));
        }
      }
    }

    // 2. Draw Flagpole
    if (this.flagpoleX >= cameraX - 20 && this.flagpoleX <= cameraX + 270) {
      const poleScreenX = Math.floor(this.flagpoleX - cameraX);
      const topSprite = Sprites.get('flagpole_top');
      const rodSprite = Sprites.get('flagpole_rod');
      const flagSprite = Sprites.get('flag');

      // Top ball
      if (topSprite) ctx.drawImage(topSprite, poleScreenX, 2 * 16);
      // Rod body
      for (let y = 3; y <= 10; y++) {
        if (rodSprite) ctx.drawImage(rodSprite, poleScreenX, y * 16);
      }
      // Flag attached to pole
      if (flagSprite) {
        ctx.drawImage(flagSprite, poleScreenX - 12, Math.floor(this.flagY));
      }
    }

    // 3. Draw Level Tiles
    const qFrame = (Math.floor(qAnimTimer * 4) % 2) === 0 ? 'qblock_1' : 'qblock_2';

    for (let y = 0; y < this.heightInTiles; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const tile = this.tiles[y][x];
        if (!tile) continue;

        let spriteName = tile.type;
        if (tile.type === 'qblock') {
          spriteName = tile.hit ? 'empty_block' : qFrame;
        }

        const sprite = Sprites.get(spriteName);
        if (sprite) {
          let drawY = y * this.tileSize;
          const bounce = this.blockBounces[`${x},${y}`];
          if (bounce) {
            drawY += bounce.offsetY;
          }
          ctx.drawImage(sprite, Math.floor(x * this.tileSize - cameraX), Math.floor(drawY));
        }
      }
    }
  }
}
