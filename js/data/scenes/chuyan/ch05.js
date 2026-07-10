/**
 * chuyan/ch05.js - 楚言路線第五章：決賽夜的密件修復
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["chuyan_ch05"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "決賽進行到白熱化。對手對我們提交的關鍵日誌進行了惡意字節阻斷，導致我們最後一題 Misc 無法開啟。"
  },
  {
    type: "character",
    character: "chuyan",
    expression: "normal",
    position: "right",
    action: "enter"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "林夏，別急。對方的混淆機制把日誌檔頭偽裝成了損毀的 PNG 圖片。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "這題只有你能用魔術字節修復它。我相信你的實力。當照片重現的那一刻，就是我們贏得冠軍的瞬間。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "林夏，準備好了嗎？我們一起，按下最後的傳送鍵！"
  },
  {
    type: "end",
    endingType: "auto",
    character: "chuyan"
  }
];
