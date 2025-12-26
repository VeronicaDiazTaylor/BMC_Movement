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

export function airRefractionForm() {
  return createModalForm({
    title: 'Movement > §lAirRefraction§r',
    previousForm: home(),
    components: [
      createToggle(
        'AIR_REFRACTION.ENABLED',
        'エアリフラクションの有効化'
      ),
      createTextField(
        'AIR_REFRACTION.MULTIPLIER',
        '加速倍率値',
        '1.45',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'AIR_REFRACTION.ANGLE',
        '発動させる首角度差',
        '85',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'AIR_REFRACTION.WAIT_TICKS',
        '屈折待機ティック',
        '7',
        (newValue) => Number.isInteger(Number(newValue))
      )
    ]
  });
}
