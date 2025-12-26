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
import { world } from '@minecraft/server';
import { createMessageForm } from 'keystonemc';

export function resetForm() {
  return createMessageForm({
    title: 'Movement > §lReset§r',
    body: 'ムーブメント設定を初期化しますか？',
    yes: {
      text: 'はい',
      handler(player) {
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
          'AIR_REFRACTION.MULTIPLIER': 1.45,
          'AIR_REFRACTION.ANGLE': 85,
          'AIR_REFRACTION.WAIT_TICKS': 7,
    
          'UPDRAFT.ENABLED': true,
          'UPDRAFT.BLOCK': 'minecraft:emerald_block',
          'UPDRAFT.HORIZONTAL_MULTIPLIER': 0.5,
          'UPDRAFT.VERTICAL_MULTIPLIER': 1.3,
    
          'AIR_CURVE.ENABLED': true,
          'AIR_CURVE.BLOCK': 'minecraft:diamond_block',
          'AIR_CURVE.HORIZONTAL_MULTIPLIER': 1.2,
          'AIR_CURVE.VERTICAL_MULTIPLIER': 0.15,
          'AIR_CURVE.RESPONSE_COUNT': 10
        });

        player.sendMessage('データを初期化しました');
      }
    },
    no: {
      text: 'いいえ',
      handler() {}
    }
  });
}
