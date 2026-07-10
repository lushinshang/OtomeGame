/**
 * ch02.js - 第二章：初戰熱身賽與抉擇點 (優化豐富版)
 */
window.gameScripts = window.gameScripts || {};

window.gameScripts["ch02"] = [
  {
    type: "background",
    id: "classroom",
    transition: "fade"
  },
  {
    type: "narration",
    text: "線上熱身賽當天。0xHeart 實驗室內，冷氣風扇呼呼吹著，但空氣中的溫度卻因為密集的運算而高居不下。"
  },
  {
    type: "narration",
    text: "鍵盤敲擊聲、滑鼠點擊聲此起彼落。大螢幕的積分表上，0xHeart 暫居第二，距離第一名只差最後一道 Misc 題的分數。"
  },
  {
    type: "character",
    character: "luze",
    expression: "normal",
    position: "left",
    action: "enter"
  },
  {
    type: "dialog",
    character: "luze",
    text: "嘖，對手的防禦硬體有 WAF (Web Application Firewall) 阻擋，我的 exploit 暫時進不去。"
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
    text: "我這邊 ECC 橢圓曲線的私鑰爆破還需要十分鐘。時間不夠了。"
  },
  {
    type: "character",
    character: "chuyan",
    expression: "normal",
    position: "center",
    action: "enter"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "大家別慌。最後這道 Misc 隱寫術題目，我剛剛在一個封包的二進位日誌中提取出了一段二進位編碼。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "林夏，我們一起來將這段 binary 翻譯成 ASCII 明文。只要解開它，我們就能提交最後的 Flag 贏得比賽！"
  },
  {
    type: "narration",
    text: "楚言學長溫柔的語氣中帶著一絲不容質疑的沉穩，他朝你點了點頭，指著螢幕上那一串 0 與 1 組成的編碼..."
  },
  {
    type: "puzzle",
    puzzleId: "misc_steg_001",
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
    position: "center",
    action: "stay"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "解出來了！Flag 是『FLAG』！太棒了，林夏，我現在就把 Flag 提交上去。"
  },
  {
    type: "narration",
    text: "【系統提示：Flag 提交成功！0xHeart 獲得 500 分！熱身賽排名：第一名！】"
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
    text: "耶！我們拿到決賽門票啦！小夏學妹跟學長真的太有默契了！"
  },
  {
    type: "character",
    character: "luze",
    expression: "blush",
    position: "right",
    action: "enter"
  },
  {
    type: "dialog",
    character: "luze",
    text: "哼...算你幫了大忙。這次就謝謝你了。"
  },
  {
    type: "narration",
    text: "熱鬧的慶功過後，實驗室漸漸安靜下來。楚言學長把你叫到辦公桌前，神色溫和但認真。"
  },
  {
    type: "character",
    character: "chuyan",
    expression: "smile",
    position: "center",
    action: "stay"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "林夏，熱身賽結束了。接下來為了備戰一個月後的線下總決賽，你需要決定專攻的領域，並與對應的隊友進行一對一的特訓。"
  },
  {
    type: "dialog",
    character: "chuyan",
    text: "告訴我...你想和誰一組，專攻哪一個領域呢？"
  },
  {
    type: "narration",
    text: "這是關鍵的抉擇。你的心跳不由得加快，腦海中浮現出隊友們的身影..."
  },
  {
    type: "routeSelect"
  }
];
