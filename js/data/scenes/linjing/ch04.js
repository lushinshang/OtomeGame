/**
 * linjing/ch04.js - 林鏡路線第四章：雨夜與被弄濕的書頁
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["linjing_ch04"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "窗外突然下起了傾盆大雨。圖書館的角落只剩下一盞暖黃色的閱讀燈。你正和林鏡並肩整理著厚重的數論文獻。"
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
    text: "林夏，把那本《現代密碼學導論》遞給我。小心，它的封面很容易磨損。"
  },
  {
    type: "narration",
    text: "在你遞書時，兩人的指尖不經意地相碰。他像觸電般縮回了手，精緻的側臉在燈光下顯得有些發紅。"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "你...你的手為什麼這麼冰？平時的血液循環是有 Bug 嗎？"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「可能是圖書館冷氣太強了吧。」",
        affinity: { linjing: 5 },
        next: null
      },
      {
        text: "輕輕抓住他的衣角：「那你幫我暖一下？」",
        affinity: { linjing: 20 },
        next: null
      }
    ]
  },
  {
    type: "character",
    character: "linjing",
    expression: "blush",
    position: "center",
    action: "stay"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "你...你在說什麼傻話！簡直毫無邏輯！"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "不過...如果你真的很冷的話...這半邊圍巾，拿去用就是了。別多想！我只是怕你感冒影響後續的解題速度。"
  },
  {
    type: "jump",
    scene: "linjing_ch05"
  }
];
