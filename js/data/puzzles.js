/**
 * puzzles.js - CTF 互動謎題題庫 (完整版)
 * 使用 Object.create(null) 防範 prototype pollution
 */
window.puzzleDatabase = Object.create(null);

// === 共同路線與序章題庫 ===
window.puzzleDatabase["base64_001"] = {
  title: "陸澤的 Pwn 關卡密鑰",
  description: "陸澤丟給了你一段可疑的 base64 代碼，並冷哼道：『連這種入門解碼都做不到，就別來隊伍裡礙手礙腳。』\n解密字串：Q2lwaGVySGVhcnRfe1B3bl9NYXN0ZXJ9",
  type: "input",
  answer: "CipherHeart_{Pwn_Master}",
  hint: "Base64 解碼。你可以在網路上尋找 Base64 Decoder 工具來還原此字串。"
};

window.puzzleDatabase["web_xss_001"] = {
  title: "謝晨的 Web 滲透挑戰",
  description: "謝晨笑嘻嘻地湊過來：『小夏，這是我剛剛在後台設的沙盒漏洞。試著輸入一個最經典的 XSS Payload 彈出 cookie 吧！』\n請輸入一個含有 <script>alert(document.cookie)</script> 的 payload 或是直接解開它。",
  type: "input",
  answer: "<script>alert(document.cookie)</script>",
  hint: "直接完整輸入謝晨提示的經典 script 標籤程式碼即可驗證成功。"
};

window.puzzleDatabase["crypto_caesar_001"] = {
  title: "林鏡的密碼學考驗",
  description: "林鏡推了推眼鏡，把一張寫有移位密碼的便條紙推給你：『如果你只有這點智商，我不建議你碰密碼學。』\n密文：FkhuBhe (提示：Caesar Cipher, shift = 3，注意大小寫)",
  type: "input",
  answer: "CherYeb",
  hint: "Caesar 密碼移位。將密文 FkhuBhe 中的每個英文字母往回數 3 格。A 往回 3 格是 X... 依此類推。 (F->C, k->h, h->e, u->r, B->Y, h->e, e->b)"
};

window.puzzleDatabase["misc_steg_001"] = {
  title: "楚言學長的隱寫術尋寶",
  description: "楚言指著系統日誌裡一串二進位編碼字串，溫柔地說：『小夏，試著將這串 binary 翻譯成 ASCII 字元，裡面藏著我們決賽的暗號。』\n二進位編碼：01000110 01001100 01000001 01000111",
  type: "input",
  answer: "FLAG",
  hint: "將 8-bit 的二進位數字轉為十進位，再對照 ASCII 表。 01000110 = 70 (F), 01001100 = 76 (L), 01000001 = 65 (A), 01000111 = 71 (G)"
};

// === 攻略路線專屬進階題庫 ===

// 陸澤 (Pwn)
window.puzzleDatabase["pwn_overflow_001"] = {
  title: "陸澤路線：緩衝區溢位偏移量計算",
  description: "陸澤的黑客螢幕上閃爍著反組譯後的 C 語言代碼。他指著變數定義：『局部緩衝區 buf 宣告長度為 64 字節，但讀取輸入時卻使用了 gets(buf)。為了覆寫返回地址，我們需要精準計算緩衝區的大小與暫存器 (ebp) 的距離。在 32 位元架構中，若 ebp 長度為 4 字節，填充多少字節的無用數據後才能剛好抵達返回地址 (Return Address)？』",
  type: "input",
  answer: "68",
  hint: "計算方式：緩衝區 buf 長度 (64) + 暫存器 ebp 的大小 (4) = 68 字節。當我們填充 68 字節的無效垃圾數據後，接下來的 4 字節就會精準覆寫返回地址 (EIP)。"
};

// 謝晨 (Web)
window.puzzleDatabase["web_sqli_001"] = {
  title: "謝晨路線：SQL 注入萬能密碼繞過",
  description: "謝晨拉著你坐在沙發上，給你看網頁登入後台的程式碼：『小夏，後台的查詢語句是 SELECT * FROM users WHERE username = 'input_user' AND password = 'input_pwd'。如果不輸入密碼，只在 username 輸入框注入一個經典的 SQL 萬能語句使 SQL 條件恆為真，來繞過密碼認證，我們該輸入什麼？』",
  type: "input",
  answer: "admin' OR '1'='1",
  hint: "使用單引號閉合前面的欄位，並加上 OR 條件。例如輸入：admin' OR '1'='1，這樣 SQL 會解析成 WHERE username = 'admin' OR '1'='1' ...，條件恆成立從而繞過驗證。"
};

// 林鏡 (Crypto)
window.puzzleDatabase["crypto_rsa_001"] = {
  title: "林鏡路線：RSA 模數 N 的質因數分解",
  description: "林鏡將眼鏡推上鼻樑，在黑板上寫下一組 RSA 公鑰參數：『在 RSA 加密中，模數 N 是兩個質數 p 和 q 的乘積。如果我告訴你 N = 323，且其中一個質數 p = 17，那麼另一個質數 q 是多少？不要告訴我你需要寫 Python 腳本才能算出來。』",
  type: "input",
  answer: "19",
  hint: "很簡單的除法運算。已知 N = p * q 且 N = 323, p = 17。則另一個質因數 q = 323 / 17 = 19。"
};

// 楚言 (Misc)
window.puzzleDatabase["misc_magic_001"] = {
  title: "楚言路線：PNG 圖片魔術位元組修復",
  description: "楚言無奈地看著一張打不開的損毀 PNG 圖片：『小夏，這張照片的檔頭字節被對手惡意篡改了。經典 PNG 圖片檔頭的前 4 個十六進位字節 (Magic Bytes) 應該是什麼？請以大寫十六進位輸入，字節之間不用空格。』",
  type: "input",
  answer: "89504E47",
  hint: "PNG 檔案的標準魔術檔頭前四個字節為 ASCII 的 \\x89PNG。換算成十六進位大寫字元即為：89504E47。"
};
