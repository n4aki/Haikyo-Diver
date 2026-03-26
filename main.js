const MAP_SIZE = 26;
const VIEWPORT_WIDTH = 12;
const VIEWPORT_HEIGHT = 12;
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
  scout: {
    name: "スカウト",
    glyph: "s",
    hp: 4,
    attack: 2,
    speed: 1,
    className: "tile-scout",
    ai: "chaser",
    moveSteps: 1,
  },
  brute: {
    name: "ブルート",
    glyph: "B",
    hp: 8,
    attack: 3,
    speed: 2,
    className: "tile-brute",
    ai: "chaser",
    moveSteps: 1,
  },
  rusher: {
    name: "ラッシャー",
    glyph: "R",
    hp: 3,
    attack: 2,
    speed: 1,
    className: "tile-rusher",
    ai: "chaser",
    moveSteps: 2,
  },
  sniper: {
    name: "スナイパー",
    glyph: "G",
    hp: 4,
    attack: 2,
    speed: 1,
    className: "tile-sniper",
    ai: "shooter",
    moveSteps: 1,
    range: 4,
  },
  exploder: {
    name: "バースト",
    glyph: "X",
    hp: 4,
    attack: 2,
    speed: 1,
    className: "tile-exploder",
    ai: "exploder",
    moveSteps: 1,
    explosionDamage: 2,
  },
  medic: {
    name: "メディク",
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
  boss: {
    name: "ウォーデン",
    glyph: "W",
    hp: 26,
    attack: 4,
    speed: 1,
    className: "tile-boss",
    moveSteps: 2,
  },
};

const ENEMY_FLOOR_BANDS = [
  {
    id: "early",
    maxFloor: 2,
    weights: {
      scout: 5.8,
      rusher: 1.8,
      brute: 1.1,
    },
  },
  {
    id: "mid",
    maxFloor: 4,
    weights: {
      scout: 4.6,
      rusher: 2.2,
      brute: 1.9,
      sniper: 1.3,
    },
  },
  {
    id: "late",
    maxFloor: Infinity,
    weights: {
      scout: 3.8,
      rusher: 2.1,
      brute: 2,
      sniper: 1.5,
      exploder: 1.4,
      medic: 0.9,
    },
  },
];

const ITEM_DEFS = {
  medkit: {
    name: "応急キット",
    glyph: "+",
    className: "tile-medkit",
  },
  oxygen: {
    name: "酸素カートリッジ",
    glyph: "O",
    className: "tile-oxygen",
  },
};

const ASSET_DEFS = {
  player: "assets/player.svg",
  enemy: {
    scout: "assets/scout.svg",
    brute: "assets/brute.svg",
    rusher: "assets/rusher.svg",
    sniper: "assets/sniper.svg",
    exploder: "assets/exploder.svg",
    medic: "assets/medic.svg",
    boss: "assets/boss.svg",
  },
  item: {
    medkit: "assets/medkit.svg",
    oxygen: "assets/oxygen.svg",
  },
  tile: {
    wall: "assets/wall.svg",
    room: "assets/floor.svg",
    corridor: "assets/floor.svg",
    stairs: "assets/exit.svg",
  },
};

const DIRECTION_ORDER = ["down", "left", "right", "up"];

const CHARACTER_ANIMATION_DEFS = {
  player: {
    anchor: {
      x: 0.5,
      y: 1,
      footOffsetX: 0,
      footOffsetY: 0,
    },
    frameDurations: {
      idle: 420,
      walk: 95,
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
    },
  },
};

