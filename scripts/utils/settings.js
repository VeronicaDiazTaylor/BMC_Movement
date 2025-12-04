import { PlayerPermissionLevel, system, world } from "@minecraft/server";
import { optionsUI } from "../ui/optionUI";

system.run(() => {
  if (!world.getDynamicProperty('BMC_MOVEMENT_INITIALIZED_FLAG')) {
    world.setDynamicProperties({
      'BMC_MOVEMENT_INITIALIZED_FLAG': true,

      'WALL_BOUNCE.ENABLED': true,
      'WALL_BOUNCE.COST_FOOD': 12,
      'WALL_BOUNCE.RECOVERY_FOOD': 0.25,
      'WALL_BOUNCE.HORIZONTAL_MULTIPLIER': 1.825,
      'WALL_BOUNCE.VERTICAL_MULTIPLIER': 0.775,
      'WALL_BOUNCE.WAIT_TICKS': 5,

      'FAST_STRAIGHT.ENABLED': true,
      'FAST_STRAIGHT.COST_FOOD': 12,
      'FAST_STRAIGHT.RECOVERY_FOOD': 0.25,
      'FAST_STRAIGHT.HORIZONTAL_MULTIPLIER': 2.575,
      'FAST_STRAIGHT.VERTICAL_MULTIPLIER': 0.585,

      'AIR_REFRACTION.ENABLED': false,
      'AIR_REFRACTION.MULTIPLIER': 1.4,
      'AIR_REFRACTION.ANGLE': 85,
      'AIR_REFRACTION.WAIT_TICKS': 10,
    });
  }
});

world.afterEvents.itemUse.subscribe((event) => {
  const item = event.itemStack;
  if (item && item.typeId === 'minecraft:nether_star') {
    const player = event.source;
    if (player.playerPermissionLevel !== PlayerPermissionLevel.Operator) return;
    
    try {
      if (player.isSneaking) {
        optionsUI.showResetMenu(player);
      } else {
        optionsUI.showMainMenu(player);
      }
    } catch (error) {
      console.error('UI trigger error:', error);
      player.sendMessage('§cUIの表示に失敗しました！');
    }
  }
});
