const MAP_SIZE = 26;
const VIEWPORT_WIDTH = 10;
const VIEWPORT_HEIGHT = 10;
const MAX_LOG_ENTRIES = 10;
const MIN_ROOMS = 4;
const MAX_ROOMS = 8;
const MIN_ROOM_SIZE = 3;
const MAX_ROOM_SIZE = 5;
const MAX_ROOM_PLACEMENT_ATTEMPTS = 80;
const MIN_ROOM_TILES_FOR_SPAWNS = 7;
const CORRIDOR_VISION_RADIUS = 2;
const OXYGEN_ACTION_INTERVAL = 2;
const BOSS_FLOOR_INTERVAL = 5;
const FINAL_FLOOR = 10;
const CAMERA_SMOOTHING = 0.22;
const FLOATING_TEXT_DURATION = 680;
const ATTACK_EFFECT_DURATION = 160;
const MEDKIT_HEAL_RATIO = 0.1;
const OXYGEN_TANK_RATIO = 0.2;
const UPGRADE_PICK_EFFECT_MS = 200;
const FLOOR_INTRO_DURATION = 3000;

const FLOOR_TYPE = {
  NORMAL: "normal",
  BOSS: "boss",
};

const TILE = {
  WALL: "#",
  ROOM: ".",
  CORRIDOR: "=",
  STAIRS: ">",
};

const ROOM_TYPE = {
  NORMAL: "normal",
  SUPPLY: "supply",
  DANGER: "danger",
};

const ENEMY_DEFS = {
  slime: {
    name: "\u30b9\u30e9\u30a4\u30e0",
    glyph: "s",
    hp: 4,
    attack: 2,
    speed: 1,
    className: "tile-slime",
    ai: "chaser",
    moveSteps: 1,
  },
  securitybot: {
    name: "\u8b66\u5099\u30ed\u30dc\u30c3\u30c8",
    glyph: "B",
    hp: 8,
    attack: 3,
    speed: 2,
    className: "tile-securitybot",
    ai: "chaser",
    moveSteps: 1,
  },
  hound: {
    name: "\u30cf\u30a6\u30f3\u30c9",
    glyph: "R",
    hp: 3,
    attack: 2,
    speed: 1,
    className: "tile-hound",
    ai: "chaser",
    moveSteps: 2,
  },
  eyebot: {
    name: "\u30a2\u30a4\u30dc\u30c3\u30c8",
    glyph: "G",
    hp: 4,
    attack: 2,
    speed: 1,
    className: "tile-eyebot",
    ai: "shooter",
    moveSteps: 1,
    range: 4,
  },
  bomber: {
    name: "\u30dc\u30de\u30fc",
    glyph: "X",
    hp: 4,
    attack: 2,
    speed: 1,
    className: "tile-bomber",
    ai: "exploder",
    moveSteps: 1,
    explosionDamage: 2,
  },
  medic: {
    name: "\u30e1\u30c7\u30a3\u30c3\u30af",
    glyph: "M",
    hp: 5,
    attack: 1,
    speed: 2,
    className: "tile-medic",
    ai: "support",
    moveSteps: 1,
    healPower: 2,
    supportRange: 3,
  },
  behemoth: {
    name: "\u30d9\u30d2\u30e2\u30b9",
    glyph: "W",
    hp: 26,
    attack: 4,
    speed: 1,
    className: "tile-behemoth",
    moveSteps: 2,
  },
};

const ENEMY_FLOOR_BANDS = [
  {
    id: "early",
    maxFloor: 2,
    weights: {
      slime: 5.8,
      hound: 1.8,
      securitybot: 1.1,
    },
  },
  {
    id: "mid",
    maxFloor: 4,
    weights: {
      slime: 4.6,
      hound: 2.2,
      securitybot: 1.9,
      eyebot: 1.3,
    },
  },
  {
    id: "late",
    maxFloor: Infinity,
    weights: {
      slime: 3.8,
      hound: 2.1,
      securitybot: 2,
      eyebot: 1.5,
      bomber: 1.4,
      medic: 0.9,
    },
  },
];

const ITEM_DEFS = {
  medkit: {
    name: "\u5fdc\u6025\u30ad\u30c3\u30c8",
    glyph: "+",
    className: "tile-medkit",
  },
  oxygen: {
    name: "\u9178\u7d20\u30dc\u30f3\u30d9",
    glyph: "O",
    className: "tile-oxygen",
  },
};

const ENEMY_DROP_CHANCE = {
  slime: 0.18,
  securitybot: 0.28,
  hound: 0.24,
  eyebot: 0.2,
  bomber: 0.22,
  medic: 0.3,
  behemoth: 0,
};

const ASSET_DEFS = {
  player: "assets/player.svg",
  enemy: {
    slime: "assets/entities/slime.png",
    securitybot: "assets/entities/securitybot.png",
    hound: "assets/entities/hound.png",
    eyebot: "assets/entities/eyebot.png",
    bomber: "assets/entities/bomber.png",
    medic: "assets/entities/medic.png",
    behemoth: "assets/entities/behemoth.png",
  },
  item: {
    medkit: "assets/items/medkit.png",
    oxygen: "assets/items/oxygen.png",
  },
  tile: {
    wall: "assets/tiles/wall.png",
    room: [
      "assets/floor_a.svg",
      "assets/floor_b.svg",
      "assets/floor_c.svg",
    ],
    corridor: "assets/corridor.svg",
    stairs: "assets/tiles/exit.png",
  },
};

const TILE_ART = {
  floor: {
    normal: "assets/tiles/floor_normal.png",
    spill: "assets/tiles/floor_spill.png",
    hole: "assets/tiles/floor_hole.png",
  },
  corridor: {
    horizontal: "assets/tiles/corridor_horizontal.png",
    vertical: "assets/tiles/corridor_vertical.png",
  },
};

const WALL_TILE_ART = {
  fill: "assets/tiles/walls/wall_fill.png",
  edge: {
    n: "assets/tiles/walls/wall_edge_n.svg",
    e: "assets/tiles/walls/wall_edge_e.svg",
    s: "assets/tiles/walls/wall_edge_s.svg",
    w: "assets/tiles/walls/wall_edge_w.svg",
  },
  outer: {
    nw: "assets/tiles/walls/wall_outer_nw.svg",
    ne: "assets/tiles/walls/wall_outer_ne.svg",
    sw: "assets/tiles/walls/wall_outer_sw.svg",
    se: "assets/tiles/walls/wall_outer_se.svg",
  },
  inner: {
    nw: "assets/tiles/walls/wall_inner_nw.svg",
    ne: "assets/tiles/walls/wall_inner_ne.svg",
    sw: "assets/tiles/walls/wall_inner_sw.svg",
    se: "assets/tiles/walls/wall_inner_se.svg",
  },
};

const DIRECTION_ORDER = ["down", "left", "right", "up"];

const CHARACTER_ANIMATION_DEFS = {
  player: {
    allowLegacyFallback: false,
    anchor: {
      x: 0.5,
      y: 1,
      footOffsetX: 0,
      footOffsetY: 0,
    },
    frameDurations: {
      idle: 420,
      walk: 95,
      attack: 72,
    },
    animations: {
      idle: {
        down: { src: "assets/sprites/player/idle_down.png", columns: 2, rows: 2, frameCount: 4 },
        left: { src: "assets/sprites/player/idle_left.png", columns: 2, rows: 2, frameCount: 4 },
        right: { src: "assets/sprites/player/idle_right.png", columns: 2, rows: 2, frameCount: 4 },
        up: { src: "assets/sprites/player/idle_up.png", columns: 2, rows: 2, frameCount: 4 },
      },
      walk: {
        down: { src: "assets/sprites/player/walk_down.png", columns: 2, rows: 2, frameCount: 4 },
        left: { src: "assets/sprites/player/walk_left.png", columns: 2, rows: 2, frameCount: 4 },
        right: { src: "assets/sprites/player/walk_right.png", columns: 2, rows: 2, frameCount: 4 },
        up: { src: "assets/sprites/player/walk_up.png", columns: 2, rows: 2, frameCount: 4 },
      },
      attack: {
        down: { src: "assets/sprites/player/attack_down.png", columns: 2, rows: 2, frameCount: 4 },
        left: { src: "assets/sprites/player/attack_left.png", columns: 2, rows: 2, frameCount: 4 },
        right: { src: "assets/sprites/player/attack_right.png", columns: 2, rows: 2, frameCount: 4 },
        up: { src: "assets/sprites/player/attack_up.png", columns: 2, rows: 2, frameCount: 4 },
      },
    },
    fallbackFrames: {
      idle: {
        down: ["assets/player_idle_0.svg", "assets/player_idle_1.svg", "assets/player_idle_0.svg", "assets/player_idle_1.svg"],
        left: ["assets/player_idle_0.svg", "assets/player_idle_1.svg", "assets/player_idle_0.svg", "assets/player_idle_1.svg"],
        right: ["assets/player_idle_0.svg", "assets/player_idle_1.svg", "assets/player_idle_0.svg", "assets/player_idle_1.svg"],
        up: ["assets/player_idle_0.svg", "assets/player_idle_1.svg", "assets/player_idle_0.svg", "assets/player_idle_1.svg"],
      },
      walk: {
        down: [
          "assets/player_move_0.svg",
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
        ],
        left: [
          "assets/player_move_0.svg",
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
        ],
        right: [
          "assets/player_move_0.svg",
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
        ],
        up: [
          "assets/player_move_0.svg",
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
        ],
      },
      attack: {
        down: [
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
          "assets/player_move_2.svg",
        ],
        left: [
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
          "assets/player_move_2.svg",
        ],
        right: [
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
          "assets/player_move_2.svg",
        ],
        up: [
          "assets/player_move_1.svg",
          "assets/player_move_2.svg",
          "assets/player_move_3.svg",
          "assets/player_move_2.svg",
        ],
      },
    },
  },
};

const UPGRADE_DEFS = [
  {
    id: "attack_boost",
    name: "\u653b\u6483\u529b\u30a2\u30c3\u30d7",
    shortName: "\u653b+1",
    description: "\u653b\u6483\u529b +1",
    apply(player) {
      player.attack += 1;
    },
  },
  {
    id: "max_hp_boost",
    name: "\u6700\u5927HP\u30a2\u30c3\u30d7",
    shortName: "HP+4",
    description: "\u6700\u5927HP +4 / HP\u3082\u5c11\u3057\u56de\u5fa9",
    apply(player) {
      player.maxHp += 4;
      player.hp = Math.min(player.maxHp, player.hp + 4);
    },
  },
  {
    id: "max_oxygen_boost",
    name: "\u6700\u5927\u9178\u7d20\u30a2\u30c3\u30d7",
    shortName: "\u9178\u7d20+4",
    description: "\u6700\u5927\u9178\u7d20 +4 / \u9178\u7d20\u3082\u5c11\u3057\u56de\u5fa9",
    apply(player) {
      player.maxOxygen += 4;
      player.oxygen = Math.min(player.maxOxygen, player.oxygen + 4);
    },
  },
  {
    id: "life_steal",
    name: "\u6483\u7834\u6642HP\u56de\u5fa9",
    shortName: "\u6483\u7834HP",
    description: "\u6575\u6483\u7834\u6642\u306bHP\u304c\u5c11\u3057\u56de\u5fa9",
    apply(player) {
      player.onKillHeal += 2;
    },
  },
  {
    id: "oxygen_drain",
    name: "\u6483\u7834\u6642\u9178\u7d20\u56de\u5fa9",
    shortName: "\u6483\u7834\u9178\u7d20",
    description: "\u6575\u6483\u7834\u6642\u306b\u9178\u7d20\u304c\u5c11\u3057\u56de\u5fa9",
    apply(player) {
      player.onKillOxygen += 2;
    },
  },
  {
    id: "critical_edge",
    name: "\u30af\u30ea\u30c6\u30a3\u30ab\u30eb\u7387\u30a2\u30c3\u30d7",
    shortName: "\u4f1a\u5fc3+15%",
    description: "15%\u3067\u30c0\u30e1\u30fc\u30b82\u500d",
    apply(player) {
      player.critChance += 0.15;
    },
  },
  {
    id: "shock_rounds",
    name: "\u8ffd\u6483\u5f3e",
    shortName: "\u8ffd\u648325%",
    description: "25%\u3067\u8ffd\u52a02\u30c0\u30e1\u30fc\u30b8",
    apply(player) {
      player.bonusDamageChance += 0.25;
    },
  },
  {
    id: "entry_shield",
    name: "\u30eb\u30fc\u30e0\u30b7\u30fc\u30eb\u30c9",
    shortName: "\u5165\u5ba4\u76fe+2",
    description: "\u65b0\u3057\u3044\u90e8\u5c4b\u306b\u5165\u308b\u305f\u3073\u30b7\u30fc\u30eb\u30c9+2",
    apply(player) {
      player.roomShield += 2;
    },
  },
  {
    id: "efficient_breathing",
    name: "\u7701\u30a8\u30cd\u547c\u5438",
    shortName: "\u9178\u7d20\u7121\u52b935%",
    description: "35%\u3067\u9178\u7d20\u6d88\u8cbb\u3092\u7121\u52b9\u5316",
    apply(player) {
      player.freeBreathChance += 0.35;
    },
  },
];

const ATTACK_MODE_DEFS = [
  { id: "standard", name: "\u6a19\u6e96\u653b\u6483", shortName: "\u6a19\u6e96", description: "\u96a3\u63a5\u3059\u308b1\u30de\u30b9\u3092\u653b\u6483" },
  { id: "pierce", name: "\u8cab\u901a\u30b7\u30e7\u30c3\u30c8", shortName: "\u8cab\u901a", description: "\u76f4\u7dda\u4e0a\u306e\u8907\u6570\u6575\u3092\u653b\u6483" },
  { id: "fan", name: "\u6247\u72b6\u30b7\u30e7\u30c3\u30c8", shortName: "\u6247\u72b6", description: "\u8fd1\u8ddd\u96e23\u30de\u30b9\u3092\u307e\u3068\u3081\u3066\u653b\u6483" },
  { id: "blast", name: "\u7206\u767a\u5f3e", shortName: "\u7206\u767a", description: "\u7740\u5f3e\u70b9\u306e\u5468\u56f2\u306b\u7bc4\u56f2\u30c0\u30e1\u30fc\u30b8" },
  { id: "power", name: "\u5358\u4f53\u9ad8\u706b\u529b\u30b7\u30e7\u30c3\u30c8", shortName: "\u9ad8\u706b\u529b", description: "\u5358\u4f53\u3078\u5927\u304d\u306a\u30c0\u30e1\u30fc\u30b8" },
];

const state = {
  floor: 1,
  floorType: FLOOR_TYPE.NORMAL,
  turn: 0,
  camera: { x: 0, y: 0 },
  cameraRender: { x: 0, y: 0 },
  cameraTarget: { x: 0, y: 0 },
  lastRenderedCamera: { x: null, y: null },
  mapDirty: true,
  animationFrame: null,
  activeAnimations: new Map(),
  visualImpulses: new Map(),
  visualFrame: null,
  visualTimestamp: 0,
  map: [],
  wallVariants: [],
  rooms: [],
  roomTiles: [],
  corridorTiles: [],
  startRoomId: null,
  stairsRoomId: null,
  discovered: [],
  visible: [],
  player: null,
  enemies: [],
  items: [],
  stairs: null,
  upgrades: [],
  upgradeChoices: [],
  pendingFloor: null,
  pendingRewardType: "normal",
  visitedRoomsThisFloor: new Set(),
  deathCause: "",
  logs: [],
  gameState: "playing",
  floatingTexts: [],
  attackEffects: [],
};

