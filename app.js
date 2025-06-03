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