/**
 * DialogManager - 對話流程控制與打字機效果
 */
class DialogManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    
    // DOM 元素引用
    this.area = document.getElementById('dialog-area');
    this.nameplate = document.getElementById('dialog-nameplate');
    this.nameText = document.getElementById('dialog-char-name');
    this.box = document.getElementById('dialog-box');
    this.textEl = document.getElementById('dialog-text');
    this.advanceIndicator = document.getElementById('btn-advance');
    
    this.backlogPanel = document.getElementById('backlog-panel');
    this.backlogList = document.getElementById('backlog-list');
    this.btnCloseBacklog = document.getElementById('btn-close-backlog');
    
    this.choiceMenu = document.getElementById('choice-menu');
    this.choiceList = document.getElementById('choice-list');

    // 狀態變數
    this.isTyping = false;
    this.typingTimer = null;
    this.fullText = '';
    this.currentTextIndex = 0;
    this.backlog = []; // 歷史對話紀錄: { character, text }
    
    this.isAuto = false;
    this.isSkip = false;
    this.autoTimer = null;
    
    // 預設打字速度與自動播放等待時間 (對應 GameState.settings)
    this.textSpeed = 40; // ms per char
    this.autoWaitTime = 2000; // ms
  }

  /**
   * 初始化事件監聽
   */
  init() {
    // 點擊對話框本身推進劇情
    if (this.box) {
      this.box.addEventListener('click', (e) => {
        // 如果正在顯示選項或謎題，點擊對話框無效
        if (!this.choiceMenu.classList.contains('hidden')) return;
        const puzzle = document.getElementById('puzzle-overlay');
        if (puzzle && !puzzle.classList.contains('hidden')) return;
        
        this.handleBoxClick();
      });
    }

    // 關閉 backlog 歷史視窗
    if (this.btnCloseBacklog) {
      this.btnCloseBacklog.addEventListener('click', () => this.hideBacklog());
    }
  }

  /**
   * 點擊對話框的邏輯：
   * - 正在打字中：立即秀出全部文字。
   * - 已經顯示全部文字：推進至下一個劇情節點。
   */
  handleBoxClick() {
    if (this.isTyping) {
      this.completeTyping();
    } else {
      this.engine.advanceScene();
    }
  }

  /**
   * 顯示對話
   * @param {string} character 說話的角色名稱，為 null 或空字串則代表旁白
   * @param {string} text 對話文本，支持 `{playerName}` 替換
   * @param {string} expression 表情 (可選，傳給 SceneManager)
   */
  showDialog(character, text, expression = null) {
    // 停止任何先前的打字計時與自動播放計時
    this.clearTypingTimer();
    this.clearAutoTimer();
    
    // 替換玩家名字 (使用 textContent 的方式先準備好文字)
    const processedText = text.replace(/{playerName}/g, this.engine.state.playerName);
    this.fullText = processedText;
    
    // 1. 處理姓名框
    if (character) {
      // 顯示姓名框
      this.nameText.textContent = character;
      this.nameplate.style.display = 'inline-block';
    } else {
      // 旁白，隱藏姓名框
      this.nameText.textContent = '';
      this.nameplate.style.display = 'none';
    }

    // 2. 寫入 Backlog 歷史
    this.pushToBacklog(character, processedText);

    // 3. 執行打字機效果
    this.textSpeed = this.engine.state.settings.textSpeed || 40;
    
    if (this.textSpeed <= 10 || this.isSkip) {
      // 快速略過或設定文字速度極快時，直接顯示
      this.completeTyping();
    } else {
      // 逐字打字
      this.isTyping = true;
      this.currentTextIndex = 0;
      this.textEl.textContent = '';
      if (this.advanceIndicator) this.advanceIndicator.style.display = 'none';
      
      this.typeNextChar();
    }
  }

  /**
   * 逐字打字遞迴
   */
  typeNextChar() {
    if (this.currentTextIndex < this.fullText.length) {
      // 安全插入字元 (防範 XSS)
      this.textEl.textContent += this.fullText[this.currentTextIndex];
      this.currentTextIndex++;
      
      this.typingTimer = setTimeout(() => {
        this.typeNextChar();
      }, this.textSpeed);
    } else {
      this.onTypingFinished();
    }
  }

  /**
   * 立即完成打字顯示
   */
  completeTyping() {
    this.clearTypingTimer();
    this.textEl.textContent = this.fullText;
    this.onTypingFinished();
  }

  /**
   * 打字完成處理
   */
  onTypingFinished() {
    this.isTyping = false;
    if (this.advanceIndicator) this.advanceIndicator.style.display = 'block';
    
    // 若為自動播放 (AUTO) 且沒有顯示選項，設定定時器自動下一步
    if (this.isAuto && this.choiceMenu.classList.contains('hidden')) {
      const settingsWait = this.engine.state.settings.autoSpeed * 1000 || 2000;
      this.autoTimer = setTimeout(() => {
        this.engine.advanceScene();
      }, settingsWait);
    }
  }

  /**
   * 顯示分支選項
   * @param {Array} choices 選項陣列 [ { text, affinity, next } ]
   */
  showChoices(choices) {
    this.clearAutoTimer();
    
    // 清空舊選項
    this.choiceList.textContent = '';
    
    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      // 強制使用 textContent，防範 XSS
      btn.textContent = choice.text;
      
      btn.addEventListener('click', () => {
        this.hideChoices();
        this.engine.makeChoice(index);
      });
      
      this.choiceList.appendChild(btn);
    });
    
    this.choiceMenu.classList.remove('hidden');
    console.log('[DialogManager] 顯示對話選項');
  }

  /**
   * 隱藏分支選項
   */
  hideChoices() {
    this.choiceMenu.classList.add('hidden');
    this.choiceList.textContent = '';
  }

  /**
   * 存入對話歷史
   */
  pushToBacklog(character, text) {
    this.backlog.push({ character: character || '旁白', text });
    // 限制 backlog 大小為 100 筆，避免消耗過多記憶體
    if (this.backlog.length > 100) {
      this.backlog.shift();
    }
  }

  /**
   * 顯示對話歷史
   */
  showBacklog() {
    this.clearAutoTimer();
    
    this.backlogList.textContent = ''; // 清空
    
    this.backlog.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'backlog-item';
      
      const speakerEl = document.createElement('span');
      speakerEl.className = 'backlog-speaker';
      speakerEl.textContent = item.character;
      
      const textEl = document.createElement('p');
      textEl.className = 'backlog-text';
      textEl.textContent = item.text;
      
      itemEl.appendChild(speakerEl);
      itemEl.appendChild(textEl);
      this.backlogList.appendChild(itemEl);
    });
    
    this.backlogPanel.classList.remove('hidden');
    // 自動滾動到底部
    this.backlogList.scrollTop = this.backlogList.scrollHeight;
  }

  /**
   * 隱藏對話歷史
   */
  hideBacklog() {
    this.backlogPanel.classList.add('hidden');
    // 如果之前處於 AUTO 狀態，重新啟用 AUTO 推進
    if (this.isAuto && !this.isTyping) {
      this.onTypingFinished();
    }
  }

  /**
   * 切換自動播放模式 (AUTO)
   */
  toggleAuto(forceState = null) {
    this.isAuto = forceState !== null ? forceState : !this.isAuto;
    
    const btnAuto = document.getElementById('btn-auto');
    if (btnAuto) {
      if (this.isAuto) {
        btnAuto.classList.add('active');
        // 若當前對話已打完字，立即觸發推進倒數
        if (!this.isTyping) {
          this.onTypingFinished();
        }
      } else {
        btnAuto.classList.remove('active');
        this.clearAutoTimer();
      }
    }
    console.log(`[DialogManager] 自動播放模式: ${this.isAuto}`);
  }

  /**
   * 切換快速跳過模式 (SKIP)
   */
  toggleSkip(forceState = null) {
    this.isSkip = forceState !== null ? forceState : !this.isSkip;
    
    const btnSkip = document.getElementById('btn-skip');
    if (btnSkip) {
      if (this.isSkip) {
        btnSkip.classList.add('active');
        // 若正在打字，立即完成，並推進
        if (this.isTyping) {
          this.completeTyping();
        }
        this.engine.advanceScene();
      } else {
        btnSkip.classList.remove('active');
      }
    }
    console.log(`[DialogManager] 略過模式: ${this.isSkip}`);
  }

  clearTypingTimer() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  clearAutoTimer() {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }
}
window.DialogManager = DialogManager;