let nextEntityId = 1;
let nextRoomId = 1;
let nextFloatingTextId = 1;
let nextAttackEffectId = 1;
const spriteAssetLoadState = new Map();

const elements = {
  map: document.getElementById("map"),
  mapStage: document.getElementById("mapStage"),
  actorLayer: document.getElementById("actorLayer"),
  log: document.getElementById("log"),
  controlPanel: document.getElementById("controlPanel"),
  hpValue: document.getElementById("hpValue"),
  oxygenValue: document.getElementById("oxygenValue"),
  floorValue: document.getElementById("floorValue"),
  hpBar: document.getElementById("hpBar"),
  oxygenBar: document.getElementById("oxygenBar"),
  restartButton: document.getElementById("restartButton"),
  floorIntroOverlay: document.getElementById("floorIntroOverlay"),
  messageBanner: document.getElementById("messageBanner"),
  upgradeSummary: document.getElementById("upgradeSummary"),
  upgradeOverlay: document.getElementById("upgradeOverlay"),
  upgradeChoices: document.getElementById("upgradeChoices"),
  upgradeTitle: document.getElementById("upgradeTitle"),
  attackModeSummary: document.getElementById("attackModeSummary"),
  gameOverOverlay: document.getElementById("gameOverOverlay"),
  gameOverText: document.getElementById("gameOverText"),
  gameOverRestartButton: document.getElementById("gameOverRestartButton"),
};

function initGame() {
  state.floor = 1;
  state.turn = 0;
  state.camera = { x: 0, y: 0 };
  state.cameraRender = { x: 0, y: 0 };
  state.cameraTarget = { x: 0, y: 0 };
  state.lastRenderedCamera = { x: null, y: null };
  state.mapDirty = true;
  state.wallVariants = [];
  state.logs = [];
  state.floatingTexts = [];
  state.attackEffects = [];
  state.floorIntro = null;
  state.upgrades = [];
  state.upgradeChoices = [];
  state.pendingFloor = null;
  state.pendingRewardType = "normal";
  state.deathCause = "";
  state.gameState = "playing";
  state.player = {
    x: 0,
    y: 0,
    hp: 50,
    maxHp: 50,
    oxygen: 30,
    maxOxygen: 30,
    attack: 3,
    critChance: 0,
    bonusDamageChance: 0,
    onKillHeal: 0,
    onKillOxygen: 0,
    roomShield: 0,
    shield: 0,
    freeBreathChance: 0,
    oxygenActionCounter: 0,
    attackMode: "standard",
    facing: "down",
    spriteState: "idle",
    spriteStateStartedAt: 0,
    spriteStateEndsAt: 0,
    renderX: 0,
    renderY: 0,
  };

  addLog("\u5d29\u58ca\u3057\u305f\u7814\u7a76\u65bd\u8a2d\u3078\u964d\u308a\u7acb\u3063\u305f\u3002\u51fa\u53e3\u3092\u63a2\u3057\u3001\u9178\u7d20\u304c\u5c3d\u304d\u308b\u524d\u306b\u751f\u304d\u5ef6\u3073\u308d\u3002");
  preloadCharacterAssets(CHARACTER_ANIMATION_DEFS.player);
  preloadStaticAssets();
  ensureVisualLoop();
  setupFloor();
}


function setupFloor() {
  state.turn = 0;
  state.activeAnimations.clear();
  state.visualImpulses.clear();
  state.mapDirty = true;
  state.lastRenderedCamera = { x: null, y: null };
  state.floatingTexts = [];
  state.attackEffects = [];
  elements.map.style.transform = "";
  elements.actorLayer.style.transform = "";
  if (state.animationFrame) {
    cancelScheduledAnimation(state.animationFrame);
    state.animationFrame = null;
  }
  state.enemies = [];
  state.items = [];
  state.stairs = null;
  state.floorType = getFloorType(state.floor);

  const floorLayout = createFloorLayout();
  state.map = floorLayout.map;
  state.wallVariants = buildWallVariantMap(state.map);
  state.rooms = floorLayout.rooms;
  state.roomTiles = floorLayout.roomTiles;
  state.corridorTiles = floorLayout.corridorTiles;
  state.startRoomId = floorLayout.startRoomId;
  state.stairsRoomId = floorLayout.stairsRoomId;
  state.discovered = createVisibilityGrid(false);
  state.visible = createVisibilityGrid(false);
  state.visitedRoomsThisFloor = new Set();
  state.player.x = floorLayout.start.x;
  state.player.y = floorLayout.start.y;
  state.player.facing = "down";
  state.player.spriteState = "idle";
  state.player.spriteStateStartedAt = getNow();
  state.player.spriteStateEndsAt = 0;
  state.player.renderX = floorLayout.start.x;
  state.player.renderY = floorLayout.start.y;
  state.cameraRender.x = floorLayout.start.x;
  state.cameraRender.y = floorLayout.start.y;
  state.cameraTarget.x = floorLayout.start.x;
  state.cameraTarget.y = floorLayout.start.y;

  placeFloorEntities(floorLayout);
  triggerRoomEntryEffects();
  updateVisibility();
  updateCamera(true);

  showMessage(state.floorType === FLOOR_TYPE.BOSS
    ? `${state.floor}F BOSS FLOOR\u3002\u30d9\u30d2\u30e2\u30b9\u3092\u6483\u7834\u3057\u308d\u3002`
    : `${state.floor}F \u306b\u5230\u9054\u3002\u51fa\u53e3\u3092\u63a2\u305b\u3002`);
  showFloorIntro();
  addLog(`${state.floor}F \u306b\u5230\u9054\u3002`);
  render();
}


function createFloorLayout() {
  if (state.floorType === FLOOR_TYPE.BOSS) {
    return createBossFloorLayout();
  }

  while (true) {
    const map = createFilledMap(TILE.WALL);
    const rooms = generateRooms(map);
    if (rooms.length < MIN_ROOMS) {
      continue;
    }

    connectRooms(map, rooms);

    finalizeRoomTiles(rooms);
    const keyRooms = chooseKeyRooms(rooms);
    const startRoom = keyRooms.startRoom;
    const start = randomRoomTile(startRoom);
    const roomTiles = collectRoomTiles(rooms);
    const corridorTiles = collectCorridorTiles(map);

    if (!validateFloor(map, start, roomTiles)) {
      continue;
    }

    return {
      map,
      rooms,
      roomTiles,
      corridorTiles,
      start,
      startRoomId: keyRooms.startRoom.id,
      stairsRoomId: keyRooms.stairsRoom.id,
    };
  }
}

function createBossFloorLayout() {
  const map = createFilledMap(TILE.WALL);
  const room = {
    id: nextRoomId,
    x: 2,
    y: 2,
    width: MAP_SIZE - 4,
    height: MAP_SIZE - 4,
    centerX: Math.floor(MAP_SIZE / 2),
    centerY: Math.floor(MAP_SIZE / 2),
    tiles: [],
    role: "boss",
    roomType: ROOM_TYPE.DANGER,
    danger: 1,
  };
  nextRoomId += 1;

  carveRoom(map, room);
  finalizeRoomTiles([room]);

  const start = {
    x: room.x + 1,
    y: room.centerY,
  };

  return {
    map,
    rooms: [room],
    roomTiles: collectRoomTiles([room]),
    corridorTiles: [],
    start,
    startRoomId: room.id,
    stairsRoomId: null,
  };
}

function createFilledMap(tileType) {
  return Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(tileType));
}

function createVisibilityGrid(initialValue) {
  return Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(initialValue));
}

function generateRooms(map) {
  const rooms = [];
  const targetRooms = randomInt(MIN_ROOMS, MAX_ROOMS);

  for (let attempt = 0; attempt < MAX_ROOM_PLACEMENT_ATTEMPTS; attempt += 1) {
    if (rooms.length >= targetRooms) {
      break;
    }

    const room = createRandomRoom();
    if (doesRoomOverlap(room, rooms)) {
      continue;
    }

    carveRoom(map, room);
    rooms.push(room);
  }

  return rooms;
}

function createRandomRoom() {
  const width = randomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  const height = randomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  const x = randomInt(1, MAP_SIZE - width - 2);
  const y = randomInt(1, MAP_SIZE - height - 2);

  const room = {
    id: nextRoomId,
    x,
    y,
    width,
    height,
    centerX: x + Math.floor(width / 2),
    centerY: y + Math.floor(height / 2),
    tiles: [],
    role: "normal",
    roomType: ROOM_TYPE.NORMAL,
    danger: 0,
  };
  nextRoomId += 1;
  return room;
}

function doesRoomOverlap(room, rooms) {
  return rooms.some((placedRoom) => (
    room.x - 1 < placedRoom.x + placedRoom.width + 1 &&
    room.x + room.width + 1 > placedRoom.x - 1 &&
    room.y - 1 < placedRoom.y + placedRoom.height + 1 &&
    room.y + room.height + 1 > placedRoom.y - 1
  ));
}

function carveRoom(map, room) {
  for (let y = room.y; y < room.y + room.height; y += 1) {
    for (let x = room.x; x < room.x + room.width; x += 1) {
      map[y][x] = TILE.ROOM;
    }
  }
}

function connectRooms(map, rooms) {
  const sortedRooms = [...rooms].sort((a, b) => a.centerX - b.centerX);
  for (let index = 1; index < sortedRooms.length; index += 1) {
    connectRoomPair(map, sortedRooms[index - 1], sortedRooms[index]);
  }
}

function connectRoomPair(map, roomA, roomB) {
  const start = { x: roomA.centerX, y: roomA.centerY };
  const end = { x: roomB.centerX, y: roomB.centerY };
  const horizontalFirst = Math.random() < 0.5;

  if (horizontalFirst) {
    carveHorizontalCorridor(map, start.x, end.x, start.y);
    carveVerticalCorridor(map, start.y, end.y, end.x);
  } else {
    carveVerticalCorridor(map, start.y, end.y, start.x);
    carveHorizontalCorridor(map, start.x, end.x, end.y);
  }
}

function carveHorizontalCorridor(map, startX, endX, y) {
  const from = Math.min(startX, endX);
  const to = Math.max(startX, endX);
  for (let x = from; x <= to; x += 1) {
    if (map[y][x] === TILE.WALL) {
      map[y][x] = TILE.CORRIDOR;
    }
  }
}

function carveVerticalCorridor(map, startY, endY, x) {
  const from = Math.min(startY, endY);
  const to = Math.max(startY, endY);
  for (let y = from; y <= to; y += 1) {
    if (map[y][x] === TILE.WALL) {
      map[y][x] = TILE.CORRIDOR;
    }
  }
}

function collectRoomTiles(rooms) {
  const tiles = [];
  rooms.forEach((room) => {
    room.tiles.forEach((tile) => {
      tiles.push({ x: tile.x, y: tile.y, roomId: room.id });
    });
  });
  return tiles;
}

function finalizeRoomTiles(rooms) {
  rooms.forEach((room) => {
    room.tiles = [];
    for (let y = room.y; y < room.y + room.height; y += 1) {
      for (let x = room.x; x < room.x + room.width; x += 1) {
        room.tiles.push({ x, y, roomId: room.id });
      }
    }
  });
}

function chooseKeyRooms(rooms) {
  let bestPair = [rooms[0], rooms[rooms.length - 1]];
  let bestDistance = -1;

  for (let i = 0; i < rooms.length; i += 1) {
    for (let j = i + 1; j < rooms.length; j += 1) {
      const distance = manhattan(rooms[i], rooms[j]);
      if (distance > bestDistance) {
        bestDistance = distance;
        bestPair = [rooms[i], rooms[j]];
      }
    }
  }

  const [startRoom, stairsRoom] = bestPair;
  assignRoomRoles(rooms, startRoom.id, stairsRoom.id);
  assignRoomTypes(rooms, startRoom.id, stairsRoom.id);

  return { startRoom, stairsRoom };
}

function assignRoomRoles(rooms, startRoomId, stairsRoomId) {
  const startRoom = rooms.find((room) => room.id === startRoomId);
  const maxDistance = Math.max(
    ...rooms.map((room) => manhattan(room, startRoom)),
    1,
  );

  rooms.forEach((room) => {
    const baseDanger = manhattan(room, startRoom) / maxDistance;
    const jitter = (Math.random() * 0.2) - 0.1;
    room.role = "normal";
    room.danger = clamp(baseDanger + jitter, 0, 1);

    if (room.id === startRoomId) {
      room.role = "start";
      room.danger = 0;
    } else if (room.id === stairsRoomId) {
      room.role = "stairs";
      room.danger = clamp(Math.max(0.75, room.danger + 0.15), 0, 1);
    }
  });
}

function assignRoomTypes(rooms, startRoomId, stairsRoomId) {
  const candidateRooms = rooms.filter((room) => room.id !== startRoomId && room.id !== stairsRoomId);
  candidateRooms.forEach((room) => {
    room.roomType = ROOM_TYPE.NORMAL;
  });

  if (candidateRooms.length === 0) {
    return;
  }

  const supplyCount = determineRoomTypeCount(candidateRooms.length, ROOM_TYPE.SUPPLY);
  const dangerCount = determineRoomTypeCount(candidateRooms.length, ROOM_TYPE.DANGER);
  const safestRooms = [...candidateRooms].sort((a, b) => a.danger - b.danger);
  const riskiestRooms = [...candidateRooms].sort((a, b) => b.danger - a.danger);

  safestRooms.slice(0, supplyCount).forEach((room) => {
    room.roomType = ROOM_TYPE.SUPPLY;
  });

  let assignedDanger = 0;
  riskiestRooms.forEach((room) => {
    if (assignedDanger >= dangerCount || room.roomType !== ROOM_TYPE.NORMAL) {
      return;
    }
    room.roomType = ROOM_TYPE.DANGER;
    assignedDanger += 1;
  });
}

function determineRoomTypeCount(candidateRoomCount, roomType) {
  if (candidateRoomCount === 0) {
    return 0;
  }

  const roll = Math.random();
  if (roomType === ROOM_TYPE.SUPPLY) {
    if (candidateRoomCount >= 5 && roll > 0.82) {
      return 2;
    }
    return roll > 0.35 ? 1 : 0;
  }

  if (candidateRoomCount >= 5 && roll > 0.84) {
    return 2;
  }
  return roll > 0.42 ? 1 : 0;
}

function collectCorridorTiles(map) {
  const tiles = [];
  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      if (map[y][x] === TILE.CORRIDOR) {
        tiles.push({ x, y });
      }
    }
  }
  return tiles;
}

function validateFloor(map, start, roomTiles) {
  if (roomTiles.length < MIN_ROOM_TILES_FOR_SPAWNS) {
    return false;
  }

  const reachable = floodFill(map, start.x, start.y);
  const reachableSet = toPositionSet(reachable);

  const allRoomTilesReachable = roomTiles.every((tile) => reachableSet.has(positionKey(tile.x, tile.y)));
  if (!allRoomTilesReachable) {
    return false;
  }

  return reachable.some((tile) => tile.x !== start.x || tile.y !== start.y);
}

