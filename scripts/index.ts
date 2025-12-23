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
import { WallBounce } from './movement/wallBounce';
import { FastStraight } from './movement/fastStraight';
import { AirRefraction } from './movement/airRefraction';
import { Updraft } from './movement/updraft';
import { AirCurve } from './movement/airCurve';
import { EventManager, Priority, repeating } from 'keystonemc';
import { PlayerPermissionLevel, system, world } from '@minecraft/server';
import { optionForm } from './form/settingForm';

// 初回のデータ生成
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
      'AIR_REFRACTION.MULTIPLIER': 1.45,
      'AIR_REFRACTION.ANGLE': 85,
      'AIR_REFRACTION.WAIT_TICKS': 7,

      'UPDRAFT.ENABLED': true,
      'UPDRAFT.BLOCK': 'emerald_block',
      'UPDRAFT.HORIZONTAL_MULTIPLIER': 0.5,
      'UPDRAFT.VERTICAL_MULTIPLIER': 1.3,

      'AIR_CURVE.ENABLED': true,
      'AIR_CURVE.BLOCK': 'diamond_block',
      'AIR_CURVE.HORIZONTAL_MULTIPLIER': 1.2,
      'AIR_CURVE.VERTICAL_MULTIPLIER': 0.15,
      'AIR_CURVE.RESPONSE_COUNT': 10
    });
  }
});

// インスタンス生成
const wallBounce = new WallBounce();
const fastStraight = new FastStraight();
const airRefraction = new AirRefraction();
const updraft = new Updraft();
const airCurve = new AirCurve();

// 毎tick（20分の1秒）でプレイヤーの入力状態をチェック
repeating({
  run() {
    for (const player of world.getPlayers()) {
      wallBounce.onActivate(player);
      airRefraction.onActivate(player);
      fastStraight.onActivate(player);
      updraft.onActivate(player);
      airCurve.onActivate(player);
    }
  },
  every: 1,
  endless: true
});

EventManager.initialize();

// 参加時にキャラコンのフラグを削除する
EventManager.registerAfter('playerSpawn', {
  handler(event) {
    if (!event.initialSpawn) return;

    const player = event.player;
    for (const propertyId of player.getDynamicPropertyIds()) {
      if (propertyId.startsWith('bmc_movement:')) {
        player.setDynamicProperty(propertyId);
      }
    }
  },
  priority: Priority.HIGHEST
});

// アイテムからメニューの展開
EventManager.registerAfter('itemUse', {
  handler(event) {
    const item = event.itemStack;
    if (item && item.typeId === 'minecraft:nether_star') {
      const player = event.source;
      if (player.playerPermissionLevel !== PlayerPermissionLevel.Operator) return;
      
      try {
        if (player.isSneaking) {
          optionForm.showResetMenu(player);
        } else {
          optionForm.showMainMenu(player);
        }
      } catch (error) {
        console.error('UI trigger error:', error);
      }
    }
  },
  priority: Priority.HIGHEST
});
