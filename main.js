title = "Prototype 1";

description = `
  A simple endless 
  runner minigame.
(Left Click) to start
`;

characters = [
  `
  bbbbbbbbbbbbbb
  bbbbbbbbbbbbbb
  bbbbbbbbbbbbbb
  bbbbbbbbbbbbbb
  bbbbbbbbbbbbbb
  `,
  `
  yyyyyyyyyyyyyy
  yyyyyyyyyyyyyy
  yyyyyyyyyyyyyy
  yyyyyyyyyyyyyy
  yyyyyyyyyyyyyy
  `
];

const window_size = {
  WIDTH: 150,
  HEIGHT: 90
}
const player_offset = 5;
options = {
  theme: 'shapeDark',
  viewSize: {x:window_size.WIDTH, y:window_size.HEIGHT},
  isPlayingBgm: true,
  isSpeedingUpSound: true,
  isShowingScore: true,
  isReplayEnabled: true,
  seed: 300
};

let player;
let objs = [];
let ceiling;
let ground;
let flip = false;
let timer = 0;
const spawnpoints = [ window_size.HEIGHT *0.2 + 4, 
                      window_size.HEIGHT *0.4 + 4,
                      window_size.HEIGHT *0.6 + 4,
                      window_size.HEIGHT *0.8 + 5 ];

let obstacle_spawn_rate;
let move_speed;

function update() {
  if (!ticks) {
    // Initialize the player position
    player = {
      pos: vec(window_size.HEIGHT*0.5, window_size.HEIGHT*0.5),
    };
    obstacle_spawn_rate = 50;
    move_speed = 1
  }
  
  // Spawn the ceiling and floor
  const ceiling = box(vec(window_size.WIDTH*0.5, 10),window_size.WIDTH,2);
  const ground = box(vec(window_size.WIDTH*0.5, window_size.HEIGHT-1),window_size.WIDTH,2);
  
  // Spawn in the player
  char("a", player.pos);

  // Spawns in obstacles
  if(obstacle_spawn_rate >= 15) obstacle_spawn_rate -= ticks/100000;
  if(timer > obstacle_spawn_rate) {
    let rnd_pos = floor(rnd(0,4));
    let rnd_spawn = vec(window_size.WIDTH, spawnpoints[rnd_pos]);
    let in_arr = false;
    objs.forEach((o) => {
      if(o == rnd_spawn) in_arr = true;
    });
    if(!in_arr) objs.push({pos: rnd_spawn});
    timer = 0;
  }
  
  // Moves the objects
  if(move_speed < 4) move_speed += ticks/1000000;
  objs.forEach((o) => {
    o.pos.x-= move_speed;
    char("b", o.pos);
  });

  // Removes objects once they go off screen
  remove(objs, (obst) => {
    if(obst.pos.x < 0) {
      addScore(100);
      return true;
    }
  });

  // Player movement and limitations
  player.pos = vec(input.pos.x, player.pos.y);
  player.pos.clamp(-player_offset+1, window_size.WIDTH-player_offset, 10+player_offset+5, window_size.HEIGHT-player_offset-6);
  
  // Gravity flip mechanic
  if(!flip) {player.pos.y -= 2;}
  if(flip)  {player.pos.y += 2;}
  if (input.isJustPressed) { flip = !flip; play("jump"); }

  // Lose conditions for Game over screen
  if((player.pos.x < -1) || (char("a", player.pos).isColliding.char.b)) { 
    
    remove(objs, (obst) => { return true; });
    end(); 
  }

  // Increases timer
  ++timer;
}