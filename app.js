const form = document.querySelector('#priceForm');
const list = document.querySelector('#priceList');
const search = document.querySelector('#search');
const els = {
  count: document.querySelector('#count'), avg: document.querySelector('#avg'),
  min: document.querySelector('#min'), max: document.querySelector('#max'),
  todayPick: document.querySelector('#todayPick')
};
let data = JSON.parse(localStorage.getItem('maplePrices') || '[]');
const money = n => Number(n).toLocaleString('ko-KR') + ' 메소';
const save = () => localStorage.setItem('maplePrices', JSON.stringify(data));
function render(){
  const q = search.value.trim().toLowerCase();
  const filtered = data.filter(x => x.name.toLowerCase().includes(q));
  list.innerHTML = filtered.length ? filtered.map(x => `
    <article class="item">
      <div><h3>${x.name}</h3><span class="tag">${x.server}</span> <small>${x.date}</small><p>${x.memo || '메모 없음'}</p></div>
      <div class="price">${money(x.price)}</div>
      <button class="del" onclick="removeItem('${x.id}')">삭제</button>
    </article>`).join('') : '<p>아직 등록된 시세가 없어요 🍄</p>';
  const prices = data.map(x => x.price);
  els.count.textContent = data.length;
  els.avg.textContent = prices.length ? money(Math.round(prices.reduce((a,b)=>a+b,0)/prices.length)) : '0';
  els.min.textContent = prices.length ? money(Math.min(...prices)) : '0';
  els.max.textContent = prices.length ? money(Math.max(...prices)) : '0';
  els.todayPick.textContent = data[0]?.name || '아직 없음';
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const item = {
    id: crypto.randomUUID(),
    name: document.querySelector('#itemName').value.trim(),
    server: document.querySelector('#server').value,
    price: Number(document.querySelector('#price').value),
    memo: document.querySelector('#memo').value.trim(),
    date: new Date().toLocaleString('ko-KR')
  };
  data.unshift(item); save(); form.reset(); render();
});
search.addEventListener('input', render);
window.removeItem = id => { data = data.filter(x => x.id !== id); save(); render(); };
render();
