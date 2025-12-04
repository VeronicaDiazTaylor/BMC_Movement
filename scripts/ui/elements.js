/**
 * @minecraft/server-ui用の様々なUI要素クラス
 * BaseFormクラスと組み合わせて使用することで、再利用可能なUI要素を提供
 */

/**
 * ボタン要素クラス
 * ActionForm用のボタンを表現
 */
export class Button {
    constructor(text, iconPath = null, callback = null) {
        this.text = text;
        this.iconPath = iconPath;
        this.callback = callback;
        this.enabled = true;
        this.data = {};
    }

    /**
     * ボタンのテキストを設定
     * @param {string} text - ボタンテキスト
     * @returns {Button} チェーン可能なインスタンス
     */
    setText(text) {
        this.text = text;
        return this;
    }

    /**
     * ボタンのアイコンを設定
     * @param {string} iconPath - アイコンのパス
     * @returns {Button} チェーン可能なインスタンス
     */
    setIcon(iconPath) {
        this.iconPath = iconPath;
        return this;
    }

    /**
     * ボタンのクリックコールバックを設定
     * @param {Function} callback - コールバック関数
     * @returns {Button} チェーン可能なインスタンス
     */
    onClick(callback) {
        this.callback = callback;
        return this;
    }

    /**
     * ボタンの有効/無効を設定
     * @param {boolean} enabled - 有効かどうか
     * @returns {Button} チェーン可能なインスタンス
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }

    /**
     * ボタンにカスタムデータを設定
     * @param {string} key - データキー
     * @param {any} value - データ値
     * @returns {Button} チェーン可能なインスタンス
     */
    setData(key, value) {
        this.data[key] = value;
        return this;
    }

    /**
     * ボタンからカスタムデータを取得
     * @param {string} key - データキー
     * @returns {any} データ値
     */
    getData(key) {
        return this.data[key];
    }
}

/**
 * テキストフィールド要素クラス
 * ModalForm用のテキスト入力フィールドを表現
 */
export class TextField {
    constructor(name, label, placeholderText = "", defaultValue = undefined) {
        this.type = "textField";
        this.name = name;
        this.label = label;
        this.placeholderText = placeholderText;
        this.defaultValue = defaultValue;
        this.validators = [];
        this.required = false;
    }

    /**
     * プレースホルダーテキストを設定
     * @param {string} text - プレースホルダーテキスト
     * @returns {TextField} チェーン可能なインスタンス
     */
    setPlaceholder(text) {
        this.placeholderText = text;
        return this;
    }

    /**
     * デフォルト値を設定
     * @param {string} value - デフォルト値
     * @returns {TextField} チェーン可能なインスタンス
     */
    setDefaultValue(value) {
        this.defaultValue = value;
        return this;
    }

    /**
     * 必須フィールドに設定
     * @param {boolean} required - 必須かどうか
     * @returns {TextField} チェーン可能なインスタンス
     */
    setRequired(required = true) {
        this.required = required;
        return this;
    }

    /**
     * バリデータを追加
     * @param {Function} validator - バリデータ関数
     * @returns {TextField} チェーン可能なインスタンス
     */
    addValidator(validator) {
        this.validators.push(validator);
        return this;
    }

    /**
     * 値を検証
     * @param {string} value - 検証する値
     * @returns {Object} 検証結果
     */
    validate(value) {
        if (this.required && (!value || value.trim() === "")) {
            return { valid: false, message: `${this.label}は必須項目です。` };
        }

        for (const validator of this.validators) {
            const result = validator(value);
            if (!result.valid) {
                return result;
            }
        }

        return { valid: true };
    }
}

/**
 * ドロップダウン要素クラス
 * ModalForm用のドロップダウン選択を表現
 */
export class Dropdown {
    constructor(name, label, options = [], defaultValueIndex = 0) {
        this.type = "dropdown";
        this.name = name;
        this.label = label;
        this.options = options;
        this.defaultValueIndex = defaultValueIndex;
        this.optionData = new Map();
    }

