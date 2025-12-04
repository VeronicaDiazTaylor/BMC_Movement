import { Block, Player, system, world } from '@minecraft/server';
import { FixedVector3 } from '../utils/vector3.js';

export class WrappedPlayer {
  /** @type {Map<{int}, {WrappedPlayer}>} */
  static wrappedPlayers = new Map();

  /**
   * コンストラクタ
   * @param {Player} player
   */
  constructor(player) {
    this.player = player;
    this.isThenWallBounce = false;
    this.isThenFastStraight = false;
    this.waitFastStraight = false;
    this.isThenAirRefraction = false;
    this.waitAirRefractionTicks = 3;

    WrappedPlayer.wrappedPlayers.set(player.id, this);
  }

  /**
   * 参加時の処理
   * @param {Player} player
   * @return {WrappedPlayer}
   */
  static join(player) {
    return new WrappedPlayer(player);
  }

  /**
   * BDSのオブジェクトから取得
   * @param {Player} player
   * @return {WrappedPlayer}
   */
  static get(player) {
    return WrappedPlayer.wrappedPlayers.get(player.id);
  }

  /**
   * 退室時の処理
   * @param {int} playerId
   */
  static quit(playerId) {
    WrappedPlayer.wrappedPlayers.delete(playerId);
  }

  /**
   * 満腹度の取得
   * @return {int}
   */
  getFood() {
    return this.player.getComponent('minecraft:player.hunger')?.currentValue ?? 0;
  }

  /**
   * 満腹度の設定
   * @param {int} value 
   */
  setFood(value) {
    const hungerComponent = this.player.getComponent('minecraft:player.hunger');
    if (hungerComponent) hungerComponent.setCurrentValue(Math.max(0, Math.min(20, value)));
  }

  isGlass(block) {
    return /glass(_pane)?$/.test(block.typeId);
  }

  isStairs(block) {
      return /_stairs$/.test(block.typeId);
  }

  isSlab(block) {
      return /_slab$/.test(block.typeId);
  }

  isFence(block) {
      return /_fence$/.test(block.typeId);
  }

  isWall(block) {
      return /_wall$/.test(block.typeId);
  }

  isDoor(block) {
      return /_door$/.test(block.typeId);
  }

  isLeaves(block) {
      return /_leaves$/.test(block.typeId);
  }

  /**
   * ブロック判定
   * @param {Block} block 
   * @returns {bool}
   */
  isCanHandleBlock(block) {
    if (this.isGlass(block)) return true;
    if (this.isStairs(block)) return true;
    if (this.isSlab(block)) return true;
    if (this.isFence(block)) return true;
    if (this.isWall(block)) return true;
    if (this.isDoor(block)) return true;
    if (this.isLeaves(block)) return true;
    if (block.typeId === 'minecraft:ladder') return false;
    if (block.typeId === 'minecraft:vine') return false;
    if (block.isAir || block.isLiquid || !block.isSolid) return false;
    return true;
  }

  /**
   * 壁ジャンプ
   */
  performWallBounce() {
    // 体力がなければ無視
    const currentHunger = this.getFood();
    if (currentHunger < world.getDynamicProperty('WALL_BOUNCE.COST_FOOD')) return;

    // 壁ジャンプ中は無視
    if (this.isThenWallBounce) return;

    // 壁ジャンプ判定
    if (!this.player.isOnGround && this.player.isSneaking) {

      // 正面のブロックを取得
      const { location } = this.player;
      const { y: yaw } = this.player.getRotation();
      const pos = FixedVector3.fromObject({
        x: location.x - Math.sin(yaw * Math.PI / 180) * 0.45,
        y: location.y + 0.7,
        z: location.z + Math.cos(yaw * Math.PI / 180) * 0.45
      });
      const block = this.player.dimension.getBlock(pos);

      // ブロック判定
      if (!this.isCanHandleBlock(block)) return;
      
      // 壁ジャンプのフラグ
      this.isThenWallBounce = true;

      // 後ろ方向を計算
      const backDirection = FixedVector3.fromBDS(this.player.getViewDirection()).multiply(-1).normalize();

      // プレイヤーにベクトルを適用
      this.player.applyKnockback({
        x: backDirection.x * world.getDynamicProperty('WALL_BOUNCE.HORIZONTAL_MULTIPLIER'),
        z: backDirection.z * world.getDynamicProperty('WALL_BOUNCE.HORIZONTAL_MULTIPLIER')
      }, world.getDynamicProperty('WALL_BOUNCE.VERTICAL_MULTIPLIER'));

      // 指定ティック後までは再度壁ジャンプできないように
      system.runTimeout(() => {
        this.isThenWallBounce = false;
      }, world.getDynamicProperty('WALL_BOUNCE.WAIT_TICKS'));

      // 空腹度の変更
      this.setFood(currentHunger - world.getDynamicProperty('WALL_BOUNCE.COST_FOOD'));

      // ティックごとの満腹度回復処理
      const foodInterval = system.runInterval(() => {
        if (this.getFood() >= 20) {
          system.clearRun(foodInterval);
        } else {
          const currentFood = this.getFood();
          this.setFood(currentFood + world.getDynamicProperty('WALL_BOUNCE.RECOVERY_FOOD'));
        }
      });
    }
  }

