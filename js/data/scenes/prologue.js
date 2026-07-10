/**
 * prologue.js - 序章劇情劇本 (優化豐富版)
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["prologue"] = [
  {
    type: "background",
    id: "classroom",
    transition: "cut"
  },
  {
    type: "narration",
    text: "炎熱的午後，蟬鳴聲在 CipherAcademy 的林蔭大道間迴響。你作為剛轉學來的交換生，手裡拿著一張略顯褶皺的社團地圖。"
  },
  {
    type: "narration",
    text: "『0xHeart』—— 傳說中連續三年稱霸全國資安大賽、由四位性格迥異但天賦異稟的帥哥所組成的頂尖 CTF 戰隊。"
  },
  {
    type: "narration",
    text: "你走到地下實驗室的門前。厚重的隔音門上方裝有一盞閃爍著微弱藍光的 LED 終端指示燈，上面用點矩陣顯示著：[Status: Exploit Pending]。"
  },
  {
    type: "narration",
    text: "你深吸一口氣，輕輕敲了敲門。門縫裡隨即傳來鍵盤快速敲擊的清脆聲響，隨後，門鎖傳來電子解除解鎖的輕響..."
  },
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
    text: "誰？敲門的頻率雜亂無章，毫無節奏感。如果是推銷防毒軟體的，立刻右轉坐電梯上去。"
  },
  {
    type: "narration",
    text: "開門的是一個身材修長的高個子男生。他穿著一件黑色半拉鏈連帽衫，兜帽隨意地搭在肩上，黑色的短髮略顯凌亂，卻襯托出他極為立體深邃的五官。"
  },
  {
    type: "narration",
    text: "他的眼神帶著一股冰冷而危險的壓迫感，正居高臨下地看著你。這個人，就是 0xHeart 的二進位漏洞防禦核心 —— 陸澤。"
  },
  {
    type: "dialog",
    character: "luze",
    text: "不說話？...難道是迷路的大一新生？"
  },
  {
    type: "choice",
    choices: [
      {
        text: "「我是今天剛報到的交換生，想申請加入 0xHeart。」",
        affinity: { luze: 5 },
        next: null
      },
      {
        text: "「我的敲門頻率有沒有 bug 我不知道，但你的歡迎詞肯定需要補丁 (Patch)。」",
        affinity: { luze: 15 },
        next: null
      }
    ]
  },
  {
    type: "character",
    character: "luze",
    expression: "blush",
    position: "right",
    action: "stay"
  },
  {
    type: "dialog",
    character: "luze",
    text: "哼，有意思。敢直接挑釁我的程式碼邏輯，你是第一個。"
  },
  {
    type: "dialog",
    character: "luze",
    text: "既然你說是來加入的，那就別光說不練。正好，我剛在靶機上佈署了一道簡單的 Pwn 線索。解出來，就證明你不是花架子。"
  },
  {
    type: "narration",
    text: "陸澤側過身，指了指桌上亮著綠色終端介面的筆記型電腦。上面閃爍著一串奇怪的 Base64 字串..."
  },
  {
    type: "puzzle",
    puzzleId: "base64_001",
    onSuccess: {
      affinity: { luze: 10 }
    },
    onFail: {
      affinity: { luze: -5 }
    }
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
    text: "嗯？解碼速度還挺快。看來你在這方面稍微有些天分，沒有把 CPU 燒壞。"
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
    text: "哇！阿澤，你怎麼一開口就在考驗可愛的新隊友啊！這樣會把人家嚇跑的啦～"
  },
  {
    type: "narration",
    text: "一個栗棕色微捲頭髮的男生笑嘻嘻地從後方的伺服器架旁走出來。他穿著一件明亮的淺色休閒衛衣，笑起來時眼睛彎得像月牙，整個人散發出暖洋洋的陽光氣息。"
  },
  {
    type: "narration",
    text: "他是社團裡的 Web 滲透大師，謝晨。他的笑容有一股讓人瞬間放鬆的魔力。"
  },
  {
    type: "dialog",
    character: "xiechen",
    text: "哈囉！我叫謝晨，叫我小晨就好了哦。別理陸澤這個二進位死腦筋，他平時對待記憶體指針比對待人類溫柔多了。"
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
    text: "謝晨，你的講話頻寬又超載了。真是不懂密碼學的優雅與安靜。"
  },
  {
    type: "narration",
    text: "坐在一旁沙發上、正對著平板電腦推導數學公式的男生抬起頭來。他戴著一副細黑框眼鏡，黑髮整齊側分，白色牛津襯衫一塵不染，氣質高冷矜持得像一位小貴公子。"
  },
  {
    type: "narration",
    text: "這位是密碼學 (Crypto) 的天才，林鏡。他合上平板，淡淡地掃了你一眼。"
  },
  {
    type: "dialog",
    character: "linjing",
    text: "我是林鏡。希望你不是那種只會用 Brute Force (暴力破解) 的粗俗駭客，否則，我的 CPU 會為你哭泣的。"
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
    text: "好啦，大家別在門口爭吵了。林夏同學，歡迎來到 0xHeart。"
  },
  {
    type: "narration",
    text: "門口傳來溫柔的聲音。一位穿著慵懶的灰色長外套、深棕長髮微微蓋耳的學長端著熱咖啡走了進來，眼神如春風般溫暖。"
  },
  {
    type: "narration",
    text: "他是社團的社長兼 Misc 大師，楚言。在大家的吵鬧聲中，他向你遞出了一杯暖暖的燕麥拿鐵。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "我是楚言。雖然我們這群隊友個性有點怪，但他們都是非常可靠的夥伴。接下來的這段日子，就請多多指教囉。"
  },
  {
    type: "narration",
    text: "雖然開局有些混亂，但在這個飄散著咖啡香氣與伺服器運轉聲的地下室中，你隱隱感覺到，一場難忘的夏天即將開始..."
  },
  {
    type: "jump",
    scene: "ch01"
  }
];
