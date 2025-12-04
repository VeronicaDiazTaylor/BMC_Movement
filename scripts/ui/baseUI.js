import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

/**
 * @minecraft/server-uiを使用したUIを作成するための抽象ベースクラス
 * 各種UIフォーム（ActionForm、ModalForm、MessageForm）の共通機能を提供
 */
export class BaseUI {
  constructor() {
    if (new.target === BaseUI) {
      throw new Error("BaseUIは抽象クラスです。直接インスタンス化することはできません。");
    }

    /** @type {ActionFormData|ModalFormData|MessageFormData} */
    this.form = null;
    this.title = "";
    this.body = "";
    this.elements = [];
    this.callbacks = new Map();
  }

  /**
   * UIのタイトルを設定
   * @param {string} title - UIのタイトル
   * @returns {BaseUI} チェーン可能なインスタンス
   */
  setTitle(title) {
    this.title = title;
    if (this.form && typeof this.form.title === "function") {
      this.form.title(title);
    }
    return this;
  }

  /**
   * UIのボディテキストを設定
   * @param {string} body - UIのボディテキスト
   * @returns {BaseUI} チェーン可能なインスタンス
   */
  setBody(body) {
    this.body = body;
    if (this.form && typeof this.form.body === "function") {
      this.form.body(body);
    }
    return this;
  }

  /**
   * 要素をUIに追加（子クラスで実装される）
   * @param {Object} element - 追加する要素
   * @returns {BaseUI} チェーン可能なインスタンス
   */
  addElement(element) {
    throw new Error("addElement()メソッドは子クラスで実装する必要があります。");
  }

  /**
   * UIを初期化（子クラスで実装される）
   * @returns {Object} 初期化されたUIオブジェクト
   */
  initializeForm() {
    throw new Error("initializeForm()メソッドは子クラスで実装する必要があります。");
  }

  /**
   * プレイヤーにUIを表示
   * @param {Player} player - UIを表示するプレイヤー
   * @returns {Promise} UI応答のPromise
   */
  async show(player) {
    if (!this.form) {
      this.form = this.initializeForm();
    }

    try {
      const response = await this.form.show(player);
      return this.handleResponse(response, player);
    } catch (error) {
      console.error("UI表示エラー:", error);
      throw error;
    }
  }

  /**
   * UI応答を処理（子クラスでオーバーライド可能）
   * @param {Object} response - UI応答
   * @param {Player} player - UIを送信したプレイヤー
   * @returns {Object} 処理結果
   */
  handleResponse(response, player) {
    if (response.canceled) {
      return { success: false, canceled: true, reason: response.cancelationReason };
    }

    return { success: true, response: response };
  }

  /**
   * イベントコールバックを設定
   * @param {string} event - イベント名
   * @param {Function} callback - コールバック関数
   * @returns {BaseUI} チェーン可能なインスタンス
   */
  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event).push(callback);
    return this;
  }

  /**
   * イベントを発火
   * @param {string} event - イベント名
   * @param {...any} args - イベント引数
   */
  emit(event, ...args) {
    if (this.callbacks.has(event)) {
      this.callbacks.get(event).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`イベント${event}のコールバック実行エラー:`, error);
        }
      });
    }
  }

  /**
   * UIをリセット
   * @returns {BaseUI} チェーン可能なインスタンス
   */
  reset() {
    this.form = null;
    this.elements = [];
    return this;
  }

  /**
   * UIの設定を検証
   * @returns {boolean} 有効かどうか
   */
  validate() {
    if (!this.title.trim()) {
      console.warn("UIにタイトルが設定されていません。");
    }
    return true;
  }
}

/**
 * ActionFormData用のベースクラス
 * ボタンベースのUIを作成するために使用
 */
export class BaseActionUI extends BaseUI {
  constructor() {
    super();
    this.buttons = [];
  }

