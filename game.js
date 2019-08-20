const game = new Phaser.Game(1340, 560, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update })

let platforms;
let cursors;
let player;
let jumpCounter;
let startdoor;
let finishdoor;
let lastdirection = 'right';
let ground;
let wall;

function preload () {
  this.load.image('background', './assets/images/backgroundWall.png');
  this.load.image('ground', './assets/images/floor.png');
  this.load.image('wall', './assets/images/wall.png');
  this.load.image('door', './assets/images/door.png');
  this.load.image('opendoor', './assets/images/opendoor.png');
  this.load.image('detector', './assets/images/detector.png');
  this.load.image('camera', './assets/images/camera.png');
  this.load.spritesheet('man', './assets/images/man.png', 50, 100);
}

function create () {
  this.physics.startSystem(Phaser.Physics.ARCADE);

  this.add.sprite(33, 0, 'background');

  platforms = this.add.group();
  
  platforms.enableBody = true;

  wall = platforms.create(0, 0, 'wall');
  wall.body.immovable = true;

  wall = platforms.create(this.world.width-32, 0, 'wall');
  wall.body.immovable = true;

  ground = platforms.create(0, this.world.height - 32, 'ground');

  ground.body.immovable = true;

  startdoor = this.add.sprite(33, 0, 'door');

  finishdoor = this.add.sprite(this.world.width - 33,this.world.height - 33, 'door');
  finishdoor.anchor.setTo(1);

  detector = this.add.sprite(this.world.width / 4, this.world.height / 9, 'detector');

  camera = this.add.sprite(this.world.width / 3.58, this.world.height / 5.45, 'camera');
  camera.anchor.setTo(0, 0.5);

  player = this.add.sprite(33, 0, 'man');
  player.scale.setTo(0.5);

  this.physics.arcade.enable(player);

  player.body.bounce.y = 0.2;
  player.body.gravity.y = 1000;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [0, 1], 10, true);
  player.animations.add('right', [2, 3], 10, true);
  player.animations.add('startjumpleft', [9], 5, true);
  player.animations.add('jumpleft', [8], 5, true);
  player.animations.add('middlejumpleft', [7, 6, 5], 5, true);
  player.animations.add('fallingjumpleft', [4], 5, true);
  player.animations.add('startjumpright', [10], 5, true);
  player.animations.add('jumpright', [11], 5, true);
  player.animations.add('middlejumpright', [12, 13, 14], 5, true);
  player.animations.add('fallingjumpright', [15], 5, true);

  cursors = this.input.keyboard.createCursorKeys();
}

function update () {
  player.body.velocity.x = 0;

  this.physics.arcade.collide(player, platforms);

  if (cursors.left.isDown) {
    player.body.velocity.x = -400;
    lastdirection = 'left';
    if (player.body.touching.down) {
      player.animations.play('left')
    }
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 400;
    lastdirection = 'right';
    if (player.body.touching.down) {
      player.animations.play('right')
    }
  } else {
    player.animations.stop()
  }

  if (!player.body.touching.down) {
    if (lastdirection === 'left') {
      if (player.body.velocity.y < -300) {
        player.animations.play('startjumpleft')
      } else if (player.body.velocity.y < -200) {
        player.animations.play('jumpleft')
      } else if (player.body.velocity.y < 100) {
        player.animations.play('middlejumpleft')
      } else {
        player.animations.play('fallingjumpleft')
      }
    } else {
      if (player.body.velocity.y < -300) {
        player.animations.play('startjumpright')
      } else if (player.body.velocity.y < -200) {
        player.animations.play('jumpright')
      } else if (player.body.velocity.y < 100) {
        player.animations.play('middlejumpright')
      } else {
        player.animations.play('fallingjumpright')
      }
    }
  }

  if (cursors.up.isDown && player.body.touching.down) {
    jump();
    jumpCounter = 0
  } else if (cursors.up.isUp && !jumpCounter) {
      jumpCounter = 1
  } else if (cursors.up.isDown && jumpCounter === 1) {
    jump();
    jumpCounter = 2
  }

  if (Phaser.Math.distance(player.x, player.y, startdoor.x, startdoor.y) < 200) {
    startdoor = this.add.sprite(33, 0, 'opendoor')
  } else {
    startdoor = this.add.sprite(33, 0, 'door')
  }

  if (Phaser.Math.distance(player.x, player.y, finishdoor.x, finishdoor.y) < 300) {
    finishdoor = this.add.sprite(this.world.width - 33,this.world.height - 33, 'opendoor');
    finishdoor.anchor.setTo(1)
  } else {
    finishdoor = this.add.sprite(this.world.width - 33,this.world.height - 33, 'door');
    finishdoor.anchor.setTo(1)
  }

  camera.rotation = Math.atan2(player.y - camera.y, player.x - camera.x);   
}

function jump() {
  player.body.velocity.y = -400
}