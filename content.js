(async () => {
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  const mode = params.get('mode');
  const newWindow = params.get('window') === '1';
  if (!q && !mode && !newWindow) return;

  const MAX_WAIT_MS = 10000;
  const POLL_MS = 200;

  const SEL = {
    EDITOR: 'div.ql-editor[contenteditable="true"]',
    SEND_BTN: 'button.send-button:not([aria-disabled="true"])',
    MODE_MENU_BTN: 'button[data-test-id="bard-mode-menu-button"]',
    MENU_ITEM: 'button[mat-menu-item], [role="menuitem"]',
  };

  // エイリアス → メニュー項目テキスト部分一致。未登録ならmodeの値をそのまま使う
  const MODE_ALIASES = {
    flash: '高速',
    thinking: '思考',
    pro: 'Pro',
  };

  const pollFor = (fn, ms = MAX_WAIT_MS) => new Promise((resolve) => {
    let elapsed = 0;
    const t = setInterval(() => {
      const r = fn();
      if (r) { clearInterval(t); resolve(r); return; }
      elapsed += POLL_MS;
      if (elapsed >= ms) { clearInterval(t); resolve(null); }
    }, POLL_MS);
  });

  // 新しいウィンドウで開く場合、パラメータからwindowを除いたURLでリダイレクト
  if (newWindow) {
    params.delete('window');
    const url = `${location.origin}${location.pathname}?${params}`;
    chrome.runtime.sendMessage({ type: 'open-window', url }, () => {
      if (chrome.runtime.lastError) window.open(url, '_blank');
    });
    window.stop();
    return;
  }

  const waitVisible = () => new Promise((resolve) => {
    if (document.visibilityState === 'visible') { resolve(); return; }
    const handler = () => {
      if (document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', handler);
        resolve();
      }
    };
    document.addEventListener('visibilitychange', handler);
  });

  const selectMode = async (label) => {
    const menuBtn = await pollFor(() => document.querySelector(SEL.MODE_MENU_BTN));
    if (!menuBtn) return;
    menuBtn.click();

    const target = await pollFor(() => {
      const items = document.querySelectorAll(SEL.MENU_ITEM);
      return Array.from(items).find((el) => el.textContent.includes(label));
    });

    if (target) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } else {
      // メニューが開きっぱなしにならないよう閉じる
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }
  };

  const editor = await pollFor(() => document.querySelector(SEL.EDITOR));
  if (!editor) return;

  const modeLabel = mode ? (MODE_ALIASES[mode] || mode) : null;
  if (modeLabel) await selectMode(modeLabel);

  await waitVisible();

  if (q) {
    // テキスト入力（gem ページ等でエディタが再生成される場合のリトライ付き）
    // execCommand は非推奨だが、contenteditable + Quill Editor + Angular で
    // 変更検知を確実にトリガーする唯一の方法
    let typed = false;
    for (let i = 0; i < 5 && !typed; i++) {
      if (i) await new Promise((r) => setTimeout(r, 500));
      const ed = document.querySelector(SEL.EDITOR);
      if (!ed) continue;
      ed.focus();
      document.execCommand('selectAll');
      document.execCommand('insertText', false, q);
      await new Promise((r) => setTimeout(r, 200));
      typed = !!ed.textContent.trim();
    }
    if (!typed) return;

    const sendBtn = await pollFor(() => document.querySelector(SEL.SEND_BTN));
    if (sendBtn) sendBtn.click();
  }
})();