function placeFloorEntities(floorLayout) {
  if (state.floorType === FLOOR_TYPE.BOSS) {
    placeBossFloorEntities(floorLayout);
    return;
  }

  const occupied = new Set([positionKey(state.player.x, state.player.y)]);
  const startRoom = getRoomById(floorLayout.startRoomId);
  const stairsRoom = getRoomById(floorLayout.stairsRoomId);

  state.stairs = placeStairsInRoom(stairsRoom, occupied);
  placeFloorItems(startRoom, stairsRoom, occupied, floorLayout);
  placeFloorEnemies(startRoom, stairsRoom, occupied, floorLayout);
}

function placeBossFloorEntities(floorLayout) {
  const bossRoom = floorLayout.rooms[0];
  const bossPosition = {
    x: bossRoom.x + bossRoom.width - 2,
    y: bossRoom.centerY,
  };

  state.items = [];
  state.stairs = null;
  state.enemies.push(createEnemy("behemoth", bossPosition));
}

function placeStairsInRoom(room, occupied) {
  const stairsPosition = findSpawnTileInRoom(room, occupied, {
    avoidCorridorAdjacency: true,
    minDistanceFromPlayer: 6,
  }) || findSpawnTileInRoom(room, occupied, {
    avoidCorridorAdjacency: true,
  }) || findSpawnTileInRoom(room, occupied);

  if (!stairsPosition) {
    throw new Error("ボスフロアの生成に失敗しました。");
  }

  occupied.add(positionKey(stairsPosition.x, stairsPosition.y));
  state.map[stairsPosition.y][stairsPosition.x] = TILE.STAIRS;
  return stairsPosition;
}

function placeItemInPreferredRooms(type, preferredRooms, occupied) {
  for (const room of preferredRooms) {
    const itemPosition = findSpawnTileInRoom(room, occupied, {
      minDistanceFromPlayer: room.role === "start" ? 1 : 2,
    }) || findSpawnTileInRoom(room, occupied);

    if (!itemPosition) {
      continue;
    }

    occupied.add(positionKey(itemPosition.x, itemPosition.y));
    state.items.push(createItem(type, itemPosition));
    return;
  }

  throw new Error(`${type} の配置に失敗しました。`);
}

function placeFloorItems(startRoom, stairsRoom, occupied, floorLayout) {
  const itemBudget = getItemBudget(floorLayout);
  const supplyRooms = getRoomsByType(ROOM_TYPE.SUPPLY);
  const normalRooms = getRoomsByType(ROOM_TYPE.NORMAL)
    .filter((room) => room.id !== stairsRoom.id)
    .sort((a, b) => a.danger - b.danger);
  const dangerRooms = getRoomsByType(ROOM_TYPE.DANGER)
    .sort((a, b) => a.danger - b.danger);

  const preferredRooms = [
    ...supplyRooms.flatMap((room) => [room, room]),
    ...normalRooms,
    ...dangerRooms,
    ...(Math.random() < 0.45 ? [startRoom] : []),
    ...(Math.random() < 0.25 ? [stairsRoom] : []),
  ];

  let placedItems = 0;
  while (placedItems < itemBudget) {
    const itemType = chooseItemTypeForPlacement(placedItems);
    if (!tryPlaceItemInRoomList(itemType, shuffle(preferredRooms.length > 0 ? preferredRooms : state.rooms), occupied)) {
      break;
    }
    placedItems += 1;
  }
}

function placeFloorEnemies(startRoom, stairsRoom, occupied, floorLayout) {
  const enemyBudget = getEnemyBudget(floorLayout);
  let placedEnemies = 0;

  buildEnemyRoomQueue(startRoom, stairsRoom).forEach((room) => {
    if (placedEnemies >= enemyBudget) {
      return;
    }

    const enemyCount = Math.min(
      getEnemyCountForRoom(room, stairsRoom.id, startRoom.id),
      enemyBudget - placedEnemies,
    );

    for (let count = 0; count < enemyCount; count += 1) {
      const enemyPosition = findSpawnTileInRoom(room, occupied, {
        minDistanceFromPlayer: room.id === startRoom.id ? 4 : 3,
      });
      if (!enemyPosition) {
        break;
      }
      occupied.add(positionKey(enemyPosition.x, enemyPosition.y));
      state.enemies.push(createEnemy(chooseEnemyTypeForRoom(room), enemyPosition));
      placedEnemies += 1;
    }
  });
}

function getEnemyCountForRoom(room, stairsRoomId, startRoomId) {
  if (room.id === startRoomId) {
    if (room.width * room.height >= 12 && Math.random() < 0.38) {
      return 1;
    }
    return 0;
  }

  if (room.id === stairsRoomId) {
    return Math.random() < 0.6 ? 1 : 0;
  }

  if (room.roomType === ROOM_TYPE.SUPPLY) {
    return Math.random() < 0.75 ? 0 : 1;
  }

  if (room.roomType === ROOM_TYPE.DANGER) {
    return 1 + (Math.random() < 0.7 ? 1 : 0);
  }

  const baseChance = 0.55 + ((state.floor - 1) * 0.1) + (room.danger * 0.15);
  return Math.random() < baseChance ? 1 : 0;
}

function getItemBudget(floorLayout) {
  const areaFactor = Math.floor(floorLayout.roomTiles.length / 26);
  return clamp(1 + areaFactor + (Math.random() < 0.28 ? 1 : 0), 1, 5);
}

function getEnemyBudget(floorLayout) {
  const roomFactor = Math.floor(floorLayout.rooms.length / 2);
  const areaFactor = Math.floor(floorLayout.roomTiles.length / 22);
  return clamp(3 + roomFactor + areaFactor + (state.floor - 1), 3, 9);
}

function chooseEnemyTypeForRoom(room) {
  const band = getEnemyBandForFloor(state.floor);
  const pool = Object.entries(band.weights).map(([type, baseWeight]) => ({
    type,
    weight: baseWeight + getEnemyRoomDangerBonus(type, room),
  }));

  if (room.roomType === ROOM_TYPE.SUPPLY) {
    adjustPoolWeight(pool, "slime", 1.05);
    adjustPoolWeight(pool, "securitybot", 0.72);
    adjustPoolWeight(pool, "hound", 0.74);
    adjustPoolWeight(pool, "eyebot", 0.82);
    adjustPoolWeight(pool, "bomber", 0.58);
    adjustPoolWeight(pool, "medic", 1.6);
  }

  if (room.roomType === ROOM_TYPE.DANGER) {
    adjustPoolWeight(pool, "slime", 0.92);
    adjustPoolWeight(pool, "securitybot", 1.32);
    adjustPoolWeight(pool, "hound", 1.38);
    adjustPoolWeight(pool, "eyebot", 1.22);
    adjustPoolWeight(pool, "bomber", 1.5);
    adjustPoolWeight(pool, "medic", 1.08);
  }

  return weightedChoice(pool);
}

function getEnemyBandForFloor(floor) {
  return ENEMY_FLOOR_BANDS.find((band) => floor <= band.maxFloor) || ENEMY_FLOOR_BANDS[ENEMY_FLOOR_BANDS.length - 1];
}

function getEnemyRoomDangerBonus(type, room) {
  switch (type) {
    case "securitybot":
      return room.danger * 1.1;
    case "hound":
      return room.danger * 1.25;
    case "eyebot":
      return room.danger * 0.75;
    case "bomber":
      return room.danger * 0.9;
    case "medic":
      return room.danger * 0.35;
    case "slime":
    default:
      return room.danger * 0.45;
  }
}

function adjustPoolWeight(pool, type, multiplier) {
  const entry = pool.find((candidate) => candidate.type === type);
  if (entry) {
    entry.weight *= multiplier;
  }
}

function weightedChoice(pool) {
  const total = pool.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
  if (total <= 0) {
    return pool[0].type;
  }

  let roll = Math.random() * total;
  for (const entry of pool) {
    roll -= Math.max(0, entry.weight);
    if (roll <= 0) {
      return entry.type;
    }
  }

  return pool[pool.length - 1].type;
}

function findSpawnTileInRoom(room, occupied, options = {}) {
  const candidates = shuffle(room.tiles).filter((tile) => {
    if (occupied.has(positionKey(tile.x, tile.y))) {
      return false;
    }
    if (options.minDistanceFromPlayer && manhattan(tile, state.player) < options.minDistanceFromPlayer) {
      return false;
    }
    if (options.avoidCorridorAdjacency && isAdjacentToCorridor(tile.x, tile.y)) {
      return false;
    }
    return true;
  });

  return candidates[0] || null;
}

function isAdjacentToCorridor(x, y) {
  return getDirections().some((direction) => {
    const nextX = x + direction.x;
    const nextY = y + direction.y;
    return isInside(nextX, nextY) && state.map[nextY][nextX] === TILE.CORRIDOR;
  });
}

function getRoomById(roomId) {
  return state.rooms.find((room) => room.id === roomId);
}

function getRoomsByType(roomType) {
  return state.rooms.filter((room) => room.roomType === roomType);
}

function otherItemType(type) {
  return type === "medkit" ? "oxygen" : "medkit";
}

function chooseItemTypeForPlacement(index) {
  if (index === 0 && state.floor === 1 && Math.random() < 0.55) {
    return "oxygen";
  }
  return Math.random() < 0.5 ? "medkit" : "oxygen";
}

function tryPlaceItemInRoomList(type, rooms, occupied) {
  for (const room of rooms) {
    const itemPosition = findSpawnTileInRoom(room, occupied, {
      minDistanceFromPlayer: room.role === "start" ? 2 : 1,
    }) || findSpawnTileInRoom(room, occupied);

    if (!itemPosition) {
      continue;
    }

    occupied.add(positionKey(itemPosition.x, itemPosition.y));
    state.items.push(createItem(type, itemPosition));
    return true;
  }

  return false;
}

function buildEnemyRoomQueue(startRoom, stairsRoom) {
  const dangerRooms = getRoomsByType(ROOM_TYPE.DANGER).sort((a, b) => b.danger - a.danger);
  const normalRooms = getRoomsByType(ROOM_TYPE.NORMAL)
    .filter((room) => room.id !== stairsRoom.id && room.id !== startRoom.id)
    .sort((a, b) => b.danger - a.danger);
  const supplyRooms = getRoomsByType(ROOM_TYPE.SUPPLY).sort((a, b) => b.danger - a.danger);

  return [
    ...dangerRooms,
    stairsRoom,
    ...normalRooms,
    ...supplyRooms,
    ...(Math.random() < 0.25 ? [startRoom] : []),
  ];
}

function placeOptionalItemInRoom(type, room, occupied) {
  const itemPosition = findSpawnTileInRoom(room, occupied, {
    minDistanceFromPlayer: room.role === "start" ? 1 : 2,
  }) || findSpawnTileInRoom(room, occupied);

  if (!itemPosition) {
    return;
  }

  occupied.add(positionKey(itemPosition.x, itemPosition.y));
  state.items.push(createItem(type, itemPosition));
}

function drawUpgradeChoices(count) {
  return shuffle(UPGRADE_DEFS.map((upgrade) => upgrade.id)).slice(0, count);
}

function drawAttackChoices(count) {
  return shuffle(ATTACK_MODE_DEFS
    .filter((mode) => mode.id !== "standard" && mode.id !== state.player.attackMode)
    .map((mode) => mode.id))
    .slice(0, count);
}

function selectUpgrade(upgradeId) {
  if (state.gameState !== "choosing-upgrade") {
    return;
  }

  if (state.pendingRewardType === "boss-attack") {
    applyAttackModeReward(upgradeId);
  } else {
    applyUpgrade(upgradeId);
  }
  const nextFloor = state.pendingFloor;
  const rewardType = state.pendingRewardType;
  state.pendingFloor = null;
  state.upgradeChoices = [];
  state.pendingRewardType = "normal";
  state.gameState = "playing";
  state.floor = nextFloor;
  if (rewardType === "boss-attack") {
    state.player.hp = state.player.maxHp;
    state.player.oxygen = state.player.maxOxygen;
  } else {
    state.player.oxygen = Math.min(state.player.maxOxygen, state.player.oxygen + 4);
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 2);
  }
  addLog(`${(rewardType === "boss-attack" ? getAttackModeDef(upgradeId) : getUpgradeDef(upgradeId)).name} \u3092\u7372\u5f97\u3057\u305f\u3002`);
  setupFloor();
}

function applyUpgrade(upgradeId) {
  const upgrade = getUpgradeDef(upgradeId);
  upgrade.apply(state.player);
  state.upgrades.push(upgradeId);
}

function applyAttackModeReward(modeId) {
  state.player.attackMode = modeId;
}

function getUpgradeDef(upgradeId) {
  return UPGRADE_DEFS.find((upgrade) => upgrade.id === upgradeId);
}

function calculatePlayerDamage(modeId) {
  let damage = state.player.attack;
  const notes = [];

  if (modeId === "power") {
    notes.push("\u5f37\u6483");
  } else if (modeId === "blast") {
    damage += 1;
  }

  if (Math.random() < state.player.critChance) {
    notes.push("\u30af\u30ea\u30c6\u30a3\u30ab\u30eb");
    damage *= 2;
  }

  if (Math.random() < state.player.bonusDamageChance) {
    notes.push("\u8ffd\u52a0\u30c0\u30e1\u30fc\u30b8");
    damage += 2;
  }

  return {
    damage,
    note: notes.length > 0 ? ` (${notes.join(" / ")})` : "",
  };
}


function getAttackTargetsForDirection(dx, dy) {
  switch (state.player.attackMode) {
    case "pierce":
      return getPierceTargets(dx, dy);
    case "fan":
      return getSweepTargets(dx, dy);
    case "blast":
      return getBlastTargets(dx, dy);
    case "power":
      return getPowerTargets(dx, dy);
    case "standard":
    default:
      return getStandardTargets(dx, dy);
  }
}

function getAttackCellsForDirection(dx, dy) {
  switch (state.player.attackMode) {
    case "pierce":
      return getPierceCells(dx, dy);
    case "fan":
      return getSweepCells(dx, dy);
    case "blast":
      return getBlastCells(dx, dy);
    case "power":
      return getPowerCells(dx, dy);
    case "standard":
    default:
      return getStandardCells(dx, dy);
  }
}

function getPierceTargets(dx, dy) {
  const targets = [];
  let x = state.player.x + dx;
  let y = state.player.y + dy;

  while (isInside(x, y) && state.map[y][x] !== TILE.WALL) {
    const enemy = getVisibleEnemyAt(x, y);
    if (enemy) {
      targets.push(enemy);
    }
    x += dx;
    y += dy;
  }

  return uniqueEnemies(targets);
}

function getPierceCells(dx, dy) {
  const cells = [];
  let x = state.player.x + dx;
  let y = state.player.y + dy;

  while (isInside(x, y) && state.map[y][x] !== TILE.WALL) {
    cells.push({ x, y });
    x += dx;
    y += dy;
  }

  return cells;
}

function getSweepTargets(dx, dy) {
  return uniqueEnemies(getSweepCells(dx, dy).map((position) => getVisibleEnemyAt(position.x, position.y)).filter(Boolean));
}

