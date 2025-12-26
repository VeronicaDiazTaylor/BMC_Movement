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
import { delayed, Vector3 } from 'keystonemc';

export class Updraft extends Movement {
  onActivate(player: Player) {
    const settings = this.fetchSettings();
    if (!settings.enabled) return;
    
    // アップドラフト中は無視
    if (player.getDynamicProperty(Movement.UPDRAFT_FLAG)) return;
    
    // 真下のブロックを取得
    const location = player.location;
    const pos = Vector3.fromBDS(location).subtract(0, 0.5, 0);
    const block = player.dimension.getBlock(pos);
    
    // ブロック判定
    if (!block) return;
    if (!this.isCanHandleBlock(block)) return;
    
    // フラグ
    player.setDynamicProperty(Movement.UPDRAFT_FLAG, true);

    // メイン処理
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    v.x *= settings.horizontalMultiplier as number;
    v.y = settings.verticalMultiplier as number;
    v.z *= settings.horizontalMultiplier as number;
    player.clearVelocity();
    player.applyImpulse(v);

    // 数ティック後にフラグ解除
    delayed(5, () => player.setDynamicProperty(Movement.UPDRAFT_FLAG));
  }

  isCanHandleBlock(block: Block): boolean {
    return block.typeId === (world.getDynamicProperty('UPDRAFT.BLOCK') as string);
  }

  fetchSettings(): Record<string, unknown> {
    return {
        enabled: world.getDynamicProperty('UPDRAFT.ENABLED') as boolean,
        horizontalMultiplier: (world.getDynamicProperty('UPDRAFT.HORIZONTAL_MULTIPLIER') ?? 0.5) as number,
        verticalMultiplier: (world.getDynamicProperty('UPDRAFT.VERTICAL_MULTIPLIER') ?? 1.3) as number,
    };
  }
}
