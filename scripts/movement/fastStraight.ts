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
import { repeating, Vector3 } from 'keystonemc';
import { AirRefraction } from './airRefraction';

export class FastStraight extends Movement {
  static INIT_YAW = 'bmc_movement:fast_straight:init_yaw';

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

    // ファストストレート中は無視
    if (player.getDynamicProperty(Movement.FAST_STRAIGHT_FLAG)) return;

    // ファストストレート判定
    if (!player.isOnGround && player.isSneaking) {

      // 正面下のブロックを取得
      const location = player.location;
      const yaw = player.getRotation().y;
      const xzMultiplier = (yaw < 15 || 200 < yaw) ? 0.55 : 0.4275;
      const pos = Vector3.fromBDS({
        x: location.x - Math.sin(yaw * Math.PI / 180) * xzMultiplier,
        y: location.y,
        z: location.z + Math.cos(yaw * Math.PI / 180) * xzMultiplier
      });
      const block = player.dimension.getBlock(pos);

      // ブロック判定
      if (!block) return;
      if (!this.isCanHandleBlock(block)) return;

      // 前方向を計算
      const direction = Vector3.fromBDS(player.getViewDirection()).normalize();

      // プレイヤーにベクトルを適用
      player.applyKnockback({
        x: direction.x * (settings.horizontalMultiplier as number),
        z: direction.z * (settings.horizontalMultiplier as number)
      }, settings.verticalMultiplier as number);

      // 初動の状態保管
      player.setDynamicProperty(FastStraight.INIT_YAW, yaw);
      player.setDynamicProperty(AirRefraction.WAITING, settings.airRefractionWaiting as number);

      // ジャンプが終わるまでループ処理
      player.setDynamicProperty(Movement.FAST_STRAIGHT_FLAG, true);
      const inAirTicks = repeating({
        run() {
          if (player.isOnGround) {
            player.setDynamicProperty(Movement.FAST_STRAIGHT_FLAG);
            player.setDynamicProperty(Movement.AIR_REFRACTION_FLAG);
            inAirTicks.cancel();
          } else {
            let currentAirRefractionWaitTicks = player.getDynamicProperty(AirRefraction.WAITING) as number;
            player.setDynamicProperty(AirRefraction.WAITING, --currentAirRefractionWaitTicks);
          }
        },
        every: 1,
        endless: true
      });

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
        enabled: world.getDynamicProperty('FAST_STRAIGHT.ENABLED') as boolean,
        costFood: (world.getDynamicProperty('FAST_STRAIGHT.COST_FOOD') ?? 12) as number,
        recoveryFood: (world.getDynamicProperty('FAST_STRAIGHT.RECOVERY_FOOD') ?? 0.25) as number,
        horizontalMultiplier: (world.getDynamicProperty('FAST_STRAIGHT.HORIZONTAL_MULTIPLIER') ?? 2.575) as number,
        verticalMultiplier: (world.getDynamicProperty('FAST_STRAIGHT.VERTICAL_MULTIPLIER') ?? 0.585) as number,
        airRefractionWaiting: (world.getDynamicProperty('AIR_REFRACTION.WAIT_TICKS') ?? 7) as number
    };
  }
}
