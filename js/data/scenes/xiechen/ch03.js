/**
 * xiechen/ch03.js - 謝晨路線第三章：Web 安全特訓
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["xiechen_ch03"] = [
  {
    type: "background",
    id: "lab_night",
    transition: "fade"
  },
  {
    type: "character",
    character: "xiechen",
    expression: "smile",
    position: "left",
    action: "enter"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "小夏！選了 Web 特訓組真的太讓我高興了！嘿嘿，今天晚上就我們兩個人留在活動室哦。"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "我們今天來練習怎麼繞過後台登入驗證。很多網頁會因為單引號閉合沒有過濾，導致萬能密碼注入。小夏，試著寫出最經典的注入語句吧！"
  },
  {
    type: "puzzle",
    puzzleId: "web_sqli_001",
    onSuccess: {
      affinity: { xiechen: 15 }
    },
    onFail: {
      affinity: { xiechen: -2 }
    }
  },
  {
    type: "character",
    character: "xiechen",
    expression: "smile",
    position: "left",
    action: "stay"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "哇！瞬間登入成功！小夏，你的滲透思維真的太敏銳了！"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "為了獎勵你，我剛剛偷偷去自動販賣機買了草莓牛奶喔。給你！這可是限量的～"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「謝謝你，謝晨，草莓牛奶很好喝。」",
        affinity: { xiechen: 10 },
        next: null
      },
      {
        text: "「你居然還記得我喜歡喝草莓牛奶？」",
        affinity: { xiechen: 15 },
        next: null
      }
    ]
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "那、那是當然的啊...關於小夏的事情，我都有好好記著喔。"
  },
  {
    type: "jump",
    scene: "xiechen_ch04"
  }
];
