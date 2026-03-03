// ===================== SNOWFLAKES =====================
const sf = document.getElementById('snowflakes')
const chars = ['❄', '❅', '❆', '✦', '·', '*']
for (let i = 0; i < 40; i++) {
	const s = document.createElement('span')
	s.className = 'snowflake'
	s.style.left = Math.random() * 100 + 'vw'
	s.style.fontSize = Math.random() * 0.8 + 0.4 + 'em'
	s.style.opacity = Math.random() * 0.5 + 0.1
	s.style.animationDuration = Math.random() * 12 + 8 + 's'
	s.style.animationDelay = Math.random() * 12 + 's'
	s.textContent = chars[Math.floor(Math.random() * chars.length)]
	sf.appendChild(s)
}

// ===================== STATE =====================
let currentMethod = 1

function switchMethod(m) {
	currentMethod = m
	document.getElementById('tab1').classList.toggle('active', m === 1)
	document.getElementById('tab2').classList.toggle('active', m === 2)
	document.getElementById('method-desc-1').style.display =
		m === 1 ? 'block' : 'none'
	document.getElementById('method-desc-2').style.display =
		m === 2 ? 'block' : 'none'
	document.getElementById('t-inputs-section').style.display =
		m === 2 ? 'block' : 'none'
	document.getElementById('results').style.display = 'none'
}

function toggleFold(bodyId, arrowId) {
	const b = document.getElementById(bodyId)
	const a = document.getElementById(arrowId)
	b.classList.toggle('open')
	if (a) a.classList.toggle('open')
}

