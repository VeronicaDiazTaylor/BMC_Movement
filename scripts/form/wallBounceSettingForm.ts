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
import { createModalForm } from 'keystonemc';
import { home } from './homeForm';
import { createTextField, createToggle } from './componentHelper';

export function wallBounceForm() {
  return createModalForm({
    title: 'Movement > §lWallBounce§r',
    previousForm: home(),
    components: [
      createToggle(
        'WALL_BOUNCE.ENABLED',
        '壁ジャンプの有効化'
      ),
      createTextField(
        'WALL_BOUNCE.COST_FOOD',
        '消費する空腹度',
        '12',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'WALL_BOUNCE.RECOVERY_FOOD',
        '1ティックごとの空腹度回復量',
        '0.25',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'WALL_BOUNCE.HORIZONTAL_MULTIPLIER',
        '水平方向の加速倍率値',
        '1.825',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'WALL_BOUNCE.VERTICAL_MULTIPLIER',
        '垂直方向の加速倍率値',
        '0.775',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'WALL_BOUNCE.WAIT_TICKS',
        '連発防止の待機ティック',
        '5',
        (newValue) => Number.isInteger(Number(newValue))
      )
    ]
  });
}
