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

export function fastStraightForm() {
  return createModalForm({
    title: 'Movement > §lFastStraight§r',
    previousForm: home(),
    components: [
      createToggle(
        'FAST_STRAIGHT.ENABLED',
        'ファストストレートの有効化'
      ),
      createTextField(
        'FAST_STRAIGHT.COST_FOOD',
        '消費する空腹度',
        '12',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'FAST_STRAIGHT.RECOVERY_FOOD',
        '1ティックごとの空腹度回復量',
        '0.25',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'FAST_STRAIGHT.HORIZONTAL_MULTIPLIER',
        '水平方向の加速倍率値',
        '2.575',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'FAST_STRAIGHT.VERTICAL_MULTIPLIER',
        '垂直方向の加速倍率値',
        '0.585',
        (newValue) => !Number.isNaN(Number(newValue))
      )
    ]
  });
}
