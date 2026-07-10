/**
 * linjing/ch05.js - 林鏡路線第五章：決賽夜的密鑰重組
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["linjing_ch05"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "總決賽。0xHeart 的隊伍面臨最後一道 ECC 橢圓曲線大題，對手在解密環節對我們進行了阻斷。"
  },
  {
    type: "character",
    character: "linjing",
    expression: "normal",
    position: "center",
    action: "enter"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "林夏，我的私鑰計算已經完成了，但對方的模數 N 混雜了干擾字符。"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "現在只有你能幫我把公鑰的模數完成因數分解，將正確的參數送入演算法。"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "別慌。在我的世界裡，你是我唯一無法用公式算出來的變數...但也是最完美的答案。我們一起解開它吧！"
  },
  {
    type: "end",
    endingType: "auto",
    character: "linjing"
  }
];