    /**
     * オプションを追加
     * @param {string} text - オプションテキスト
     * @param {any} data - オプションに関連付けるデータ
     * @returns {Dropdown} チェーン可能なインスタンス
     */
    addOption(text, data = null) {
        const index = this.options.length;
        this.options.push(text);
        if (data !== null) {
            this.optionData.set(index, data);
        }
        return this;
    }

    /**
     * 複数のオプションを一度に設定
     * @param {Array} options - オプションの配列
     * @returns {Dropdown} チェーン可能なインスタンス
     */
    setOptions(options) {
        this.options = [...options];
        return this;
    }

    /**
     * デフォルト選択インデックスを設定
     * @param {number} index - デフォルトインデックス
     * @returns {Dropdown} チェーン可能なインスタンス
     */
    setDefaultIndex(index) {
        this.defaultValueIndex = Math.max(0, Math.min(index, this.options.length - 1));
        return this;
    }

    /**
     * 特定のオプションのデータを取得
     * @param {number} index - オプションインデックス
     * @returns {any} オプションデータ
     */
    getOptionData(index) {
        return this.optionData.get(index);
    }

    /**
     * 選択されたオプションのテキストを取得
     * @param {number} selectedIndex - 選択されたインデックス
     * @returns {string} オプションテキスト
     */
    getSelectedText(selectedIndex) {
        return this.options[selectedIndex] || "";
    }
}

/**
 * スライダー要素クラス
 * ModalForm用のスライダーを表現
 */
export class Slider {
    constructor(name, label, minimumValue = 0, maximumValue = 100, valueStep = 1, defaultValue = 0) {
        this.type = "slider";
        this.name = name;
        this.label = label;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
        this.valueStep = valueStep;
        this.defaultValue = Math.max(minimumValue, Math.min(defaultValue, maximumValue));
        this.formatValue = null;
    }

    /**
     * 最小値を設定
     * @param {number} min - 最小値
     * @returns {Slider} チェーン可能なインスタンス
     */
    setMinimum(min) {
        this.minimumValue = min;
        this.defaultValue = Math.max(min, this.defaultValue);
        return this;
    }

    /**
     * 最大値を設定
     * @param {number} max - 最大値
     * @returns {Slider} チェーン可能なインスタンス
     */
    setMaximum(max) {
        this.maximumValue = max;
        this.defaultValue = Math.min(max, this.defaultValue);
        return this;
    }

    /**
     * ステップ値を設定
     * @param {number} step - ステップ値
     * @returns {Slider} チェーン可能なインスタンス
     */
    setStep(step) {
        this.valueStep = Math.max(0.1, step);
        return this;
    }

    /**
     * デフォルト値を設定
     * @param {number} value - デフォルト値
     * @returns {Slider} チェーン可能なインスタンス
     */
    setDefaultValue(value) {
        this.defaultValue = Math.max(this.minimumValue, Math.min(value, this.maximumValue));
        return this;
    }

    /**
     * 値のフォーマット関数を設定
     * @param {Function} formatter - フォーマット関数
     * @returns {Slider} チェーン可能なインスタンス
     */
    setValueFormatter(formatter) {
        this.formatValue = formatter;
        return this;
    }

    /**
     * 値をフォーマット
     * @param {number} value - フォーマットする値
     * @returns {string} フォーマット済みの値
     */
    formatDisplayValue(value) {
        return this.formatValue ? this.formatValue(value) : value.toString();
    }
}

/**
 * トグル要素クラス
 * ModalForm用のトグルスイッチを表現
 */
export class Toggle {
    constructor(name, label, defaultValue = false) {
        this.type = "toggle";
        this.name = name;
        this.label = label;
        this.defaultValue = defaultValue;
        this.onChangeCallback = null;
    }

