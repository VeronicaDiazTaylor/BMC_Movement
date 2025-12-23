import { Player, world } from '@minecraft/server';
import { BaseModalForm, BaseMessageForm, TextField, Toggle } from 'keystonemc';

class OptionForm {
  /**
   * メイン設定 Form を表示
   * @param player 表示対象プレイヤー
   */
  showMainMenu(player: Player): void {
    const form = new BaseModalForm()
      .setTitle('§lMovement§r')
      .addElement(
        new Toggle(
          'WALL_BOUNCE.ENABLED',
          'ウォールバウンス',
          Boolean(world.getDynamicProperty('WALL_BOUNCE.ENABLED'))
        )
      )
      .addElement(
        new TextField(
          'WALL_BOUNCE.COST_FOOD',
          '消費する空腹度',
          '12',
          String(world.getDynamicProperty('WALL_BOUNCE.COST_FOOD'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'WALL_BOUNCE.RECOVERY_FOOD',
          '1ティックごとの空腹度回復量',
          '0.25',
          String(world.getDynamicProperty('WALL_BOUNCE.RECOVERY_FOOD'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'WALL_BOUNCE.HORIZONTAL_MULTIPLIER',
          '水平方向の加速倍率値',
          '1.825',
          String(world.getDynamicProperty('WALL_BOUNCE.HORIZONTAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'WALL_BOUNCE.VERTICAL_MULTIPLIER',
          '垂直方向の加速倍率値',
          '0.775',
          String(world.getDynamicProperty('WALL_BOUNCE.VERTICAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'WALL_BOUNCE.WAIT_TICKS',
          '連発防止の待機ティック',
          '5',
          String(world.getDynamicProperty('WALL_BOUNCE.WAIT_TICKS'))
        ).addValidator(value => ({
          valid: Number.isInteger(Number(value)),
          message: '整数を入力してください',
        }))
      )
      .addElement(
        new Toggle(
          'FAST_STRAIGHT.ENABLED',
          'ファストストレート',
          Boolean(world.getDynamicProperty('FAST_STRAIGHT.ENABLED'))
        )
      )
      .addElement(
        new TextField(
          'FAST_STRAIGHT.COST_FOOD',
          '消費空腹度',
          '12',
          String(world.getDynamicProperty('FAST_STRAIGHT.COST_FOOD'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'FAST_STRAIGHT.RECOVERY_FOOD',
          '1ティックごとの空腹度回復量',
          '0.25',
          String(world.getDynamicProperty('FAST_STRAIGHT.RECOVERY_FOOD'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'FAST_STRAIGHT.HORIZONTAL_MULTIPLIER',
          '水平方向の加速倍率値',
          '2.575',
          String(world.getDynamicProperty('FAST_STRAIGHT.HORIZONTAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'FAST_STRAIGHT.VERTICAL_MULTIPLIER',
          '垂直方向の加速倍率値',
          '0.585',
          String(world.getDynamicProperty('FAST_STRAIGHT.VERTICAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new Toggle(
          'AIR_REFRACTION.ENABLED',
          'エアリフラクション',
          Boolean(world.getDynamicProperty('AIR_REFRACTION.ENABLED'))
        )
      )
      .addElement(
        new TextField(
          'AIR_REFRACTION.MULTIPLIER',
          '加速倍率値',
          '1.45',
          String(world.getDynamicProperty('AIR_REFRACTION.MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'AIR_REFRACTION.ANGLE',
          '発動させる首角度差',
          '85',
          String(world.getDynamicProperty('AIR_REFRACTION.ANGLE'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'AIR_REFRACTION.WAIT_TICKS',
          '屈折待機ティック',
          '7',
          String(world.getDynamicProperty('AIR_REFRACTION.WAIT_TICKS'))
        ).addValidator(value => ({
          valid: Number.isInteger(Number(value)),
          message: '整数を入力してください',
        }))
      )
      .addElement(
        new Toggle(
          'UPDRAFT.ENABLED',
          'アップドラフト',
          Boolean(world.getDynamicProperty('UPDRAFT.ENABLED'))
        )
      )
      .addElement(
        new TextField(
          'UPDRAFT.BLOCK',
          '応答するブロックタイプ (例: emerald_block)',
          'emerald_block',
          String(world.getDynamicProperty('UPDRAFT.BLOCK'))
        ).addValidator(value => ({
          valid: /^[^\d]+$/.test(value),
          message: '数字を含めないでください',
        }))
      )
      .addElement(
        new TextField(
          'UPDRAFT.HORIZONTAL_MULTIPLIER',
          '水平方向の加速倍率値',
          '0.5',
          String(world.getDynamicProperty('UPDRAFT.HORIZONTAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'UPDRAFT.VERTICAL_MULTIPLIER',
          '垂直方向の加速倍率値',
          '1.3',
          String(world.getDynamicProperty('UPDRAFT.VERTICAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new Toggle(
          'AIR_CURVE.ENABLED',
          'エアカーブ',
          Boolean(world.getDynamicProperty('AIR_CURVE.ENABLED'))
        )
      )
      .addElement(
        new TextField(
          'AIR_CURVE.BLOCK',
          '応答するブロックタイプ (例: diamond_block)',
          'diamond_block',
          String(world.getDynamicProperty('AIR_CURVE.BLOCK'))
        ).addValidator(value => ({
          valid: /^[^\d]+$/.test(value),
          message: '数字を含めないでください',
        }))
      )
      .addElement(
        new TextField(
          'AIR_CURVE.HORIZONTAL_MULTIPLIER',
          '水平方向の加速倍率値',
          '1.2',
          String(world.getDynamicProperty('AIR_CURVE.HORIZONTAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'AIR_CURVE.VERTICAL_MULTIPLIER',
          '垂直方向の加速倍率値',
          '0.15',
          String(world.getDynamicProperty('AIR_CURVE.VERTICAL_MULTIPLIER'))
        ).addValidator(value => ({
          valid: !Number.isNaN(Number(value)),
          message: '数値を入力してください',
        }))
      )
      .addElement(
        new TextField(
          'AIR_CURVE.RESPONSE_COUNT',
          '加速度付与の試行回数',
          '10',
          String(world.getDynamicProperty('AIR_CURVE.RESPONSE_COUNT'))
        ).addValidator(value => ({
          valid: Number.isInteger(Number(value)),
          message: '整数を入力してください',
        }))
      )
      // ここからサブミット処理
      .on('submit', (_player, values: Record<string, unknown>) => {
        for (const key in values) {
          if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

          const raw = values[key];
          const oldValue = world.getDynamicProperty(key);
          let newValue = oldValue;
          try {
            newValue = JSON.parse(String(raw));
          } catch {
            newValue = String(raw);
          }

          if (oldValue !== newValue) {
            player.sendMessage(
              `${key} (§7${String(oldValue)}§r → §a${String(newValue)}§r)`
            );
          }

          world.setDynamicProperty(key, newValue);
        }
      });

    try {
      void form.show(player);
    } catch (error) {
      console.error('Form error:', error);
      player.sendMessage('§cForm の表示中にエラーが発生しました！');
    }
  }

  /**
   * 設定初期化確認 Form を表示
   *
   * @param player 表示対象プレイヤー
   */
  showResetMenu(player: Player): void {
    const form = new BaseMessageForm()
      .setTitle('§lMovement§r')
      .setBody('このワールドのムーブメント設定を初期化しますか？')
      .setButton1('はい', () => {
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

        player.sendMessage('ムーブメント設定を初期化しました');
      })
      .setButton2('いいえ');

    try {
      void form.show(player);
    } catch (error) {
      console.error('Form error:', error);
      player.sendMessage('§cForm の表示中にエラーが発生しました！');
    }
  }
}

export const optionForm = new OptionForm();
