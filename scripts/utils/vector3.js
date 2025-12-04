export class FixedVector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // ===== 静的生成 =====
  /**
   * ゼロベクトルで生成
   * @return {FixedVector3}
   */
  static zero() {
    return new FixedVector3(0, 0, 0);
  }

  /**
   * BDSの {x, y, z} オブジェクトから生成
   * @param {*} vector
   * @return {FixedVector3}
   */
  static fromBDS(vector) {
    return new FixedVector3(vector.x, vector.y, vector.z);
  }

  /** 
   * PMMPや別形式の {x, y, z} から生成
   * @param {*} obj
   * @return {FixedVector3}
   */
  static fromObject(obj) {
    return new FixedVector3(obj.x, obj.y, obj.z);
  }

  // ===== 基本ゲッター =====
  getX() { return this.x; }
  getY() { return this.y; }
  getZ() { return this.z; }

  getFloorX() { return Math.floor(this.x); }
  getFloorY() { return Math.floor(this.y); }
  getFloorZ() { return Math.floor(this.z); }

  // ===== 演算 =====
  /**
   * 加算
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @return {FixedVector3}
   */
  add(x, y, z) {
    return new FixedVector3(this.x + x, this.y + y, this.z + z);
  }

  /**
   * ベクトル単位での加算
   * @param {*} v
   * @return {FixedVector3}
   */
  addVector(v) {
    return this.add(v.x, v.y, v.z);
  }

  /**
   * 減算
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {FixedVector3}
   */
  subtract(x, y, z) {
    return this.add(-x, -y, -z);
  }

  /**
   * ベクトル単位での減算
   * @param {*} v
   * @return {FixedVector3}
   */
  subtractVector(v) {
    return this.add(-v.x, -v.y, -v.z);
  }

  /**
   * 乗算
   * @param {number} number
   * @return {FixedVector3}
   */
  multiply(number) {
    return new FixedVector3(this.x * number, this.y * number, this.z * number);
  }

  /**
   * 除算
   * @param {number} number
   * @return {FixedVector3}
   */
  divide(number) {
    return new FixedVector3(this.x / number, this.y / number, this.z / number);
  }

  /**
   * ベクトルの内部数値小数点切り上げ
   * @return {FixedVector3}
   */
  ceil() {
    return new FixedVector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
  }

  /**
   * ベクトルの内部数値小数点切り捨て
   * @return {FixedVector3}
   */
  floor() {
    return new FixedVector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }

  /**
   * ベクトルの内部数値小数点四捨五入
   * @param {number} precision
   * @return {FixedVector3}
   */
  round(precision = 0) {
    const factor = Math.pow(10, precision);
    return new FixedVector3(
      Math.round(this.x * factor) / factor,
      Math.round(this.y * factor) / factor,
      Math.round(this.z * factor) / factor
    );
  }

  /**
   * ベクトルの内部数値の絶対値
   * @return {FixedVector3}
   */
  abs() {
    return new FixedVector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }

  /**
   * 指定した2点間のユークリッド距離
   * @param {*} pos 
   * @return {number}
   */
  distance(pos) {
    return Math.sqrt(this.distanceSquared(pos));
  }

  /**
   * 指定した2点間のユークリッド距離の2乗
   * @param {*} pos 
   * @return {number}
   */
  distanceSquared(pos) {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    const dz = this.z - pos.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * ベクトルの長さ
   * @return {number}
   */
  length() {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * ベクトルの長さの2乗
   * @return {number}
   */
  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * 正規化
   * @return {FixedVector3}
   */
  normalize() {
    const len = this.length();
    if (len > 0) {
      return this.divide(len);
    }
    return new FixedVector3(0, 0, 0);
  }

  /**
   * 内積
   * @param {*} v 
   * @return {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * 外積
   * @param {*} v 
   * @return {FixedVector3}
   */
  cross(v) {
    return new FixedVector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * ベクトルの比較
   * @param {*} v 
   * @return {boolean}
   */
  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  /**
   * オブジェクトの数値指定再生成
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @return {FixedVector3}
   */
  withComponents(x, y, z) {
    return new FixedVector3(
      x !== undefined ? x : this.x,
      y !== undefined ? y : this.y,
      z !== undefined ? z : this.z
    );
  }

  // ===== 静的ユーティリティ =====
  static maxComponents(vector, ...vectors) {
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;
    for (const pos of vectors) {
      x = Math.max(x, pos.x);
      y = Math.max(y, pos.y);
      z = Math.max(z, pos.z);
    }
    return new FixedVector3(x, y, z);
  }

  static minComponents(vector, ...vectors) {
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;
    for (const pos of vectors) {
      x = Math.min(x, pos.x);
      y = Math.min(y, pos.y);
      z = Math.min(z, pos.z);
    }
    return new FixedVector3(x, y, z);
  }

  static sum(...vectors) {
    let x = 0, y = 0, z = 0;
    for (const v of vectors) {
      x += v.x;
      y += v.y;
      z += v.z;
    }
    return new FixedVector3(x, y, z);
  }

  // ===== 変換 =====
  /** BDS ScriptAPIで使える {x, y, z} 形式に変換 */
  toBDS() {
    return { x: this.x, y: this.y, z: this.z };
  }

  /** 通常のオブジェクトに変換 */
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  toString() {
    return `Vector3(x=${this.x}, y=${this.y}, z=${this.z})`;
  }
}
