/**
 * GameEngine - 核心遊戲狀態機與調度中心
 */
class GameEngine {
  constructor() {
    // 遊戲狀態單例初始化
    this.state = {
      playerName: "林夏",
      currentScene: "prologue",
      currentNode: 0,
      chapter: 0,
      selectedRoute: null, // "luze" | "xiechen" | "linjing" | "chuyan"
      affinity: {
        luze: 0,
        xiechen: 0,
        linjing: 0,
        chuyan: 0
      },
      unlockedCGs: [],
      readScenes: new Set(),
      clearedRoutes: [],
      solvedPuzzles: {}, // 使用 Object.create(null) 防範 prototype pollution
      settings: {
        textSpeed: 40,
        autoSpeed: 2,
        dialogOpacity: 0.85
      }
    };
    
    // 初始化防範原型鏈污染的 resolved list
    this.state.solvedPuzzles = Object.create(null);

    // 引擎子系統
    this.sceneManager = null;
    this.dialogManager = null;
    
    // 全域劇本資料庫 (掛載在 window.gameScripts)
    window.gameScripts = window.gameScripts || {};
  }

  /**
   * 初始化引擎與 DOM 事件綁定
   */
  init() {
    this.sceneManager = new SceneManager();
    this.dialogManager = new DialogManager(this);
    this.dialogManager.init();

    // 讀取設定檔
    const savedSettings = SaveSystem.loadSettings();
    if (savedSettings) {
      this.state.settings = { ...this.state.settings, ...savedSettings };
    }

    this.bindGlobalEvents();
    this.sceneManager.showScreen('screen-title');
    console.log("[GameEngine] 初始化完成，已載入標題畫面。");
  }