function getSweepCells(dx, dy) {
  const positions = [{ x: state.player.x + dx, y: state.player.y + dy }];
  if (dx !== 0) {
    positions.push({ x: state.player.x + dx, y: state.player.y - 1 });
    positions.push({ x: state.player.x + dx, y: state.player.y + 1 });
  } else {
    positions.push({ x: state.player.x - 1, y: state.player.y + dy });
    positions.push({ x: state.player.x + 1, y: state.player.y + dy });
  }

  return positions.filter((position) => isInside(position.x, position.y) && state.map[position.y][position.x] !== TILE.WALL);
}

function getBlastTargets(dx, dy) {
  const center = findBlastCenter(dx, dy);
  if (!center) {
    return [];
  }

  return uniqueEnemies(state.enemies.filter((enemy) => (
    state.visible[enemy.y]?.[enemy.x] &&
    Math.max(Math.abs(enemy.x - center.x), Math.abs(enemy.y - center.y)) <= 1
  )));
}

function getBlastCells(dx, dy) {
  const center = findBlastCenter(dx, dy);
  if (!center) {
    return [];
  }

  const cells = [];
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      const x = center.x + offsetX;
      const y = center.y + offsetY;
      if (isInside(x, y) && state.map[y][x] !== TILE.WALL) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
}

function findBlastCenter(dx, dy) {
  for (let step = 1; step <= 3; step += 1) {
    const x = state.player.x + (dx * step);
    const y = state.player.y + (dy * step);
    if (!isInside(x, y) || state.map[y][x] === TILE.WALL) {
      return null;
    }
    if (getVisibleEnemyAt(x, y)) {
      return { x, y };
    }
  }
  return null;
}

function getStandardTargets(dx, dy) {
  const enemy = getVisibleEnemyAt(state.player.x + dx, state.player.y + dy);
  return enemy ? [enemy] : [];
}

function getStandardCells(dx, dy) {
  const x = state.player.x + dx;
  const y = state.player.y + dy;
  if (!isInside(x, y) || state.map[y][x] === TILE.WALL) {
    return [];
  }
  return [{ x, y }];
}

function getPowerTargets(dx, dy) {
  const enemy = getVisibleEnemyAt(state.player.x + dx, state.player.y + dy);
  return enemy ? [enemy] : [];
}

function getPowerCells(dx, dy) {
  return getStandardCells(dx, dy);
}

function getVisibleEnemyAt(x, y) {
  if (!isInside(x, y) || !state.visible[y][x]) {
    return null;
  }
  return getEnemyAt(x, y);
}

function uniqueEnemies(enemies) {
  const seen = new Set();
  return enemies.filter((enemy) => {
    if (!enemy || seen.has(enemy.id)) {
      return false;
    }
    seen.add(enemy.id);
    return true;
  });
}

function getAttackModeDef(modeId) {
  return ATTACK_MODE_DEFS.find((mode) => mode.id === modeId);
}

function applyKillRewards() {
  if (state.player.onKillHeal > 0) {
    const previousHp = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + state.player.onKillHeal);
    const healed = state.player.hp - previousHp;
    if (healed > 0) {
      spawnFloatingText(state.player.x, state.player.y, `+${healed}`, "heal", "player");
    }
  }
  if (state.player.onKillOxygen > 0) {
    state.player.oxygen = Math.min(state.player.maxOxygen, state.player.oxygen + state.player.onKillOxygen);
  }
}

function applyDamageToPlayer(amount, source, hitFrom = null) {
  let remainingDamage = amount;
  if (state.player.shield > 0) {
    const blocked = Math.min(state.player.shield, remainingDamage);
    state.player.shield -= blocked;
    remainingDamage -= blocked;
    addLog(`${source}\u304c\u30b7\u30fc\u30eb\u30c9\u3092 ${blocked} \u9632\u3044\u3060\u3002`);
  }

  if (remainingDamage > 0) {
    state.player.hp -= remainingDamage;
    state.deathCause = source;
    spawnFloatingText(state.player.x, state.player.y, `-${remainingDamage}`, "damage", "player");
    if (hitFrom) {
      queueVisualImpulse(
        "player",
        "hit",
        Math.sign(state.player.x - hitFrom.x),
        Math.sign(state.player.y - hitFrom.y),
        130,
      );
    }
    addLog(`${source}\u3067 ${remainingDamage} \u30c0\u30e1\u30fc\u30b8\u3002`);
  }
}


function spawnAttackEffect(fromX, fromY, toX, toY, kind, options = {}) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const variant = options.variant || (kind === "player" ? "hit" : "enemy");
  state.attackEffects.push({
    id: nextAttackEffectId,
    fromX,
    fromY,
    toX,
    toY,
    kind,
    variant,
    startTime: getNow(),
    duration: options.duration || ATTACK_EFFECT_DURATION,
    angle,
    distance,
    showTrail: options.showTrail !== false && distance > 0,
    showImpact: options.showImpact !== false,
    showFlash: Boolean(options.hit),
  });
  nextAttackEffectId += 1;
}

function spawnTileImpactEffect(x, y, kind, options = {}) {
  state.attackEffects.push({
    id: nextAttackEffectId,
    fromX: x,
    fromY: y,
    toX: x,
    toY: y,
    kind,
    variant: options.variant || kind,
    startTime: getNow(),
    duration: options.duration || ATTACK_EFFECT_DURATION,
    angle: 0,
    distance: 0,
    showTrail: false,
    showImpact: options.showImpact !== false,
    showFlash: Boolean(options.hit),
  });
  nextAttackEffectId += 1;
}

function triggerRoomEntryEffects() {
  const room = getRoomAt(state.player.x, state.player.y);
  if (!room) {
    return;
  }

  if (state.visitedRoomsThisFloor.has(room.id)) {
    return;
  }

  state.visitedRoomsThisFloor.add(room.id);
  if (state.player.roomShield > 0) {
    state.player.shield += state.player.roomShield;
    addLog("\u65b0\u3057\u3044\u90e8\u5c4b\u306b\u5165\u3063\u3066\u30b7\u30fc\u30eb\u30c9\u3092 " + state.player.roomShield + " \u7372\u5f97\u3057\u305f\u3002");
  }
}


function floodFill(map, startX, startY) {
  const visited = new Set();
  const queue = [{ x: startX, y: startY }];
  const result = [];

  while (queue.length > 0) {
    const current = queue.shift();
    const key = positionKey(current.x, current.y);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    if (!isInside(current.x, current.y) || map[current.y][current.x] === TILE.WALL) {
      continue;
    }

    result.push(current);
    getDirections().forEach((direction) => {
      queue.push({ x: current.x + direction.x, y: current.y + direction.y });
    });
  }

  return result;
}

function createEnemy(type, position) {
  const def = ENEMY_DEFS[type];
  const enemy = {
    id: nextEntityId,
    type,
    x: position.x,
    y: position.y,
    hp: def.hp,
    maxHp: def.hp,
    attack: def.attack,
    speed: def.speed,
    cooldown: 0,
    renderX: position.x,
    renderY: position.y,
  };
  nextEntityId += 1;
  return enemy;
}

function createItem(type, position) {
  const item = {
    id: nextEntityId,
    type,
    x: position.x,
    y: position.y,
  };
  nextEntityId += 1;
  return item;
}

function handlePlayerAction(action) {
  if (state.gameState !== "playing") {
    return;
  }

  if (state.player.spriteState === "attack" && state.player.spriteStateEndsAt > getNow()) {
    return;
  }

  let acted = false;
  if (action === "wait") {
    addLog("\u305d\u306e\u5834\u3067\u5f85\u6a5f\u3057\u305f\u3002");
    acted = true;
  } else {
    const direction = directionMap[action];
    acted = attemptMoveOrAttack(direction.x, direction.y);
  }

  if (!acted) {
    render();
    return;
  }

  if (state.gameState !== "playing") {
    render();
    return;
  }

  state.turn += 1;
  consumeOxygen();
  if (state.gameState !== "playing") {
    updateVisibility();
    render();
    return;
  }

  collectItemAtPlayer();
  if (tryUseStairs()) {
    updateVisibility();
    render();
    return;
  }

  enemiesAct();
  collectItemAtPlayer();
  checkGameOver();
  updateVisibility();
  render();
}


function attemptMoveOrAttack(dx, dy) {
  state.player.facing = getDirectionName(dx, dy);
  const nextX = state.player.x + dx;
  const nextY = state.player.y + dy;

  const attackTargets = getAttackTargetsForDirection(dx, dy);
  const attackCells = getAttackCellsForDirection(dx, dy);
  if (attackTargets.length > 0) {
    playPlayerAttackAnimation(dx, dy);
    performAttack(state.player.attackMode, attackTargets, attackCells);
    return true;
  }

  if (!isWalkable(nextX, nextY)) {
    addLog("\u305d\u306e\u5148\u306f\u58c1\u3060\u3002");
    return false;
  }

  const previousPosition = { x: state.player.x, y: state.player.y };
  state.player.x = nextX;
  state.player.y = nextY;
  queueHopAnimation("player", state.player, previousPosition, { x: nextX, y: nextY }, 150, 0.22);
  return true;
}


function attackEnemy(enemy) {
  if (!state.enemies.some((target) => target.id === enemy.id)) {
    return;
  }

  const attackResult = calculatePlayerDamage(state.player.attackMode);
  addLog(ENEMY_DEFS[enemy.type].name + " \u3092\u653b\u6483\u3057 " + attackResult.damage + " \u30c0\u30e1\u30fc\u30b8" + attackResult.note + "\u3002");
  damageEnemy(enemy, attackResult.damage, { grantKillRewards: true });
}


function performAttack(modeId, targets, attackCells = []) {
  addLog(getAttackModeDef(modeId).name + " \u3092\u653e\u3063\u305f\u3002");

  const hitPositions = new Set(targets.map((enemy) => positionKey(enemy.x, enemy.y)));
  attackCells.forEach((cell) => {
    spawnAttackEffect(state.player.x, state.player.y, cell.x, cell.y, "player", {
      hit: hitPositions.has(positionKey(cell.x, cell.y)),
    });
  });

  targets.forEach((enemy) => {
    queueVisualImpulse(
      enemy.id,
      "hit",
      Math.sign(enemy.x - state.player.x),
      Math.sign(enemy.y - state.player.y),
      120,
    );
    attackEnemy(enemy);
  });
}


function consumeOxygen() {
  state.player.oxygenActionCounter += 1;
  if (state.player.oxygenActionCounter < OXYGEN_ACTION_INTERVAL) {
    return;
  }

  state.player.oxygenActionCounter = 0;

  if (Math.random() < state.player.freeBreathChance) {
    addLog("\u9178\u7d20\u6d88\u8cbb\u3092\u7121\u52b9\u5316\u3057\u305f\u3002");
    return;
  }

  if (state.player.oxygen > 0) {
    state.player.oxygen -= 1;
    if (state.player.oxygen === 0) {
      spawnFloatingText(state.player.x, state.player.y, "\u9178\u7d20\u5207\u308c", "alert", "player", 3000);
    }
    if (state.player.oxygen === 5) {
      addLog("\u9178\u7d20\u304c\u6b8b\u308a\u5c11\u306a\u3044\u3002");
    }
    return;
  }

  applyDamageToPlayer(1, "\u9178\u7d20\u5207\u308c");
  checkGameOver();
}


function enemiesAct() {
  state.enemies.forEach((enemy) => {
    if (state.gameState !== "playing") {
      return;
    }

    if (state.turn % enemy.speed !== 0) {
      return;
    }

    if (enemy.type === "behemoth") {
      actBoss(enemy);
      return;
    }

    actEnemy(enemy);
  });
}

function actEnemy(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  switch (def.ai) {
    case "shooter":
      actShooterEnemy(enemy);
      return;
    case "bomber":
      actExploderEnemy(enemy);
      return;
    case "support":
      actSupportEnemy(enemy);
      return;
    case "chaser":
    default:
      actChaserEnemy(enemy);
  }
}

function actChaserEnemy(enemy) {
  const distance = manhattan(enemy, state.player);
  if (distance === 1) {
    playEnemyAttackAnimation(enemy);
    spawnAttackEffect(enemy.x, enemy.y, state.player.x, state.player.y, "enemy", { hit: true });
    applyDamageToPlayer(enemy.attack, ENEMY_DEFS[enemy.type].name + " \u306e\u653b\u6483", enemy);
    return;
  }

  moveEnemyTowardPlayer(enemy, ENEMY_DEFS[enemy.type].moveSteps || 1);
}


function actShooterEnemy(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  const distance = manhattan(enemy, state.player);

  if (distance === 1) {
    playEnemyAttackAnimation(enemy);
    spawnAttackEffect(enemy.x, enemy.y, state.player.x, state.player.y, "enemy", { hit: true });
    applyDamageToPlayer(enemy.attack, `${def.name} \u306e\u8fd1\u8ddd\u96e2\u653b\u6483`, enemy);
    return;
  }

  if (distance <= 2 && moveEnemyAwayFromPlayer(enemy)) {
    return;
  }

  if (hasClearShot(enemy, state.player, def.range || 4)) {
    addLog(def.name + " \u304c\u5c04\u6483\u3057\u305f\u3002");
    playEnemyAttackAnimation(enemy);
    spawnAttackEffect(enemy.x, enemy.y, state.player.x, state.player.y, "enemy", { hit: true, duration: 150 });
    applyDamageToPlayer(def.attack, `${def.name} \u306e\u5c04\u6483`, enemy);
    return;
  }

  moveEnemyTowardPlayer(enemy, def.moveSteps || 1);
}


function actExploderEnemy(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  if (manhattan(enemy, state.player) === 1) {
    addLog(def.name + " \u304c\u7206\u767a\u3057\u305f\u3002");
    spawnTileImpactEffect(enemy.x, enemy.y, "enemy", { hit: true, duration: 170, variant: "burst" });
    removeEnemy(enemy);
    explodeAt(enemy.x, enemy.y, def.explosionDamage || 2, def.name + " \u306e\u7206\u767a", {
      ignoreEnemyIds: [enemy.id],
    });
    return;
  }

  moveEnemyTowardPlayer(enemy, def.moveSteps || 1);
}


function actSupportEnemy(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  const ally = findHealTarget(enemy, def.supportRange || 3);
  if (ally) {
    const amount = def.healPower || 2;
    const previousHp = ally.hp;
    ally.hp = Math.min(ally.maxHp, ally.hp + amount);
    const healed = ally.hp - previousHp;
    if (healed > 0) {
      spawnFloatingText(ally.x, ally.y, `+${healed}`, "heal", ally.id);
    }
    addLog(def.name + " \u304c " + ENEMY_DEFS[ally.type].name + " \u3092 " + amount + " \u56de\u5fa9\u3057\u305f\u3002");
    return;
  }

  if (manhattan(enemy, state.player) === 1) {
    playEnemyAttackAnimation(enemy);
    applyDamageToPlayer(enemy.attack, def.name + " \u306e\u653b\u6483", enemy);
    spawnAttackEffect(enemy.x, enemy.y, state.player.x, state.player.y, "enemy", { hit: true });
    return;
  }

  moveEnemyTowardPlayer(enemy, def.moveSteps || 1);
}


