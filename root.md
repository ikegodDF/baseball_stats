baseball_stats/
├── backend/ # Node.js + Express + MySQL
│ ├── src/
│ │ ├── controllers/ # API のロジック
│ │ ├── routes/ # ルーティング定義
│ │ ├── models/ # DB の操作・ORM や SQL
│ │ ├── config/ # DB 接続などの設定
│ │ ├── services/ # 業務ロジック層（必要に応じて）
│ │ └── app.js # Express アプリ本体
│ ├── public/ # 静的ファイル（画像など）
│ ├── scripts/ # マイグレーションやデータ投入など
│ ├── .env # 環境変数（DB 設定など）
│ ├── package.json
│ └── README.md
│
├── frontend/ # React プロジェクト（create-react-app 等）
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ ├── services/ # API 呼び出し用コード
│ │ └── App.jsx
│ ├── .env # API の URL など
│ ├── package.json
│ └── README.md
│
├── data/ # CSV、画像などの学習/初期データ
├── README.md