  /**
   * 綁定 index.html 中的標題選單及控制按鈕
   */
  bindGlobalEvents() {
    // --- 標題畫面選單 ---
    document.getElementById('btn-new-game').addEventListener('click', () => {
      this.sceneManager.showScreen('screen-name-input');
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
      this.showSaveScreen('load');
    });

    document.getElementById('btn-gallery').addEventListener('click', () => {
      this.showGalleryScreen();
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      this.showSettingsScreen();
    });

    document.getElementById('btn-about').addEventListener('click', () => {
      this.showToast("CipherHeart v1.0 - CTF 資安主題乙女遊戲。");
    });

    // --- 名字確認視窗 ---
    document.getElementById('btn-confirm-name').addEventListener('click', () => {
      const input = document.getElementById('input-player-name');
      // XSS 安全過濾與防護 (Sanitize input)
      let name = input.value.trim();
      name = name.replace(/[<>"'/]/g, ""); // 移除潛在 HTML 標籤字元
      if (name.length === 0) name = "林夏";
      
      this.startNewGame(name);
    });

    document.getElementById('btn-cancel-name').addEventListener('click', () => {
      this.sceneManager.showScreen('screen-title');
    });

    // --- 遊戲中 HUD 按鈕 ---
    document.getElementById('btn-menu').addEventListener('click', () => {
      document.getElementById('pause-menu').classList.remove('hidden');
      this.dialogManager.clearAutoTimer();
    });

    document.getElementById('btn-auto').addEventListener('click', () => {
      this.dialogManager.toggleAuto();
    });

    document.getElementById('btn-skip').addEventListener('click', () => {
      this.dialogManager.toggleSkip();
    });

    document.getElementById('btn-log').addEventListener('click', () => {
      this.dialogManager.showBacklog();
    });

    document.getElementById('btn-save-quick').addEventListener('click', () => {
      this.showToast("已快速存檔至 Slot 1。");
      this.saveGame(1);
    });

    // --- 暫停選單按鈕 ---
    document.getElementById('btn-resume').addEventListener('click', () => {
      document.getElementById('pause-menu').classList.add('hidden');
      if (this.dialogManager.isAuto) {
        this.dialogManager.onTypingFinished();
      }
    });

    document.getElementById('btn-save-from-pause').addEventListener('click', () => {
      document.getElementById('pause-menu').classList.add('hidden');
      this.showSaveScreen('save');
    });

    document.getElementById('btn-load-from-pause').addEventListener('click', () => {
      document.getElementById('pause-menu').classList.add('hidden');
      this.showSaveScreen('load');
    });

    document.getElementById('btn-settings-from-pause').addEventListener('click', () => {
      document.getElementById('pause-menu').classList.add('hidden');
      this.showSettingsScreen();
    });

    document.getElementById('btn-to-title').addEventListener('click', () => {
      if (confirm("確定要回到標題畫面嗎？未存檔的進度將會遺失。")) {
        document.getElementById('pause-menu').classList.add('hidden');
        this.dialogManager.toggleAuto(false);
        this.dialogManager.toggleSkip(false);
        this.sceneManager.fadeToScreen('screen-title');
      }
    });

    // --- 存讀檔畫面關閉 ---
    document.getElementById('btn-close-save').addEventListener('click', () => {
      // 依當前遊戲所在畫面返回 (如果在遊戲中點暫停->讀檔，返回遊戲畫面)
      const gameActive = document.getElementById('screen-game').classList.contains('active');
      if (gameActive) {
        this.sceneManager.showScreen('screen-game');
      } else {
        this.sceneManager.showScreen('screen-title');
      }
    });

    // --- CG 鑑賞室關閉 ---
    document.getElementById('btn-close-gallery').addEventListener('click', () => {
      this.sceneManager.showScreen('screen-title');
    });
    
    document.getElementById('btn-cg-close').addEventListener('click', () => {
      document.getElementById('cg-viewer').classList.add('hidden');
    });

    // --- CG 鑑賞室篩選按鈕事件 ---
    const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const filter = e.target.getAttribute('data-filter');
        this.renderGalleryGrid(filter);
      });
    });

    // --- 設定視窗事件 ---
    const textSpeedInput = document.getElementById('setting-text-speed');
    const autoSpeedInput = document.getElementById('setting-auto-speed');
    const opacityInput = document.getElementById('setting-dialog-opacity');

    textSpeedInput.addEventListener('input', (e) => {
      document.getElementById('setting-text-speed-val').textContent = e.target.value;
      this.state.settings.textSpeed = 110 - parseInt(e.target.value); // 反轉，使滑桿越大速度越快 (對應毫秒越小)
    });

    autoSpeedInput.addEventListener('input', (e) => {
      document.getElementById('setting-auto-speed-val').textContent = e.target.value;
      this.state.settings.autoSpeed = parseFloat(e.target.value);
    });

    opacityInput.addEventListener('input', (e) => {
      const percentage = Math.round(e.target.value * 100);
      document.getElementById('setting-dialog-opacity-val').textContent = percentage + "%";
      this.state.settings.dialogOpacity = parseFloat(e.target.value);
      
      const dBox = document.getElementById('dialog-box');
      if (dBox) dBox.style.backgroundColor = `rgba(8, 11, 26, ${e.target.value})`;
    });

    document.getElementById('btn-settings-reset').addEventListener('click', () => {
      textSpeedInput.value = 40;
      autoSpeedInput.value = 2;
      opacityInput.value = 0.85;
      textSpeedInput.dispatchEvent(new Event('input'));
      autoSpeedInput.dispatchEvent(new Event('input'));
      opacityInput.dispatchEvent(new Event('input'));
    });

    document.getElementById('btn-settings-close').addEventListener('click', () => {
      SaveSystem.saveSettings(this.state.settings);
      
      const gameActive = document.getElementById('screen-game').classList.contains('active');
      if (gameActive) {
        this.sceneManager.showScreen('screen-game');
      } else {
        this.sceneManager.showScreen('screen-title');
      }
    });
  }

  /**
   * 開始新遊戲
   */
  startNewGame(playerName) {
    this.state.playerName = playerName;
    this.state.currentScene = "prologue";
    this.state.currentNode = 0;
    this.state.chapter = 0;
    this.state.selectedRoute = null;
    this.state.affinity = { luze: 0, xiechen: 0, linjing: 0, chuyan: 0 };
    this.state.solvedPuzzles = Object.create(null);
    
    // 初始化 UI 元件狀態
    this.dialogManager.backlog = [];
    this.dialogManager.toggleAuto(false);
    this.dialogManager.toggleSkip(false);
    
    this.sceneManager.clearAllCharacters();
    this.sceneManager.hideCG();
    
    document.getElementById('affinity-hud').classList.add('hidden');

    this.sceneManager.fadeToScreen('screen-game', () => {
      this.advanceScene();
    });
  }

  /**
   * 推進場景腳本節點
   */
  advanceScene() {
    const sceneId = this.state.currentScene;
    const script = window.gameScripts[sceneId];

    if (!script) {
      console.error(`[GameEngine] 找不到腳本: ${sceneId}`);
      this.showToast(`[Error] 腳本 ${sceneId} 未載入。`);
      return;
    }

    if (this.state.currentNode >= script.length) {
      console.log(`[GameEngine] 場景 ${sceneId} 播放結束，切換至標題。`);
      this.sceneManager.fadeToScreen('screen-title');
      return;
    }

    const node = script[this.state.currentNode];
    this.state.currentNode++;

    // 處理已讀狀態
    const stateKey = `${sceneId}_${this.state.currentNode - 1}`;
    this.state.readScenes.add(stateKey);

    // 解析節點類型
    switch (node.type) {
      case 'background':
        this.sceneManager.transitionBackground(node.id, node.transition);
        this.advanceScene(); // 背景更換為自動執行，隨後跳下一節點
        break;

      case 'character':
        this.sceneManager.showCharacter(node.character, node.expression, node.position, node.action);
        this.advanceScene(); // 角色立繪更換後，自動播下一節點
        break;

      case 'dialog':
        this.updateAffinityHUD(node.character);
        this.dialogManager.showDialog(
          this.getCharacterName(node.character),
          node.text,
          node.expression
        );
        break;

      case 'narration':
        document.getElementById('affinity-hud').classList.add('hidden');
        this.dialogManager.showDialog(null, node.text);
        break;

      case 'choice':
        this.dialogManager.showChoices(node.choices);
        break;

      case 'puzzle':
        this.triggerPuzzle(node);
        break;

      case 'cg':
        this.sceneManager.showCG(node.cgId);
        // CG 解鎖
        if (!this.state.unlockedCGs.includes(node.cgId)) {
          this.state.unlockedCGs.push(node.cgId);
        }
        
        // 點按 CG 本身前進或倒數跳下一格
        const cgDuration = node.duration || 0;
        if (cgDuration > 0) {
          setTimeout(() => {
            this.sceneManager.hideCG();
            this.advanceScene();
          }, cgDuration);
        } else {
          // 沒有給時間代表點按畫面才前進
          const cgEl = document.getElementById('cg-layer');
          const advanceCG = () => {
            cgEl.removeEventListener('click', advanceCG);
            this.sceneManager.hideCG();
            this.advanceScene();
          };
          cgEl.addEventListener('click', advanceCG);
        }
        break;

      case 'routeSelect':
        this.dialogManager.clearAutoTimer();
        this.renderRouteCards();
        this.sceneManager.showScreen('screen-route-select');
        break;

      case 'setFlag':
        this.state[node.flag] = node.value;
        this.advanceScene();
        break;

      case 'jump':
        this.state.currentScene = node.scene;
        this.state.currentNode = 0;
        this.advanceScene();
        break;

      case 'end':
        const endingType = node.endingType === 'auto' ? this.getEndingType(node.character) : node.endingType;
        this.showEnding(endingType, node.character);
        break;

      default:
        console.warn(`[GameEngine] 未知的 node type: ${node.type}`);
        this.advanceScene();
        break;
    }
  }

  /**
   * 點選分支選項
   */
  makeChoice(choiceIndex) {
    const sceneId = this.state.currentScene;
    const script = window.gameScripts[sceneId];
    // 目前 Choice 節點是前一個 node (因 advanceScene 已將 currentNode+1)
    const choiceNode = script[this.state.currentNode - 1];
    const choice = choiceNode.choices[choiceIndex];

    console.log(`[GameEngine] 玩家選擇: ${choice.text}`);

    // 更新好感度
    if (choice.affinity) {
      for (const [char, delta] of Object.entries(choice.affinity)) {
        this.changeAffinity(char, delta);
      }
    }

    // 跳轉或前進
    if (choice.next !== null && choice.next !== undefined) {
      if (typeof choice.next === 'string') {
        this.state.currentScene = choice.next;
        this.state.currentNode = 0;
      } else {
        this.state.currentNode = choice.next;
      }
    }
    
    this.advanceScene();
  }

  /**
   * 修改攻略角色好感度
   */
  changeAffinity(character, delta) {
    if (this.state.affinity[character] !== undefined) {
      const oldVal = this.state.affinity[character];
      let newVal = oldVal + delta;
      newVal = Math.max(0, Math.min(100, newVal)); // 範圍限制在 0-100
      this.state.affinity[character] = newVal;
      
      const charName = this.getCharacterName(character);
      if (delta > 0) {
        this.showToast(`與 ${charName} 的好感度上升了！ (+${delta})`);
      } else if (delta < 0) {
        this.showToast(`與 ${charName} 的好感度下降了... (${delta})`);
      }
      
      // 即時更新好感度 HUD 顯示
      this.updateAffinityHUD(character);
    }
  }

  /**
   * 進入角色路線後，好感度量表的動態更新顯示
   */
  updateAffinityHUD(character) {
    const hud = document.getElementById('affinity-hud');
    if (!hud) return;

    // 只有進入角色專屬路線或是攻略角色在對話時才顯示 HUD
    if (character && this.state.affinity[character] !== undefined) {
      const charName = this.getCharacterName(character);
      document.getElementById('affinity-char-name').textContent = charName;
      document.getElementById('affinity-value').textContent = this.state.affinity[character];
      document.getElementById('affinity-bar-fill').style.width = `${this.state.affinity[character]}%`;
      hud.classList.remove('hidden');
    } else {
      hud.classList.add('hidden');
    }
  }

  /**
   * 獲取角色中文姓名
   */
  getCharacterName(charId) {
    const names = {
      luze: "陸澤",
      xiechen: "謝晨",
      linjing: "林鏡",
      chuyan: "楚言"
    };
    return names[charId] || charId;
  }

  /**
   * 根據攻略對象的好感度決定結局類型
   */
  getEndingType(character) {
    const score = this.state.affinity[character] || 0;
    if (score >= 80) return 'good';
    if (score >= 50) return 'normal';
    return 'bad';
  }

  /**
   * 執行 CTF 謎題機制 (Phase 1 骨架，將在 Phase 2 提供題庫)
   */
  triggerPuzzle(node) {
    const overlay = document.getElementById('puzzle-overlay');
    if (!overlay) return;

    this.dialogManager.clearAutoTimer();
    
    // 預設題庫 fallback，防止 P1 無 puzzles.js 時報錯
    const puzzleDb = window.puzzleDatabase || {};
    const puzzle = puzzleDb[node.puzzleId] || {
      title: "CTF 基礎挑戰",
      description: "請將 Base64 編碼字串 dGVzdA== 還原成明文以獲取 Flag。",
      type: "input",
      answer: "test"
    };

    document.getElementById('puzzle-title').textContent = puzzle.title;
    document.getElementById('puzzle-description').textContent = puzzle.description;
    
    const contentArea = document.getElementById('puzzle-content');
    contentArea.innerHTML = ''; // 清空 (安全：只動態建立 input 或 button)
    
    const feedback = document.getElementById('puzzle-feedback');
    feedback.textContent = '';
    feedback.className = '';
    
    const hintText = document.getElementById('puzzle-hint-text');
    hintText.textContent = puzzle.hint || "無提示。";
    hintText.classList.add('hidden');

    let getUserAnswer = () => "";

    if (puzzle.type === 'input') {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'puzzle-input';
      input.placeholder = '請輸入 Flag (例如: Flag{...})';
      input.autocomplete = 'off';
      input.spellcheck = false;
      contentArea.appendChild(input);
      
      getUserAnswer = () => input.value.trim();
    }
    
    overlay.classList.remove('hidden');

    // 提示按鈕事件
    const btnHint = document.getElementById('btn-puzzle-hint');
    const toggleHint = () => {
      hintText.classList.toggle('hidden');
    };
    btnHint.onclick = toggleHint;

    // 提交按鈕事件
    const btnSubmit = document.getElementById('btn-puzzle-submit');
    btnSubmit.onclick = () => {
      const userAns = getUserAnswer();
      
      // 使用安全比對 (防範 prototype pollution)
      if (userAns === puzzle.answer) {
        feedback.textContent = "✔ 驗證成功！正在解鎖下一部分系統...";
        feedback.className = "feedback-success";
        
        // 紀錄解題狀態 (防護 prototype pollution)
        if (Object.prototype.hasOwnProperty.call(this.state.solvedPuzzles, node.puzzleId)) {
          // 已解過
        } else {
          this.state.solvedPuzzles[node.puzzleId] = true;
        }

        // 好感加成
        if (node.onSuccess && node.onSuccess.affinity) {
          for (const [char, delta] of Object.entries(node.onSuccess.affinity)) {
            this.changeAffinity(char, delta);
          }
        }

        setTimeout(() => {
          overlay.classList.add('hidden');
          this.advanceScene();
        }, 1500);
      } else {
        feedback.textContent = "✘ 驗證失敗。CheckSum 錯誤，請重試。";
        feedback.className = "feedback-error";
        
        // 失敗回饋
        if (node.onFail && node.onFail.affinity) {
          for (const [char, delta] of Object.entries(node.onFail.affinity)) {
            this.changeAffinity(char, delta);
          }
        }
      }
    };
  }

  /**
   * 顯示結局
   */
  showEnding(endingType, character) {
    const bgUrl = `assets/cg/${character}_cg02.png`; // 結局 CG 假設為 cg02
    document.getElementById('ending-bg').style.backgroundImage = `url('${bgUrl}')`;
    
    const badge = document.getElementById('ending-type-badge');
    const title = document.getElementById('ending-title');
    const text = document.getElementById('ending-text');
    
    const charName = this.getCharacterName(character);
    
    if (endingType === 'good') {
      badge.textContent = "GOOD ENDING";
      badge.style.borderColor = "var(--color-accent-cyan)";
      badge.style.color = "var(--color-accent-cyan)";
      title.textContent = `與 ${charName} 共同抵達的彼岸`;
      text.textContent = "在決賽夜，你們成功防禦了外部攻擊並奪得冠軍。當所有人都在歡呼時，他悄悄拉起你的手，在終端機前對你許下了一生的承諾。";
    } else if (endingType === 'normal') {
      badge.textContent = "NORMAL ENDING";
      badge.style.borderColor = "var(--color-accent-gold)";
      badge.style.color = "var(--color-accent-gold)";
      title.textContent = "名為戰友的距離";
      text.textContent = "決賽在驚險中落幕，戰隊贏得了優秀的名次。雖然沒有挑明那層關係，但你們成為了最默契的戰友。在未來的代碼旅程中，彼此的身邊依然有著對方。";
    } else {
      badge.textContent = "BAD ENDING";
      badge.style.borderColor = "var(--color-accent-red)";
      badge.style.color = "var(--color-accent-red)";
      title.textContent = "斷開的連結";
      text.textContent = "密鑰錯誤。在緊要關頭，你們錯失了關鍵的一步，比賽失敗，而他也在這場賽事後逐漸淡出了你的生活。這段夏天的記憶，最終只成為了一份唯讀的系統日誌。";
    }

    // 綁定結局動作
    document.getElementById('btn-ending-gallery').onclick = () => {
      this.sceneManager.showScreen('screen-gallery');
    };
    
    document.getElementById('btn-ending-again').onclick = () => {
      this.startNewGame(this.state.playerName);
    };
    
    document.getElementById('btn-ending-title').onclick = () => {
      this.sceneManager.showScreen('screen-title');
    };

    // CG 解鎖
    const cgId = `${character}_cg02`;
    if (!this.state.unlockedCGs.includes(cgId)) {
      this.state.unlockedCGs.push(cgId);
    }

    this.sceneManager.showScreen('screen-ending');
  }

  /**
   * 存檔
   */
  saveGame(slot) {
    this.state.saveTime = new Date().toLocaleString();
    const success = SaveSystem.save(slot, this.state);
    if (success) {
      this.showToast(`存檔成功！已寫入槽位 ${slot}。`);
      this.renderSaveSlots(this.saveMode); // 重新繪製介面
    } else {
      this.showToast("存檔失敗，存檔區損毀。");
    }
  }

  /**
   * 讀檔
   */
  loadGame(slot) {
    const loadedState = SaveSystem.load(slot);
    if (loadedState) {
      this.state = loadedState;
      // 確保 Set 欄位存在
      if (!(this.state.readScenes instanceof Set)) {
        this.state.readScenes = new Set(this.state.readScenes || []);
      }
      
      this.dialogManager.backlog = [];
      this.dialogManager.toggleAuto(false);
      this.dialogManager.toggleSkip(false);
      this.sceneManager.clearAllCharacters();
      
      // 讀取當前的場景背景與角色
      this.sceneManager.fadeToScreen('screen-game', () => {
        // 因 load 後 currentNode 指向的是將要執行的節點，直接推進即可
        // 但若是讀檔時正在執行 choice 或是對話，我們需要倒回前一個 node 重新播放以載入 UI
        if (this.state.currentNode > 0) {
          this.state.currentNode--; 
        }
        this.advanceScene();
      });
    } else {
      this.showToast("讀檔失敗！存檔檔案 Hash 驗證不合，已被修改或損毀。");
    }
  }

  /**
   * 顯示存讀檔選單
   */
  showSaveScreen(mode) {
    this.saveMode = mode; // 'save' | 'load'
    document.getElementById('save-mode-title').textContent = mode === 'save' ? "保存進度" : "載入進度";
    this.renderSaveSlots(mode);
    this.sceneManager.showScreen('screen-save');
  }

  /**
   * 渲染存讀檔插槽
   */
  renderSaveSlots(mode) {
    const grid = document.getElementById('save-slot-grid');
    grid.textContent = ''; // 清空

    for (let slot = 1; slot <= SaveSystem.SLOTS; slot++) {
      const hasSave = SaveSystem.hasSave(slot);
      const info = SaveSystem.getSaveInfo(slot);
      
      const slotCard = document.createElement('div');
      slotCard.className = 'save-slot';
      slotCard.dataset.slot = slot;
      
      // 讓卡片定位 relative 以便刪除按鈕絕對定位
      slotCard.style.position = 'relative';
      
      const thumb = document.createElement('div');
      thumb.className = 'save-slot-thumb';
      
      const infoDiv = document.createElement('div');
      infoDiv.className = 'save-slot-info';

      if (hasSave && info) {
        thumb.textContent = `Chapter ${info.chapter} - ${info.currentScene}`;
        
        // 刪除按鈕
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'save-slot-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.title = '刪除存檔';
        deleteBtn.onclick = (e) => {
          e.stopPropagation(); // 阻止冒泡觸發讀取/寫入
          if (confirm(`確定要刪除 SLOT ${slot} 的存檔進度嗎？此動作無法復原。`)) {
            localStorage.removeItem(SaveSystem.KEY_PREFIX + slot);
            this.showToast(`已刪除 SLOT ${slot} 的存檔。`, "warn");
            this.renderSaveSlots(mode);
          }
        };
        slotCard.appendChild(deleteBtn);

        const sceneName = document.createElement('span');
        sceneName.className = 'save-slot-scene';
        sceneName.textContent = info.playerName;
        
        const timeVal = document.createElement('span');
        timeVal.className = 'save-slot-time';
        timeVal.textContent = info.time;
        
        infoDiv.appendChild(sceneName);
        infoDiv.appendChild(timeVal);
      } else {
        thumb.textContent = "— 空的存檔欄位 —";
        const emptyLabel = document.createElement('span');
        emptyLabel.textContent = `SLOT ${slot}`;
        infoDiv.appendChild(emptyLabel);
      }
      
      slotCard.appendChild(thumb);
      slotCard.appendChild(infoDiv);
      
      // 點擊事件
      slotCard.onclick = () => {
        if (mode === 'save') {
          this.saveGame(slot);
        } else {
          if (hasSave) {
            this.loadGame(slot);
          } else {
            this.showToast("此欄位沒有存檔資料。");
          }
        }
      };

      grid.appendChild(slotCard);
    }
  }

  /**
   * 顯示設定畫面
   */
  showSettingsScreen() {
    this.sceneManager.showScreen('screen-settings');
  }

  /**
   * 顯示 CG 鑑賞室
   */
  showGalleryScreen() {
    // 重設篩選器為 'all'
    const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
    filterButtons.forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.gallery-filter .filter-btn[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');

    this.renderGalleryGrid('all');
    this.sceneManager.showScreen('screen-gallery');
  }

  /**
   * 根據篩選器渲染 CG 網格
   */
  renderGalleryGrid(filter = 'all') {
    const grid = document.getElementById('gallery-grid');
    grid.textContent = ''; // 清空 (安全：不使用 innerHTML)
    
    // CG 定義：4 角色 × 3 CG = 12 張
    const cgList = [
      { id: 'luze_cg01', char: 'luze' }, { id: 'luze_cg02', char: 'luze' }, { id: 'luze_cg03', char: 'luze' },
      { id: 'xiechen_cg01', char: 'xiechen' }, { id: 'xiechen_cg02', char: 'xiechen' }, { id: 'xiechen_cg03', char: 'xiechen' },
      { id: 'linjing_cg01', char: 'linjing' }, { id: 'linjing_cg02', char: 'linjing' }, { id: 'linjing_cg03', char: 'linjing' },
      { id: 'chuyan_cg01', char: 'chuyan' }, { id: 'chuyan_cg02', char: 'chuyan' }, { id: 'chuyan_cg03', char: 'chuyan' }
    ];

    cgList.forEach(cg => {
      // 篩選
      if (filter !== 'all' && cg.char !== filter) return;

      const item = document.createElement('div');
      const isUnlocked = this.state.unlockedCGs.includes(cg.id);
      
      if (isUnlocked) {
        item.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = `assets/cg/${cg.id}.png`;
        img.alt = cg.id;
        
        item.appendChild(img);
        
        item.onclick = () => {
          this.showCGViewer(cg.id);
        };
      } else {
        item.className = 'gallery-item locked';
      }
      
      grid.appendChild(item);
    });
  }

  /**
   * 顯示全螢幕 CG 檢視器且支援鍵盤/按鈕切換
   */
  showCGViewer(cgId) {
    const viewer = document.getElementById('cg-viewer');
    const viewerImg = document.getElementById('cg-viewer-img');
    viewerImg.src = `assets/cg/${cgId}.png`;
    viewer.classList.remove('hidden');

    this.currentViewerCG = cgId;

    // 取得所有已解鎖的 CG 列表，以便左右切換
    const cgList = [
      'luze_cg01', 'luze_cg02', 'luze_cg03',
      'xiechen_cg01', 'xiechen_cg02', 'xiechen_cg03',
      'linjing_cg01', 'linjing_cg02', 'linjing_cg03',
      'chuyan_cg01', 'chuyan_cg02', 'chuyan_cg03'
    ];
    const unlockedList = cgList.filter(id => this.state.unlockedCGs.includes(id));

    // 綁定上一張與下一張
    const btnPrev = document.getElementById('btn-cg-prev');
    const btnNext = document.getElementById('btn-cg-next');

    const updateViewer = (newId) => {
      this.currentViewerCG = newId;
      viewerImg.src = `assets/cg/${newId}.png`;
    };

    btnPrev.onclick = (e) => {
      e.stopPropagation();
      const idx = unlockedList.indexOf(this.currentViewerCG);
      if (idx > 0) {
        updateViewer(unlockedList[idx - 1]);
      }
    };

    btnNext.onclick = (e) => {
      e.stopPropagation();
      const idx = unlockedList.indexOf(this.currentViewerCG);
      if (idx !== -1 && idx < unlockedList.length - 1) {
        updateViewer(unlockedList[idx + 1]);
      }
    };
  }

  /**
   * 渲染角色路線卡片
   */
  renderRouteCards() {
    const container = document.getElementById('route-cards');
    if (!container) return;
    container.textContent = ''; // 清空 (安全：不使用 innerHTML)

    const characters = [
      { id: 'luze', name: '陸澤', specialty: 'Pwn 專家' },
      { id: 'xiechen', name: '謝晨', specialty: 'Web 專家' },
      { id: 'linjing', name: '林鏡', specialty: 'Crypto 專家' },
      { id: 'chuyan', name: '楚言', specialty: 'Misc 專家' }
    ];

    characters.forEach(char => {
      const card = document.createElement('div');
      card.className = 'route-card';
      card.dataset.character = char.id;

      const portrait = document.createElement('div');
      portrait.className = 'route-card-portrait';
      
      // 使用立繪大頭照作為背景。若無，CSS 套用漸層
      portrait.style.backgroundImage = `url('assets/characters/${char.id}_normal.png')`;

      const info = document.createElement('div');
      info.className = 'route-card-info';

      const nameH2 = document.createElement('h2');
      nameH2.textContent = char.name;

      const specP = document.createElement('p');
      specP.className = 'route-card-specialty';
      specP.textContent = char.specialty;

      const affinityDiv = document.createElement('div');
      affinityDiv.className = 'route-card-affinity';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = `好感度: ${this.state.affinity[char.id]}`;

      const barTrack = document.createElement('div');
      barTrack.className = 'mini-affinity-bar';

      const barFill = document.createElement('div');
      barFill.style.width = `${this.state.affinity[char.id]}%`;

      barTrack.appendChild(barFill);
      affinityDiv.appendChild(labelSpan);
      affinityDiv.appendChild(barTrack);

      info.appendChild(nameH2);
      info.appendChild(specP);
      info.appendChild(affinityDiv);

      card.appendChild(portrait);
      card.appendChild(info);

      // 點擊事件：切換至角色路線
      card.onclick = () => {
        this.selectRoute(char.id);
      };

      container.appendChild(card);
    });
  }

  /**
   * 選擇攻略對象路線
   */
  selectRoute(characterId) {
    this.state.selectedRoute = characterId;
    // 進入專屬路線，直接從第三章 (ch03) 開始
    this.state.currentScene = `${characterId}_ch03`;
    this.state.currentNode = 0;
    this.state.chapter = 3;

    this.showToast(`已進入 ${this.getCharacterName(characterId)} 的專屬路線。`);
    
    this.sceneManager.fadeToScreen('screen-game', () => {
      this.advanceScene();
    });
  }

  /**
   * 顯示浮動 Toast 提示訊息
   */
  showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message; // textContent XSS 防護
    
    container.appendChild(toast);
    
    // 動態移除
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
window.GameEngine = GameEngine;
