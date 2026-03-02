/**
 * Convert a Minecraft NBT UUID (array of 4 signed int32) to a standard UUID string.
 * e.g. [-1714867277, 197215715, -1240806338, -1953197416]
 *   → "99eb4eb3-0bc0-0be3-b60e-983e8ba88258"
 */
export function uuidArrayToString(arr: number[]): string {
  if (!arr || arr.length !== 4) return "";
  return arr
    .map((n) => (n >>> 0).toString(16).padStart(8, "0"))
    .join("")
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

/**
 * Returns ordered skin render URLs to try (primary + fallbacks).
 * Cycle through these if one fails to load.
 */
export function getPlayerSkinUrls(uuid: number[] | string): string[] {
  const id =
    typeof uuid === "string"
      ? uuid.replace(/-/g, "")
      : uuidArrayToString(uuid).replace(/-/g, "");
  return [
    `https://mc-heads.net/body/${id}/100`,
    `https://crafatar.com/renders/body/${id}?scale=4&overlay`,
    `https://visage.surgeplay.com/full/256/${id}`,
    `https://minotar.net/body/${id}/100`,
  ];
}

/** Primary URL (first provider) — convenience shorthand */
export function getPlayerSkinUrl(uuid: number[] | string): string {
  return getPlayerSkinUrls(uuid)[0];
}

export function getItemImageIdentifier(id: string): string {
  if (!id) return "";
  const rawId = id.includes(":") ? id.split(":")[1] : id;

  // Special edge cases where the ID differs from texture filename
  if (rawId === "experience_bottle" || rawId === "xp_bottle")
    return "Bottle_o'_Enchanting";
  if (rawId === "writable_book") return "Book_and_Quill";
  if (rawId === "knowledge_book") return "Knowledge_Book";
  if (rawId === "skeleton_skull") return "Skeleton_Skull";
  if (rawId === "zombie_head") return "Zombie_Head";
  if (rawId === "creeper_head") return "Creeper_Head";
  if (rawId === "dragon_head") return "Dragon_Head";
  if (rawId === "hunger") return "hunger";

  // Default: Capitalize first letter of each word and join with underscores
  return rawId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("_");
}

/**
 * Returns a URL to an item texture via minecraft.wiki.
 */
export function getItemImageUrl(id: string): string {
  const identifier = getItemImageIdentifier(id);
  return `https://minecraft.wiki/w/Special:FilePath/${identifier}.png`;
}

/**
 * Returns a URL to a block texture via minecraft.wiki.
 * (Wiki uses the same flat FilePath directory for blocks)
 */
export function getBlockImageUrl(id: string): string {
  const identifier = getItemImageIdentifier(id);
  return `https://minecraft.wiki/w/Special:FilePath/${identifier}.png`;
}

/** Shorthand alias — preferred for new code */
export const getImage = getItemImageUrl;

export function formatItemName(id: string): string {
  if (!id) return "Desconhecido";
  const rawId = id.includes(":") ? id.split(":")[1] : id;
  const result = rawId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function getDifficultyName(level: number): string {
  switch (level) {
    case 0:
      return "Pacifico";
    case 1:
      return "Facil";
    case 2:
      return "Normal";
    case 3:
      return "Dificil";
    default:
      return "Desconhecida";
  }
}

export function getGameTypeName(type: number): string {
  switch (type) {
    case 0:
      return "Sobrevivencia";
    case 1:
      return "Criativo";
    case 2:
      return "Aventura";
    case 3:
      return "Espectador";
    default:
      return "Desconhecido";
  }
}

export function getDimensionName(dimension: string): string {
  if (dimension.includes("overworld")) return "Mundo Normal";
  if (dimension.includes("nether")) return "Nether";
  if (dimension.includes("end")) return "The End";
  return dimension;
}

export function formatMinecraftTime(ticks: number): string {
  // Tempo no Minecraft (ticks max 24000)
  // 6000 = meio-dia, 18000 = meia-noite
  let hour = Math.floor(ticks / 1000) + 6;
  if (hour >= 24) hour -= 24;

  const minutes = Math.floor(((ticks % 1000) / 1000) * 60);

  const hh = hour.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");

  return `${hh}:${mm}`;
}

export function formatLastPlayed(timestamp: number): string {
  if (!timestamp) return "Desconhecido";
  const date = new Date(timestamp);
  const result = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatLastPlayedExtended(timestamp: number): string {
  if (!timestamp) return "Desconhecido";
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const result = `${dateStr} as ${hours}h${minutes}`;

  // Remove accents for Minecraft font compatibility (e.g., março -> marco)
  return result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatDaysPlayed(timeTicks: number): number {
  if (!timeTicks) return 0;
  // 1 dia de Minecraft = 24000 ticks
  return Math.floor(timeTicks / 24000);
}

export function formatSeed(seed: unknown): string {
  if (!seed) return "Desconhecida";
  return String(seed)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export const GAME_RULES_PTBR: Record<string, string> = {
  // Java/Bedrock CamelCase/SnakeCase mixes
  announceAdvancements: "Informa conquistas no chat",
  blockExplosionDropDecay: "Blocos destruidos por explosao somem sem dropar",
  commandBlocksEnabled: "Ativa blocos de comando",
  commandBlockOutput: "Logs de blocos de comando no chat",
  commandModificationBlockLimit: "Limite de blocos alterados por comando",
  disableElytraMovementCheck: "Ignora velocidade de Elytra anti lag",
  disablePlayerMovementCheck: "Pula verificacao de velocidade do jogador",
  disableRaids: "Desativa ataques em vilas Raids",
  doDaylightCycle: "Ciclo dia noite ativo",
  doEntityDrops: "Entidades dropam itens ao quebrar",
  doFireTick: "Fogo se espalha e apaga sozinho",
  doInsomnia: "Phantoms surgem se o player nao dormir",
  doImmediateRespawn: "Renasce sem passar pela tela de morte",
  doLimitedCrafting: "So crafta receitas ja desbloqueadas",
  doMobLoot: "Mobs dropam itens e XP ao morrer",
  doMobSpawning: "Geracao natural de criaturas",
  doPatrolSpawning: "Geracao de patrulhas de saqueadores",
  doTileDrops: "Blocos dropam o item ao minerar",
  doTraderSpawning: "Surgimento de vendedores ambulantes",
  doVinesSpread: "Crescimento de videiras ativo",
  doWeatherCycle: "Clima muda sozinho chuva trovao",
  doWardenSpawning: "Surgimento de Wardens ativo",
  drowningDamage: "Dano por afogamento ativo",
  enderPearlsVanishOnDeath: "Perolas lancadas somem se o player morrer",
  fallDamage: "Dano de queda ativo",
  fireDamage: "Dano por fogo e lava ativo",
  forgiveDeadPlayers: "Mobs neutros param de te bater na morte",
  freezeDamage: "Dano por congelamento neve fofa ativo",
  globalSoundEvents: "Sons ex Wither sao ouvidos globalmente",
  keepInventory: "Mantem o inventario ao morrer",
  lavaSourceConversion: "Novas fontes de lava podem surgir",
  logAdminCommands: "Comandos de admin registrados no log",
  maxCommandChainLength: "Limite de cadeira de comandos",
  maxEntityCramming: "Limite de criaturas num unico bloco",
  minecartMaxSpeed: "Velocidade maxima dos vagonetes",
  mobExplosionDropDecay: "Explosoes de mobs somem com parte do loot",
  mobGriefing: "Mobs podem roubar destruir blocos Enderman Creeper",
  naturalRegeneration: "Regeneracao de vida natural com comida",
  playersNetherPortalCreativeDelay: "Espera no portal em modo Criativo",
  playersNetherPortalDefaultDelay: "Espera no portal em Sobrevivencia",
  playersSleepingPercentage: "porcentagem de players que precisam dormir",
  projectilesCanBreakBlocks: "Projeteis podem quebrar blocos frageis",
  pvp: "Combate entre jogadores ativo",
  randomTickSpeed: "Velocidade de crescimento e eventos randomicos",
  recipesUnlock: "Necessario desbloquear receitas para criar",
  reducedDebugInfo: "Reduz informacoes do F3",
  respawnBlocksExplode: "Camas explodem no Nether End",
  sendCommandFeedback: "Feedback de comandos no chat",
  showBorderEffect: "Efeito visual de borda do mundo",
  showCoordinates: "Exibe coordenadas na tela",
  showDeathMessages: "Mostra mensagens de morte no chat",
  showTags: "Mostra tags tecnicas em itens",
  snowAccumulationHeight: "Limite de acumulo de neve em blocos",
  spawnChunkRadius: "Raio de chunks de spawn carregados",
  spawnRadius: "Raio de surgimento aleatorio inicial",
  spectatorsGenerateChunks: "Espectadores geram novos chunks",
  tntExplodes: "TNT explode ao ser ativa",
  tntExplosionDropDecay: "Loot de explosoes de TNT some com o tempo",
  universalAnger: "Mobs neutros atacam qualquer um se ficarem bravos",
  waterSourceConversion: "Novas fontes de agua podem surgir",

  // Extra mapping from screenshots/wiki snake_case
  spawn_wandering_traders: "Vendedores ambulantes surgem",
  block_drops: "Blocos minerados dropam itens",
  spawner_blocks_work: "Gaiolas de monstros funcionam",
  spawn_monsters: "Geracao natural de monstros hostis",
  immediate_respawn: "Renasce instantaneamente",
  player_movement_check: "Verifica velocidade do jogador",
  block_explosion_drop_decay: "Explosoes de blocos removem loot",
  spread_vines: "Crescimento de vinhas ativo",
  elytra_movement_check: "Verifica velocidade de voo com Elytra",
  fire_spread_radius_around_player: "Propagacao de fogo ao redor do player",
  mob_drops: "Mobs dropam loot e XP",
  advance_weather: "Permite avanco do clima no tempo",
  max_block_modifications: "Limite de modificacoes em blocos",
  max_command_forks: "Limite de ramificacoes em comandos",
  command_block_output: "Logs de comandos em chat",
  show_advancement_messages: "Anuncia avancos no chat",
  locator_bar: "Barra de localizacao ativa",
  respawn_radius: "Raio de renascimento aleatorio",
  max_snow_accumulation_height: "Limite de camadas de neve",
  allow_entering_nether_using_portal: "Permite entrar no Nether via portal",
  spawn_patrols: "Geracao de patrulhas de saqueadores",
  advance_time: "Passagem de tempo ativo",
  spawn_wardens: "Permite surgimento de Wardens",
  projectiles_can_break_blocks: "Projeteis interagem com ambiente",
  water_source_conversion: "Fontes de agua infinitas",
  ender_pearls_vanish_on_death: "Perolas somem se voce morrer",
};

export function getGameRuleDescription(ruleId: string): string {
  // Normaliza o ID: remove prefixo e tenta camelCase e snake_case
  const cleanId = ruleId.replace("minecraft:", "");
  const snakeId = cleanId
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");

  return (
    GAME_RULES_PTBR[cleanId] ||
    GAME_RULES_PTBR[snakeId] ||
    GAME_RULES_PTBR[ruleId] ||
    "Regra de Jogo"
  );
}