    /**
     * デフォルト値を設定
     * @param {boolean} value - デフォルト値
     * @returns {Toggle} チェーン可能なインスタンス
     */
    setDefaultValue(value) {
        this.defaultValue = Boolean(value);
        return this;
    }

    /**
     * 変更時のコールバックを設定
     * @param {Function} callback - コールバック関数
     * @returns {Toggle} チェーン可能なインスタンス
     */
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
}

/**
 * テキスト表示要素クラス
 * 読み取り専用のテキスト表示用（ActionFormのbodyとして使用）
 */
export class TextDisplay {
    constructor(text = "", formatting = {}) {
        this.text = text;
        this.formatting = {
            color: null,
            bold: false,
            italic: false,
            ...formatting
        };
    }

    /**
     * テキストを設定
     * @param {string} text - 表示テキスト
     * @returns {TextDisplay} チェーン可能なインスタンス
     */
    setText(text) {
        this.text = text;
        return this;
    }

    /**
     * テキストを追加
     * @param {string} text - 追加するテキスト
     * @returns {TextDisplay} チェーン可能なインスタンス
     */
    appendText(text) {
        this.text += text;
        return this;
    }

    /**
     * 新しい行を追加
     * @param {string} text - 新しい行のテキスト
     * @returns {TextDisplay} チェーン可能なインスタンス
     */
    addLine(text = "") {
        this.text += "\n" + text;
        return this;
    }

    /**
     * テキストの色を設定
     * @param {string} color - テキストの色
     * @returns {TextDisplay} チェーン可能なインスタンス
     */
    setColor(color) {
        this.formatting.color = color;
        return this;
    }

    /**
     * テキストを太字に設定
     * @param {boolean} bold - 太字かどうか
     * @returns {TextDisplay} チェーン可能なインスタンス
     */
    setBold(bold = true) {
        this.formatting.bold = bold;
        return this;
    }

    /**
     * テキストを斜体に設定
     * @param {boolean} italic - 斜体かどうか
     * @returns {TextDisplay} チェーン可能なインスタンス
     */
    setItalic(italic = true) {
        this.formatting.italic = italic;
        return this;
    }

    /**
     * フォーマット済みのテキストを取得
     * @returns {string} フォーマット済みテキスト
     */
    getFormattedText() {
        let formattedText = this.text;
        
        if (this.formatting.bold) {
            formattedText = `**${formattedText}**`;
        }
        
        if (this.formatting.italic) {
            formattedText = `*${formattedText}*`;
        }
        
        if (this.formatting.color) {
            formattedText = `§${this.formatting.color}${formattedText}§r`;
        }
        
        return formattedText;
    }
}

/**
 * 区切り線要素クラス
 * テキスト表示での視覚的区切りを提供
 */
export class Separator {
    constructor(character = "-", length = 20) {
        this.character = character;
        this.length = length;
    }

    /**
     * 区切り線の文字を設定
     * @param {string} character - 区切り線文字
     * @returns {Separator} チェーン可能なインスタンス
     */
    setCharacter(character) {
        this.character = character;
        return this;
    }

    /**
     * 区切り線の長さを設定
     * @param {number} length - 区切り線の長さ
     * @returns {Separator} チェーン可能なインスタンス
     */
    setLength(length) {
        this.length = Math.max(1, length);
        return this;
    }

    /**
     * 区切り線テキストを取得
     * @returns {string} 区切り線テキスト
     */
    getText() {
        return this.character.repeat(this.length);
    }
}

/**
 * リスト表示要素クラス
 * 項目リストの表示を管理
 */
export class ListDisplay {
    constructor(items = [], listType = "bullet") {
        this.items = items;
        this.listType = listType; // "bullet", "numbered", "none"
        this.indentLevel = 0;
    }

    /**
     * 項目を追加
     * @param {string} item - リスト項目
     * @returns {ListDisplay} チェーン可能なインスタンス
     */
    addItem(item) {
        this.items.push(item);
        return this;
    }

