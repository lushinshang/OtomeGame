/**
 * luze/ch05.js - 陸澤路線第五章：決賽夜與結局
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["luze_ch05"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "CipherHeart CTF 決賽夜。大螢幕上的積分表瘋狂跳動，0xHeart 與對手的分數咬得極緊。"
  },
  {
    type: "character",
    character: "luze",
    expression: "normal",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "luze",
    text: "最後一題 Pwn... 只要拿到 Flag，我們就能贏下冠軍。"
  },
  {
    type: "dialog",
    character: "luze",
    text: "林夏，把你的 Payload 與我的密鑰結合，送出吧！"
  },
  {
    type: "end",
    endingType: "auto",
    character: "luze"
  }
];
