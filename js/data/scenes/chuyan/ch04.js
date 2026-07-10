/**
 * chuyan/ch04.js - 楚言路線第四章：河堤與未寄出的明信片
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["chuyan_ch04"] = [
  {
    type: "background",
    id: "rooftop",
    transition: "fade"
  },
  {
    type: "narration",
    text: "黃昏時分，夕陽將河堤染成一片金黃。你和楚言學長沿著河岸慢慢散步。微風送爽，他的灰色長外套下擺隨風輕擺。"
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
    text: "林夏，你知道我為什麼喜歡 Misc 的隱寫術嗎？"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "因為有時候，人與人之間有很多話是不好意思直接說出口的。就像圖片裡隱藏的數據一樣，需要密鑰才能看見。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "其實...我以前有一段很迷茫的時期，差點放棄了資安。但看見你那明亮、充滿幹勁的雙眼，就讓我覺得自己不能輕言放棄。"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「學長現在不需要迷茫了，我會一直陪著你。」",
        affinity: { chuyan: 20 },
        next: null
      },
      {
        text: "「我也從學長這裡得到了很多的勇氣和溫暖。」",
        affinity: { chuyan: 10 },
        next: null
      }
    ]
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "林夏...謝謝你。能聽你這麼說，我就覺得一切的努力都是值得的。"
  },
  {
    type: "jump",
    scene: "chuyan_ch05"
  }
];
