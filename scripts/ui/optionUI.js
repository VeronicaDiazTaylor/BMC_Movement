import { Player, world } from '@minecraft/server';
import { BaseModalUI, BaseMessageUI } from './baseUI.js';
import { TextField, Toggle } from './elements.js';

class OptionsUI {
  constructor() {
  }

  /**
   * @param { Player } player 
   */
  showMainMenu(player) {
    const form = new BaseModalUI()
      .setTitle('§lMovement§r')
      .addElement(new Toggle('WALL_BOUNCE.ENABLED', 'ウォールバウンス', world.getDynamicProperty('WALL_BOUNCE.ENABLED')))
      .addElement(new TextField('WALL_BOUNCE.COST_FOOD', '消費する空腹度', 12, world.getDynamicProperty('WALL_BOUNCE.COST_FOOD'))
        .addValidator((value) => (parseInt(value)) instanceof Number)
      )
      .addElement(new TextField('WALL_BOUNCE.RECOVERY_FOOD', '1ティックごとの空腹度回復量', 0.25, world.getDynamicProperty('WALL_BOUNCE.RECOVERY_FOOD'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('WALL_BOUNCE.HORIZONTAL_MULTIPLIER', '水平方向の加速倍率値', 1.825, world.getDynamicProperty('WALL_BOUNCE.HORIZONTAL_MULTIPLIER'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('WALL_BOUNCE.VERTICAL_MULTIPLIER', '垂直方向の加速倍率値', 0.775, world.getDynamicProperty('WALL_BOUNCE.VERTICAL_MULTIPLIER'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('WALL_BOUNCE.WAIT_TICKS', '連発防止の待機ティック', 5, world.getDynamicProperty('WALL_BOUNCE.WAIT_TICKS'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new Toggle('FAST_STRAIGHT.ENABLED', 'ファストストレート', world.getDynamicProperty('FAST_STRAIGHT.ENABLED')))
      .addElement(new TextField('FAST_STRAIGHT.COST_FOOD', '消費空腹度', 12, world.getDynamicProperty('FAST_STRAIGHT.COST_FOOD'))
        .addValidator((value) => (parseInt(value)) instanceof Number)
      )
      .addElement(new TextField('FAST_STRAIGHT.RECOVERY_FOOD', '1ティックごとの空腹度回復量', 0.25, world.getDynamicProperty('FAST_STRAIGHT.RECOVERY_FOOD'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('FAST_STRAIGHT.HORIZONTAL_MULTIPLIER', '水平方向の加速倍率値', 2.575, world.getDynamicProperty('FAST_STRAIGHT.HORIZONTAL_MULTIPLIER'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('FAST_STRAIGHT.VERTICAL_MULTIPLIER', '垂直方向の加速倍率値', 0.585, world.getDynamicProperty('FAST_STRAIGHT.VERTICAL_MULTIPLIER'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new Toggle('AIR_REFRACTION.ENABLED', 'エアリフラクション', world.getDynamicProperty('AIR_REFRACTION.ENABLED')))
      .addElement(new TextField('AIR_REFRACTION.MULTIPLIER', '加速倍率値', 1.4, world.getDynamicProperty('AIR_REFRACTION.MULTIPLIER'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('AIR_REFRACTION.ANGLE', '発動させる首角度差', 85, world.getDynamicProperty('AIR_REFRACTION.ANGLE'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .addElement(new TextField('AIR_REFRACTION.WAIT_TICKS', '屈折待機ティック', 10, world.getDynamicProperty('AIR_REFRACTION.WAIT_TICKS'))
        .addValidator((value) => (parseFloat(value)) instanceof Number)
      )
      .on('submit', (_, processedValues) => {
        Object.entries(processedValues).forEach(([key, value]) => {
          const oldValue = world.getDynamicProperty(key);
          const newValue = JSON.parse(value);
          if (oldValue != newValue) {
            player.sendMessage(key + ' (§7' + String(oldValue) + '§r > §a' + String(newValue) + '§r)');
          }

          world.setDynamicProperty(key, newValue);
        });
      });

    try {
      form.show(player);
    } catch (error) {
      console.error('UI error:', error);
      player.sendMessage('§cUIの表示中にエラーが発生しました！');
    }
  }

  /**
   * @param { Player } player 
   */
  showResetMenu(player) {
    /** @type BaseMessageUI */
    const form = new BaseMessageUI()
      .setTitle('§lMovement§r')
      .setBody('このワールドのムーブメント設定を初期化しますか？')
      .setButton1('はい', (player, selection) => {
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
          'AIR_REFRACTION.MULTIPLIER': 1.4,
          'AIR_REFRACTION.ANGLE': 85,
          'AIR_REFRACTION.WAIT_TICKS': 10,
        });

        player.sendMessage('ムーブメント設定を初期化しました');
      })
      .setButton2('いいえ');
    try {
      form.show(player);
    } catch (error) {
      console.error('UI error:', error);
      player.sendMessage('§cUIの表示中にエラーが発生しました！');
    }
  }
}

export const optionsUI = new OptionsUI();