function moveEnemyTowardPlayer(enemy, steps) {
  const startPosition = { x: enemy.x, y: enemy.y };
  for (let step = 0; step < steps; step += 1) {
    const dx = Math.sign(state.player.x - enemy.x);
    const dy = Math.sign(state.player.y - enemy.y);
    const options = prioritizeDirections(dx, dy);

    let moved = false;
    for (const option of options) {
      const nextX = enemy.x + option.x;
      const nextY = enemy.y + option.y;

      if (!canEnemyMoveTo(nextX, nextY)) {
        continue;
      }

      enemy.x = nextX;
      enemy.y = nextY;
      moved = true;
      break;
    }

    if (!moved || manhattan(enemy, state.player) === 1) {
      break;
    }
  }

  if (startPosition.x !== enemy.x || startPosition.y !== enemy.y) {
    queueHopAnimation(enemy.id, enemy, startPosition, { x: enemy.x, y: enemy.y }, 170, 0.16);
  }
}

function moveEnemyAwayFromPlayer(enemy) {
  const startPosition = { x: enemy.x, y: enemy.y };
  const dx = Math.sign(enemy.x - state.player.x);
  const dy = Math.sign(enemy.y - state.player.y);
  const options = prioritizeDirections(dx, dy);

  for (const option of options) {
    const nextX = enemy.x + option.x;
    const nextY = enemy.y + option.y;

    if (!canEnemyMoveTo(nextX, nextY)) {
      continue;
    }

    if (manhattan({ x: nextX, y: nextY }, state.player) <= manhattan(enemy, state.player)) {
      continue;
    }

    enemy.x = nextX;
    enemy.y = nextY;
    queueHopAnimation(enemy.id, enemy, startPosition, { x: enemy.x, y: enemy.y }, 150, 0.14);
    return true;
  }

  return false;
}

function hasClearShot(from, to, range) {
  if (from.x !== to.x && from.y !== to.y) {
    return false;
  }

  const distance = manhattan(from, to);
  if (distance < 1 || distance > range) {
    return false;
  }

  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  let x = from.x + dx;
  let y = from.y + dy;

  while (x !== to.x || y !== to.y) {
    if (!isInside(x, y) || state.map[y][x] === TILE.WALL) {
      return false;
    }
    x += dx;
    y += dy;
  }

  return true;
}

function findHealTarget(enemy, range) {
  return state.enemies.find((ally) => (
    ally.id !== enemy.id &&
    ally.hp < ally.maxHp &&
    manhattan(enemy, ally) <= range
  )) || null;
}

function damageEnemy(enemy, amount, options = {}) {
  if (!state.enemies.some((target) => target.id === enemy.id)) {
    return false;
  }

  const previousHp = enemy.hp;
  enemy.hp -= amount;
  const actualDamage = Math.min(previousHp, amount);
  if (actualDamage > 0) {
    spawnFloatingText(enemy.x, enemy.y, `-${actualDamage}`, "damage", enemy.id);
  }
  if (enemy.hp > 0) {
    return false;
  }

  const enemyName = ENEMY_DEFS[enemy.type].name;
  const dropPosition = { x: enemy.x, y: enemy.y };
  removeEnemy(enemy);
  addLog(enemyName + " \u3092\u5012\u3057\u305f\u3002");

  if (options.grantKillRewards) {
    applyKillRewards();
  }

  tryDropItemFromEnemy(enemy, dropPosition);

  const def = ENEMY_DEFS[enemy.type];
  if (def.explosionDamage) {
    addLog(enemyName + " \u304c\u7206\u767a\u3057\u305f\u3002");
    explodeAt(enemy.x, enemy.y, def.explosionDamage, `${enemyName} \u306e\u7206\u767a`, {
      grantKillRewards: options.grantKillRewards,
      ignoreEnemyIds: [enemy.id],
    });
  }

  if (enemy.type === "behemoth") {
    handleBossDefeat();
  }

  return true;
}

function removeEnemy(enemy) {
  state.activeAnimations.delete(enemy.id);
  state.visualImpulses.delete(enemy.id);
  state.enemies = state.enemies.filter((target) => target.id !== enemy.id);
}

function tryDropItemFromEnemy(enemy, position) {
  const dropChance = ENEMY_DROP_CHANCE[enemy.type] ?? 0;
  if (dropChance <= 0 || Math.random() >= dropChance) {
    return false;
  }

  if (state.map[position.y]?.[position.x] === TILE.STAIRS) {
    return false;
  }

  if (getItemAt(position.x, position.y)) {
    return false;
  }

  const itemType = Math.random() < 0.55 ? "medkit" : "oxygen";
  state.items.push(createItem(itemType, position));
  state.mapDirty = true;
  addLog(ENEMY_DEFS[enemy.type].name + " \u304c " + ITEM_DEFS[itemType].name + " \u3092\u843d\u3068\u3057\u305f\u3002");
  return true;
}


function explodeAt(x, y, damage, source, options = {}) {
  if (Math.max(Math.abs(state.player.x - x), Math.abs(state.player.y - y)) <= 1) {
    spawnTileImpactEffect(state.player.x, state.player.y, "enemy", { hit: true, duration: 150, variant: "burst" });
    applyDamageToPlayer(damage, source, { x, y });
  }

  const ignoreEnemyIds = new Set(options.ignoreEnemyIds || []);
  const targets = state.enemies.filter((enemy) => (
    !ignoreEnemyIds.has(enemy.id) &&
    Math.max(Math.abs(enemy.x - x), Math.abs(enemy.y - y)) <= 1
  ));

  targets.forEach((enemy) => {
    spawnTileImpactEffect(enemy.x, enemy.y, "player", { hit: true, duration: 150, variant: "burst" });
    addLog(ENEMY_DEFS[enemy.type].name + " \u304c\u7206\u767a\u306b\u5dfb\u304d\u8fbc\u307e\u308c\u305f\u3002");
    damageEnemy(enemy, damage, { grantKillRewards: Boolean(options.grantKillRewards) });
  });
}
function actBoss(enemy) {
  if (manhattan(enemy, state.player) === 1) {
    const damage = state.turn % 3 === 0 ? enemy.attack + 2 : enemy.attack;
    playEnemyAttackAnimation(enemy);
    spawnAttackEffect(enemy.x, enemy.y, state.player.x, state.player.y, "enemy", { hit: true, duration: damage > enemy.attack ? 180 : 155, variant: damage > enemy.attack ? "heavy" : "enemy" });
    applyDamageToPlayer(damage, damage > enemy.attack ? "\u30d9\u30d2\u30e2\u30b9\u306e\u5f37\u6253" : "\u30d9\u30d2\u30e2\u30b9\u306e\u653b\u6483", enemy);
    return;
  }

  const startPosition = { x: enemy.x, y: enemy.y };
  for (let step = 0; step < (ENEMY_DEFS.behemoth.moveSteps || 1); step += 1) {
    const dx = Math.sign(state.player.x - enemy.x);
    const dy = Math.sign(state.player.y - enemy.y);
    const options = prioritizeDirections(dx, dy);

    let moved = false;
    for (const option of options) {
      const nextX = enemy.x + option.x;
      const nextY = enemy.y + option.y;
      if (!canEnemyMoveTo(nextX, nextY)) {
        continue;
      }
      enemy.x = nextX;
      enemy.y = nextY;
      moved = true;
      break;
    }

    if (!moved || manhattan(enemy, state.player) === 1) {
      break;
    }
  }

  if (startPosition.x !== enemy.x || startPosition.y !== enemy.y) {
    queueHopAnimation(enemy.id, enemy, startPosition, { x: enemy.x, y: enemy.y }, 190, 0.18);
  }

  if (manhattan(enemy, state.player) === 1) {
    playEnemyAttackAnimation(enemy);
    spawnAttackEffect(enemy.x, enemy.y, state.player.x, state.player.y, "enemy", { hit: true, duration: 155 });
    applyDamageToPlayer(enemy.attack, "\u30d9\u30d2\u30e2\u30b9\u306e\u8ffd\u3044\u8fbc\u307f", enemy);
  }
}


function prioritizeDirections(dx, dy) {
  const options = [];
  if (dx !== 0) {
    options.push({ x: dx, y: 0 });
  }
  if (dy !== 0) {
    options.push({ x: 0, y: dy });
  }
  getDirections().forEach((direction) => {
    if (!options.some((option) => option.x === direction.x && option.y === direction.y)) {
      options.push(direction);
    }
  });
  return options;
}

function canEnemyMoveTo(x, y) {
  if (!isWalkable(x, y)) {
    return false;
  }
  if (x === state.player.x && y === state.player.y) {
    return false;
  }
  return !state.enemies.some((enemy) => enemy.x === x && enemy.y === y);
}

function collectItemAtPlayer() {
  const item = state.items.find((target) => target.x === state.player.x && target.y === state.player.y);
  if (!item) {
    return;
  }

  if (item.type === "medkit") {
    const previousHp = state.player.hp;
    const healAmount = Math.max(1, Math.round(state.player.maxHp * MEDKIT_HEAL_RATIO));
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
    const healed = state.player.hp - previousHp;
    if (healed > 0) {
      spawnFloatingText(state.player.x, state.player.y, "+" + healed, "heal", "player");
    }
    addLog("\u5fdc\u6025\u30ad\u30c3\u30c8\u3067HP\u304c\u56de\u5fa9\u3057\u305f\u3002");
  } else if (item.type === "oxygen") {
    const oxygenAmount = Math.max(1, Math.round(state.player.maxOxygen * OXYGEN_TANK_RATIO));
    state.player.oxygen = Math.min(state.player.maxOxygen, state.player.oxygen + oxygenAmount);
    addLog("\u9178\u7d20\u30dc\u30f3\u30d9\u3067\u9178\u7d20\u304c\u56de\u5fa9\u3057\u305f\u3002");
  }

  state.items = state.items.filter((target) => target.id !== item.id);
  state.mapDirty = true;
}


function tryUseStairs() {
  if (state.floorType === FLOOR_TYPE.BOSS) {
    return false;
  }

  if (state.player.x !== state.stairs.x || state.player.y !== state.stairs.y) {
    return false;
  }

  state.pendingFloor = state.floor + 1;
  state.upgradeChoices = drawUpgradeChoices(3);
  state.pendingRewardType = "normal";
  state.gameState = "choosing-upgrade";
  showMessage("アップグレードを1つ選んで次のフロアへ進もう。");
  showMessage("アップグレードを1つ選んで次のフロアへ進もう。");
  addLog(state.pendingFloor + "F へ進む前に強化を選択する。");
  return true;
}

function handleBossDefeat() {
  if (state.floor >= FINAL_FLOOR) {
    state.gameState = "clear";
    state.upgradeChoices = [];
    state.pendingFloor = null;
    state.pendingRewardType = "normal";
    state.player.hp = state.player.maxHp;
    showMessage("ベヒモスを撃破した。さらに奥へ進める。");
    showMessage("ベヒモスを撃破した。さらに奥へ進める。");
    addLog(state.floor + "F のボスを撃破した。");
    return;
  }

  state.player.hp = state.player.maxHp;
  state.player.oxygen = state.player.maxOxygen;
  state.pendingFloor = state.floor + 1;
  state.pendingRewardType = "boss-attack";
  state.gameState = "choosing-upgrade";
  state.upgradeChoices = drawAttackChoices(3);
  showMessage("攻撃特性を選択しよう。");
  showMessage("攻撃特性を選択しよう。");
  addLog("ベヒモス撃破報酬として攻撃特性を選択する。");
}

function checkGameOver() {
  if (state.player.hp > 0) {
    return;
  }

  state.player.hp = 0;
  state.gameState = "gameover";
  addLog("ゲームオーバー。");
  addLog("ゲームオーバー。");
}

function render() {
  updateCamera();
  renderStatus();
  renderUpgradeSummary();
  renderAttackModeUi();
  renderMap();
  renderActors();
  renderFloorIntro();
  renderLog();
  renderUpgradeOverlay();
  renderGameOverOverlay();
  elements.restartButton.disabled = false;
}

function renderStatus() {
  const shieldSuffix = state.player.shield > 0 ? ` +${state.player.shield}` : "";
  elements.hpValue.textContent = `${state.player.hp} / ${state.player.maxHp}${shieldSuffix}`;
  elements.oxygenValue.textContent = `${state.player.oxygen} / ${state.player.maxOxygen}`;
  elements.floorValue.textContent = state.floorType === FLOOR_TYPE.BOSS ? `${state.floor}F BOSS` : `${state.floor}F`;
  const hpRatio = state.player.maxHp > 0 ? (state.player.hp / state.player.maxHp) * 100 : 0;
  const oxygenRatio = state.player.maxOxygen > 0 ? (state.player.oxygen / state.player.maxOxygen) * 100 : 0;
  elements.hpBar.style.width = `${Math.max(0, Math.min(100, hpRatio))}%`;
  elements.oxygenBar.style.width = `${Math.max(0, Math.min(100, oxygenRatio))}%`;
}

function renderUpgradeSummary() {
  elements.upgradeSummary.innerHTML = "";

  if (state.upgrades.length === 0) {
    elements.upgradeSummary.textContent = "未取得";
    return;
  }

  state.upgrades.forEach((upgradeId) => {
    const upgrade = getUpgradeDef(upgradeId);
    const pill = document.createElement("span");
    pill.className = "upgrade-pill";
    pill.textContent = upgrade.shortName;
    elements.upgradeSummary.appendChild(pill);
  });
}

function renderUpgradeOverlay() {
  if (state.gameState !== "choosing-upgrade") {
    elements.upgradeOverlay.classList.add("hidden");
    elements.upgradeOverlay.classList.remove("upgrade-overlay-picking");
    delete elements.upgradeOverlay.dataset.busy;
    elements.upgradeChoices.innerHTML = "";
    return;
  }

  elements.upgradeOverlay.classList.remove("hidden");
  elements.upgradeOverlay.classList.remove("upgrade-overlay-picking");
  delete elements.upgradeOverlay.dataset.busy;
  elements.upgradeTitle.textContent = state.pendingRewardType === "boss-attack"
    ? `BOSS REWARD: ${state.pendingFloor}F へ進む前に攻撃特性を選択`
    : `${state.pendingFloor}F へ進む前に強化を選択`;
  elements.upgradeChoices.innerHTML = "";

  state.upgradeChoices.forEach((choiceId) => {
    const choice = state.pendingRewardType === "boss-attack"
      ? getAttackModeDef(choiceId)
      : getUpgradeDef(choiceId);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "upgrade-card";
    button.innerHTML = `<strong>${choice.name}</strong><span>${choice.description}</span>`;
    button.addEventListener("click", () => {
      if (elements.upgradeOverlay.dataset.busy === "true") {
        return;
      }

      elements.upgradeOverlay.dataset.busy = "true";
      elements.upgradeOverlay.classList.add("upgrade-overlay-picking");
      button.classList.add("upgrade-card-picked");

      Array.from(elements.upgradeChoices.querySelectorAll(".upgrade-card")).forEach((card) => {
        card.disabled = true;
      });

      window.setTimeout(() => {
        selectUpgrade(choiceId);
      }, UPGRADE_PICK_EFFECT_MS);
    });
    elements.upgradeChoices.appendChild(button);
  });
}

function renderAttackModeUi() {
  const mode = getAttackModeDef(state.player.attackMode);
  elements.attackModeSummary.textContent = `${mode.name} - ${mode.description}`;
}

function renderGameOverOverlay() {
  if (state.gameState !== "gameover") {
    elements.gameOverOverlay.classList.add("hidden");
    return;
  }

  elements.gameOverOverlay.classList.remove("hidden");
  elements.gameOverText.textContent = getGameOverMessage();
}