const UPGRADE_DEFS = [
  {
    id: "attack_boost",
    name: "攻撃力アップ",
    shortName: "攻+1",
    description: "攻撃力 +1",
    apply(player) {
      player.attack += 1;
    },
  },
  {
    id: "max_hp_boost",
    name: "耐久強化",
    shortName: "HP+4",
    description: "最大HP +4 / HPも4回復",
    apply(player) {
      player.maxHp += 4;
      player.hp = Math.min(player.maxHp, player.hp + 4);
    },
  },
  {
    id: "max_oxygen_boost",
    name: "酸素タンク拡張",
    shortName: "O2+4",
    description: "最大酸素 +4 / 酸素も4回復",
    apply(player) {
      player.maxOxygen += 4;
      player.oxygen = Math.min(player.maxOxygen, player.oxygen + 4);
    },
  },
  {
    id: "life_steal",
    name: "撃破回復",
    shortName: "撃破HP",
    description: "敵撃破時にHPを2回復",
    apply(player) {
      player.onKillHeal += 2;
    },
  },
  {
    id: "oxygen_drain",
    name: "撃破酸素回収",
    shortName: "撃破O2",
    description: "敵撃破時に酸素を2回復",
    apply(player) {
      player.onKillOxygen += 2;
    },
  },
  {
    id: "critical_edge",
    name: "クリティカル強化",
    shortName: "会心+15%",
    description: "15%でダメージ2倍",
    apply(player) {
      player.critChance += 0.15;
    },
  },
  {
    id: "shock_rounds",
    name: "追撃弾",
    shortName: "追撃+25%",
    description: "25%で追加2ダメージ",
    apply(player) {
      player.bonusDamageChance += 0.25;
    },
  },
  {
    id: "entry_shield",
    name: "ルームシールド",
    shortName: "入室盾+2",
    description: "新しい部屋に入るたびシールド+2",
    apply(player) {
      player.roomShield += 2;
    },
  },
  {
    id: "efficient_breathing",
    name: "省酸素行動",
    shortName: "息継ぎ35%",
    description: "35%で行動時の酸素消費を無効化",
    apply(player) {
      player.freeBreathChance += 0.35;
    },
  },
];

const ATTACK_MODE_DEFS = [
  { id: "standard", name: "標準攻撃", shortName: "標準", description: "隣接する1体を攻撃する" },
  { id: "pierce", name: "貫通ショット", shortName: "貫通", description: "一直線の敵をまとめて撃つ" },
  { id: "fan", name: "扇状ショット", shortName: "扇状", description: "近距離3マスをまとめて撃つ" },
  { id: "blast", name: "爆発弾", shortName: "爆発", description: "着弾点の周囲に範囲ダメージ" },
  { id: "power", name: "単体高火力ショット", shortName: "高火力", description: "単体へ高威力の一撃" },
];

const state = {
  floor: 1,
  floorType: FLOOR_TYPE.NORMAL,
  turn: 0,
  camera: { x: 0, y: 0 },
  animationFrame: null,
  activeAnimations: new Map(),
  visualFrame: null,
  visualTimestamp: 0,
  map: [],
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
};

let nextEntityId = 1;
let nextRoomId = 1;
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
  state.logs = [];
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
    oxygen: 20,
    maxOxygen: 20,
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
    renderX: 0,
    renderY: 0,
  };

  addLog("崩壊した研究施設に侵入した。酸素が尽きる前に出口を探そう。");
  ensureVisualLoop();
  setupFloor();
}

function setupFloor() {
  state.turn = 0;
  state.activeAnimations.clear();
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
  state.player.renderX = floorLayout.start.x;
  state.player.renderY = floorLayout.start.y;

  placeFloorEntities(floorLayout);
  triggerRoomEntryEffects();
  updateVisibility();
  updateCamera();

  showMessage(state.floorType === FLOOR_TYPE.BOSS
    ? `${state.floor}F BOSS FLOOR。ウォーデンを撃破せよ。`
    : `${state.floor}F に到達。出口を探せ。`);
  addLog(`${state.floor}F を探索開始。`);
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
  state.enemies.push(createEnemy("boss", bossPosition));
}

function placeStairsInRoom(room, occupied) {
  const stairsPosition = findSpawnTileInRoom(room, occupied, {
    avoidCorridorAdjacency: true,
    minDistanceFromPlayer: 6,
  }) || findSpawnTileInRoom(room, occupied, {
    avoidCorridorAdjacency: true,
  }) || findSpawnTileInRoom(room, occupied);

  if (!stairsPosition) {
    throw new Error("階段を配置できませんでした。");
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

  throw new Error(`${type} を配置できませんでした。`);
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
  const areaFactor = Math.floor(floorLayout.roomTiles.length / 20);
  return clamp(2 + areaFactor + (Math.random() < 0.45 ? 1 : 0), 2, 6);
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
    adjustPoolWeight(pool, "scout", 1.05);
    adjustPoolWeight(pool, "brute", 0.72);
    adjustPoolWeight(pool, "rusher", 0.74);
    adjustPoolWeight(pool, "sniper", 0.82);
    adjustPoolWeight(pool, "exploder", 0.58);
    adjustPoolWeight(pool, "medic", 1.6);
  }

  if (room.roomType === ROOM_TYPE.DANGER) {
    adjustPoolWeight(pool, "scout", 0.92);
    adjustPoolWeight(pool, "brute", 1.32);
    adjustPoolWeight(pool, "rusher", 1.38);
    adjustPoolWeight(pool, "sniper", 1.22);
    adjustPoolWeight(pool, "exploder", 1.5);
    adjustPoolWeight(pool, "medic", 1.08);
  }

  return weightedChoice(pool);
}

