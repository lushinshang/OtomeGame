/**
 * xiechen/ch04.js - 謝晨路線第四章：天台的星空與心聲
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["xiechen_ch04"] = [
  {
    type: "background",
    id: "rooftop",
    transition: "fade"
  },
  {
    type: "narration",
    text: "深夜，特訓的疲憊襲來。謝晨拉著你來到了實驗室大樓的天台頂樓。微風吹拂著他的栗棕色髮絲，夜空繁星點點。"
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
    text: "小夏，你知道嗎？雖然我平時看起來總是笑嘻嘻的，好像什麼都不在乎..."
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "但其實在遇見你之前，我一直覺得自己在戰隊裡只是個隨時可以被取代的 Web 拼貼工而已。"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "是你的認真和努力，讓我覺得...我也想為了某個重要的人，成為更耀眼、更強大的存在。"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「你在我眼裡一直都是最棒、最溫暖的隊友。」",
        affinity: { xiechen: 10 },
        next: null
      },
      {
        text: "「對我來說，謝晨是無可替代的存在。」",
        affinity: { xiechen: 20 },
        next: null
      }
    ]
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
    text: "小夏...謝謝你。決賽，我們一定會贏的。我有這個信心！"
  },
  {
    type: "jump",
    scene: "xiechen_ch05"
  }
];
