/**
 * chuyan/ch03.js - 楚言路線第三章：隱寫術的溫柔
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["chuyan_ch03"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "character",
    character: "chuyan",
    expression: "smile",
    position: "right",
    action: "enter"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "林夏，Misc (雜項) 看似鬆散，卻是考驗直覺與綜合資安知識的領域。很高興你能和我一組。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "這張 PNG 圖片打不開，因為它的前 4 個十六進位字節 (Magic Bytes) 被惡意修改了。林夏，你能把它修復嗎？"
  },
  {
    type: "puzzle",
    puzzleId: "misc_magic_001",
    onSuccess: {
      affinity: { chuyan: 15 }
    },
    onFail: {
      affinity: { chuyan: -2 }
    }
  },
  {
    type: "character",
    character: "chuyan",
    expression: "smile",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "回答是『89504E47』...太棒了。修復之後，你看，這是一張我們入隊第一天在操場拍的合照喔。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "雖然照片有點糊，但我一直好好保存著。對了，要喝熱燕麥拿鐵嗎？我剛為你泡的。"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「謝謝楚言學長，有學長在感覺特別安心。」",
        affinity: { chuyan: 15 },
        next: null
      },
      {
        text: "「學長是不是對每個新人都這麼溫柔？」",
        affinity: { chuyan: 5 },
        next: null
      }
    ]
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "傻丫頭...怎麼會呢？我只有對你，才會特別泡這杯拿鐵喔。"
  },
  {
    type: "jump",
    scene: "chuyan_ch04"
  }
];
