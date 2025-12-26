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
import { button, createActionForm } from 'keystonemc';
import { airCurveForm } from './airCurveSettingForm';
import { updraftForm } from './updraftSettingForm';
import { wallBounceForm } from './wallBounceSettingForm';
import { airRefractionForm } from './airRefractionSettingForm';
import { fastStraightForm } from './fastStraightSettingForm';
import { resetForm } from './resetForm';

export function home() { 
  return createActionForm({
    title: '§lMovement§r',
    body: '設定する項目を以下から選んでください',
    buttons: [
      button({
        text: 'WallBounce',
        iconPath: 'textures/ui/speed_effect',
        handler(player) {
          wallBounceForm().send(player);
        },
      }),
      button({
        text: 'FastStraight',
        iconPath: 'textures/ui/wind_charged_effect',
        handler(player) {
          fastStraightForm().send(player);
        },
      }),
      button({
        text: 'AirRefraction',
        iconPath: 'textures/ui/invisibility_effect',
        handler(player) {
          airRefractionForm().send(player);
        },
      }),
      button({
        text: 'Updraft',
        iconPath: 'textures/ui/jump_boost_effect',
        handler(player) {
          updraftForm().send(player);
        },
      }),
      button({
        text: 'AirCurve',
        iconPath: 'textures/ui/weaving_effect',
        handler(player) {
          airCurveForm().send(player);
        },
      }),
      button({
        text: '§l§c設定の初期化§r',
        iconPath: 'textures/ui/trash',
        handler(player) {
          resetForm().send(player);
        },
      }),
    ]
  });
}