function getEnemyBandForFloor(floor) {
  return ENEMY_FLOOR_BANDS.find((band) => floor <= band.maxFloor) || ENEMY_FLOOR_BANDS[ENEMY_FLOOR_BANDS.length - 1];
}

function getEnemyRoomDangerBonus(type, room) {
  switch (type) {
    case "brute":
      return room.danger * 1.1;
    case "rusher":
      return room.danger * 1.25;
    case "sniper":
      return room.danger * 0.75;
    case "exploder":
      return room.danger * 0.9;
    case "medic":
      return room.danger * 0.35;
    case "scout":
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
  addLog(`${(rewardType === "boss-attack" ? getAttackModeDef(upgradeId) : getUpgradeDef(upgradeId)).name} を獲得した。`);
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
    damage += 3;
    notes.push("強撃");
  } else if (modeId === "blast") {
    damage += 1;
  }

  if (Math.random() < state.player.critChance) {
    damage *= 2;
    notes.push("会心");
  }

  if (Math.random() < state.player.bonusDamageChance) {
    damage += 2;
    notes.push("追撃");
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

function getSweepTargets(dx, dy) {
  const positions = [{ x: state.player.x + dx, y: state.player.y + dy }];
  if (dx !== 0) {
    positions.push({ x: state.player.x + dx, y: state.player.y - 1 });
    positions.push({ x: state.player.x + dx, y: state.player.y + 1 });
  } else {
    positions.push({ x: state.player.x - 1, y: state.player.y + dy });
    positions.push({ x: state.player.x + 1, y: state.player.y + dy });
  }

  return uniqueEnemies(positions.map((position) => getVisibleEnemyAt(position.x, position.y)).filter(Boolean));
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

function getPowerTargets(dx, dy) {
  const enemy = getVisibleEnemyAt(state.player.x + dx, state.player.y + dy);
  return enemy ? [enemy] : [];
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
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + state.player.onKillHeal);
  }
  if (state.player.onKillOxygen > 0) {
    state.player.oxygen = Math.min(state.player.maxOxygen, state.player.oxygen + state.player.onKillOxygen);
  }
}

function applyDamageToPlayer(amount, source) {
  let remainingDamage = amount;
  if (state.player.shield > 0) {
    const blocked = Math.min(state.player.shield, remainingDamage);
    state.player.shield -= blocked;
    remainingDamage -= blocked;
    addLog(`${source} をシールドが ${blocked} 防いだ。`);
  }

  if (remainingDamage > 0) {
    state.player.hp -= remainingDamage;
    state.deathCause = source;
    addLog(`${source} で ${remainingDamage} ダメージ。`);
  }
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
    addLog(`新しい部屋に入りシールドを ${state.player.roomShield} 獲得した。`);
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

  let acted = false;
  if (action === "wait") {
    addLog("物音を殺して周囲をうかがった。");
    acted = true;
  } else {
    const direction = directionMap[action];
    acted = attemptMoveOrAttack(direction.x, direction.y);
  }

  if (!acted) {
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
  if (attackTargets.length > 0) {
    performAttack(state.player.attackMode, attackTargets);
    return true;
  }

  if (!isWalkable(nextX, nextY)) {
    addLog("崩落した瓦礫が道を塞いでいる。");
    return false;
  }

  const previousPosition = { x: state.player.x, y: state.player.y };
  state.player.x = nextX;
  state.player.y = nextY;
  queueHopAnimation("player", state.player, previousPosition, { x: nextX, y: nextY }, 150, 0.22);
  triggerRoomEntryEffects();
  addLog(`(${nextX + 1}, ${nextY + 1}) へ移動した。`);
  return true;
}

function attackEnemy(enemy) {
  if (!state.enemies.some((target) => target.id === enemy.id)) {
    return;
  }

  const attackResult = calculatePlayerDamage(state.player.attackMode);
  addLog(`${ENEMY_DEFS[enemy.type].name} を攻撃し ${attackResult.damage} ダメージ${attackResult.note}。`);
  damageEnemy(enemy, attackResult.damage, { grantKillRewards: true });
}

function performAttack(modeId, targets) {
  addLog(`${getAttackModeDef(modeId).name} を放った。`);
  targets.forEach((enemy) => {
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
    addLog("省酸素行動で酸素消費を抑えた。");
    return;
  }

  if (state.player.oxygen > 0) {
    state.player.oxygen -= 1;
    if (state.player.oxygen === 5) {
      addLog("酸素残量が少ない。");
    }
    return;
  }

  applyDamageToPlayer(1, "酸素切れ");
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

    if (enemy.type === "boss") {
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
    case "exploder":
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
    applyDamageToPlayer(enemy.attack, `${ENEMY_DEFS[enemy.type].name} の攻撃`);
    return;
  }

  moveEnemyTowardPlayer(enemy, ENEMY_DEFS[enemy.type].moveSteps || 1);
}

function actShooterEnemy(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  const distance = manhattan(enemy, state.player);

  if (distance === 1) {
    applyDamageToPlayer(enemy.attack, `${def.name} の近距離射撃`);
    return;
  }

  if (distance <= 2 && moveEnemyAwayFromPlayer(enemy)) {
    return;
  }

  if (hasClearShot(enemy, state.player, def.range || 4)) {
    addLog(`${def.name} が射線を通してきた。`);
    applyDamageToPlayer(def.attack, `${def.name} の射撃`);
    return;
  }

  moveEnemyTowardPlayer(enemy, def.moveSteps || 1);
}

function actExploderEnemy(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  if (manhattan(enemy, state.player) === 1) {
    addLog(`${def.name} が自爆した。`);
    removeEnemy(enemy);
    explodeAt(enemy.x, enemy.y, def.explosionDamage || 2, `${def.name} の自爆`, {
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
    ally.hp = Math.min(ally.maxHp, ally.hp + amount);
    addLog(`${def.name} が ${ENEMY_DEFS[ally.type].name} を ${amount} 回復した。`);
    return;
  }

  if (manhattan(enemy, state.player) === 1) {
    applyDamageToPlayer(enemy.attack, `${def.name} の攻撃`);
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

  enemy.hp -= amount;
  if (enemy.hp > 0) {
    return false;
  }

  const enemyName = ENEMY_DEFS[enemy.type].name;
  removeEnemy(enemy);
  addLog(`${enemyName} を撃破した。`);

  if (options.grantKillRewards) {
    applyKillRewards();
  }

  const def = ENEMY_DEFS[enemy.type];
  if (def.explosionDamage) {
    addLog(`${enemyName} が爆発した。`);
    explodeAt(enemy.x, enemy.y, def.explosionDamage, `${enemyName} の爆発`, {
      grantKillRewards: options.grantKillRewards,
      ignoreEnemyIds: [enemy.id],
    });
  }

  if (enemy.type === "boss") {
    handleBossDefeat();
  }

  return true;
}

function removeEnemy(enemy) {
  state.activeAnimations.delete(enemy.id);
  state.enemies = state.enemies.filter((target) => target.id !== enemy.id);
}

function explodeAt(x, y, damage, source, options = {}) {
  if (Math.max(Math.abs(state.player.x - x), Math.abs(state.player.y - y)) <= 1) {
    applyDamageToPlayer(damage, source);
  }

  const ignoreEnemyIds = new Set(options.ignoreEnemyIds || []);
  const targets = state.enemies.filter((enemy) => (
    !ignoreEnemyIds.has(enemy.id) &&
    Math.max(Math.abs(enemy.x - x), Math.abs(enemy.y - y)) <= 1
  ));

  targets.forEach((enemy) => {
    addLog(`${ENEMY_DEFS[enemy.type].name} が爆発に巻き込まれた。`);
    damageEnemy(enemy, damage, { grantKillRewards: Boolean(options.grantKillRewards) });
  });
}

function actBoss(enemy) {
  if (manhattan(enemy, state.player) === 1) {
    const damage = state.turn % 3 === 0 ? enemy.attack + 2 : enemy.attack;
    applyDamageToPlayer(damage, damage > enemy.attack ? "ウォーデンの強打" : "ウォーデンの攻撃");
    return;
  }

  const startPosition = { x: enemy.x, y: enemy.y };
  for (let step = 0; step < (ENEMY_DEFS.boss.moveSteps || 1); step += 1) {
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
    applyDamageToPlayer(enemy.attack, "ウォーデンの追い込み");
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
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
    addLog("応急キットを使用しHPを5回復した。");
  } else if (item.type === "oxygen") {
    state.player.oxygen = Math.min(state.player.maxOxygen, state.player.oxygen + 7);
    addLog("酸素カートリッジで酸素を7回復した。");
  }

  state.items = state.items.filter((target) => target.id !== item.id);
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
  showMessage("アップグレードを1つ選んで次のフロアへ進む。");
  addLog(`階段を見つけた。${state.pendingFloor}F に向けて強化を選択する。`);
  return true;
}

function handleBossDefeat() {
  if (state.floor >= FINAL_FLOOR) {
    state.gameState = "clear";
    state.upgradeChoices = [];
    state.pendingFloor = null;
    state.pendingRewardType = "normal";
    state.player.hp = state.player.maxHp;
    state.player.oxygen = state.player.maxOxygen;
    showMessage("ウォーデンを撃破。施設を制圧し仮クリア。");
    addLog(`${state.floor}F のボスを撃破し、探索を完遂した。`);
    return;
  }

  state.player.hp = state.player.maxHp;
  state.player.oxygen = state.player.maxOxygen;
  state.pendingFloor = state.floor + 1;
  state.pendingRewardType = "boss-attack";
  state.upgradeChoices = drawAttackChoices(3);
  state.gameState = "choosing-upgrade";
  showMessage("ボス撃破報酬。新しい攻撃特性を選んで次へ進む。");
  addLog(`ウォーデンを撃破。${state.pendingFloor}F へ向けて攻撃特性を選択する。`);
}

function checkGameOver() {
  if (state.player.hp > 0) {
    return;
  }

  state.player.hp = 0;
  state.gameState = "gameover";
  showMessage(getGameOverMessage());
  addLog("探索はここで途絶えた。");
}

function render() {
  updateCamera();
  renderStatus();
  renderUpgradeSummary();
  renderAttackModeUi();
  renderMap();
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
  elements.hpBar.style.width = `${(state.player.hp / state.player.maxHp) * 100}%`;
  elements.oxygenBar.style.width = `${(state.player.oxygen / state.player.maxOxygen) * 100}%`;
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
    elements.upgradeChoices.innerHTML = "";
    return;
  }

  elements.upgradeOverlay.classList.remove("hidden");
  elements.upgradeTitle.textContent = state.pendingRewardType === "boss-attack"
    ? `BOSS REWARD: ${state.pendingFloor}F へ向けて攻撃特性を選択`
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
      selectUpgrade(choiceId);
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
    return "酸素が尽き、崩壊施設の闇に沈んだ。リスタートして再挑戦できます。";
  }

  if (state.deathCause.includes("ウォーデン")) {
    return "ウォーデンの猛攻に押し潰された。リスタートして再挑戦できます。";
  }

  if (
    state.deathCause.includes("スカウト") ||
    state.deathCause.includes("ブルート") ||
    state.deathCause.includes("ラッシャー") ||
    state.deathCause.includes("スナイパー") ||
    state.deathCause.includes("バースト") ||
    state.deathCause.includes("メディク")
  ) {
    return "敵との戦闘で力尽きた。リスタートして再挑戦できます。";
  }

  if (state.deathCause) {
    return `${state.deathCause} によって倒れた。リスタートして再挑戦できます。`;
  }

  return "探索はここで途絶えた。リスタートして再挑戦できます。";
}

function renderMap() {
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
        applyTileVisual(tileElement, {
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

  renderActors();
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
      tileElement.classList.remove("tile-has-art");
      img.remove();
    });
    tileElement.appendChild(img);
  }

  tileElement.appendChild(glyph);
}

function updateCamera() {
  const halfWidth = Math.floor(VIEWPORT_WIDTH / 2);
  const halfHeight = Math.floor(VIEWPORT_HEIGHT / 2);
  const maxCameraX = Math.max(0, MAP_SIZE - VIEWPORT_WIDTH);
  const maxCameraY = Math.max(0, MAP_SIZE - VIEWPORT_HEIGHT);

  state.camera.x = clamp(state.player.x - halfWidth, 0, maxCameraX);
  state.camera.y = clamp(state.player.y - halfHeight, 0, maxCameraY);
}

function renderActors() {
  elements.actorLayer.innerHTML = "";
  const metrics = getTileMetrics();
  if (!metrics) {
    return;
  }

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
    renderActors();
  };

  state.visualFrame = scheduleAnimationFrame(tick);
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
  const transform = buildActorTransform(screenX, screenY, metrics, animation);
  const actorElement = document.createElement("div");
  actorElement.className = `actor-sprite actor-${actor.typeClass} ${actor.id === "player" ? "actor-player" : "actor-enemy"}`;
  if (animation) {
    actorElement.classList.add("actor-moving");
  }
  actorElement.style.transform = transform;
  const visual = document.createElement("div");
  visual.className = "actor-visual";
  const actorVisual = getActorVisual(actor, animation);
  applyActorAnchor(visual, actorVisual.anchor, metrics);
  if (actorVisual.mode === "grid") {
    actorElement.classList.add("actor-has-art");
    visual.classList.add("actor-visual-grid");
    const gridCanvas = document.createElement("canvas");
    gridCanvas.className = "actor-grid-canvas";
    gridCanvas.width = Math.max(1, Math.round(metrics.tileWidth));
    gridCanvas.height = Math.max(1, Math.round(metrics.tileHeight));
    gridCanvas.style.width = `${Math.round(metrics.tileWidth)}px`;
    gridCanvas.style.height = `${Math.round(metrics.tileHeight)}px`;
    drawActorGridFrame(gridCanvas, actorVisual);
    visual.appendChild(gridCanvas);
  } else if (actorVisual.mode === "image" && actorVisual.image) {
    actorElement.classList.add("actor-has-art");
    const image = document.createElement("img");
    image.className = "actor-image";
    image.src = actorVisual.image;
    image.alt = "";
    image.draggable = false;
    image.decoding = "async";
    visual.appendChild(image);
  }
  const glyph = document.createElement("span");
  glyph.className = "tile-glyph";
  glyph.textContent = actor.glyph || "";
  visual.appendChild(glyph);
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
    };
  }

  const stateName = actor.spriteState || (animation ? "walk" : "idle");
  const direction = DIRECTION_ORDER.includes(actor.facing) ? actor.facing : "down";
  const timestamp = state.visualTimestamp || performance.now();

  const gridFrame = getAnimationGridFrame(spriteDef, stateName, direction, timestamp);
  if (gridFrame) {
    return gridFrame;
  }

  const fallbackFrames = spriteDef.fallbackFrames?.[stateName]?.[direction]
    || spriteDef.fallbackFrames?.idle?.down
    || [];
  if (fallbackFrames.length === 0) {
    return {
      mode: actor.asset ? "image" : "glyph",
      image: actor.asset || "",
      anchor: getActorAnchor(actor),
    };
  }

  const duration = spriteDef.frameDurations?.[stateName] || 120;
  const frameIndex = Math.floor(timestamp / duration) % fallbackFrames.length;
  return {
    mode: "image",
    image: fallbackFrames[frameIndex],
    anchor: getActorAnchor(actor),
  };
}

