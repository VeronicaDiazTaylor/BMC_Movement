/**
 *           _ _           _              _            
 * __   ____| (_) __ _ ___| |_ __ _ _   _| | ___  _ __ 
 * \ \ / / _` | |/ _` |_  / __/ _` | | | | |/ _ \| '__|
 *  \ V / (_| | | (_| |/ /| || (_| | |_| | | (_) | |   
 *   \_/ \__,_|_|\__,_/___|\__\__,_|\__, |_|\___/|_|   
 *                                  |___/                
 * 
 * @author vdiaztaylor
 * @website https://github.com/VeronicaDiazTaylor
 * 
 * NOTE:
 * このプログラムは非公式サーバーソフトウェアPocketMine-MPで稼働していたBowyersMCをScriptAPIに移植したものです。
 * ScriptAPIのビヘイビアー開発支援フレームワーク「Keystone」を用いているため、TypeScriptで書かれています。
 * 
 */
import { Block, Player, world } from '@minecraft/server';
import { Movement } from './movement';
import { delayed, repeating, Vector3 } from 'keystonemc';

export class WallBounce extends Movement {
  onActivate(player: Player) {
    const settings = this.fetchSettings();
    if (!settings.enabled) return;

    const hungerComponent = player.getComponent('minecraft:player.hunger');
    const costFood = settings.costFood as number;

    // 体力がなければ無視
    const currentHunger = hungerComponent?.currentValue ?? 0;
    if (currentHunger < costFood) return;

    // 壁ジャンプ中は無視
    if (player.getDynamicProperty(Movement.WALL_BOUNCE_FLAG)) return;

    // 壁ジャンプ判定
    if (!player.isOnGround && player.isSneaking) {

      // 正面のブロックを取得
      const location = player.location;
      const yaw = player.getRotation().y;
      const pos = Vector3.fromBDS({
        x: location.x - Math.sin(yaw * Math.PI / 180) * 0.45,
        y: location.y + 0.7,
        z: location.z + Math.cos(yaw * Math.PI / 180) * 0.45
      });
      const block = player.dimension.getBlock(pos);

      // ブロック判定
      if (!block) return;
      if (!this.isCanHandleBlock(block)) return;
      
      // 壁ジャンプのフラグ
      player.setDynamicProperty(Movement.WALL_BOUNCE_FLAG, true);

      // 後ろ方向を計算
      const backDirection = Vector3.fromBDS(player.getViewDirection()).multiply(-1).normalize();

      // プレイヤーにベクトルを適用
      player.applyKnockback({ 
        x: backDirection.x * (settings.horizontalMultiplier as number),
        z: backDirection.z * (settings.horizontalMultiplier as number)
      }, settings.verticalMultiplier as number);

      // 指定ティック後までは再度壁ジャンプできないように
      delayed(settings.waitTicks as number, () => player.setDynamicProperty(Movement.WALL_BOUNCE_FLAG));

      // 空腹度の変更
      if (hungerComponent) hungerComponent.setCurrentValue(Math.max(0, Math.min(20, currentHunger - costFood)));

      // ティックごとの満腹度回復処理
      const recoveryPerTick = settings.recoveryFood as number;
      const ticks = repeating({
        run() {
          if (!player || !player.isValid) {
            ticks.cancel(true);
            return;
          }
          const hungerComponent = player.getComponent('minecraft:player.hunger');
          if (hungerComponent) {
            if ((hungerComponent?.currentValue ?? 0) >= 20) {
              ticks.cancel();
            } else {
              hungerComponent.setCurrentValue(Math.max(0, Math.min(20, (hungerComponent?.currentValue ?? 0) + recoveryPerTick)));
            }
          }
        },
        every: 1,
        endless: true
      });
    }
  }

  isCanHandleBlock(block: Block): boolean {
    if (this.isGlass(block)) return true;
    if (this.isStairs(block)) return true;
    if (this.isSlab(block)) return true;
    if (this.isFence(block)) return true;
    if (this.isWall(block)) return true;
    if (this.isDoor(block)) return true;
    if (this.isLeaves(block)) return true;
    if (block.typeId === 'minecraft:ladder') return false;
    if (block.typeId === 'minecraft:vine') return false;
    if (block.isAir || block.isLiquid || !block.isSolid) return false;
    return true;
  }

  fetchSettings(): Record<string, unknown> {
    return {
        enabled: world.getDynamicProperty('WALL_BOUNCE.ENABLED') as boolean,
        costFood: (world.getDynamicProperty('WALL_BOUNCE.COST_FOOD') ?? 12) as number,
        recoveryFood: (world.getDynamicProperty('WALL_BOUNCE.RECOVERY_FOOD') ?? 0.25) as number,
        horizontalMultiplier: (world.getDynamicProperty('WALL_BOUNCE.HORIZONTAL_MULTIPLIER') ?? 1.825) as number,
        verticalMultiplier: (world.getDynamicProperty('WALL_BOUNCE.VERTICAL_MULTIPLIER') ?? 0.775) as number,
        waitTicks: (world.getDynamicProperty('WALL_BOUNCE.WAIT_TICKS') ?? 5) as number
    };
  }
}
