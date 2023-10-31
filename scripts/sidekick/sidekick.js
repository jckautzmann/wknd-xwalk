async function getMountPoint(owner, repo, ref) {
  const res = await fetch(`https://admin.hlx.page/sidekick/${owner}/${repo}/${ref}/env.json`);
  if (!res || !res.ok) {
    return null;
  }
  const env = await res.json();
  if (!env) {
    return null;
  }
  return env.contentSourceUrl;
}
async function openAemEditor(event) {
  const { owner, repo, ref } = event.detail.data.config;
  const mountPoint = await getMountPoint(owner, repo, ref);
  const path = window.location.pathname;
  const editorUrl = `${mountPoint}${path}?cmd=open`;
  // open the editor in a new tab
  window.open(editorUrl, '_blank');
}

async function overrideEdit(sk) {
  // TODO: replace edit button with the custom one
  // TODO: change event name in config.json
  
  // Wait for edit button
  const oldEditBtn = await new Promise((resolve) => {
    const check = () => {
      const btn = sk.shadowRoot.querySelectorAll('.edit.plugin')[0];
      if (btn) {
        resolve(btn);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
  
  const newEditBtn = sk.shadowRoot.querySelectorAll('.universaleditor.plugin')[0];
  oldEditBtn.replaceWith(newEditBtn);
  sk.addEventListener('custom:openUE', openAemEditor);
}

// eslint-disable-next-line import/prefer-default-export
export function initSidekick() {
  let sk = document.querySelector('helix-sidekick');
  if (sk) {
    // sidekick already loaded
    overrideEdit(sk);
  } else {
    // wait for sidekick to be loaded
    document.addEventListener('sidekick-ready', () => {
      sk = document.querySelector('helix-sidekick');
      overrideEdit(sk);
    }, { once: true });
  }
}
