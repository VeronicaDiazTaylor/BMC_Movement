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

export class AirCurve extends Movement {
  onActivate(player: Player) {
    const settings = this.fetchSettings();
    if (!settings.enabled) return;

    // 真下のブロックを取得
    const location = player.location;
    const pos = Vector3.fromBDS(location).subtract(0, 0.5, 0);
    const block = player.dimension.getBlock(pos);

    // ブロック判定
    if (!block) return;
    if (!this.isCanHandleBlock(block)) return;

    // メイン処理
    const { x: pitch, y: yaw } = player.getRotation();
    const motion = Vector3.fromBDS({
      x: -1 * Math.sin(yaw / 180 * Math.PI) * Math.cos(pitch / 180 * Math.PI) / 15,
      y: settings.verticalMultiplier as number,
      z: Math.cos(yaw / 180 * Math.PI) * Math.cos(pitch / 180 * Math.PI) / 15
    });

    player.clearVelocity();
    player.applyImpulse(motion);

    const inAirTicks = repeating({
      run(tick) {
        if (tick >= (settings.responseCount as number) || (!player || !player.isValid)) {
          inAirTicks.cancel();
          return;
        }

        const direction = Vector3.fromBDS(player.getViewDirection()).normalize();
        direction.x /= 2;
        direction.y = 0;
        direction.z /= 2;

        const next = motion.addVector(direction);
        next.x *= (settings.horizontalMultiplier as number);
        next.z *= (settings.horizontalMultiplier as number);
        player.clearVelocity();
        player.applyImpulse(next);
      },
      every: 1,
      endless: true
    });
  }

  isCanHandleBlock(block: Block): boolean {
    return block.typeId === `minecraft:${(world.getDynamicProperty('AIR_CURVE.BLOCK') as string)}`;
  }

  fetchSettings(): Record<string, unknown> {
    return {
        enabled: world.getDynamicProperty('AIR_CURVE.ENABLED') as boolean,
        horizontalMultiplier: (world.getDynamicProperty('AIR_CURVE.HORIZONTAL_MULTIPLIER') ?? 1.2) as number,
        verticalMultiplier: (world.getDynamicProperty('AIR_CURVE.VERTICAL_MULTIPLIER') ?? 0.15) as number,
        responseCount: (world.getDynamicProperty('AIR_CURVE.RESPONSE_COUNT') ?? 10) as number,
    };
  }
}
