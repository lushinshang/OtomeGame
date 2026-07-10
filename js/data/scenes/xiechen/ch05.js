/**
 * xiechen/ch05.js - 謝晨路線第五章：決賽夜的 Web Bypass
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["xiechen_ch05"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "線下決賽現場，氣氛緊張到了極點。最後十五分鐘，0xHeart 與對手的分數依然處於白熱化的膠著狀態。"
  },
  {
    type: "character",
    character: "xiechen",
    expression: "normal",
    position: "left",
    action: "enter"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "小夏！對手剛剛修補了他們後台的所有過濾器，我們之前準備的 Web payload 被阻擋了！"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "但我剛剛在他們的登入機制中，發現了一個可以利用的條件漏洞！"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "林夏，把我們在練習時寫好的那行繞過指令送出去吧！成敗在此一舉了！"
  },
  {
    type: "end",
    endingType: "auto",
    character: "xiechen"
  }
];