  /**
   * ファストストレート
   */
  performFastStraight() {
    // 体力がなければ無視
    const currentHunger = this.getFood();
    if (currentHunger < world.getDynamicProperty('FAST_STRAIGHT.COST_FOOD')) return;

    // 壁ジャンプ中は無視
    if (this.isThenWallBounce) return;

    // ファストストレート中は無視
    if (this.isThenFastStraight) return;

    // 待機中なら無視
    if (this.waitFastStraight) return;

    // ファストストレート判定
    if (!this.player.isOnGround && this.player.isSneaking) {
      this.waitFastStraight = true;
      const waitFastStraightInterval = system.runInterval(() => {
        if (this.player.isOnGround) {
          this.waitFastStraight = false;
          system.clearRun(waitFastStraightInterval);
        }
      });

      // 正面下のブロックを取得
      const { location } = this.player;
      const { y: yaw } = this.player.getRotation();
      const xzMultiplier = (yaw < 15 || 200 < yaw) ? 0.55 : 0.4275;
      const pos = FixedVector3.fromObject({
        x: location.x - Math.sin(yaw * Math.PI / 180) * xzMultiplier,
        y: location.y - 0.2,
        z: location.z + Math.cos(yaw * Math.PI / 180) * xzMultiplier
      });
      const block = this.player.dimension.getBlock(pos);

      // ブロック判定
      if (!this.isCanHandleBlock(block)) return;

      // 前方向を計算
      const direction = FixedVector3.fromBDS(this.player.getViewDirection()).normalize();

      // プレイヤーにベクトルを適用
      this.player.applyKnockback({
        x: direction.x * world.getDynamicProperty('FAST_STRAIGHT.HORIZONTAL_MULTIPLIER'),
        z: direction.z * world.getDynamicProperty('FAST_STRAIGHT.HORIZONTAL_MULTIPLIER')
      }, world.getDynamicProperty('FAST_STRAIGHT.VERTICAL_MULTIPLIER'));

      // ジャンプが終わるまでループ処理
      this.isThenFastStraight = true;
      const jumpingInterval = system.runInterval(() => {
        if (this.player.isOnGround) {
          this.isThenFastStraight = false;
          this.waitFastStraight = false;
          this.isThenAirRefraction = false;
          this.waitAirRefractionTicks = world.getDynamicProperty('AIR_REFRACTION.WAIT_TICKS');
          system.clearRun(jumpingInterval);
        } else {
          if (world.getDynamicProperty('AIR_REFRACTION.ENABLED')) {
            const { y: newYaw } = this.player.getRotation();
            var diff = Math.abs(yaw - newYaw) % 360;
            if (diff > 180) diff = 360 - diff;
            if (--this.waitAirRefractionTicks == 0 && !this.isThenAirRefraction && diff >= world.getDynamicProperty('AIR_REFRACTION.ANGLE')) {
              // プレイヤーにベクトルを適用
              const dirV = FixedVector3.fromBDS(this.player.getViewDirection()).normalize();
              this.player.applyImpulse({
                x: dirV.x * world.getDynamicProperty('AIR_REFRACTION.MULTIPLIER'),
                y: 0,
                z: dirV.z * world.getDynamicProperty('AIR_REFRACTION.MULTIPLIER')
              });
              this.isThenAirRefraction = true;
            }
          }
        }
      });

      // 空腹度の変更
      this.setFood(currentHunger - world.getDynamicProperty('FAST_STRAIGHT.COST_FOOD'));

      // ティックごとの満腹度回復処理
      const foodInterval = system.runInterval(() => {
        if (this.getFood() >= 20) {
          system.clearRun(foodInterval);
        } else {
          const currentFood = this.getFood();
          this.setFood(currentFood + world.getDynamicProperty('FAST_STRAIGHT.RECOVERY_FOOD'));
        }
      });
    }
  }
}

//====起動処理====

// プレイヤーがサーバーに参加した時の処理
world.afterEvents.playerSpawn.subscribe((event) => {

  // ラッパークラスへの登録
  if (event.initialSpawn) {
    WrappedPlayer.join(event.player);
  }
});

// プレイヤーがサーバーから退出した時の処理
world.afterEvents.playerLeave.subscribe((event) => {

  // ラッパークラスの登録解除
  WrappedPlayer.quit(event.playerId);
});

// 毎tick（20分の1秒）でプレイヤーの入力状態をチェック
system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (world.getDynamicProperty('WALL_BOUNCE.ENABLED')) WrappedPlayer.get(player)?.performWallBounce();
    if (world.getDynamicProperty('FAST_STRAIGHT.ENABLED')) WrappedPlayer.get(player)?.performFastStraight();
  }
}, 1);
