/**
 * SceneManager - 畫面切換與角色/背景立繪渲染控制
 */
class SceneManager {
  constructor() {
    this.screens = document.querySelectorAll('.screen');
    this.mask = document.getElementById('transition-mask');
    this.gameBg = document.getElementById('game-bg');
    this.cgLayer = document.getElementById('cg-layer');
    this.cgImage = document.getElementById('cg-image');
    
    // 角色 DOM 對照表
    this.charContainers = {
      left: document.getElementById('char-left'),
      center: document.getElementById('char-center'),
      right: document.getElementById('char-right')
    };

    // 目前畫面上顯示的攻略角色 -> 位置映射 { luze: 'right' }
    this.activeCharacters = {};
  }

  /**
   * 切換到指定的畫面
   * @param {string} screenId 畫面 element ID，如 'screen-title' 或 'screen-game'
   */
  showScreen(screenId) {
    const target = document.getElementById(screenId);
    if (!target) {
      console.error(`[SceneManager] 找不到畫面 ID: ${screenId}`);
      return;
    }

    this.screens.forEach(screen => {
      screen.classList.remove('active');
    });
    target.classList.add('active');
    console.log(`[SceneManager] 切換畫面至: ${screenId}`);
  }

  /**
   * 帶有淡入淡出遮罩的畫面跳轉
   * @param {string} screenId 目標畫面 ID
   * @param {function} callback 在遮罩最黑時要執行的函數 (可選)
   */
  fadeToScreen(screenId, callback = null) {
    if (!this.mask) {
      this.showScreen(screenId);
      if (callback) callback();
      return;
    }

    this.mask.classList.add('active');
    
    setTimeout(() => {
      this.showScreen(screenId);
      if (callback) callback();
      
      setTimeout(() => {
        this.mask.classList.remove('active');
      }, 300);
    }, 500); // 遮罩完全變黑的時間
  }

  /**
   * 切換遊戲背景圖
   * @param {string} bgId 背景圖片 ID，對應 assets/backgrounds/[bgId].png
   * @param {string} transition 切換類型 'fade' | 'cut' | 'slide'
   */
  transitionBackground(bgId, transition = 'fade') {
    if (!this.gameBg) return;

    const bgUrl = bgId ? `url('assets/backgrounds/${bgId}.png')` : '';
    
    if (transition === 'fade') {
      this.gameBg.style.transition = 'opacity 0.5s ease';
      this.gameBg.style.opacity = 0;
      
      setTimeout(() => {
        if (bgUrl) {
          this.gameBg.style.backgroundImage = bgUrl;
        } else {
          this.gameBg.style.backgroundImage = '';
        }
        this.gameBg.style.opacity = 1;
      }, 500);
    } else {
      // 'cut' or immediate
      this.gameBg.style.transition = 'none';
      if (bgUrl) {
        this.gameBg.style.backgroundImage = bgUrl;
      } else {
        this.gameBg.style.backgroundImage = '';
      }
      this.gameBg.style.opacity = 1;
    }
    console.log(`[SceneManager] 切換背景至: ${bgId} (模式: ${transition})`);
  }

  /**
   * 顯示角色立繪
   * @param {string} charId 角色 ID (luze / xiechen / linjing / chuyan)
   * @param {string} expression 表情 (normal / smile / angry / surprised / blush)
   * @param {string} position 位置 (left / center / right)
   * @param {string} action 動作動作類型 (enter / stay)
   */
  showCharacter(charId, expression = 'normal', position = 'center', action = 'stay') {
    const container = this.charContainers[position];
    if (!container) return;

    // 先清除這個位置可能代表的舊角色對照關係
    for (const [cId, pos] of Object.entries(this.activeCharacters)) {
      if (pos === position && cId !== charId) {
        delete this.activeCharacters[cId];
      }
    }

    // 儲存新位置
    this.activeCharacters[charId] = position;

    // 清除先前動畫 class
    container.className = 'character-sprite';
    
    // 設定立繪圖片路徑。如果不存在，利用 CSS 漸層占位 (在 CSS 設定)
    container.style.backgroundImage = `url('assets/characters/${charId}_${expression}.png')`;
    
    // 套用狀態
    container.classList.add('active');
    
    // 若為新進場，套用對應動畫
    if (action === 'enter') {
      container.classList.add(`char-enter-${position}`);
    }

    console.log(`[SceneManager] 顯示角色: ${charId} (${expression}) 於 ${position} (動作: ${action})`);
  }

  /**
   * 隱藏特定角色的立繪
   * @param {string} charId 角色 ID
   * @param {string} action 動作動作類型 (exit)
   */
  hideCharacter(charId, action = 'exit') {
    const position = this.activeCharacters[charId];
    if (!position) return; // 這個角色目前不在畫面上

    const container = this.charContainers[position];
    if (container) {
      if (action === 'exit') {
        container.className = 'character-sprite active';
        container.classList.add(`char-exit-${position}`);
        
        // 動態動畫完成後移除 active
        setTimeout(() => {
          container.classList.remove('active');
          container.className = 'character-sprite';
          container.style.backgroundImage = '';
        }, 400);
      } else {
        container.classList.remove('active');
        container.className = 'character-sprite';
        container.style.backgroundImage = '';
      }
    }

    delete this.activeCharacters[charId];
    console.log(`[SceneManager] 隱藏角色: ${charId}`);
  }

  /**
   * 清除畫面上所有的角色立繪
   */
  clearAllCharacters() {
    Object.keys(this.activeCharacters).forEach(charId => {
      this.hideCharacter(charId, 'immediate');
    });
    this.activeCharacters = {};
  }

  /**
   * 顯示滿版 CG 圖
   * @param {string} cgId CG 圖片名稱，對應 assets/cg/[cgId].png
   */
  showCG(cgId) {
    if (!this.cgLayer || !this.cgImage) return;

    this.cgImage.src = `assets/cg/${cgId}.png`;
    this.cgLayer.classList.remove('hidden');
    console.log(`[SceneManager] 展示 CG 插圖: ${cgId}`);
  }

  /**
   * 隱藏 CG 圖
   */
  hideCG() {
    if (!this.cgLayer) return;
    this.cgLayer.classList.add('hidden');
    if (this.cgImage) this.cgImage.src = '';
  }
}
window.SceneManager = SceneManager;
