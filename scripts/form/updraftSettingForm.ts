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

export function updraftForm() {
  return createModalForm({
    title: 'Movement > §lUpdraft§r',
    previousForm: home(),
    components: [
      createToggle(
        'UPDRAFT.ENABLED',
        'アップドラフトの有効化'
      ),
      createTextField(
        'UPDRAFT.BLOCK',
        '応答するブロック (例: minecraft:emerald_block)',
        'minecraft:emerald_block',
        (newValue) => /^[^\d]+$/.test(newValue)
      ),
      createTextField(
        'UPDRAFT.HORIZONTAL_MULTIPLIER',
        '水平方向の加速倍率値',
        '0.5',
        (newValue) => !Number.isNaN(Number(newValue))
      ),
      createTextField(
        'UPDRAFT.VERTICAL_MULTIPLIER',
        '垂直方向の加速倍率値',
        '1.3',
        (newValue) => !Number.isNaN(Number(newValue))
      )
    ]
  });
}