  initializeForm() {
    const form = new ActionFormData();

    if (this.title) form.title(this.title);
    if (this.body) form.body(this.body);

    this.buttons.forEach(button => {
      form.button(button.text, button.iconPath);
    });

    return form;
  }

  addElement(button) {
    this.buttons.push(button);
    return this;
  }

  handleResponse(response, player) {
    const baseResult = super.handleResponse(response, player);

    if (!baseResult.success) {
      return baseResult;
    }

    const buttonIndex = response.selection;
    const selectedButton = this.buttons[buttonIndex];

    if (selectedButton && selectedButton.callback) {
      try {
        selectedButton.callback(player, buttonIndex);
      } catch (error) {
        console.error("ボタンコールバック実行エラー:", error);
      }
    }

    this.emit('buttonClick', player, buttonIndex, selectedButton);

    return {
      success: true,
      buttonIndex: buttonIndex,
      button: selectedButton
    };
  }
}

/**
 * ModalFormData用のベースクラス  
 * 入力フィールドを持つUIを作成するために使用
 */
export class BaseModalUI extends BaseUI {
  constructor() {
    super();
    this.fields = [];
  }

  initializeForm() {
    const form = new ModalFormData();

    if (this.title) form.title(this.title);

    this.fields.forEach(field => {
      switch (field.type) {
        case 'textField':
          form.textField(field.label, String(field.placeholderText), {'defaultValue': String(field.defaultValue)});
          break;
        case 'dropdown':
          form.dropdown(field.label, field.options, {'defaultValueIndex': field.defaultValueIndex});
          break;
        case 'slider':
          form.slider(field.label, field.minimumValue, field.maximumValue, {'valueStep': field.valueStep, 'defaultValue': field.defaultValue});
          break;
        case 'toggle':
          form.toggle(field.label, {'defaultValue': field.defaultValue});
          break;
      }
    });

    return form;
  }

  addElement(field) {
    this.fields.push(field);
    return this;
  }

  handleResponse(response, player) {
    const baseResult = super.handleResponse(response, player);

    if (!baseResult.success) {
      return baseResult;
    }

    const formValues = response.formValues;
    const processedValues = {};

    this.fields.forEach((field, index) => {
      processedValues[field.name || `field_${index}`] = formValues[index];
    });

    this.emit('submit', player, processedValues);

    return {
      success: true,
      values: processedValues,
      rawValues: formValues
    };
  }
}

/**
 * MessageFormData用のベースクラス
 * メッセージとボタン（通常は2個）を表示するために使用
 */
export class BaseMessageUI extends BaseUI {
  constructor() {
    super();
    this.button1Text = "";
    this.button2Text = "";
    this.button1Callback = null;
    this.button2Callback = null;
  }

  initializeForm() {
    const form = new MessageFormData();

    if (this.title) form.title(this.title);
    if (this.body) form.body(this.body);
    if (this.button1Text) form.button1(this.button1Text);
    if (this.button2Text) form.button2(this.button2Text);

    return form;
  }

  setButton1(text, callback = null) {
    this.button1Text = text;
    this.button1Callback = callback;
    return this;
  }

  setButton2(text, callback = null) {
    this.button2Text = text;
    this.button2Callback = callback;
    return this;
  }

  addElement() {
    throw new Error("MessageUIではaddElement()は使用できません。setButton1()またはsetButton2()を使用してください。");
  }

  handleResponse(response, player) {
    const baseResult = super.handleResponse(response, player);

    if (!baseResult.success) {
      return baseResult;
    }

    const selection = response.selection;
    const callback = selection === 0 ? this.button1Callback : this.button2Callback;

    if (callback) {
      try {
        callback(player, selection);
      } catch (error) {
        console.error("ボタンコールバック実行エラー:", error);
      }
    }

    this.emit('buttonClick', player, selection);

    return {
      success: true,
      selection: selection,
      buttonText: selection === 0 ? this.button1Text : this.button2Text
    };
  }
}
