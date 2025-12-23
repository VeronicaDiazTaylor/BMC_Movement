# BMC_Movement
BowyersMCの一部キャラコンを実装したビヘイビアーパック。  
基本的なものから詳細な点まで自由に設定できるようにしています。
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2e4aa95d-274a-40b7-bb19-04d81fd48c68" />
  <br /><br />


## 機能
- 壁ジャンプ (WallBounce)
- ファストストレート (FastStraight)
- エアリフラクション (AirRefraction)
- アップドラフト (Updraft)
- エアカーブ (AirCurve)

エアストレイフは現在、ScriptAPIのみでプレイヤーの入力検知ができないため、実装していません。    
  <br />

## 導入方法
1. Releasesより最新の*.mcpackをダウンロード
2. Minecraftを開かずに、*.mcpackをダブルクリックしてインポート
3. 追加したいワールドの編集ボタンをクリック
4. 必要な方はここで念のためワールドのバックアップを複製で取っておいてください
5. 左のメニューの「実験的機能/Experimental」をクリック
6. 「ベータAPI」を有効化
7. ビヘイビアーパック項目から「BMC_Movement」を認証
<br />

## 設定方法
1. クリエイティブに変更
2. ネザースターをホットバーに追加
3. ネザースターを右クリック
4. UIの指示に従って設定

スニークしながらネザースターを使うことで設定の初期化ができます。  
  
<br />

## 更新予定とサポートについて
- [x] 統合版バージョンアップの対応 (manifest.jsonの更新) 
- [x] ダイヤモンドブロック (AirCurve / エアカーブ) (対象ブロック可変)
- [x] エメラルドブロック (Updraft / アップドラフト) (対象ブロック可変)
- [x] [ScriptAPIの開発支援フレームワーク"Keystone"](https://github.com/XxPMMPERxX/Keystone)へのソースコードリファクタリング
