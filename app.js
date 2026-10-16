/* Seluruh interaksi berjalan lokal di browser. Tidak ada jaringan API, login, cookies, atau penyimpanan. */
(() => {
  'use strict';
  const D = window.RISET_DATA;
  if (!D || !Array.isArray(D.titles)) {
    document.body.textContent = 'Data pembelajaran tidak tersedia. Pastikan data.js dimuat bersama index.html.';
    return;
  }
  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ORDER = ['si','iot','analytics','cross','integration','media','security'];
  const counts = ORDER.map((id) => ({id, label:D.labels[id], count:D.titles.filter((t) => t.category === id).length}));
  const total = D.titles.length;
  let chosenCategory = 'all';
  let query = '';
  let shown = 8;
  let selectedCase = D.transformations[0].id;
  let currentOutline = '';

  function renderChart() {
    $('#themeChart').innerHTML = counts.map((c) => `
      <button class="chart-row" type="button" data-cat="${escapeHTML(c.id)}" data-selected="${chosenCategory === c.id}" title="Filter ${escapeHTML(c.label)}">
        <span class="bar-label"><span>${escapeHTML(c.label)}</span><strong>${c.count} · ${(100*c.count/total).toLocaleString('id-ID',{maximumFractionDigits:1})}%</strong></span>
        <span class="bar-track"><span class="bar-fill" style="--w:${(c.count/12*100).toFixed(2)}%"></span></span>
      </button>`).join('');
    $('#themeChart').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
      chosenCategory = chosenCategory === button.dataset.cat ? 'all' : button.dataset.cat;
      shown = 8;
      $('#categorySelect').value = chosenCategory;
      renderChart();
      renderCatalog();
      $('#peta-judul').scrollIntoView({behavior: 'smooth', block:'start'});
    }));
  }
  function matchedTitles() {
    return D.titles.filter((t) => (chosenCategory === 'all' || t.category === chosenCategory)
      && (t.title + ' ' + D.labels[t.category]).toLocaleLowerCase('id-ID').includes(query));
  }
  function renderCatalog() {
    const list = matchedTitles();
    const visible = list.slice(0, shown);
    $('#catalogCount').textContent = `${list.length} dari ${total} judul sesuai filter`;
    $('#titleList').innerHTML = visible.length ? visible.map((t) => `<article class="title-item">
      <span class="title-num">${String(t.id).padStart(2,'0')}</span>
      <div class="title-info"><strong>${escapeHTML(t.title)}</strong><span class="category-tag">${escapeHTML(D.labels[t.category])}</span></div>
    </article>`).join('') : `<div class="no-results">Tidak ada judul yang cocok. Ubah kata kunci atau reset filter.</div>`;
    $('#catalogPageInfo').textContent = `${visible.length} ditampilkan dari ${list.length} hasil`;
    $('#loadMore').hidden = visible.length >= list.length;
  }
  function setupCatalog() {
    $('#categorySelect').innerHTML = '<option value="all">Semua bidang</option>' + counts.map(c => `<option value="${c.id}">${escapeHTML(c.label)} (${c.count})</option>`).join('');
    $('#categorySelect').addEventListener('change', (e) => {chosenCategory=e.target.value;shown=8;renderChart();renderCatalog();});
    $('#titleSearch').addEventListener('input', (e) => {query=e.target.value.trim().toLocaleLowerCase('id-ID');shown=8;renderCatalog();});
    $('#resetFilter').addEventListener('click', () => {chosenCategory='all';query='';shown=8;$('#categorySelect').value='all';$('#titleSearch').value='';renderChart();renderCatalog();});
    $('#loadMore').addEventListener('click', () => {shown += 8;renderCatalog();});
    renderChart();renderCatalog();
  }
  function renderCases() {
    $('#caseTabs').innerHTML = D.transformations.map((c)=>`<button type="button" id="tab-${escapeHTML(c.id)}" role="tab" aria-selected="${selectedCase===c.id}" aria-controls="caseFeature" data-case="${escapeHTML(c.id)}" tabindex="${selectedCase===c.id ? 0 : -1}">${escapeHTML(c.label)}</button>`).join('');
    const selected = D.transformations.find(c => c.id===selectedCase) || D.transformations[0];
    $('#caseFeature').setAttribute('role','tabpanel');
    $('#caseFeature').setAttribute('aria-labelledby',`tab-${selected.id}`);
    $('#caseFeature').innerHTML = `<header class="case-head"><div><small>STUDI KASUS INTERAKTIF / ${escapeHTML(selected.focus)}</small><h3>${escapeHTML(selected.label)}</h3></div><span class="case-tag">S1 → S2 → S3</span></header>
    <div class="case-stages"><div class="case-stage stage-1"><span>TAHAP 01 · PENERAPAN</span><h4>Skripsi S1</h4><p>${escapeHTML(selected.s1)}</p></div>
    <div class="case-stage stage-2"><span>TAHAP 02 · PENYELIDIKAN</span><h4>Tesis S2</h4><p>${escapeHTML(selected.s2)}</p></div>
    <div class="case-stage stage-3"><span>TAHAP 03 · ORISINALITAS</span><h4>Disertasi S3</h4><p>${escapeHTML(selected.s3)}</p></div></div>
    <div class="case-foot"><div><h4>◈ Dugaan research gap untuk diverifikasi</h4><p>${escapeHTML(selected.gap)}</p></div><div><h4>◎ Bukti yang dibutuhkan</h4><p>${escapeHTML(selected.proof)}</p></div></div>`;
    $('#caseTabs').querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {selectedCase=button.dataset.case;renderCases();});
      button.addEventListener('keydown', (event)=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        const idx=D.transformations.findIndex(c=>c.id===selectedCase);
        const next=event.key==='Home'?0:event.key==='End'?D.transformations.length-1:(idx+(event.key==='ArrowRight'?1:-1)+D.transformations.length)%D.transformations.length;
        selectedCase=D.transformations[next].id;renderCases();$(`#tab-${selectedCase}`).focus();
      });
    });
  }
  const angles = {
    generalisasi:{focus:'generalisasi lintas konteks', rq:'Apakah temuan tetap berlaku ketika data, populasi, atau lokasi penggunaan berubah?', result:'Peta kondisi ketika hasil dapat atau tidak dapat digeneralisasi.', validate:'Evaluasi lintas dataset/lokasi, pembandingan baseline, dan analisis perbedaan distribusi.'},
    robustness:{focus:'ketahanan pada gangguan',rq:'Bagaimana performa atau dampaknya berubah saat muncul noise, data hilang, drift, atau kegagalan sistem?',result:'Pengetahuan tentang titik kegagalan dan strategi mitigasi yang diuji.',validate:'Eksperimen gangguan terkontrol, metrik kestabilan, dan analisis sensitivitas.'},
    validitas:{focus:'kekuatan validasi dan pembanding',rq:'Apakah kesimpulan bertahan setelah dibandingkan dengan baseline kuat dan pengujian yang bebas bias?',result:'Bukti evaluatif yang lebih dapat dipercaya dan protokol pengujian yang dapat direplikasi.',validate:'Baseline tepat, split data yang benar, pengulangan, ablation bila relevan, serta ketidakpastian hasil.'},
    pengguna:{focus:'dampak pada pengguna atau proses',rq:'Faktor apa yang memengaruhi penerimaan, perilaku, atau hasil proses setelah solusi digunakan?',result:'Penjelasan faktor dan prinsip desain yang didukung observasi empiris.',validate:'Survei/instrumen tervalidasi, wawancara, observasi, serta desain pembandingan yang sesuai.'},
    efisiensi:{focus:'trade-off efisiensi dan ketepatan',rq:'Kapan peningkatan ketepatan tidak sebanding dengan biaya waktu, energi, kompleksitas, atau sumber daya?',result:'Batas kondisi dan panduan pemilihan pendekatan yang beralasan.',validate:'Pengukuran waktu/biaya komputasi, kualitas keluaran, dan eksperimen beberapa konfigurasi.'}
  };
  function renderLab() {
    const c=D.transformations.find(x=>x.id===$('#labCase').value) || D.transformations[0];
    const angle=angles[$('#labAngle').value] || angles.generalisasi;
    const parts=[
      {label:'1. Landasan yang perlu ditelaah',body:`Telusuri artikel primer tentang “${c.label}”, pendekatan sejenis, kondisi evaluasi, dan keterbatasan yang sudah dilaporkan. Jangan menganggap dugaan berikut sebagai fakta literatur.`},
      {label:'2. Hipotesis research gap',body:`Perlu diverifikasi apakah penelitian yang ada sudah memberi bukti memadai mengenai ${angle.focus} pada tema “${c.label}”. Dugaan awal: ${c.gap}`},
      {label:'3. Contoh pertanyaan penelitian',body:angle.rq},
      {label:'4. Calon kontribusi ilmiah',body:angle.result},
      {label:'5. Rencana validasi',body:angle.validate},
      {label:'6. Pemeriksaan novelty',body:'Bandingkan kontribusi yang diusulkan dengan karya mutakhir: apa unsur orisinalnya, mengapa penting, dan bukti mana yang akan mendukungnya?'}
    ];
    $('#labResult').innerHTML=`<p class="lab-result-title">KERANGKA DISKUSI / ${escapeHTML(c.label)}</p><div class="lab-outline">${parts.map(p=>`<div class="outline-item"><b>${escapeHTML(p.label)}</b><p>${escapeHTML(p.body)}</p></div>`).join('')}</div><p class="lab-disclaimer">Catatan: kerangka ini adalah alat bantu berpikir, bukan sistem yang memeriksa Scopus, menemukan gap secara otomatis, atau menjamin novelty.</p>`;
    currentOutline=`KERANGKA DISKUSI METODOLOGI PENELITIAN\nTopik: ${c.label}\nFokus: ${angle.focus}\n\n`+parts.map(p=>`${p.label}\n${p.body}`).join('\n\n')+'\n\nVerifikasi wajib: cari dan sintesis artikel primer mutakhir sebelum menyatakan gap atau kebaruan.';
    $('#copyNotice').textContent='';
  }
  function setupLab() {
    $('#labCase').innerHTML=D.transformations.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.label)}</option>`).join('');
    $('#labCase').addEventListener('change',renderLab);
    $('#labAngle').addEventListener('change',renderLab);
    $('#copyOutline').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(currentOutline);$('#copyNotice').textContent='Kerangka berhasil disalin.';}
      catch {$('#copyNotice').textContent='Clipboard tidak tersedia; salin teks hasil secara manual.';}
    });
    renderLab();
  }
  function renderReferences() {
    $('#referenceList').innerHTML=D.references.map(r=>`<article class="reference"><span class="ref-year">${r.year} · JURNAL INTERNASIONAL</span><h3>${escapeHTML(r.title)}</h3><p class="ref-authors">${escapeHTML(r.authors)}</p><p class="ref-journal">${escapeHTML(r.journal)}</p><p class="ref-use">${escapeHTML(r.use)}</p><a href="https://doi.org/${encodeURIComponent(r.doi)}" rel="noopener noreferrer" target="_blank">DOI: ${escapeHTML(r.doi)} ↗</a></article>`).join('');
  }
  function setupNav() {
    const toggle=$('#navToggle');const nav=$('#navLinks');
    toggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(isOpen));});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
  }
  setupCatalog();renderCases();setupLab();renderReferences();setupNav();
})();
