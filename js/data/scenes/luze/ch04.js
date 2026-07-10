/**
 * luze/ch04.js - 陸澤路線第四章：裂縫
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["luze_ch04"] = [
  {
    type: "character",
    character: "luze",
    expression: "angry",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "luze",
    text: "你的思緒亂了。是因為決賽壓力，還是因為...其他事情？"
  },
  {
    type: "dialog",
    character: "luze",
    text: "冷靜下來。我不希望因為任何人分心，包括你在內。"
  },
  {
    type: "jump",
    scene: "luze_ch05"
  }
];