function getGameOverMessage() {
  if (state.deathCause === "酸素切れ") {
    return "酸素切れで倒れた。";
  }

  if (state.deathCause.includes("ベヒモス")) {
    return "ベヒモスに倒された。";
  }

  if (
    state.deathCause.includes("スライム") ||
    state.deathCause.includes("警備ロボット") ||
    state.deathCause.includes("ハウンド") ||
    state.deathCause.includes("アイボット") ||
    state.deathCause.includes("ボマー") ||
    state.deathCause.includes("メディック")
  ) {
    return "敵の攻撃で倒れた。";
  }

  if (state.deathCause) {
    return `${state.deathCause}で倒れた。`;
  }

  return "ゲームオーバー。";
}
function renderMap() {
  if (
    !state.mapDirty &&
    state.lastRenderedCamera.x === state.camera.x &&
    state.lastRenderedCamera.y === state.camera.y
  ) {
    return;
  }

  elements.map.innerHTML = "";
  elements.mapStage.style.setProperty("--cols", VIEWPORT_WIDTH);
  elements.mapStage.style.setProperty("--rows", VIEWPORT_HEIGHT);
  elements.map.style.gridTemplateColumns = `repeat(${VIEWPORT_WIDTH}, minmax(0, 1fr))`;

  for (let viewY = 0; viewY < VIEWPORT_HEIGHT; viewY += 1) {
    for (let viewX = 0; viewX < VIEWPORT_WIDTH; viewX += 1) {
      const x = state.camera.x + viewX;
      const y = state.camera.y + viewY;
      const tileElement = document.createElement("div");
      tileElement.className = "tile";

      const enemy = getEnemyAt(x, y);
      const item = getItemAt(x, y);
      const mapTile = state.map[y][x];
      const isVisible = state.visible[y][x];
      const isDiscovered = state.discovered[y][x];

      if (!isDiscovered) {
        tileElement.classList.add("tile-unknown");
        elements.map.appendChild(tileElement);
        continue;
      }

      if (state.player.x === x && state.player.y === y) {
        const floorTile = getFloorTileDisplay(mapTile, x, y, isVisible);
        applyTileVisual(tileElement, floorTile);
      } else if (isVisible && enemy) {
        const floorTile = getFloorTileDisplay(mapTile, x, y, isVisible);
        applyTileVisual(tileElement, floorTile);
      } else if (isVisible && item) {
        const floorTile = getFloorTileDisplay(mapTile, x, y, isVisible);
        applyTileVisual(tileElement, floorTile);
        applyTileOverlay(tileElement, {
          glyph: ITEM_DEFS[item.type].glyph,
          asset: ASSET_DEFS.item[item.type],
          classes: [ITEM_DEFS[item.type].className],
        });
      } else {
        const floorTile = getFloorTileDisplay(mapTile, x, y, isVisible);
        applyTileVisual(tileElement, floorTile);
      }

      if (isVisible) {
        tileElement.classList.add("tile-visible");
      } else {
        tileElement.classList.add("tile-seen");
      }

      elements.map.appendChild(tileElement);
    }
  }
  state.mapDirty = false;
  state.lastRenderedCamera = { x: state.camera.x, y: state.camera.y };
}

function applyTileVisual(tileElement, visual) {
  tileElement.classList.add(...(visual.classes || []));

  const glyph = document.createElement("span");
  glyph.className = "tile-glyph";
  glyph.textContent = visual.glyph || "";

  if (visual.asset) {
    tileElement.classList.add("tile-has-art");
    const img = document.createElement("img");
    img.className = "tile-art";
    img.src = visual.asset;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => {
      if (visual.fallbackAsset && img.src !== new URL(visual.fallbackAsset, window.location.href).href) {
        img.src = visual.fallbackAsset;
        return;
      }
      tileElement.classList.remove("tile-has-art");
      img.remove();
    });
    tileElement.appendChild(img);
  }

  tileElement.appendChild(glyph);

  if (visual.decorations && visual.decorations.length > 0) {
    applyTileDecorations(tileElement, visual.decorations);
  }

  if (visual.overlayAsset || visual.overlayGlyph) {
    applyTileOverlay(tileElement, {
      glyph: visual.overlayGlyph || "",
      asset: visual.overlayAsset || "",
      classes: visual.overlayClasses || [],
    });
  }
}

function applyTileDecorations(tileElement, decorations) {
  decorations.forEach((decoration) => {
    if (decoration.asset) {
      const img = document.createElement("img");
      img.className = `tile-art tile-overlay-art tile-wall-detail-art ${(decoration.classes || []).join(" ")}`.trim();
      img.src = decoration.asset;
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      img.addEventListener("error", () => {
        img.remove();
      });
      tileElement.appendChild(img);
      return;
    }

    const detail = document.createElement("div");
    detail.className = `wall-detail ${(decoration.classes || []).join(" ")}`.trim();
    tileElement.appendChild(detail);
  });
}

function applyTileOverlay(tileElement, visual) {
  if (!visual) {
    return;
  }

  const glyph = document.createElement("span");
  glyph.className = "tile-glyph tile-overlay-glyph";
  glyph.textContent = visual.glyph || "";

  if (visual.asset) {
    const img = document.createElement("img");
    img.className = `tile-art tile-overlay-art ${(visual.classes || []).join(" ")}`.trim();
    img.src = visual.asset;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.remove();
    });
    tileElement.appendChild(img);
  } else {
    tileElement.appendChild(glyph);
  }
}

function updateCamera(immediate = false) {
  const halfWidth = Math.floor(VIEWPORT_WIDTH / 2);
  const halfHeight = Math.floor(VIEWPORT_HEIGHT / 2);
  const maxCameraX = Math.max(0, MAP_SIZE - VIEWPORT_WIDTH);
  const maxCameraY = Math.max(0, MAP_SIZE - VIEWPORT_HEIGHT);
  const focusX = Number.isFinite(state.player.renderX) ? state.player.renderX : state.player.x;
  const focusY = Number.isFinite(state.player.renderY) ? state.player.renderY : state.player.y;

  state.cameraTarget.x = clamp(focusX - halfWidth, 0, maxCameraX);
  state.cameraTarget.y = clamp(focusY - halfHeight, 0, maxCameraY);

  if (immediate) {
    state.cameraRender.x = state.cameraTarget.x;
    state.cameraRender.y = state.cameraTarget.y;
  } else {
    state.cameraRender.x = lerp(state.cameraRender.x, state.cameraTarget.x, CAMERA_SMOOTHING);
    state.cameraRender.y = lerp(state.cameraRender.y, state.cameraTarget.y, CAMERA_SMOOTHING);

    if (Math.abs(state.cameraRender.x - state.cameraTarget.x) < 0.01) {
      state.cameraRender.x = state.cameraTarget.x;
    }
    if (Math.abs(state.cameraRender.y - state.cameraTarget.y) < 0.01) {
      state.cameraRender.y = state.cameraTarget.y;
    }
  }

  state.camera.x = clamp(Math.floor(state.cameraRender.x), 0, maxCameraX);
  state.camera.y = clamp(Math.floor(state.cameraRender.y), 0, maxCameraY);
}

function renderActors() {
  elements.actorLayer.innerHTML = "";
  const metrics = getTileMetrics();
  if (!metrics) {
    return;
  }

  applyCameraViewportOffset(metrics);

  renderActorSprite({
    id: "player",
    typeClass: "player",
    glyph: "@",
    asset: ASSET_DEFS.player,
    className: "tile-player",
    facing: state.player.facing,
    spriteState: state.player.spriteState,
    renderX: state.player.renderX,
    renderY: state.player.renderY,
    visible: true,
  }, metrics);

  state.enemies.forEach((enemy) => {
    if (!state.visible[enemy.y]?.[enemy.x]) {
      return;
    }

    renderActorSprite({
      id: enemy.id,
      typeClass: enemy.type,
      glyph: ENEMY_DEFS[enemy.type].glyph,
      asset: ASSET_DEFS.enemy[enemy.type],
      className: ENEMY_DEFS[enemy.type].className,
      renderX: enemy.renderX,
      renderY: enemy.renderY,
      visible: true,
    }, metrics);
  });

  renderAttackEffects(metrics);
  renderFloatingTexts(metrics);
}

function renderAttackEffects(metrics) {
  const now = state.visualTimestamp || getNow();

  state.attackEffects.forEach((effect) => {
    const targetScreenX = effect.toX - state.camera.x;
    const targetScreenY = effect.toY - state.camera.y;
    const fromScreenX = effect.fromX - state.camera.x;
    const fromScreenY = effect.fromY - state.camera.y;
    if (
      (targetScreenX < -2 || targetScreenY < -2 || targetScreenX > VIEWPORT_WIDTH + 1 || targetScreenY > VIEWPORT_HEIGHT + 1) &&
      (fromScreenX < -2 || fromScreenY < -2 || fromScreenX > VIEWPORT_WIDTH + 1 || fromScreenY > VIEWPORT_HEIGHT + 1)
    ) {
      return;
    }

    const progress = clamp((now - effect.startTime) / effect.duration, 0, 1);
    const tileCenterX = metrics.originX + (targetScreenX * metrics.stepX) + (metrics.tileWidth * 0.5);
    const tileCenterY = metrics.originY + (targetScreenY * metrics.stepY) + (metrics.tileHeight * 0.5);

    const tileFlash = document.createElement("div");
    tileFlash.className = `attack-effect attack-effect-tile attack-effect-${effect.kind} attack-effect-${effect.variant}`;
    tileFlash.style.opacity = `${(1 - progress) * 0.92}`;
    tileFlash.style.transform = `translate3d(${Math.round(tileCenterX)}px, ${Math.round(tileCenterY)}px, 0) translate(-50%, -50%) scale(${1 + (progress * 0.18)})`;
    elements.actorLayer.appendChild(tileFlash);

    if (effect.showTrail && effect.distance > 0.01) {
      const fromCenterX = metrics.originX + (fromScreenX * metrics.stepX) + (metrics.tileWidth * 0.5);
      const fromCenterY = metrics.originY + (fromScreenY * metrics.stepY) + (metrics.tileHeight * 0.5);
      const dx = tileCenterX - fromCenterX;
      const dy = tileCenterY - fromCenterY;
      const length = Math.max(10, Math.hypot(dx, dy) - (metrics.tileWidth * 0.26));
      const trail = document.createElement("div");
      trail.className = `attack-effect attack-effect-trail attack-effect-${effect.kind}`;
      trail.style.width = `${Math.round(length)}px`;
      trail.style.opacity = `${(1 - progress) * 0.88}`;
      trail.style.transform = `translate3d(${Math.round(fromCenterX)}px, ${Math.round(fromCenterY)}px, 0) rotate(${Math.atan2(dy, dx)}rad) scaleX(${1 - (progress * 0.16)})`;
      elements.actorLayer.appendChild(trail);
    }

    if (effect.showImpact) {
      const impact = document.createElement("div");
      impact.className = `attack-effect attack-effect-impact attack-effect-${effect.kind} ${effect.showFlash ? "attack-effect-impact-hit" : "attack-effect-impact-miss"}`;
      impact.style.opacity = `${(1 - progress) * (effect.showFlash ? 1 : 0.62)}`;
      impact.style.transform = `translate3d(${Math.round(tileCenterX)}px, ${Math.round(tileCenterY)}px, 0) translate(-50%, -50%) scale(${0.72 + (progress * 0.52)}) rotate(${effect.angle}rad)`;
      elements.actorLayer.appendChild(impact);
    }
  });
}

function renderFloatingTexts(metrics) {
  const now = state.visualTimestamp || getNow();

  state.floatingTexts.forEach((entry) => {
    const anchor = getFloatingTextAnchor(entry);
    const screenX = anchor.x - state.camera.x;
    const screenY = anchor.y - state.camera.y;
    if (screenX < -1 || screenY < -1 || screenX > VIEWPORT_WIDTH || screenY > VIEWPORT_HEIGHT) {
      return;
    }

    const progress = clamp((now - entry.startTime) / entry.duration, 0, 1);
    const rise = progress * metrics.tileHeight * 0.68;
    const driftX = entry.offsetX;
    const baseX = metrics.originX + (screenX * metrics.stepX) + (metrics.tileWidth * 0.5);
    const baseY = metrics.originY + (screenY * metrics.stepY) - (metrics.tileHeight * 0.18);

    const textElement = document.createElement("div");
    textElement.className = `floating-text floating-text-${entry.kind}`;
    textElement.textContent = entry.text;
    textElement.style.opacity = `${1 - progress}`;
    textElement.style.transform = `translate3d(${Math.round(baseX + driftX)}px, ${Math.round(baseY - rise - entry.offsetY)}px, 0) translateX(-50%)`;
    elements.actorLayer.appendChild(textElement);
  });
}

function getFloatingTextAnchor(entry) {
  if (entry.targetId === "player") {
    return {
      x: Number.isFinite(state.player.renderX) ? state.player.renderX : entry.x,
      y: Number.isFinite(state.player.renderY) ? state.player.renderY : entry.y,
    };
  }

  const enemy = state.enemies.find((target) => target.id === entry.targetId);
  if (enemy) {
    return {
      x: Number.isFinite(enemy.renderX) ? enemy.renderX : entry.x,
      y: Number.isFinite(enemy.renderY) ? enemy.renderY : entry.y,
    };
  }

  return { x: entry.x, y: entry.y };
}

function spawnFloatingText(x, y, value, kind, targetId = null, duration = FLOATING_TEXT_DURATION) {
  const stackCount = state.floatingTexts.filter((entry) => entry.targetId === targetId).length;
  state.floatingTexts.push({
    id: nextFloatingTextId,
    x,
    y,
    text: value,
    kind,
    targetId,
    startTime: getNow(),
    duration,
    offsetX: (stackCount % 2 === 0 ? -1 : 1) * Math.min(12, stackCount * 4),
    offsetY: stackCount * 7,
  });
  nextFloatingTextId += 1;
}

function applyCameraViewportOffset(metrics) {
  const subTileX = state.cameraRender.x - state.camera.x;
  const subTileY = state.cameraRender.y - state.camera.y;
  const offsetX = -Math.round(subTileX * metrics.stepX);
  const offsetY = -Math.round(subTileY * metrics.stepY);
  const transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  elements.map.style.transform = transform;
  elements.actorLayer.style.transform = transform;
}

function ensureVisualLoop() {
  if (state.visualFrame) {
    return;
  }

  const tick = (timestamp) => {
    state.visualTimestamp = timestamp;
    state.visualFrame = scheduleAnimationFrame(tick);
    if (!elements.actorLayer || !state.player) {
      return;
    }
    updateTimedVisualStates(timestamp);
    updateCamera();
    renderMap();
    renderActors();
    renderFloorIntro();
  };

  state.visualFrame = scheduleAnimationFrame(tick);
}

function updateTimedVisualStates(timestamp) {
  if (state.player.spriteState === "attack" && state.player.spriteStateEndsAt > 0 && timestamp >= state.player.spriteStateEndsAt) {
    setPlayerSpriteState("idle");
  }

  state.floatingTexts = state.floatingTexts.filter((entry) => (timestamp - entry.startTime) < entry.duration);
  state.attackEffects = state.attackEffects.filter((entry) => (timestamp - entry.startTime) < entry.duration);
}

