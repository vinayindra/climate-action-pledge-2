const STORAGE_KEY = 'climate_pledges_v1';
const countEl = document.getElementById('count');
const listEl = document.getElementById('pledgeList');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const viewBtn = document.getElementById('viewBtn');

function loadPledges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePledges(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  renderCount();
}

function renderCount() {
  const arr = loadPledges();
  countEl.textContent = arr.length;
}

function renderList() {
  const arr = loadPledges().slice().reverse();
  listEl.innerHTML = '';
  if (!arr.length) {
    listEl.innerHTML = '<div class="muted">No pledges yet — be the first!</div>';
    return;
  }
  arr.forEach(p => {
    const d = document.createElement('div');
    d.className = 'pledge-item';
    const when = new Date(p.time).toLocaleString();
    d.innerHTML = `<strong>${p.name}</strong> — <span class="muted">${when}</span><div>${p.text}</div>`;
    listEl.appendChild(d);
  });
}

document.getElementById('pledgeBtn').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const action = document.getElementById('action').value;
  const other = document.getElementById('other').value.trim();

  const map = {
    reduce_plastic: 'Reduce single-use plastic',
    use_public_transport: 'Use public/shared transport',
    eat_less_meat: 'Eat less meat',
    save_energy: 'Lower home energy use',
    plant_trees: 'Plant/support tree planting',
    other: other || 'Other action',
  };

  const text = map[action] || other || 'Take action';

  if (action === 'other' && !other) {
    alert('Please describe your "Other" action.');
    return;
  }

  const pledges = loadPledges();
  pledges.push({ name: name || 'Anonymous', email, text, time: new Date().toISOString() });
  savePledges(pledges);
  alert('Thanks — your pledge is recorded locally!');
  document.getElementById('pledgeForm').reset();
});

viewBtn.addEventListener('click', () => {
  listEl.style.display = listEl.style.display === 'none' ? 'block' : 'none';
  if (listEl.style.display === 'block') renderList();
});

copyBtn.addEventListener('click', async () => {
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy link'), 1500);
  } catch {
    prompt('Copy this link:', url);
  }
});

resetBtn.addEventListener('click', () => {
  if (confirm('Clear all pledges saved in this browser?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderCount();
    listEl.innerHTML = '';
    alert('All pledges cleared locally.');
  }
});

renderCount();