// ===================== BUILD TABLE =====================
function buildTable() {
	const n = parseInt(document.getElementById('nAlt').value) || 4
	const m = parseInt(document.getElementById('nCrit').value) || 6

	// Criteria names + types
	let chtml =
		'<div class="card-title" style="margin-bottom:12px;">📋 Критерії ефективності</div>'
	chtml +=
		'<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:4px;">'
	chtml +=
		'<div class="alt-header">Критерій</div><div class="alt-header">Назва</div><div class="alt-header">Тип</div></div>'
	chtml += '<div style="display:grid; gap:8px;" id="crit-rows">'
	const defCrits = [
		'Продуктивність (м³/год)',
		'Дальність (м)',
		'Енергоспоживання (кВт)',
		'Маса (кг)',
		'Рівень шуму (дБ)',
		'Ціна (тис. грн)',
		'Надійність (1-10)',
		'Мороз. стійкість (°C)',
		'Кут обертання (°)',
		'Гарантія (місяці)',
	]
	const defTypes = [
		'max',
		'max',
		'min',
		'min',
		'min',
		'min',
		'max',
		'max',
		'max',
		'max',
	]
	for (let i = 0; i < m; i++) {
		chtml += `<div style="display:grid; grid-template-columns:80px 1fr 140px; gap:10px; align-items:center;">
  <div class="alt-label"><span class="alt-badge">K${i + 1}</span></div>
  <input type="text" id="crit${i}" value="${defCrits[i] || 'Критерій ' + (i + 1)}" placeholder="Назва критерію">
  <select id="ctype${i}" class="crit-type-select">
    <option value="max" ${(defTypes[i] || 'max') === 'max' ? 'selected' : ''}>▲ Максимум (краще більше)</option>
    <option value="min" ${(defTypes[i] || 'max') === 'min' ? 'selected' : ''}>▼ Мінімум (краще менше)</option>
  </select>
</div>`
	}
	chtml += '</div>'
	document.getElementById('crit-names-section').innerHTML = chtml

	// Alt names
	let ahtml =
		'<div class="card-title" style="margin-bottom:12px;">🏔 Альтернативи (пушки SnowTeam)</div>'
	ahtml +=
		'<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:10px;">'
	const defAlts = [
		'SnowTeam PRO-X',
		'SnowTeam ULTRA',
		'SnowTeam ECO',
		'SnowTeam MAX-K',
		'SnowTeam TURBO',
		'SnowTeam LITE',
		'SnowTeam ALPINE',
		'SnowTeam PEAK',
	]
	for (let j = 0; j < n; j++) {
		ahtml += `<div><label>Пушка x${j + 1}</label><input type="text" id="alt${j}" value="${defAlts[j] || 'Пушка ' + (j + 1)}"></div>`
	}
	ahtml += '</div>'
	document.getElementById('alt-names-section').innerHTML = ahtml

	// Matrix
	let mhtml =
		'<div class="card-title" style="margin-bottom:12px;">📊 Числові оцінки</div>'
	// header
	mhtml +=
		'<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:0.82rem;">'
	mhtml +=
		'<tr><th style="padding:8px 10px; text-align:left; color:var(--accent2); font-family:Orbitron,monospace; font-size:0.62rem; letter-spacing:2px; border-bottom:1px solid var(--border2);">Критерій</th>'
	for (let j = 0; j < n; j++)
		mhtml += `<th style="padding:8px 10px; text-align:center; color:var(--accent2); font-family:Orbitron,monospace; font-size:0.62rem; letter-spacing:2px; border-bottom:1px solid var(--border2);" id="mth${j}">x${j + 1}</th>`
	mhtml += '</tr>'

	const demoData = [
		[320, 280, 350, 300, 260, 310, 400, 280],
		[45, 38, 50, 42, 35, 40, 55, 38],
		[22, 18, 25, 20, 15, 12, 30, 18],
		[180, 150, 200, 170, 130, 110, 250, 160],
		[75, 68, 78, 72, 65, 60, 80, 70],
		[85, 72, 95, 80, 65, 55, 110, 75],
		[8, 7, 9, 8, 6, 7, 9, 8],
		[25, 22, 28, 25, 20, 18, 30, 22],
		[360, 320, 360, 340, 270, 300, 360, 330],
		[24, 18, 36, 24, 12, 12, 36, 18],
	]

	for (let i = 0; i < m; i++) {
		mhtml += `<tr>
  <td style="padding:8px 10px; color:var(--text); border-bottom:1px solid rgba(30,136,229,0.08);" id="mrow${i}">K${i + 1}</td>`
		for (let j = 0; j < n; j++) {
			const v = demoData[i]?.[j] ?? Math.floor(Math.random() * 90 + 10)
			mhtml += `<td style="padding:6px 8px; border-bottom:1px solid rgba(30,136,229,0.08);">
    <input type="number" id="o${i}_${j}" value="${v}" style="text-align:center; min-width:70px;">
  </td>`
		}
		mhtml += '</tr>'
	}
	mhtml += '</table></div>'
	document.getElementById('matrix-section').innerHTML = mhtml

	// Weights
	const defWeights = [9, 8, 7, 6, 7, 8, 9, 7, 6, 8]
	let whtml =
		'<div class="card-title" style="margin-bottom:12px;">⚖ Ваги критеріїв (з довільного інтервалу [1, 10])</div>'
	whtml +=
		'<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:12px;">'
	for (let i = 0; i < m; i++) {
		whtml += `<div class="weight-item">
  <div class="weight-label">K${i + 1} вага</div>
  <input type="number" id="w${i}" value="${defWeights[i] || 7}" min="0" max="100" step="0.1" style="text-align:center;">
</div>`
	}
	whtml += '</div>'
	document.getElementById('weights-section').innerHTML = whtml

	// T values for method 2
	const defT = [350, 50, 18, 160, 65, 70, 9, 28, 360, 36]
	let thtml =
		'<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:12px;">'
	for (let i = 0; i < m; i++) {
		thtml += `<div class="weight-item">
  <div class="weight-label">t${i + 1} (K${i + 1})</div>
  <input type="number" id="t${i}" value="${defT[i] ?? 50}" style="text-align:center;">
</div>`
	}
	thtml += '</div>'
	document.getElementById('t-inputs-row').innerHTML = thtml

	document.getElementById('data-section').style.display = 'block'
	document.getElementById('t-inputs-section').style.display =
		currentMethod === 2 ? 'block' : 'none'

	// Update matrix header alt names live
	for (let j = 0; j < n; j++) {
		document.getElementById('alt' + j).addEventListener('input', function () {
			const th = document.getElementById('mth' + j)
			if (th) th.textContent = this.value || 'x' + (j + 1)
		})
	}
	for (let i = 0; i < m; i++) {
		document.getElementById('crit' + i).addEventListener('input', function () {
			const td = document.getElementById('mrow' + i)
			if (td) td.textContent = this.value || 'K' + (i + 1)
		})
	}

	document.getElementById('results').style.display = 'none'
}

// ===================== FILL DEMO =====================
function fillDemo() {
	buildTable()
}