    /**
     * 複数の項目を一度に追加
     * @param {Array} items - リスト項目の配列
     * @returns {ListDisplay} チェーン可能なインスタンス
     */
    addItems(items) {
        this.items.push(...items);
        return this;
    }

    /**
     * リストタイプを設定
     * @param {string} type - リストタイプ（"bullet", "numbered", "none"）
     * @returns {ListDisplay} チェーン可能なインスタンス
     */
    setListType(type) {
        this.listType = type;
        return this;
    }

    /**
     * インデントレベルを設定
     * @param {number} level - インデントレベル
     * @returns {ListDisplay} チェーン可能なインスタンス
     */
    setIndentLevel(level) {
        this.indentLevel = Math.max(0, level);
        return this;
    }

    /**
     * フォーマット済みのリストテキストを取得
     * @returns {string} フォーマット済みリストテキスト
     */
    getFormattedText() {
        const indent = "  ".repeat(this.indentLevel);
        
        return this.items.map((item, index) => {
            let prefix = "";
            
            switch (this.listType) {
                case "bullet":
                    prefix = "• ";
                    break;
                case "numbered":
                    prefix = `${index + 1}. `;
                    break;
                case "none":
                default:
                    prefix = "";
                    break;
            }
            
            return `${indent}${prefix}${item}`;
        }).join("\n");
    }

    /**
     * リストをクリア
     * @returns {ListDisplay} チェーン可能なインスタンス
     */
    clear() {
        this.items = [];
        return this;
    }
}

/**
 * バリデーションヘルパークラス
 * 入力フィールド用の一般的なバリデーション機能を提供
 */
export class ValidationHelpers {
    /**
     * 必須チェックバリデーター
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static required(message = "この項目は必須です。") {
        return (value) => {
            const isValid = value && value.trim() !== "";
            return { valid: isValid, message: isValid ? "" : message };
        };
    }

    /**
     * 最小長チェックバリデーター
     * @param {number} minLength - 最小長
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static minLength(minLength, message = `最低${minLength}文字必要です。`) {
        return (value) => {
            const isValid = !value || value.length >= minLength;
            return { valid: isValid, message: isValid ? "" : message };
        };
    }

    /**
     * 最大長チェックバリデーター
     * @param {number} maxLength - 最大長
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static maxLength(maxLength, message = `最大${maxLength}文字まで入力可能です。`) {
        return (value) => {
            const isValid = !value || value.length <= maxLength;
            return { valid: isValid, message: isValid ? "" : message };
        };
    }

    /**
     * 数値チェックバリデーター
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static numeric(message = "数値を入力してください。") {
        return (value) => {
            const isValid = !value || !isNaN(Number(value));
            return { valid: isValid, message: isValid ? "" : message };
        };
    }

    /**
     * 整数チェックバリデーター
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static integer(message = "整数を入力してください。") {
        return (value) => {
            const isValid = !value || (Number.isInteger(Number(value)) && !value.includes("."));
            return { valid: isValid, message: isValid ? "" : message };
        };
    }

    /**
     * 範囲チェックバリデーター
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static range(min, max, message = `${min}から${max}の範囲で入力してください。`) {
        return (value) => {
            if (!value) return { valid: true, message: "" };
            const numValue = Number(value);
            const isValid = !isNaN(numValue) && numValue >= min && numValue <= max;
            return { valid: isValid, message: isValid ? "" : message };
        };
    }

    /**
     * 正規表現チェックバリデーター
     * @param {RegExp} pattern - 正規表現パターン
     * @param {string} message - エラーメッセージ
     * @returns {Function} バリデーター関数
     */
    static pattern(pattern, message = "入力形式が正しくありません。") {
        return (value) => {
            const isValid = !value || pattern.test(value);
            return { valid: isValid, message: isValid ? "" : message };
        };
    }
}
