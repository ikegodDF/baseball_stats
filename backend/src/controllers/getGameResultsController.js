// このファイルは試合結果取得APIのビジネスロジック（コントローラー）を記述します。
// 例：DBやjsonからデータを取得し、レスポンスとして返す処理
//
// ここに書くべき内容：
// - リクエストパラメータの取得
// - データ取得処理（DBやjsonファイル）
// - レスポンスの整形と返却
//

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/game_results 用コントローラー
export const getGameResults = async (req, res) => {
  try {
    // data/url.jsonの絶対パスを取得
    const filePath = path.resolve(__dirname, "../../../data/url.json");
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    res.json(json);
  } catch (error) {
    console.error("API error", error);
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
};