// ===================== CALC =====================
function calculate() {
	const n = parseInt(document.getElementById('nAlt').value) || 4
	const m = parseInt(document.getElementById('nCrit').value) || 6

	const altNames = []
	for (let j = 0; j < n; j++)
		altNames.push(document.getElementById('alt' + j)?.value || 'x' + (j + 1))

	const critNames = []
	const critTypes = []
	for (let i = 0; i < m; i++) {
		critNames.push(document.getElementById('crit' + i)?.value || 'K' + (i + 1))
		critTypes.push(document.getElementById('ctype' + i)?.value || 'max')
	}

	// Raw matrix
	const O = []
	for (let i = 0; i < m; i++) {
		O.push([])
		for (let j = 0; j < n; j++)
			O[i].push(
				parseFloat(document.getElementById('o' + i + '_' + j)?.value) || 0,
			)
	}

	// Raw weights
	const pw = []
	let sumW = 0
	for (let i = 0; i < m; i++) {
		pw.push(parseFloat(document.getElementById('w' + i)?.value) || 1)
		sumW += pw[i]
	}
	const alpha = pw.map(p => p / sumW)

	let Z
	if (currentMethod === 1) {
		// Method 1: normalize [0,1] by min/max + criterion type
		Z = []
		for (let i = 0; i < m; i++) {
			const row = O[i]
			const mn = Math.min(...row),
				mx = Math.max(...row)
			Z.push(
				row.map(v => {
					if (mx === mn) return 1
					const norm = (v - mn) / (mx - mn)
					return critTypes[i] === 'max' ? norm : 1 - norm
				}),
			)
		}
	} else {
		// Method 2: distance from satisfaction point
		const T = []
		for (let i = 0; i < m; i++)
			T.push(parseFloat(document.getElementById('t' + i)?.value) || 0)
		Z = []
		for (let i = 0; i < m; i++) {
			const row = O[i]
			const mn = Math.min(...row),
				mx = Math.max(...row)
			Z.push(
				row.map(v => {
					const denom = Math.max(T[i] - mn, mx - T[i])
					if (denom === 0) return 1
					return 1 - Math.abs(T[i] - v) / denom
				}),
			)
		}
	}

	const foldType = document.getElementById('fold-type').value

	function computeFold(type) {
		const scores = []
		for (let j = 0; j < n; j++) {
			let s = 0
			if (type === 'avg') {
				for (let i = 0; i < m; i++) s += alpha[i] * Z[i][j]
			} else if (type === 'pess') {
				let denom = 0
				for (let i = 0; i < m; i++) {
					if (Z[i][j] > 0) denom += alpha[i] / Z[i][j]
					else {
						denom = Infinity
						break
					}
				}
				s = denom > 0 ? 1 / denom : 0
			} else if (type === 'geom') {
				s = 1
				for (let i = 0; i < m; i++)
					s *= Math.pow(Math.max(Z[i][j], 0.0001), alpha[i])
			} else if (type === 'opt') {
				for (let i = 0; i < m; i++) s += alpha[i] * Z[i][j] * Z[i][j]
				s = Math.sqrt(s)
			}
			scores.push(s)
		}
		return scores
	}

	let mainScores, foldLabel
	if (foldType === 'all') {
		mainScores = computeFold('avg')
		foldLabel = 'Середня M₃'
	} else {
		mainScores = computeFold(foldType)
		const labels = {
			avg: 'Середня M₃',
			pess: 'Песимістична M₁',
			geom: 'Обережна M₂',
			opt: 'Оптимістична M₄',
		}
		foldLabel = labels[foldType]
	}

	// Sort
	const ranked = [
		...mainScores.map((s, j) => ({ j, s, name: altNames[j] })),
	].sort((a, b) => b.s - a.s)
	const maxS = Math.max(...mainScores)
	const winner = ranked[0]

	// ---- RENDER RESULTS ----
	// Cards
	let cardsHtml = ''
	ranked.forEach((r, rank) => {
		const isW = rank === 0
		cardsHtml += `<div class="result-card ${isW ? 'winner' : ''}">
  <div class="result-card-name">${r.name}</div>
  <div class="result-card-score">${r.s.toFixed(4)}</div>
  <div class="result-card-rank">${rank === 0 ? '🏆 1-е місце' : rank === 1 ? '🥈 2-е місце' : rank === 2 ? '🥉 3-є місце' : rank + 1 + '-е місце'}</div>
  ${isW ? '<div class="winner-badge">❄ Найкраща пушка</div>' : ''}
</div>`
	})
	document.getElementById('results-cards').innerHTML = cardsHtml

	// Bars
	let barsHtml = `<div style="margin-bottom:8px; font-size:0.72rem; color:var(--text-dim); letter-spacing:2px; text-transform:uppercase;">${foldLabel}</div>`
	ranked.forEach((r, rank) => {
		const pct = maxS > 0 ? (r.s / maxS) * 100 : 0
		barsHtml += `<div class="bar-row ${rank === 0 ? 'is-winner' : ''}">
  <div class="bar-label">${rank === 0 ? '🏆 ' : ''}<strong>${r.name}</strong></div>
  <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
  <div class="bar-val">${r.s.toFixed(3)}</div>
</div>`
	})
	document.getElementById('results-bars').innerHTML = barsHtml

	// All folds comparison
	if (foldType === 'all') {
		const allTypes = ['avg', 'pess', 'geom', 'opt']
		const allLabels = [
			'M₃ Середня',
			'M₁ Песимістична',
			'M₂ Обережна',
			'M₄ Оптимістична',
		]
		const allScores = allTypes.map(t => computeFold(t))
		let thtml = `<table class="cmp-table"><tr><th>Пушка</th>`
		allLabels.forEach(l => (thtml += `<th>${l}</th>`))
		thtml += '<th>Середнє</th><th>Місце (M₃)</th></tr>'

		// find winners per fold
		const foldWinners = allScores.map(sc => {
			let mx = 0,
				wi = 0
			sc.forEach((v, i) => {
				if (v > mx) {
					mx = v
					wi = i
				}
			})
			return wi
		})
		const avgScores = altNames.map(
			(_, j) => allScores.reduce((s, sc) => s + sc[j], 0) / allScores.length,
		)

		altNames.forEach((name, j) => {
			const rank3 = ranked.findIndex(r => r.j === j)
			thtml += `<tr class="${ranked[0].j === j ? 'winner-row' : ''}">
    <td style="text-align:left; font-weight:${ranked[0].j === j ? 700 : 400}; color:${ranked[0].j === j ? 'var(--ice)' : ''};">${ranked[0].j === j ? '🏆 ' : ''} ${name}</td>`
			allScores.forEach((sc, fi) => {
				const isW = foldWinners[fi] === j
				thtml += `<td class="${isW ? 'best-col' : ''}">${sc[j].toFixed(4)}</td>`
			})
			thtml += `<td style="color:var(--accent3);">${avgScores[j].toFixed(4)}</td>`
			thtml += `<td>${rank3 + 1}</td></tr>`
		})
		thtml += '</table>'
		document.getElementById('comparison-table').innerHTML = thtml
		document.getElementById('all-folds-card').style.display = 'block'
	} else {
		document.getElementById('all-folds-card').style.display = 'none'
	}

	// Normalized matrix
	let nthtml = `<table class="norm-table"><tr><th>Критерій</th>`
	altNames.forEach(aName => (nthtml += `<th>${aName}</th>`))
	nthtml += '</tr>'
	for (let i = 0; i < m; i++) {
		nthtml += `<tr><td style="text-align:left; color:var(--accent2);">${critNames[i]}</td>`
		const rowVals = Z[i]
		const rowMax = Math.max(...rowVals)
		rowVals.forEach(v => {
			const cls = v >= rowMax ? 'high' : v < 0.2 ? 'low' : ''
			nthtml += `<td class="${cls}">${v.toFixed(4)}</td>`
		})
		nthtml += '</tr>'
	}
	nthtml += '</table>'
	document.getElementById('norm-table').innerHTML = nthtml

	// Weights display
	let wdhtml = '<div style="display:flex; flex-wrap:wrap; gap:10px;">'
	for (let i = 0; i < m; i++) {
		wdhtml += `<div style="background:rgba(30,136,229,0.08); border:1px solid var(--border); padding:8px 14px; border-radius:2px; text-align:center; min-width:100px;">
  <div style="font-size:0.68rem; color:var(--text-dim); letter-spacing:1px;">${critNames[i]}</div>
  <div style="font-family:Orbitron,monospace; font-size:0.9rem; color:var(--accent3); margin-top:2px;">α${i + 1} = ${alpha[i].toFixed(4)}</div>
  <div style="font-size:0.7rem; color:var(--text-dim);">p = ${pw[i]}</div>
</div>`
	}
	wdhtml += '</div>'
	document.getElementById('weights-display').innerHTML = wdhtml

	// Conclusion
	const methodName =
		currentMethod === 1 ? 'нормування по min/max' : 'точки задоволення ОПР'
	const foldDesc = foldType === 'all' ? 'всіх чотирьох згорток' : foldLabel
	let concl = `За результатами багатокритеріального аналізу методом <strong style="color:var(--accent3)">${methodName}</strong> із застосуванням <strong style="color:var(--accent3)">${foldDesc}</strong>:<br><br>`
	concl += `🏆 <strong style="color:var(--ice)">Найкраща пушка для осніження — «${winner.name}»</strong> з інтегрованою оцінкою <strong style="color:var(--accent3)">${winner.s.toFixed(4)}</strong>.<br><br>`
	concl += '<strong style="color:var(--accent2)">Рейтинг:</strong><br>'
	ranked.forEach((r, i) => {
		const pct = winner.s > 0 ? ((r.s / winner.s) * 100).toFixed(1) : 0
		concl += `${i + 1}. ${r.name} — ${r.s.toFixed(4)} (${pct}% від лідера)<br>`
	})
	if (foldType === 'all') {
		concl += `<br>📊 <strong style="color:var(--accent2)">Порівняння згорток:</strong> Субординація M₁ ≤ M₂ ≤ M₃ ≤ M₄ дотримана. Оптимістична згортка завищує оцінки, песимістична — занижує. Рекомендується використовувати середню M₃ як основну.`
	}
	document.getElementById('conclusion-text').innerHTML = concl

	document.getElementById('results').style.display = 'block'
	document
		.getElementById('results')
		.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ===================== INIT =====================
buildTable()
