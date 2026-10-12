// Pixel Sprite Generator & Cache for Super Mario NES Aesthetic
// All sprites are pre-rendered into offscreen canvas bitmaps for fast 60fps rendering

const Sprites = {
  cache: {},

  init() {
    this.createPalettes();
    this.createMarioSprites();
    this.createSuperMarioSprites();
    this.createEnemySprites();
    this.createTileSprites();
    this.createItemSprites();
  },

  createPalettes() {
    // Mario & General Palette
    this.pal = {
      '.': 'transparent',
      'R': '#e52521', // Mario Hat/Shirt Red
      'B': '#0038b8', // Mario Overalls Blue
      'S': '#fed8a6', // Peach Skin Tone
      'H': '#6b3800', // Hair, Mustache, Shoes Dark Brown
      'W': '#ffffff', // White
      'K': '#000000', // Black
      'Y': '#f8b800', // Yellow
      'O': '#fc9838', // Orange / Q-block base
      'L': '#80d010', // Light Green (Pipe highlight)
      'G': '#00a800', // Green (Pipe / Koopa)
      'D': '#005000', // Dark Green (Pipe shadow)
      'M': '#b84418', // Brick / Goomba Brown
      'E': '#441800', // Dark Brick Mortar
      'C': '#888888', // Castle Grey
      'X': '#555555', // Castle Dark Grey
      'P': '#d8a038'  // Stone stair block
    };
  },

  render(w, h, rows, customPal = null) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const p = customPal || this.pal;

    for (let y = 0; y < h; y++) {
      const row = rows[y] || '';
      for (let x = 0; x < w; x++) {
        const char = row[x] || '.';
        const col = p[char];
        if (col && col !== 'transparent') {
          ctx.fillStyle = col;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return canvas;
  },

  createMarioSprites() {
    // Small Mario Idle (16x16)
    this.cache['mario_idle'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRBRRR......",
      "...RRRBRRBRRR...",
      "..RRRRBBBBBRRR..",
      "..SSRBBBBBRSS...",
      "..SSSBBBBBBSSS..",
      "..SSBBBBBBBBSS..",
      "....BBBBBBBB....",
      "...HHH....HHH...",
      "..HHHH....HHHH.."
    ]);

    // Small Mario Run 1 (16x16)
    this.cache['mario_run1'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRBRRR......",
      "...RRRBRRBRRR...",
      "..RRRRBBBBBRRR..",
      "..SSRBBBBBRSS...",
      "..SSSBBBBBBSSS..",
      "..SSBBBBBBBBSS..",
      "...BBB....BB....",
      "..HHH......HHH..",
      ".HHHH......HHHH."
    ]);

    // Small Mario Run 2 (16x16)
    this.cache['mario_run2'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "...RRRBRR.......",
      "..RRRRBRRR......",
      ".RRRRRBBBB......",
      ".SSRRRBBBB......",
      "SS.SSBBBBBBSS...",
      "....BBBBBBBBSS..",
      "...BBBB..BBB....",
      "..HHH.....HHH...",
      ".HHHH......HHHH."
    ]);

    // Small Mario Run 3 (16x16)
    this.cache['mario_run3'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRBRRR......",
      "...RRRBRRBRRR...",
      "..RRRRBBBBBRRR..",
      "..SSRBBBBBRSS...",
      "..SSSBBBBBBSSS..",
      "..SSBBBBBBBBSS..",
      "....BBBBBB......",
      ".....HHHH.......",
      "....HHHHHH......"
    ]);

    // Small Mario Jump (16x16)
    this.cache['mario_jump'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "..SSRRBRRRSS....",
      ".SSSRRBRRBRRSS..",
      ".SSRRRBBBBBRSS..",
      "...RRRBBBBBRR...",
      "..RRBBBBBBBBRR..",
      ".HHHBBBBBBBB....",
      "HHHH..BBBB......",
      "HHH....BBHHH....",
      ".......HHHHHH..."
    ]);

    // Small Mario Skid / Turn (16x16)
    this.cache['mario_skid'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRBRRRSS....",
      "...RRRBRRBRRSS..",
      "..RRRRBBBBBRSS..",
      "..SSRBBBBBB.....",
      "..SSSBBBBBB.....",
      "....BBBBBBBB....",
      "....HHHH.HHH....",
      "...HHHH...HHHH..",
      "..HHHH.....HHHH."
    ]);

    // Small Mario Die (16x16)
    this.cache['mario_die'] = this.render(16, 16, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "..SSRRRRRRSS....",
      ".SSSRRBRRBSS....",
      ".SSRRBBBBBSS....",
      "..RRRBBBBBRR....",
      "..RRBBBBBBBBRR..",
      "...BBBBBBBBBB...",
      "...BBBB..BBBB...",
      "..HHHH....HHHH..",
      ".HHHH......HHHH."
    ]);
  },

  createSuperMarioSprites() {
    // Tall Super Mario (16x32)
    const superHead = [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRBRRR......",
      "...RRRBRRBRRR...",
      "..RRRRBBBBBRRR..",
      "..SSRBBBBBRSS...",
      "..SSSBBBBBBSSS..",
      "..SSBBBBBBBBSS..",
      "....BBBBBBBB....",
      "....BBBBBBBB...."
    ];

    // Idle
    this.cache['super_idle'] = this.render(16, 32, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRRRRRRR....",
      "...RRRRRRRRRR...",
      "..RRRRRRRRRRRR..",
      "..SSRRBBRRBRSS..",
      "..SSSRBBRRBRSS..",
      "..SSRRBBRRBSSS..",
      "....RRBBBBB.....",
      "....BBBBBBBB....",
      "....BBBBBBBB....",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "...BBB....BBB...",
      "...BBB....BBB...",
      "...HHH....HHH...",
      "..HHHH....HHHH..",
      ".HHHHH....HHHHH.",
      ".HHHH......HHHH.",
      "................",
      "................"
    ]);

    // Run 1
    this.cache['super_run1'] = this.render(16, 32, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRRRRRRR....",
      "...RRRRRRRRRR...",
      "..RRRRRRRRRRRR..",
      "..SSRRBBRRBRSS..",
      "..SSSRBBRRBRSS..",
      "..SSRRBBRRBSSS..",
      "....RRBBBBB.....",
      "....BBBBBBBB....",
      "....BBBBBBBB....",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "...BBB....BBB...",
      "..BBBB....BBBB..",
      "..BBBB.....BBB..",
      "..BBB......BBB..",
      "..BBB.......BBB.",
      "..BBB.......BBB.",
      ".HHHH......HHHH.",
      "HHHHH......HHHHH",
      "HHHH........HHHH",
      "................",
      "................",
      "................",
      "................",
      "................"
    ]);

    // Run 2
    this.cache['super_run2'] = this.render(16, 32, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRRRRRRR....",
      "...RRRRRRRRRR...",
      "..RRRRRRRRRRRR..",
      "..SSRRBBRRBRSS..",
      "..SSSRBBRRBRSS..",
      "..SSRRBBRRBSSS..",
      "....RRBBBBB.....",
      "....BBBBBBBB....",
      "....BBBBBBBB....",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "....BBBBBBBB....",
      ".....BBBBBB.....",
      "......BBBB......",
      ".....BB..BB.....",
      "....BBB..BBB....",
      "...HHHH..HHHH...",
      "..HHHHH..HHHHH..",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................"
    ]);

    // Run 3
    this.cache['super_run3'] = this.render(16, 32, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "....RRRRRRRR....",
      "...RRRRRRRRRR...",
      "..RRRRRRRRRRRR..",
      "..SSRRBBRRBRSS..",
      "..SSSRBBRRBRSS..",
      "..SSRRBBRRBSSS..",
      "....RRBBBBB.....",
      "....BBBBBBBB....",
      "....BBBBBBBB....",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "..BBBB....BBBB..",
      "...BBB....BBB...",
      "....HHH..HHH....",
      "...HHHH..HHHH...",
      "..HHHHH..HHHHH..",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................"
    ]);

    // Jump
    this.cache['super_jump'] = this.render(16, 32, [
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "..SSRRRRRRRRSS..",
      ".SSSRRRRRRRRSSS.",
      ".SSRRRRRRRRRRSS.",
      "..SSRRBBRRBRSS..",
      "...RRRBBRRBRR...",
      "...RRBBBBBBBBR..",
      "..RRBBBBBBBBBBR.",
      "..BBBBBBBBBBBB..",
      ".HHHBBBBBBBB....",
      "HHHH..BBBB......",
      "HHHH..BBBB......",
      "HHH....BBHHH....",
      ".......HHHHHH...",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................"
    ]);

    // Duck / Crouch (16x32, Mario ducks down)
    this.cache['super_duck'] = this.render(16, 32, [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      ".....RRRRR......",
      "....RRRRRRRRR...",
      "....HHHSSHS.....",
      "...HSHSSSHSSS...",
      "...HSHHSSSHSSS..",
      "...HHSSSSHHHH...",
      ".....SSSSSSS....",
      "...RRRRRRRRRR...",
      "..SSRRBBBBBBRSS.",
      "..SSSRBBBBBBRSS.",
      "..SSRRBBBBBBRSS.",
      "....BBBBBBBB....",
      "...BBBBBBBBBB...",
      "..BBBBBBBBBBBB..",
      "..HHHHBBBBHHHH..",
      ".HHHHHBBBBHHHHH.",
      ".HHHH......HHHH.",
      "................",
      "................",
      "................"
    ]);
  },

  createEnemySprites() {
    // Goomba Walk 1 (16x16)
    this.cache['goomba_walk1'] = this.render(16, 16, [
      "......MMMM......",
      ".....MMMMMM.....",
      "....MMMMMMMM....",
      "...MMMMMMMMMM...",
      "..MMMMMMMMMMMM..",
      ".MMMMMMMMMMMMMM.",
      ".MMMMWMMMMWMMMM.",
      "MMMMMWKMMWKMMMMM",
      "MMMMMWKMMWKMMMMM",
      "MMMMMMKKMMKKMMMM",
      ".MMSSSSSSSSSSMM.",
      "..SSSSSSSSSSSS..",
      "...SSSSSSSSSS...",
      "...KKKK...KKKK..",
      "..KKKKK...KKKKK.",
      ".KKKKKK...KKKKKK"
    ]);

    // Goomba Walk 2 (16x16 - feet reversed)
    this.cache['goomba_walk2'] = this.render(16, 16, [
      "......MMMM......",
      ".....MMMMMM.....",
      "....MMMMMMMM....",
      "...MMMMMMMMMM...",
      "..MMMMMMMMMMMM..",
      ".MMMMMMMMMMMMMM.",
      ".MMMMWMMMMWMMMM.",
      "MMMMMWKMMWKMMMMM",
      "MMMMMWKMMWKMMMMM",
      "MMMMMMKKMMKKMMMM",
      ".MMSSSSSSSSSSMM.",
      "..SSSSSSSSSSSS..",
      "...SSSSSSSSSS...",
      "..KKKK...KKKK...",
      ".KKKKK...KKKKK..",
      "KKKKKK...KKKKKK."
    ]);

    // Goomba Squished / Flat (16x16)
    this.cache['goomba_flat'] = this.render(16, 16, [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      ".MMMMMMMMMMMMMM.",
      "MMMWKMMMMMMWKMMM",
      "MMMWKMMMMMMWKMMM",
      ".SSSSSSSSSSSSSS.",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK"
    ]);

    // Koopa Troopa Walk 1 (16x24)
    this.cache['koopa_walk1'] = this.render(16, 24, [
      ".....GGGG.......",
      "....GGGGGGG.....",
      "...GGGGGGGGG....",
      "...GGWWKGGGG....",
      "...GGWWKGGYY....",
      "...GGGGGGYYY....",
      "....GGGGYYYY....",
      "....GGYYYYYY....",
      "....GGGG........",
      "...GGGGGG.......",
      "..GGGGGGGG......",
      ".GGWWGGWWGG.....",
      ".GGWWGGWWGG.....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      ".GGWWGGWWGG.....",
      "..GGGGGGGG......",
      "...YYYYYYYY.....",
      "...YYYY..YY.....",
      "...YYY...YYY....",
      "..YYYY...YYYY...",
      ".YYYYY...YYYYY.."
    ]);

    // Koopa Troopa Walk 2 (16x24)
    this.cache['koopa_walk2'] = this.render(16, 24, [
      ".....GGGG.......",
      "....GGGGGGG.....",
      "...GGGGGGGGG....",
      "...GGWWKGGGG....",
      "...GGWWKGGYY....",
      "...GGGGGGYYY....",
      "....GGGGYYYY....",
      "....GGYYYYYY....",
      "....GGGG........",
      "...GGGGGG.......",
      "..GGGGGGGG......",
      ".GGWWGGWWGG.....",
      ".GGWWGGWWGG.....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      ".GGWWGGWWGG.....",
      "..GGGGGGGG......",
      "...YYYYYYYY.....",
      "....YY..YYYY....",
      "...YYY...YYY....",
      "...YYYY...YYYY..",
      "..YYYYY...YYYYY."
    ]);

    // Koopa Shell (16x16)
    this.cache['koopa_shell'] = this.render(16, 16, [
      ".....GGGGGG.....",
      "...GGGGGGGGGG...",
      "..GGGGGGGGGGGG..",
      ".GGWWGGGGGGWWGG.",
      ".GGWWGGGGGGWWGG.",
      "GGGGWWGGGGWWGGGG",
      "GGGGWWGGGGWWGGGG",
      "GGGGGGWWWWGGGGGG",
      "GGGGGGWWWWGGGGGG",
      "GGGGWWGGGGWWGGGG",
      "GGGGWWGGGGWWGGGG",
      ".GGWWGGGGGGWWGG.",
      ".GGWWGGGGGGWWGG.",
      "..GGGGGGGGGGGG..",
      "...YYYYYYYYYY...",
      "....YYYYYYYY...."
    ]);
  },

  createTileSprites() {
    // Ground Tile (16x16)
    this.cache['ground'] = this.render(16, 16, [
      "OOOOOOOOOOOOOOOO",
      "OOOOOOOOOOOOOOOO",
      "OOMMOOMMOOMMOOMM",
      "MMOOMMOOMMOOMMOO",
      "MMMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM",
      "MMOOMMOOMMOOMMOO",
      "OOMMOOMMOOMMOOMM",
      "MMMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM",
      "OOMMOOMMOOMMOOMM",
      "MMOOMMOOMMOOMMOO"
    ]);

    // Question Mark Block Frame 1 (Bright)
    this.cache['qblock_1'] = this.render(16, 16, [
      "OOOOOOOOOOOOOOOO",
      "OYYYYYYYYYYYYYYM",
      "OYKKKKKKKKKKKKOM",
      "OYKYYYYYYYYYYKOM",
      "OYKY...YYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OYK..YY..YYY.KOM",
      "OYK.....YYYY.KOM",
      "OYK....YYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OYK..........KOM",
      "OYK...YYYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OOMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM"
    ], {
      ...this.pal,
      'Y': '#fc9838',
      'O': '#ffcc00',
      '.': '#441800',
      'K': '#ffffff'
    });

    // Question Mark Block Frame 2 (Pulsing)
    this.cache['qblock_2'] = this.render(16, 16, [
      "OOOOOOOOOOOOOOOO",
      "OYYYYYYYYYYYYYYM",
      "OYKKKKKKKKKKKKOM",
      "OYKYYYYYYYYYYKOM",
      "OYKY...YYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OYK..YY..YYY.KOM",
      "OYK.....YYYY.KOM",
      "OYK....YYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OYK..........KOM",
      "OYK...YYYYYY.KOM",
      "OYK...YYYYYY.KOM",
      "OOMMMMMMMMMMMMMM",
      "MMMMMMMMMMMMMMMM"
    ], {
      ...this.pal,
      'Y': '#f87800',
      'O': '#fca044',
      '.': '#662200',
      'K': '#fed8a6'
    });

    // Empty Block (Hit block)
    this.cache['empty_block'] = this.render(16, 16, [
      "MMMMMMMMMMMMMMMM",
      "MOOOOOOOOOOOOOOM",
      "MOE..........EOM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MO............OM",
      "MOE..........EOM",
      "MOOOOOOOOOOOOOOM",
      "MMMMMMMMMMMMMMMM"
    ], {
      ...this.pal,
      'M': '#000000',
      'O': '#8a4c18',
      'E': '#000000',
      '.': '#6b3810'
    });

    // Brick Block
    this.cache['brick'] = this.render(16, 16, [
      "EEEEEEEEEEEEEEEE",
      "EMMMMEMMMMEMMMME",
      "EMMMMEMMMMEMMMME",
      "EEEEEEEEEEEEEEEE",
      "MMMEMMMMEMMMMEMM",
      "MMMEMMMMEMMMMEMM",
      "EEEEEEEEEEEEEEEE",
      "EMMMMEMMMMEMMMME",
      "EMMMMEMMMMEMMMME",
      "EEEEEEEEEEEEEEEE",
      "MMMEMMMMEMMMMEMM",
      "MMMEMMMMEMMMMEMM",
      "EEEEEEEEEEEEEEEE",
      "EMMMMEMMMMEMMMME",
      "EMMMMEMMMMEMMMME",
      "EEEEEEEEEEEEEEEE"
    ], {
      ...this.pal,
      'M': '#b84418',
      'E': '#000000'
    });

    // Brick Debris (8x8 particle)
    this.cache['brick_debris'] = this.render(8, 8, [
      "KKKKKKKK",
      "KMMMMMMK",
      "KMMMMMMK",
      "KKKKKKKK",
      "KMMMMMMK",
      "KMMMMMMK",
      "KKKKKKKK",
      "KKKKKKKK"
    ], {
      'K': '#000000',
      'M': '#b84418'
    });

    // Stone Pyramid Stairs Block
    this.cache['stone_block'] = this.render(16, 16, [
      "KKKKKKKKKKKKKKKK",
      "KPPPPPPPPPPPPPPK",
      "KPEEEEEEEEEEEEKK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEPPPPPPPPPPPXK",
      "KPEXXXXXXXXXXXKK",
      "KPKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK"
    ], {
      ...this.pal,
      'K': '#000000',
      'P': '#fc9838',
      'E': '#ffe0a8',
      'X': '#8a4000'
    });

    // Pipe Top Left (16x16)
    this.cache['pipe_tl'] = this.render(16, 16, [
      "KKKKKKKKKKKKKKKK",
      "KLLLLLLLLGGGGGGG",
      "KLLLLLLLLGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLWWLLLLGGGGGGGG",
      "KLLLLLLLLGGGGGGG",
      "KKKKKKKKKKKKKKKK"
    ]);

    // Pipe Top Right (16x16)
    this.cache['pipe_tr'] = this.render(16, 16, [
      "KKKKKKKKKKKKKKKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "GGGGGGGGDDDDDDKK",
      "KKKKKKKKKKKKKKKK"
    ]);

    // Pipe Body Left (16x16)
    this.cache['pipe_bl'] = this.render(16, 16, [
      "..KLLLLLGGGGGGGG",
      "..KLLLLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLWWLLGGGGGGGG",
      "..KLLLLLGGGGGGGG",
      "..KLLLLLGGGGGGGG"
    ]);

    // Pipe Body Right (16x16)
    this.cache['pipe_br'] = this.render(16, 16, [
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK.",
      "GGGGGGGGDDDDDDK."
    ]);

    // Flagpole ball & rod & flag
    this.cache['flagpole_top'] = this.render(16, 16, [
      "......GGGG......",
      "....GGLLLLGG....",
      "...GLLWWLLLLG...",
      "...GLLLLLLLLG...",
      "....GGLLLLGG....",
      "......GGGG......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
    ]);

    this.cache['flagpole_rod'] = this.render(16, 16, [
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
      ".......XX.......",
    ]);

    this.cache['flag'] = this.render(16, 16, [
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "GGLLLLLLGGGG....",
      "GGLLLLLLGGGG....",
      "GGLLWWLLGGGG....",
      "GGLLWWLLGGGG....",
      "GGLLLLLLGGGG....",
      "GGLLLLLLGGGG....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "GGGGGGGGGGGG....",
      "................",
      "................",
      "................",
      "................",
      "................",
    ]);

    // Castle Bricks & Details
    this.cache['castle_brick'] = this.render(16, 16, [
      "KKKKKKKKKKKKKKKK",
      "KMMMMMMKMMMMMMMK",
      "KMMMMMMKMMMMMMMK",
      "KKKKKKKKKKKKKKKK",
      "KMMMKMMMMMMKMMMK",
      "KMMMKMMMMMMKMMMK",
      "KKKKKKKKKKKKKKKK",
      "KMMMMMMKMMMMMMMK",
      "KMMMMMMKMMMMMMMK",
      "KKKKKKKKKKKKKKKK",
      "KMMMKMMMMMMKMMMK",
      "KMMMKMMMMMMKMMMK",
      "KKKKKKKKKKKKKKKK",
      "KMMMMMMKMMMMMMMK",
      "KMMMMMMKMMMMMMMK",
      "KKKKKKKKKKKKKKKK"
    ]);

    this.cache['castle_door'] = this.render(16, 16, [
      ".....KKKKKK.....",
      "...KKKKKKKKKK...",
      "..KKKKKKKKKKKK..",
      ".KKKKKKKKKKKKKK.",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK"
    ]);

    // Scenery Clouds & Bushes
    this.cache['cloud_m'] = this.render(16, 16, [
      ".....WWWWWW.....",
      "...WWWWWWWWWW...",
      "..WWWWWWWWWWWW..",
      ".WWWWWWWWWWWWWW.",
      "WWWWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWWWW",
      ".WWWWWWWWWWWWWW.",
      "..WWWWWWWWWWWW..",
      "................",
      "................",
      "................"
    ], { ...this.pal, 'W': '#ffffff' });

    this.cache['bush_m'] = this.render(16, 16, [
      ".....GGGGGG.....",
      "...GGLLLLLLGG...",
      "..GLLWWWWLLLLG..",
      ".GLLWWWWWWLLLLG.",
      "GLLWWWWWWWWLLLLG",
      "GLLWWWWWWWWLLLLG",
      "GLLWWWWWWWWLLLLG",
      "GLLWWWWWWWWLLLLG",
      "GLLWWWWWWWWLLLLG",
      "GLLWWWWWWWWLLLLG",
      "GLLWWWWWWWWLLLLG",
      ".GLLWWWWWWLLLLG.",
      "..GGLLLLLLLLGG..",
      "...GGGGGGGGGG...",
      "................",
      "................"
    ]);
  },

  createItemSprites() {
    // Super Mushroom (16x16)
    this.cache['mushroom'] = this.render(16, 16, [
      "......RRRR......",
      "....RRRRRRRR....",
      "...RRWWWRRRRR...",
      "..RRWWWWWRRRRR..",
      ".RRRWWWWWRRRRRR.",
      ".RRWWWWWWWRRRRR.",
      ".RRRWWWWWRRRRRR.",
      "RRRRRWWWRRRRRRRR",
      "RRRRRRRRRRRRRRRR",
      "....SSSSSSSS....",
      "...SSSKSSKSSS...",
      "...SSSKSSKSSS...",
      "...SSSSSSSSSS...",
      "...SSSSSSSSSS...",
      "....SSSSSSSS....",
      "................"
    ]);

    // Spinning Coin Frame 1 (Full)
    this.cache['coin_1'] = this.render(16, 16, [
      ".....YYYYYY.....",
      "...YYWWWWWWYY...",
      "..YYWWYYYYWWYY..",
      ".YYWWYYYYYYWWYY.",
      ".YYWWYYYYYYWWYY.",
      "YYWWYYKKKKYYWWYY",
      "YYWWYYKKKKYYWWYY",
      "YYWWYYKKKKYYWWYY",
      "YYWWYYKKKKYYWWYY",
      "YYWWYYKKKKYYWWYY",
      ".YYWWYYYYYYWWYY.",
      ".YYWWYYYYYYWWYY.",
      "..YYWWYYYYWWYY..",
      "...YYWWWWWWYY...",
      ".....YYYYYY.....",
      "................"
    ], { ...this.pal, 'K': '#e59000' });

    // Coin Frame 2 (Medium)
    this.cache['coin_2'] = this.render(16, 16, [
      ".......YYYY.....",
      ".....YYWWWWYY...",
      "....YYWWYYWWYY..",
      "...YYWWYYYYWWYY.",
      "...YYWWYYYYWWYY.",
      "..YYWWYYKKYYWWYY",
      "..YYWWYYKKYYWWYY",
      "..YYWWYYKKYYWWYY",
      "..YYWWYYKKYYWWYY",
      "..YYWWYYKKYYWWYY",
      "...YYWWYYYYWWYY.",
      "...YYWWYYYYWWYY.",
      "....YYWWYYWWYY..",
      ".....YYWWWWYY...",
      ".......YYYY.....",
      "................"
    ], { ...this.pal, 'K': '#e59000' });

    // Coin Frame 3 (Narrow)
    this.cache['coin_3'] = this.render(16, 16, [
      "........YY......",
      "......YYWWYY....",
      ".....YYWWWWYY...",
      ".....YYWWWWYY...",
      ".....YYWWWWYY...",
      "....YYWWKKWWYY..",
      "....YYWWKKWWYY..",
      "....YYWWKKWWYY..",
      "....YYWWKKWWYY..",
      "....YYWWKKWWYY..",
      ".....YYWWWWYY...",
      ".....YYWWWWYY...",
      ".....YYWWWWYY...",
      "......YYWWYY....",
      "........YY......",
      "................"
    ], { ...this.pal, 'K': '#e59000' });

    // Coin Frame 4 (Thin sliver)
    this.cache['coin_4'] = this.render(16, 16, [
      ".........Y......",
      ".......YYWYY....",
      ".......YYWYY....",
      ".......YYWYY....",
      ".......YYWYY....",
      "......YYWKWY....",
      "......YYWKWY....",
      "......YYWKWY....",
      "......YYWKWY....",
      "......YYWKWY....",
      ".......YYWYY....",
      ".......YYWYY....",
      ".......YYWYY....",
      ".......YYWYY....",
      ".........Y......",
      "................"
    ], { ...this.pal, 'K': '#e59000' });
  },

  get(name) {
    return this.cache[name] || null;
  }
};
