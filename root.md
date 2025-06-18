baseball_stats/
├── backend/ # Node.js + Express + MySQL を用いたバックエンド
│ ├── src/
│ │ ├── controllers/ # API のロジック（例：GET/POST リクエストの処理）
│ │ ├── routes/ # ルーティング定義（URL ごとのコントローラ接続）
│ │ ├── models/ # DB の操作・ORM や SQL（例：Sequelize モデル）
│ │ ├── config/ # DB 接続などの設定（例：DB 接続情報、CORS 設定）
│ │ ├── services/ # 業務ロジック層（必要に応じて）ビジネスルールを管理
│ │ └── app.js # Express アプリ本体（エントリポイント）
│ ├── public/ # 静的ファイル（画像など）API 経由で配信したいファイル
│ ├── scripts/ # マイグレーションやデータ投入などを行うスクリプト群
│ ├── .env # 環境変数（DB 設定など、dotenv パッケージで読み込む）
│ ├── package.json # バックエンド依存関係とスクリプト
│ └── README.md # バックエンドの概要やセットアップ手順
│
├── frontend/ # React プロジェクト（create-react-app 等）
│ ├── public/ # 静的ファイル（index.html など）
│ ├── src/
│ │ ├── components/ # UI 部品（ボタンや表など再利用可能なパーツ）
│ │ ├── pages/ # 各画面コンポーネント（例：ホーム、詳細ページなど）
│ │ ├── hooks/ # カスタムフック（例：useFetch や useToggle など）
│ │ ├── services/ # API 呼び出し用コード（例：axios を使った通信処理）
│ │ └── App.jsx # ルーティングなど全体構成のエントリポイント
│ ├── .env # API の URL など（環境に応じて変える）
│ ├── package.json # フロントエンド依存関係とスクリプト
│ └── README.md # フロントエンドの概要や使い方
│
├── data/ # CSV、画像などの学習/初期データ（例：初期試合データ、選手情報）
├── README.md # プロジェクト全体の説明や使い方（トップレベルの README）
