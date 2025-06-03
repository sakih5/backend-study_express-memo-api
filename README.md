# Express 入門してみた

※ フレームワークとライブラリの違いも分からない人間が、Expressをかじってみた試行錯誤の記録です。

## Expressとは？

ExpressはNode.jsのための高速・軽量なWebフレームワークである。

WebアプリケーションやAPIを構築するためのメソッドやプラグインが豊富※な**npmパッケージ**と言える。

※具体的には、以下の実装をラクにできる。

- Web APIの作成
- HTTPリクエストを受けるサーバーの起動 など

## フレームワークとライブラリの違い

ざっくり

- **フレームワーク**
  - アプリ全体の「流れ」や「構成」が決まっているもの
  - コードを書くべき場所に差し込む
  - 自由度が少ない分、速い

- **ライブラリ**
  - 「この機能だけ使いたい」という部品
  - 自分で組み立てる
  - 自由度が高い分、保守性が低い

である。

詳細な比較を以下に表で示す。

| 比較軸   | フレームワーク                            | ライブラリ                    |
| ----- | ---------------------------------- | ------------------------ |
| 主導権 | フレームワークが持つ | 開発者が持つ |
| スケール | アプリ全体の構造・流れを提供 | 特定の機能を提供 |
| 学習コスト | 高め（設計や流れに従う必要あり） | 低め（必要なときにだけ使えばOK）|
| 拡張性 | 柔軟に拡張できるが、流れに従う必要がある | 必要な機能だけ選んで柔軟に使える |
| 保守性 | 統一された構成で保守しやすい | ライブラリの組み合わせ次第で構成がバラバラになる |
| 自由度 | 制限あり（フレームワークのルールがある） | 高い（好きなように組み合わせ可能）|
| スピード感 | 最初のセットアップは早いことが多い | 自分で構築するため初期構築は手間がかかる |

## 初め方

1. 前提: Node.jsとnpmはインストール済であること

2. アプリ開発をするディレクトリに移動して、プロジェクト初期化

    ```bash
    cd express-memo-api
    npm init -y
    ```

3. Expressをインストールする

    ```bash
    npm install express
    ```

4. `app.js`という名前のファイルを作成して、以下の内容を貼り付ける

    ```javascript
    // express関数をインスタンス化して初期設定されたオブジェクトを取得
    const express = require('express');
    const app = express();
    const PORT = 3000;

    // JSON形式のリクエストボディを読み取れるようにする
    app.use(express.json());

    // メモのデータ（メモリ上に保持）
    let memos = [];
    let nextId = 1;

    // メモ一覧取得のAPI定義
    app.get('/memos', (req, res) => {
      res.json(memos);
    });

    // メモ追加のAPI定義
    app.post('/memos', (req, res) => {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'text is required' });
      }

      const memo = { id: nextId++, text };
      memos.push(memo);
      res.status(201).json(memo);
    });

    // メモ削除のAPI定義
    app.delete('/memos/:id', (req, res) => {
      const id = parseInt(req.params.id);
      memos = memos.filter((memo) => memo.id !== id);
      res.status(204).send(); // No Content
    });

    // サーバー起動
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    ```

    コードの説明:

    - `memos`に辞書のリストが入る。各辞書は`{ id: 数値, text: 文字列 }`という構造。
    - `GET /memos`というAPIで`memos`が取得できる
    - `POST /memos`というAPIで`memos`にXXXというメモが追加される
    - `memos`の情報はメモリ（RAM）上にあるだけで、ファイルやDBに保存してないので、サーバーを再起動すると消える
    - スクリプトの最後に`listen()`を書くことで、サーバーを起動してリクエストを受け付ける状態にすることができる

5. 動作確認

    - 以下コマンドを実行。`Server running on http://localhost:3000`と出ればサーバーの立ち上げに成功している

        ```bash
        node app.js
        ```

    - <https://hoppscotch.io/>にアクセス。これはオープンソースでAPIのテストができるサイトである
    - (初回のみ)hoppscotchのサイト上で`GET`を選択し、`http://localhost:3000/memos`と入力すると、ネットワークエラーが出る → chrome拡張機能をインストールすると消える
    - GET /memos の動作確認
      - メソッド：GET
      - URL：<http://localhost:3000/memos>
      - [Send] を押すと memos の中身が表示される
      - ステータスが200となっていれば成功
    - POST /memos の動作確認
      - メソッド：POST
      - URL：<http://localhost:3000/memos>
      - 「Body」タブ → コンテンツタイプ：`application/json` を選ぶ
      - 生のリクエストボディに以下を追加

        ```json
        {
          "text": "買い物リスト"
        }
        ```

      - 「Header」タブ → Key：`content-type`、値：`application/json` を追加
      - 送信ボタン [Send] を押すと、新しいメモが作られてレスポンスボディにJSONが返ってくる
      - ステータスが201となっていれば成功
    - DELETE /memos/1 の動作確認
      - メソッド：DELETE
      - URL：<http://localhost:3000/memos/1>
      - [Send] を押すと idが1の辞書が削除される
      - ステータスが204となっていれば成功

## 補足1 ブラウザを使った動作確認

今回、データはJSON形式で授受するため、クエリパラメータ（URLの後に`?キー=値&キー=値`というように打ち込むもの）ではなく、リクエストの本文（リクエストボディ）に入れ込む必要がある。

→ そのため、ブラウザ上でPOSTのAPIの動作確認はできない。

※ただし、ターミナル上でコマンドで確認することはできる。補足2で後述

## 補足2 コマンドを使った動作確認

`curl`を使う。`curl`は、コマンドラインからHTTPリクエストを送るツール。

curlの基本構文: `curl [オプション] URL`

- GET /memos の確認

    ```bash
    curl http://localhost:3000/memos
    ```

  - curl のデフォルトは GET のため、`-X GET`は省略でOK

- POST /memos の確認

    ```bash
    curl -X POST http://localhost:3000/memos \
    -H "Content-Type: application/json" \
    -d '{"text":"買い物リスト"}'
    ```

  - `-X POST`はPOSTメソッドで送るの意
  - `-H`はヘッダーの指定
  - `-d`は送信するデータ（JSON文字列）

- DELETE /memos/1 の確認

    ```bash
    curl -X DELETE http://localhost:3000/memos/1
    ```

## 感想

- APIの構築はExpressを使えば簡単にできる。APIの中身の処理を外部ファイルに切り出すなど挑戦していきたい
- Express自体使うのはそんなに大変ではないが、動作確認が今回のタスクの半分以上を占めた。動作確認することで始めてAPIへの理解が深まった
- JSON形式でデータの授受をしようとすると、クエリパラメータにベタ打ちでなくなるということを初めて知った
