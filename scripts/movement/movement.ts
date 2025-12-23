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
import { Block, Player } from '@minecraft/server';

export abstract class Movement {
  protected static WALL_BOUNCE_FLAG = 'bmc_movement:wall_bounce';
  protected static FAST_STRAIGHT_FLAG = 'bmc_movement:fast_straight';
  protected static AIR_REFRACTION_FLAG = 'bmc_movement:air_refraction';
  protected static UPDRAFT_FLAG = 'bmc_movement:updraft';

  /**
   * 処理
   * @param player
   * @returns {void}
   */
  abstract onActivate(player: Player): void;

  /**
   * ブロック判定
   * @param block 
   * @returns {boolean}
   */
  abstract isCanHandleBlock(block: Block): boolean;

  /**
   * 設定の取得
   * @returns {Record<string, unknown>}
   */
  abstract fetchSettings(): Record<string, unknown>;

  isGlass(block: Block): boolean {
    return /glass(_pane)?$/.test(block.typeId);
  }

  isStairs(block: Block): boolean {
      return /_stairs$/.test(block.typeId);
  }

  isSlab(block: Block): boolean {
      return /_slab$/.test(block.typeId);
  }

  isFence(block: Block): boolean {
      return /_fence$/.test(block.typeId);
  }

  isWall(block: Block): boolean {
      return /_wall$/.test(block.typeId);
  }

  isDoor(block: Block): boolean {
      return /_door$/.test(block.typeId);
  }

  isLeaves(block: Block): boolean {
      return /_leaves$/.test(block.typeId);
  }
}
