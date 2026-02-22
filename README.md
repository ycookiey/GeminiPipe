# Gemini Pipe

URLパラメータ `?q=` で Gemini の入力欄に質問文を自動入力するブラウザ拡張機能。

## 使い方

```
https://gemini.google.com/app?q=質問文をここに書く
https://gemini.google.com/app?q=質問文&mode=flash
https://gemini.google.com/app?q=質問文&mode=thinking
https://gemini.google.com/app?q=質問文&mode=pro
```

| パラメータ | 説明 |
|---|---|
| `q` | 質問文（必須）。自動入力・自動送信される |
| `mode` | エイリアス（`flash`/`thinking`/`pro`）またはメニュー項目テキストの部分文字列 |
| `window` | `1` で新しいウィンドウで開く |

## インストール（Vivaldi）

1. `vivaldi://extensions` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択

## ファイル構成

```
manifest.json    Manifest V3 設定
content.js       URLパラメータを読み取り入力欄に自動入力するスクリプト
background.js    新しいウィンドウで開くための Service Worker
```