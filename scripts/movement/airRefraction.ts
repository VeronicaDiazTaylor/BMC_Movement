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
import { Player, world } from '@minecraft/server';
import { Movement } from './movement';
import { FastStraight } from './fastStraight';
import { Vector3 } from 'keystonemc';

export class AirRefraction extends Movement {
  static WAITING = 'bmc_movement:air_refraction:waiting';

  onActivate(player: Player) {
    const settings = this.fetchSettings();
    if (!settings.enabled) return;

    // ファストストレート中以外は無視
    if (!player.getDynamicProperty(Movement.FAST_STRAIGHT_FLAG)) return;
    
    // エアーリフラクションの待機
    player.setDynamicProperty(Movement.AIR_REFRACTION_FLAG, true);

    // メイン処理
    if (!player.isOnGround) {
      const newYaw = player.getRotation().y;
      const previousYaw = (player.getDynamicProperty(FastStraight.INIT_YAW) as number) ?? newYaw;
      let diff = Math.abs(previousYaw - newYaw) % 360;
      if (diff > 180) diff = 360 - diff;

      const currentAirRefractionWaitTicks = player.getDynamicProperty(AirRefraction.WAITING) as number;
      if (currentAirRefractionWaitTicks <= 0 && player.getDynamicProperty(Movement.AIR_REFRACTION_FLAG) && diff >= (settings.angle as number)) {
        // プレイヤーにベクトルを適用
        const dirV = Vector3.fromBDS(player.getViewDirection()).normalize();
        player.applyImpulse({
          x: dirV.x * (settings.multiplier as number),
          y: 0,
          z: dirV.z * (settings.multiplier as number)
        });

        // フラグを削除
        player.setDynamicProperty(Movement.FAST_STRAIGHT_FLAG);
        player.setDynamicProperty(Movement.AIR_REFRACTION_FLAG);
      }
    }
  }

  isCanHandleBlock(): boolean {
    return true;
  }

  fetchSettings(): Record<string, unknown> {
    return {
        enabled: world.getDynamicProperty('AIR_REFRACTION.ENABLED') as boolean,
        multiplier: (world.getDynamicProperty('AIR_REFRACTION.MULTIPLIER') ?? 1.45) as number,
        angle: (world.getDynamicProperty('AIR_REFRACTION.ANGLE') ?? 85) as number,
    };
  }
}
