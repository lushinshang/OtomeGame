/**
 * SaveSystem - 存讀檔與 checksum 防竄改驗證
 */
class SaveSystem {
  static SLOTS = 6;
  static KEY_PREFIX = "ch_save_";
  static SETTINGS_KEY = "ch_settings";

  /**
   * 計算特定資料欄位的防竄改雜湊摘要 (djb2 hash)
   * @param {Object} state GameState 資料
   * @returns {string} 雜湊字串
   */
  static _hash(state) {
    const critical = JSON.stringify({
      affinity: state.affinity,
      clearedRoutes: state.clearedRoutes,
      unlockedCGs: state.unlockedCGs
    });
    
    let h = 5381;
    for (let i = 0; i < critical.length; i++) {
      h = ((h << 5) + h) + critical.charCodeAt(i);
      h |= 0; // 轉換為 32-bit 整數
    }
    return h.toString(16);
  }

  /**
   * 儲存遊戲狀態至指定槽位
   * @param {number} slot 槽位編號 (1~6)
   * @param {Object} state 當前的 GameState
   */
  static save(slot, state) {
    try {
      // 複製一份狀態，避免污染原始資料
      const saveState = JSON.parse(JSON.stringify(state));
      // 移除可能存在的 Set (因為 Set 無法直接 stringify)
      if (saveState.readScenes) {
        saveState.readScenes = Array.from(state.readScenes);
      }
      
      // 計算雜湊
      saveState._hash = this._hash(saveState);
      
      // 儲存
      localStorage.setItem(this.KEY_PREFIX + slot, JSON.stringify(saveState));
      console.log(`[SaveSystem] 已成功儲存至 Slot ${slot}`);
      return true;
    } catch (e) {
      console.error("[SaveSystem] 存檔失敗", e);
      return false;
    }
  }

  /**
   * 載入指定槽位的遊戲狀態
   * @param {number} slot 槽位編號 (1~6)
   * @returns {Object|null} 載入後的 GameState 或 null
   */
  static load(slot) {
    try {
      const raw = localStorage.getItem(this.KEY_PREFIX + slot);
      if (!raw) return null;
      
      const data = JSON.parse(raw);
      const { _hash, ...rest } = data;
      
      // 將已讀場景陣列還原為 Set
      if (rest.readScenes) {
        rest.readScenes = new Set(rest.readScenes);
      } else {
        rest.readScenes = new Set();
      }

      // 驗證存檔完整性 (防竄改)
      const calculatedHash = this._hash(rest);
      if (calculatedHash !== _hash) {
        console.warn(`[SaveSystem] 槽位 ${slot} 存檔完整性驗證失敗！預期: ${_hash}, 計算值: ${calculatedHash}。拒絕讀取已竄改存檔。`);
        return null;
      }
      
      console.log(`[SaveSystem] 已成功讀取 Slot ${slot}`);
      return rest;
    } catch (e) {
      console.error(`[SaveSystem] 讀檔失敗 (Slot ${slot})`, e);
      return null;
    }
  }

  /**
   * 檢查指定槽位是否有存檔
   * @param {number} slot 
   * @returns {boolean}
   */
  static hasSave(slot) {
    return localStorage.getItem(this.KEY_PREFIX + slot) !== null;
  }

  /**
   * 獲取存檔簡短資訊 (用於存讀檔介面)
   * @param {number} slot 
   * @returns {Object|null} { chapterTitle, time }
   */
  static getSaveInfo(slot) {
    try {
      const raw = localStorage.getItem(this.KEY_PREFIX + slot);
      if (!raw) return null;
      
      const data = JSON.parse(raw);
      return {
        playerName: data.playerName || "林夏",
        currentScene: data.currentScene,
        chapter: data.chapter,
        time: data.saveTime || "未知時間"
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * 儲存設定檔
   */
  static saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  /**
   * 讀取設定檔
   */
  static loadSettings() {
    const raw = localStorage.getItem(this.SETTINGS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
}
window.SaveSystem = SaveSystem;
