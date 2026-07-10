/**
 * luze/ch03.js - 陸澤路線第三章：解題羈絆
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["luze_ch03"] = [
  {
    type: "background",
    id: "lab_night",
    transition: "fade"
  },
  {
    type: "character",
    character: "luze",
    expression: "normal",
    position: "right",
    action: "enter"
  },
  {
    type: "dialog",
    character: "luze",
    text: "既然你選了 Pwn，就代表你做好了每天只睡四個小時的心理準備。"
  },
  {
    type: "dialog",
    character: "luze",
    text: "這個 binary 裡面有緩衝區溢位漏洞，溢出位移你自己算，五分鐘後我來檢查。"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「交給我吧，我現在就算出來。」",
        affinity: { luze: 10 },
        next: null
      },
      {
        text: "「五分鐘？我三分鐘就夠了。」",
        affinity: { luze: 15 },
        next: null
      }
    ]
  },
  {
    type: "character",
    character: "luze",
    expression: "smile",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "luze",
    text: "口氣很大嘛。做出來的話，今晚的消夜我請客。"
  },
  {
    type: "jump",
    scene: "luze_ch04"
  }
];
