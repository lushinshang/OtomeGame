/**
 * main.js - 遊戲啟動入口
 */
document.addEventListener('DOMContentLoaded', () => {
  // 檢查是否所有核心 Class 均已載入
  if (window.GameEngine) {
    window.engine = new window.GameEngine();
    window.engine.init();
  } else {
    console.error("[CipherHeart] 找不到 GameEngine Class。載入順序可能有問題。");
  }
});
