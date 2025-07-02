// このファイルは試合結果取得APIのルーティングを記述します。
// 例：/api/game-results などのエンドポイントを定義し、コントローラーを呼び出す役割です。
//
// ここに書くべき内容：
// - ExpressのRouter生成
// - get/post等のルート定義
// - コントローラー関数の呼び出し
//

import express from "express";
import { getGameResults } from "../src/controllers/getGameResultsController.js";

const router = express.Router();

// GET /api/game_results
router.get("/game_results", getGameResults);

export default router;