function getCharacterAnimationDef(actor) {
  if (actor.id === "player") {
    return CHARACTER_ANIMATION_DEFS.player;
  }
  return null;
}

function getAnimationGridFrame(spriteDef, stateName, direction, timestamp) {
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
  const frameIndex = Math.floor(timestamp / duration) % animationDef.frameCount;

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
  };
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

function buildActorTransform(screenX, screenY, metrics, animation) {
  const baseX = Math.round(metrics.originX + (screenX * metrics.stepX));
  const baseY = Math.round(metrics.originY + (screenY * metrics.stepY));

  if (!animation) {
    return `translate3d(${baseX}px, ${baseY}px, 0)`;
  }

  return `translate3d(${baseX}px, ${Math.round(baseY - animation.hop)}px, 0) scale(${animation.scaleX}, ${animation.scaleY})`;
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
    return { glyph: "#", asset: ASSET_DEFS.tile.wall, classes: ["tile-wall"] };
  }

  if (mapTile === TILE.CORRIDOR) {
    return { glyph: "=", asset: ASSET_DEFS.tile.corridor, classes: ["tile-corridor"] };
  }

  if (mapTile === TILE.STAIRS) {
    return { glyph: ">", asset: ASSET_DEFS.tile.stairs, classes: ["tile-stairs"] };
  }

  return {
    glyph: ".",
    asset: ASSET_DEFS.tile.room,
    classes: ["tile-room", ...getRoomTileClasses(x, y, isVisible)],
  };
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
