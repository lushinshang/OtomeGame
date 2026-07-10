/**
 * ch01.js - 第一章：入隊與首訓 (優化豐富版)
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["ch01"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "正式加入 0xHeart 的第一天。陽光透過社團活動室高高的氣窗灑在白板上，白板上畫滿了複雜的網路拓撲圖與數學算式。"
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
    text: "小夏！你今天穿這件衣服超好看的！來來來，快坐我旁邊。我們今天先來熟悉一下 Web 滲透的基礎！"
  },
  {
    type: "character",
    character: "linjing",
    expression: "normal",
    position: "right",
    action: "enter"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "嘖，聒噪。林夏，別聽他的。Web 漏洞不過是些程式碼拼貼的疏忽。只有密碼學，才是建立在純粹數學之上的究極藝術。"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "阿鏡你這就不懂了吧！Web 滲透可是千變萬化的，能用一個簡單的 XSS bypass 防火牆，那種成就感可是無與倫比的！對吧，小夏？"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "無聊。林夏，我這裡有一道關於 Caesar Cipher 移位加密的古老暗號。你要是能在一分鐘內人工破解它，我就承認你的大腦還在正常運轉。"
  },
  {
    type: "narration",
    text: "兩個人同時盯著你，空氣中彷彿有火花在劈啪作響。你無奈地笑了笑，決定先挑戰..."
  },
  {
    type: "choice",
    choices: [
      {
        text: "「謝晨，我們先來做 Web 滲透訓練吧！」",
        affinity: { xiechen: 15, linjing: -2 },
        next: 10 // 跳轉到節點 10 (Web 劇情分支)
      },
      {
        text: "「林鏡，我來解你的密碼學暗號。」",
        affinity: { linjing: 15, xiechen: -2 },
        next: 20 // 跳轉到節點 20 (Crypto 劇情分支)
      }
    ]
  },

  // ═════ [NODE 10] WEB 分支 ═════
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
    text: "太棒了！果然小夏跟我最有默契！來，這是我剛搭好的靶機網頁。試著把這個 XSS payload 送進輸入框，拿走隱藏在管理員 admin cookie 裡的 Flag 吧！"
  },
  {
    type: "puzzle",
    puzzleId: "web_xss_001",
    onSuccess: {
      affinity: { xiechen: 10 }
    },
    onFail: {
      affinity: { xiechen: -2 }
    }
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "哇！完美彈窗！Flag 順利拿到！小夏，你真的太厲害了，今天訓練結束後，我們一起去吃冰慶祝吧？"
  },
  {
    type: "jump",
    scene: "ch01_end"
  },

  // ═════ [NODE 20] CRYPTO 分支 ═════
  {
    type: "character",
    character: "linjing",
    expression: "normal",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "很好，看來你做出了理智的抉擇。這是我的便條紙，密文是『FkhuBhe』，金鑰偏移量是 3。把它還原出來給我看。"
  },
  {
    type: "puzzle",
    puzzleId: "crypto_caesar_001",
    onSuccess: {
      affinity: { linjing: 10 }
    },
    onFail: {
      affinity: { linjing: -2 }
    }
  },
  {
    type: "character",
    character: "linjing",
    expression: "blush",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "答案是...『CherYeb』？...嘖，居然答對了。好吧，我承認你的邏輯運算速度比一般人要快上一點點。但也只有一點點而已！"
  },
  {
    type: "jump",
    scene: "ch01_end"
  }
];

// 第一章收尾場景
window.gameScripts["ch01_end"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "character",
    character: "chuyan",
    expression: "smile",
    position: "center",
    action: "enter"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "看來大家的訓練進行得很順利呢。林夏，適應得還習慣嗎？"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "明天是我們和隔壁學校『CryptoReaper』的線上熱身賽，今晚大家記得早點睡，養精蓄銳。"
  },
  {
    type: "narration",
    text: "你對著溫柔的楚言學長點了點頭。回到宿舍躺在床上，看著天花板，你開始有些期待明天的比賽了..."
  },
  {
    type: "jump",
    scene: "ch02"
  }
];
