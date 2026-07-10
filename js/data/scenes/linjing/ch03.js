/**
 * linjing/ch03.js - 林鏡路線第三章：密碼學的奧秘
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["linjing_ch03"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
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
    text: "林夏，既然你選擇了密碼學特訓，那我就會以最嚴格的標準要求你。"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "在非對稱加密 RSA 中，大數 N 的分解是整個算法安全的基礎。今天我們先做一個小熱身。給你 N 與質數 p，把 q 算出來。"
  },
  {
    type: "puzzle",
    puzzleId: "crypto_rsa_001",
    onSuccess: {
      affinity: { linjing: 15 }
    },
    onFail: {
      affinity: { linjing: -2 }
    }
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
    text: "q = 19？...運算無誤。哼，看來你今天的大腦運作得還算靈光。"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "這是我的推導筆記，本來是不借給別人的。不過看在你想學的份上，拿去吧。"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「謝謝你，林鏡，你的字寫得很漂亮。」",
        affinity: { linjing: 15 },
        next: null
      },
      {
        text: "「傲嬌的你，其實還挺溫柔的嘛。」",
        affinity: { linjing: 5 },
        next: null
      }
    ]
  },
  {
    type: "dialog",
    character: "linjing",
    text: "溫、溫柔？別開玩笑了！我只是不希望你在決賽中因為密碼學算錯而拉低我們隊伍的平均分數而已！"
  },
  {
    type: "jump",
    scene: "linjing_ch04"
  }
];