function renderActorSprite(actor, metrics) {
  if (!actor.visible) {
    return;
  }

  const screenX = actor.renderX - state.camera.x;
  const screenY = actor.renderY - state.camera.y;
  if (screenX < -1 || screenY < -1 || screenX > VIEWPORT_WIDTH || screenY > VIEWPORT_HEIGHT) {
    return;
  }

  const animation = state.activeAnimations.get(actor.id);
  const transform = buildActorTransform(actor, screenX, screenY, metrics, animation);
  const actorElement = document.createElement("div");
  actorElement.className = `actor-sprite actor-${actor.typeClass} ${actor.id === "player" ? "actor-player" : "actor-enemy"}`;
  if (animation) {
    actorElement.classList.add("actor-moving");
  }
  if (state.visualImpulses.get(actor.id)?.type === "hit") {
    actorElement.classList.add("actor-hit-react");
  }
  actorElement.style.transform = transform;
  const visual = document.createElement("div");
  visual.className = "actor-visual";
  const actorVisual = getActorVisual(actor, animation);
  applyActorAnchor(visual, actorVisual.anchor, metrics);
  const glyph = document.createElement("span");
  glyph.className = "tile-glyph";
  glyph.textContent = actor.glyph || "";
  visual.appendChild(glyph);

  if (actorVisual.mode === "grid") {
    visual.classList.add("actor-visual-grid");
    const gridCanvas = document.createElement("canvas");
    gridCanvas.className = "actor-grid-canvas";
    gridCanvas.width = Math.max(1, Math.round(metrics.tileWidth));
    gridCanvas.height = Math.max(1, Math.round(metrics.tileHeight));
    gridCanvas.style.width = `${Math.round(metrics.tileWidth)}px`;
    gridCanvas.style.height = `${Math.round(metrics.tileHeight)}px`;
    drawActorGridFrame(gridCanvas, actorVisual);
    actorElement.classList.add("actor-has-art");
    visual.appendChild(gridCanvas);
  } else if (actorVisual.mode === "image" && actorVisual.image) {
    const assetStatus = getSpriteAssetStatus(actorVisual.image);
    if (assetStatus.status === "ready") {
      const image = document.createElement("img");
      image.className = "actor-image";
      image.src = actorVisual.image;
      image.alt = "";
      image.draggable = false;
      image.decoding = "async";
      actorElement.classList.add("actor-has-art");
      visual.appendChild(image);
    } else if (assetStatus.status === "loading") {
      glyph.remove();
    } else if (assetStatus.status !== "error") {
      glyph.remove();
    }
  } else if (actorVisual.suppressGlyph) {
    glyph.remove();
  }
  actorElement.appendChild(visual);
  elements.actorLayer.appendChild(actorElement);
}

function getActorVisual(actor, animation) {
  const spriteDef = getCharacterAnimationDef(actor);
  if (!spriteDef) {
    return {
      mode: actor.asset ? "image" : "glyph",
      image: actor.asset || "",
      anchor: getActorAnchor(actor),
      suppressGlyph: false,
    };
  }

  const stateName = actor.spriteState || (animation ? "walk" : "idle");
  const direction = DIRECTION_ORDER.includes(actor.facing) ? actor.facing : "down";
  const timestamp = state.visualTimestamp || performance.now();

  const gridFrame = getAnimationGridFrame(actor, spriteDef, stateName, direction, timestamp);
  if (gridFrame) {
    return gridFrame;
  }

  if (spriteDef.allowLegacyFallback === false) {
    return {
      mode: "glyph",
      image: "",
      anchor: getActorAnchor(actor),
      suppressGlyph: false,
    };
  }

  const fallbackFrames = spriteDef.fallbackFrames?.[stateName]?.[direction]
    || spriteDef.fallbackFrames?.idle?.down
    || [];
  if (fallbackFrames.length === 0) {
    return {
      mode: actor.asset ? "image" : "glyph",
      image: actor.asset || "",
      anchor: getActorAnchor(actor),
      suppressGlyph: false,
    };
  }

  const duration = spriteDef.frameDurations?.[stateName] || 120;
  const frameIndex = Math.floor(timestamp / duration) % fallbackFrames.length;
  return {
    mode: "image",
    image: fallbackFrames[frameIndex],
    anchor: getActorAnchor(actor),
    suppressGlyph: false,
  };
}

function getCharacterAnimationDef(actor) {
  if (actor.id === "player") {
    return CHARACTER_ANIMATION_DEFS.player;
  }
  return null;
}

function getAnimationGridFrame(actor, spriteDef, stateName, direction, timestamp) {
  const animationDef = spriteDef.animations?.[stateName]?.[direction]
    || spriteDef.animations?.idle?.down;
  if (!animationDef) {
    return null;
  }

  const assetRecord = getSpriteAssetStatus(animationDef.src);
  if (assetRecord.status !== "ready") {
    return null;
  }

  if (!animationDef.frameCount || animationDef.frameCount <= 0) {
    return null;
  }

  const columns = animationDef.columns || animationDef.frameCount || 1;
  const rows = animationDef.rows || 1;
  if (columns <= 0 || rows <= 0) {
    return null;
  }

  const frameWidth = Math.floor(assetRecord.naturalWidth / columns);
  const frameHeight = Math.floor(assetRecord.naturalHeight / rows);
  if (frameWidth <= 0 || frameHeight <= 0) {
    return null;
  }

  const duration = spriteDef.frameDurations?.[stateName] || 120;
  const rawIndex = Math.floor((timestamp - (actor.spriteStateStartedAt || 0)) / duration);
  const frameIndex = stateName === "attack"
    ? Math.min(animationDef.frameCount - 1, Math.max(0, rawIndex))
    : ((Math.floor(timestamp / duration) % animationDef.frameCount) + animationDef.frameCount) % animationDef.frameCount;

  return {
    mode: "grid",
    image: animationDef.src,
    imageElement: assetRecord.image,
    columns,
    rows,
    frameCount: animationDef.frameCount,
    frameIndex,
    frameCol: frameIndex % columns,
    frameRow: Math.floor(frameIndex / columns),
    frameWidth,
    frameHeight,
    anchor: spriteDef.anchor || getActorAnchor({ id: "player" }),
    suppressGlyph: false,
  };
}

function preloadCharacterAssets(characterDef) {
  if (!characterDef?.animations) {
    return;
  }

  Object.values(characterDef.animations).forEach((stateAnimations) => {
    Object.values(stateAnimations).forEach((animationDef) => {
      if (animationDef?.src) {
        getSpriteAssetStatus(animationDef.src);
      }
    });
  });
}

function preloadStaticAssets() {
  const paths = new Set();

  Object.values(ASSET_DEFS.enemy || {}).forEach((path) => {
    if (path) {
      paths.add(path);
    }
  });

  Object.values(ASSET_DEFS.item || {}).forEach((path) => {
    if (path) {
      paths.add(path);
    }
  });

  Object.values(ASSET_DEFS.tile || {}).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((path) => {
        if (path) {
          paths.add(path);
        }
      });
    } else if (value) {
      paths.add(value);
    }
  });

  Object.values(TILE_ART.floor || {}).forEach((path) => {
    if (path) {
      paths.add(path);
    }
  });

  Object.values(TILE_ART.corridor || {}).forEach((path) => {
    if (path) {
      paths.add(path);
    }
  });

  paths.forEach((path) => {
    getSpriteAssetStatus(path);
  });
}

function drawActorGridFrame(canvas, actorVisual) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context || !actorVisual.imageElement) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false;
  context.drawImage(
    actorVisual.imageElement,
    actorVisual.frameCol * actorVisual.frameWidth,
    actorVisual.frameRow * actorVisual.frameHeight,
    actorVisual.frameWidth,
    actorVisual.frameHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );
}

