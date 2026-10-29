# Gemini Pipe

URLの`?q=`に書いた質問文をGeminiの入力欄に入れて送信する、Chromium系のブラウザの拡張機能。Geminiを検索エンジンとしてブラウザに登録すると、アドレスバーからGeminiに質問できる。

## インストール

1. このリポジトリをcloneするか、ZIPでダウンロードして展開する
2. Chromeでは`chrome://extensions`を開き、「デベロッパー モード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」を押し、`manifest.json`のあるフォルダを選択する

## 使い方

```
https://gemini.google.com/app?q=質問文
https://gemini.google.com/app?q=質問文&mode=pro
https://gemini.google.com/app?mode=thinking
https://gemini.google.com/app?q=質問文&window=1
```

| パラメータ | 動作 |
|---|---|
| `q` | 質問文を入力欄に入れて送信する |
| `mode` | モードのメニューで、値の文字列を含む項目を選択する。`flash`は`高速`、`thinking`は`思考`、`pro`は`Pro`を含む項目を選択する |
| `window` | `1`のとき、新しいウィンドウで開き直し、元のタブを閉じる |

どのパラメータも省略できる。`mode`だけを付けると、モードを選択し、送信はしない。GemのページのURLにも付けられる。

アドレスバーから質問するには、ブラウザの設定で、URLが`https://gemini.google.com/app?q=%s`の検索エンジンを追加する。

## 注意

- 拡張機能はGeminiの画面を操作するだけで、APIキーは不要
- `q`の付いたURLを開くと、確認なしで送信する。他人が作ったリンクを開いた場合も、リンクに書かれた質問文が自分のアカウントから送信される
- `flash`と`thinking`で選択する`高速`と`思考`は、Geminiの表示言語が日本語のときの項目名。ほかの言語の画面では、メニューの項目名をそのまま`mode`に書く
- Geminiの画面の構造に依存するため、Geminiの画面が変わると動かなくなることがある。入力欄が10秒以内に現れないときは何もしない
- 裏のタブで開くと、タブを表示するまで入力と送信を待つ

## アンインストール

`chrome://extensions`でGemini Pipeの「削除」を押す。

## ライセンス

[MIT License](LICENSE)
