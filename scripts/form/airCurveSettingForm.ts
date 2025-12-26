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

export function airCurveForm() {
  return createModalForm({
    title: 'Movement > §lAirCurve§r',
    previousForm: home(),
    components: [
      createToggle(
        'AIR_CURVE.ENABLED',
        'エアカーブの有効化'
      ),
      createTextField(
        'AIR_CURVE.BLOCK',
        '応答するブロック (例: minecraft:diamond_block)',
        'minecraft:diamond_block',
        (newValue) => /^[^\d]+$/.test(newValue)
      ),
      createTextField(
        'AIR_CURVE.HORIZONTAL_MULTIPLIER',
        '水平方向の加速倍率値',
        '1.2',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'AIR_CURVE.VERTICAL_MULTIPLIER',
        '垂直方向の加速倍率値',
        '0.15',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'AIR_CURVE.RESPONSE_COUNT',
        '加速度付与の試行回数',
        '10',
        (newValue) => Number.isInteger(Number(newValue))
      )
    ]
  });
}