function getActorImpulseTransform(actor, metrics, timestamp) {
  const effect = state.visualImpulses.get(actor.id);
  if (!effect) {
    return { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
  }

  const progress = clamp((timestamp - effect.startTime) / effect.duration, 0, 1);
  if (progress >= 1) {
    state.visualImpulses.delete(actor.id);
    return { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
  }

  const tileWidth = metrics.tileWidth || 24;
  const tileHeight = metrics.tileHeight || 24;
  const dirX = effect.dirX || 0;
  const dirY = effect.dirY || 0;

  if (effect.type === "attack") {
    const distance = getAttackLungeDistance(progress, effect.distance || 0.3) * tileWidth;
    const offsetX = dirX * distance;
    const offsetY = (dirY * distance) - (Math.sin(progress * Math.PI) * tileHeight * 0.05);
    const squash = getAttackLungeSquash(progress);
    return {
      offsetX,
      offsetY,
      scaleX: squash.scaleX,
      scaleY: squash.scaleY,
    };
  }

  if (effect.type === "hit") {
    const distance = getHitKnockbackDistance(progress) * tileWidth;
    return {
      offsetX: dirX * distance,
      offsetY: (dirY * distance) - (Math.sin(progress * Math.PI) * tileHeight * 0.025),
      scaleX: 1 + (Math.sin(progress * Math.PI) * 0.03),
      scaleY: 1 - (Math.sin(progress * Math.PI) * 0.03),
    };
  }

  return { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
}

function getAttackLungeDistance(progress, maxDistance) {
  if (progress < 0.16) {
    return lerp(0, -0.08, progress / 0.16);
  }
  if (progress < 0.46) {
    return lerp(-0.08, maxDistance, (progress - 0.16) / 0.3);
  }
  if (progress < 0.6) {
    return maxDistance;
  }
  return lerp(maxDistance, 0, (progress - 0.6) / 0.4);
}

function getAttackLungeSquash(progress) {
  if (progress < 0.16) {
    const t = progress / 0.16;
    return {
      scaleX: lerp(1, 1.08, t),
      scaleY: lerp(1, 0.92, t),
    };
  }
  if (progress < 0.46) {
    const t = (progress - 0.16) / 0.3;
    return {
      scaleX: lerp(1.08, 0.94, t),
      scaleY: lerp(0.92, 1.08, t),
    };
  }
  if (progress < 0.6) {
    return { scaleX: 0.96, scaleY: 1.05 };
  }

  const t = (progress - 0.6) / 0.4;
  return {
    scaleX: lerp(0.96, 1, t),
    scaleY: lerp(1.05, 1, t),
  };
}

function getHitKnockbackDistance(progress) {
  if (progress < 0.28) {
    return lerp(0, 0.18, progress / 0.28);
  }
  if (progress < 0.46) {
    return 0.18;
  }
  return lerp(0.18, 0, (progress - 0.46) / 0.54);
}

function getActorAnchor(actor) {
  if (actor.id === "player") {
    return CHARACTER_ANIMATION_DEFS.player.anchor;
  }
  return { x: 0.5, y: 1, footOffsetX: 0, footOffsetY: 0 };
}

function applyActorAnchor(visual, anchor, metrics) {
  const safeAnchor = anchor || getActorAnchor({});
  const offsetX = Math.round(((0.5 - safeAnchor.x) * metrics.tileWidth) + (safeAnchor.footOffsetX || 0));
  const offsetY = Math.round(((1 - safeAnchor.y) * metrics.tileHeight) + (safeAnchor.footOffsetY || 0));
  visual.style.left = `${offsetX}px`;
  visual.style.top = `${offsetY}px`;
}

function getSpriteAssetStatus(imagePath) {
  if (!imagePath) {
    return { status: "missing", naturalWidth: 0, naturalHeight: 0 };
  }

  const current = spriteAssetLoadState.get(imagePath);
  if (current) {
    return current;
  }

  const record = { status: "loading", naturalWidth: 0, naturalHeight: 0, image: null };
  spriteAssetLoadState.set(imagePath, record);

  const probe = new Image();
  probe.onload = () => {
    record.status = "ready";
    record.naturalWidth = probe.naturalWidth || 0;
    record.naturalHeight = probe.naturalHeight || 0;
    record.image = probe;
    renderActors();
  };
  probe.onerror = () => {
    record.status = "error";
  };
  probe.src = imagePath;
  return record;
}

function buildActorTransform(actor, screenX, screenY, metrics, animation) {
  const baseX = Math.round(metrics.originX + (screenX * metrics.stepX));
  const baseY = Math.round(metrics.originY + (screenY * metrics.stepY));
  const impulse = getActorImpulseTransform(actor, metrics, state.visualTimestamp || getNow());
  const hopOffset = animation ? animation.hop : 0;
  const scaleX = (animation ? animation.scaleX : 1) * impulse.scaleX;
  const scaleY = (animation ? animation.scaleY : 1) * impulse.scaleY;
  const finalX = Math.round(baseX + impulse.offsetX);
  const finalY = Math.round(baseY - hopOffset + impulse.offsetY);

  return `translate3d(${finalX}px, ${finalY}px, 0) scale(${scaleX}, ${scaleY})`;
}

function queueHopAnimation(id, entity, from, to, duration, hopHeight) {
  entity.renderX = from.x;
  entity.renderY = from.y;
  entity.spriteState = "walk";
  state.activeAnimations.set(id, {
    entity,
    fromX: from.x,
    fromY: from.y,
    toX: to.x,
    toY: to.y,
    startTime: performance.now(),
    duration,
    hopHeight,
    scaleX: 1,
    scaleY: 1,
    hop: 0,
  });

  if (!state.animationFrame) {
    state.animationFrame = scheduleAnimationFrame(stepAnimations);
  }
}

function stepAnimations(timestamp) {
  let hasActive = false;

  state.activeAnimations.forEach((animation, id) => {
    const progress = clamp((timestamp - animation.startTime) / animation.duration, 0, 1);
    const eased = easeOutCubic(progress);
    animation.entity.renderX = lerp(animation.fromX, animation.toX, eased);
    animation.entity.renderY = lerp(animation.fromY, animation.toY, eased);

    const jumpArc = Math.sin(progress * Math.PI);
    animation.hop = jumpArc * getHopPixels(animation.hopHeight);
    animation.scaleX = 1 + ((1 - jumpArc) * 0.08);
    animation.scaleY = 1 - ((1 - jumpArc) * 0.08) + (jumpArc * 0.08);

    if (progress >= 1) {
      animation.entity.renderX = animation.toX;
      animation.entity.renderY = animation.toY;
      animation.entity.spriteState = "idle";
      state.activeAnimations.delete(id);
    } else {
      hasActive = true;
    }
  });

  updateCamera();
  renderMap();
  renderActors();

  if (hasActive) {
    state.animationFrame = scheduleAnimationFrame(stepAnimations);
  } else {
    state.animationFrame = null;
  }
}

function getHopPixels(tileFactor) {
  const firstTile = elements.map.querySelector(".tile");
  const tileSize = firstTile ? firstTile.getBoundingClientRect().width : 24;
  return tileSize * tileFactor;
}

function lerp(start, end, t) {
  return start + ((end - start) * t);
}

function easeOutCubic(value) {
  return 1 - ((1 - value) ** 3);
}

function scheduleAnimationFrame(callback) {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(() => callback(Date.now()), 16);
}

function cancelScheduledAnimation(frameId) {
  if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(frameId);
    return;
  }
  clearTimeout(frameId);
}

function getTileMetrics() {
  const firstTile = elements.map.querySelector(".tile");
  if (!firstTile) {
    return null;
  }

  const rightTile = elements.map.children[1] || firstTile;
  const belowTile = elements.map.children[VIEWPORT_WIDTH] || firstTile;
  return {
    originX: firstTile.offsetLeft,
    originY: firstTile.offsetTop,
    tileWidth: firstTile.clientWidth || firstTile.getBoundingClientRect().width,
    tileHeight: firstTile.clientHeight || firstTile.getBoundingClientRect().height,
    stepX: rightTile.offsetLeft - firstTile.offsetLeft || (firstTile.clientWidth || firstTile.getBoundingClientRect().width),
    stepY: belowTile.offsetTop - firstTile.offsetTop || (firstTile.clientHeight || firstTile.getBoundingClientRect().height),
  };
}

function getFloorTileDisplay(mapTile, x, y, isVisible) {
  if (mapTile === TILE.WALL) {
    return {
      glyph: "",
      asset: WALL_TILE_ART.fill,
      classes: ["tile-wall"],
      decorations: getWallDecorations(x, y),
    };
  }

  if (mapTile === TILE.CORRIDOR) {
    const corridorVisual = getCorridorVisual(x, y);
    return {
      glyph: "=",
      asset: corridorVisual.asset,
      fallbackAsset: corridorVisual.fallbackAsset,
      classes: ["tile-corridor", `tile-corridor-${corridorVisual.orientation}`],
    };
  }

  if (mapTile === TILE.STAIRS) {
    const floorVisual = getRoomFloorVisual(x, y);
    return {
      glyph: ".",
      asset: floorVisual.asset,
      fallbackAsset: floorVisual.fallbackAsset,
      overlayGlyph: ">",
      overlayAsset: ASSET_DEFS.tile.stairs,
      overlayClasses: ["tile-stairs"],
      classes: ["tile-room", ...getRoomTileClasses(x, y, isVisible)],
    };
  }

  const floorVisual = getRoomFloorVisual(x, y);
  return {
    glyph: ".",
    asset: floorVisual.asset,
    fallbackAsset: floorVisual.fallbackAsset,
    classes: ["tile-room", ...getRoomTileClasses(x, y, isVisible)],
  };
}

function getRoomFloorVisual(x, y) {
  const variants = Array.isArray(ASSET_DEFS.tile.room) ? ASSET_DEFS.tile.room : [ASSET_DEFS.tile.room];
  const fallbackAsset = variants.length > 0
    ? variants[Math.abs(((x * 17) + (y * 31)) % variants.length)]
    : "";
  const visualType = getRoomFloorVisualType(x, y);
  return {
    type: visualType,
    asset: TILE_ART.floor[visualType] || fallbackAsset,
    fallbackAsset,
  };
}

function getRoomFloorVisualType(x, y) {
  const roll = Math.abs(((x * 29) + (y * 37) + (x * y * 3)) % 100);
  if (roll < 4) {
    return "hole";
  }
  if (roll < 12) {
    return "spill";
  }
  return "normal";
}

function getCorridorVisual(x, y) {
  const orientation = getCorridorOrientation(x, y);
  return {
    orientation,
    asset: TILE_ART.corridor[orientation] || ASSET_DEFS.tile.corridor,
    fallbackAsset: ASSET_DEFS.tile.corridor,
  };
}

function buildWallVariantMap(map) {
  return map.map((row, y) => row.map((tile, x) => {
    if (tile !== TILE.WALL) {
      return null;
    }

    const north = isWallInMap(map, x, y - 1);
    const east = isWallInMap(map, x + 1, y);
    const south = isWallInMap(map, x, y + 1);
    const west = isWallInMap(map, x - 1, y);
    const northEast = isWallInMap(map, x + 1, y - 1);
    const northWest = isWallInMap(map, x - 1, y - 1);
    const southEast = isWallInMap(map, x + 1, y + 1);
    const southWest = isWallInMap(map, x - 1, y + 1);

    const decorations = [];

    if (!north) {
      decorations.push({ asset: WALL_TILE_ART.edge.n, classes: ["wall-detail-edge", "wall-detail-edge-n"] });
    }
    if (!east) {
      decorations.push({ asset: WALL_TILE_ART.edge.e, classes: ["wall-detail-edge", "wall-detail-edge-e"] });
    }
    if (!south) {
      decorations.push({ asset: WALL_TILE_ART.edge.s, classes: ["wall-detail-edge", "wall-detail-edge-s"] });
    }
    if (!west) {
      decorations.push({ asset: WALL_TILE_ART.edge.w, classes: ["wall-detail-edge", "wall-detail-edge-w"] });
    }

    if (!north && !west) {
      decorations.push({ asset: WALL_TILE_ART.outer.nw, classes: ["wall-detail-corner", "wall-detail-outer", "wall-detail-outer-nw"] });
    }
    if (!north && !east) {
      decorations.push({ asset: WALL_TILE_ART.outer.ne, classes: ["wall-detail-corner", "wall-detail-outer", "wall-detail-outer-ne"] });
    }
    if (!south && !west) {
      decorations.push({ asset: WALL_TILE_ART.outer.sw, classes: ["wall-detail-corner", "wall-detail-outer", "wall-detail-outer-sw"] });
    }
    if (!south && !east) {
      decorations.push({ asset: WALL_TILE_ART.outer.se, classes: ["wall-detail-corner", "wall-detail-outer", "wall-detail-outer-se"] });
    }

    if (north && west && !northWest) {
      decorations.push({ asset: WALL_TILE_ART.inner.nw, classes: ["wall-detail-corner", "wall-detail-inner", "wall-detail-inner-nw"] });
    }
    if (north && east && !northEast) {
      decorations.push({ asset: WALL_TILE_ART.inner.ne, classes: ["wall-detail-corner", "wall-detail-inner", "wall-detail-inner-ne"] });
    }
    if (south && west && !southWest) {
      decorations.push({ asset: WALL_TILE_ART.inner.sw, classes: ["wall-detail-corner", "wall-detail-inner", "wall-detail-inner-sw"] });
    }
    if (south && east && !southEast) {
      decorations.push({ asset: WALL_TILE_ART.inner.se, classes: ["wall-detail-corner", "wall-detail-inner", "wall-detail-inner-se"] });
    }

    return { decorations };
  }));
}

function isWallInMap(map, x, y) {
  return y >= 0 && y < map.length && x >= 0 && x < map[y].length && map[y][x] === TILE.WALL;
}

function getWallDecorations(x, y) {
  return state.wallVariants[y]?.[x]?.decorations || [];
}

function getCorridorOrientation(x, y) {
  const left = isCorridorConnectedTile(x - 1, y);
  const right = isCorridorConnectedTile(x + 1, y);
  const up = isCorridorConnectedTile(x, y - 1);
  const down = isCorridorConnectedTile(x, y + 1);
  const horizontalScore = Number(left) + Number(right);
  const verticalScore = Number(up) + Number(down);

  if (horizontalScore > verticalScore) {
    return "horizontal";
  }
  if (verticalScore > horizontalScore) {
    return "vertical";
  }

  return (x + y) % 2 === 0 ? "horizontal" : "vertical";
}

function isCorridorConnectedTile(x, y) {
  if (!isInside(x, y)) {
    return false;
  }
  const tile = state.map[y][x];
  return tile === TILE.CORRIDOR || tile === TILE.ROOM || tile === TILE.STAIRS;
}

function getRoomTileClasses(x, y, isVisible) {
  if (!isVisible) {
    return [];
  }

  const room = getRoomAt(x, y);
  if (!room) {
    return [];
  }

  if (room.roomType === ROOM_TYPE.SUPPLY) {
    return ["tile-room-supply"];
  }

  if (room.roomType === ROOM_TYPE.DANGER) {
    return ["tile-room-danger"];
  }

  return [];
}

function renderLog() {
  elements.log.innerHTML = "";
  state.logs.forEach((entry) => {
    const line = document.createElement("div");
    line.className = "log-entry";
    line.textContent = entry;
    elements.log.appendChild(line);
  });
}

function addLog(message) {
  state.logs.unshift(message);
  state.logs = state.logs.slice(0, MAX_LOG_ENTRIES);
}

function showMessage(message) {
  elements.messageBanner.textContent = message;
  elements.messageBanner.classList.remove("hidden");
}

function showFloorIntro() {
  state.floorIntro = {
    text: state.floorType === FLOOR_TYPE.BOSS ? `${state.floor}F BOSS` : `${state.floor}F`,
    subtitle: state.floorType === FLOOR_TYPE.BOSS ? "BOSS FLOOR" : "RUIN DEPTH",
    startTime: getNow(),
    duration: FLOOR_INTRO_DURATION,
  };
}

function renderFloorIntro() {
  const overlay = elements.floorIntroOverlay;
  if (!overlay) {
    return;
  }

  if (!state.floorIntro) {
    overlay.classList.add("hidden");
    overlay.classList.remove("floor-intro-visible");
    overlay.innerHTML = "";
    overlay.style.opacity = "";
    overlay.style.transform = "";
    return;
  }

  const now = state.visualTimestamp || getNow();
  const elapsed = now - state.floorIntro.startTime;
  const progress = clamp(elapsed / state.floorIntro.duration, 0, 1);
  if (progress >= 1) {
    state.floorIntro = null;
    overlay.classList.add("hidden");
    overlay.classList.remove("floor-intro-visible");
    overlay.innerHTML = "";
    overlay.style.opacity = "";
    overlay.style.transform = "";
    return;
  }

  const fadeIn = clamp(progress / 0.18, 0, 1);
  const fadeOut = clamp((1 - progress) / 0.32, 0, 1);
  const opacity = Math.min(fadeIn, fadeOut);
  const lift = Math.round((1 - easeOutCubic(progress)) * 10);

  overlay.classList.remove("hidden");
  overlay.classList.add("floor-intro-visible");
  overlay.style.opacity = opacity.toFixed(3);
  overlay.style.transform = `translate3d(-50%, ${lift}px, 0)`;
  overlay.innerHTML = `<strong>${state.floorIntro.text}</strong><span>${state.floorIntro.subtitle}</span>`;
}

function getEnemyAt(x, y) {
  return state.enemies.find((enemy) => enemy.x === x && enemy.y === y);
}

function getItemAt(x, y) {
  return state.items.find((item) => item.x === x && item.y === y);
}

function isWalkable(x, y) {
  return isInside(x, y) && state.map[y][x] !== TILE.WALL;
}

function updateVisibility() {
  state.visible = createVisibilityGrid(false);

  const currentRoom = getRoomAt(state.player.x, state.player.y);
  if (currentRoom) {
    revealRoomArea(currentRoom);
  } else {
    revealAround(state.player.x, state.player.y, CORRIDOR_VISION_RADIUS);
  }
  state.mapDirty = true;
}

function revealRoomArea(room) {
  for (let y = room.y - 1; y <= room.y + room.height; y += 1) {
    for (let x = room.x - 1; x <= room.x + room.width; x += 1) {
      if (isInside(x, y)) {
        revealTile(x, y);
      }
    }
  }
}

function revealAround(centerX, centerY, radius) {
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (!isInside(x, y)) {
        continue;
      }
      if (Math.abs(x - centerX) + Math.abs(y - centerY) <= radius) {
        revealTile(x, y);
      }
    }
  }
}

function revealTile(x, y) {
  state.visible[y][x] = true;
  state.discovered[y][x] = true;
}

function getRoomAt(x, y) {
  return state.rooms.find((room) => (
    x >= room.x &&
    x < room.x + room.width &&
    y >= room.y &&
    y < room.y + room.height
  )) || null;
}

function randomRoomTile(room) {
  const tile = room.tiles[randomInt(0, room.tiles.length - 1)];
  return { x: tile.x, y: tile.y };
}

function shuffle(list) {
  const clone = [...list];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function toPositionSet(tiles) {
  return new Set(tiles.map((tile) => positionKey(tile.x, tile.y)));
}

function positionKey(x, y) {
  return `${x},${y}`;
}

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function isInside(x, y) {
  return x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getFloorType(floor) {
  return floor % BOSS_FLOOR_INTERVAL === 0 ? FLOOR_TYPE.BOSS : FLOOR_TYPE.NORMAL;
}

function getDirections() {
  return [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];
}

const directionMap = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function getDirectionName(dx, dy) {
  if (dx === 0 && dy < 0) {
    return "up";
  }
  if (dx === 0 && dy > 0) {
    return "down";
  }
  if (dx < 0) {
    return "left";
  }
  if (dx > 0) {
    return "right";
  }
  return "down";
}

function getNow() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function setPlayerSpriteState(stateName, durationMs = 0) {
  const now = getNow();
  state.player.spriteState = stateName;
  state.player.spriteStateStartedAt = now;
  state.player.spriteStateEndsAt = durationMs > 0 ? now + durationMs : 0;
}

function queueVisualImpulse(id, type, dirX, dirY, duration) {
  state.visualImpulses.set(id, {
    type,
    dirX,
    dirY,
    startTime: getNow(),
    duration,
  });
}

function playEnemyAttackAnimation(enemy) {
  if (!enemy) {
    return;
  }

  const dirX = Math.sign(state.player.x - enemy.x);
  const dirY = Math.sign(state.player.y - enemy.y);
  const profile = {
    slime: { distance: 0.28, duration: 122 },
    eyebot: { distance: 0.26, duration: 112 },
    securitybot: { distance: 0.31, duration: 150 },
    hound: { distance: 0.32, duration: 138 },
    burst: { distance: 0.29, duration: 126 },
    medic: { distance: 0.27, duration: 118 },
    behemoth: { distance: 0.34, duration: 170 },
  }[enemy.type] || { distance: 0.3, duration: 120 };

  queueVisualImpulse(enemy.id, "attack", dirX, dirY, profile.duration);
  const effect = state.visualImpulses.get(enemy.id);
  if (effect) {
    effect.distance = profile.distance;
  }
}

function playPlayerAttackAnimation(dirX, dirY) {
  const attackDuration = (CHARACTER_ANIMATION_DEFS.player.frameDurations.attack || 72) * 4;
  setPlayerSpriteState("attack", attackDuration);
  queueVisualImpulse("player", "attack", dirX, dirY, attackDuration);
}

let lastPointerActionTime = 0;
document.querySelectorAll("[data-action]").forEach((button) => {
  const triggerAction = (event) => {
    const action = button.dataset.action;
    if (!action) {
      return;
    }

    if (event.type === "pointerdown") {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      event.preventDefault();
      lastPointerActionTime = Date.now();
      handlePlayerAction(action);
      return;
    }

    if (Date.now() - lastPointerActionTime < 400) {
      event.preventDefault();
      return;
    }

    handlePlayerAction(action);
  };

  button.addEventListener("pointerdown", triggerAction, { passive: false });
  button.addEventListener("click", triggerAction);
});

let lastControlTouchTime = 0;
if (elements.controlPanel) {
  elements.controlPanel.addEventListener("dblclick", (event) => {
    event.preventDefault();
  });

  elements.controlPanel.addEventListener("touchend", (event) => {
    const now = Date.now();
    if (now - lastControlTouchTime < 320) {
      event.preventDefault();
    }
    lastControlTouchTime = now;
  }, { passive: false });
}

window.addEventListener("keydown", (event) => {
  const action = keyMap[event.key.toLowerCase()];
  if (!action) {
    return;
  }

  event.preventDefault();
  handlePlayerAction(action);
});

elements.restartButton.addEventListener("click", initGame);
elements.gameOverRestartButton.addEventListener("click", initGame);

const keyMap = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
  " ": "wait",
};

initGame();
