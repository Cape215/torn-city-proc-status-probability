// ==UserScript==
// @name         Torn — Calculadora de Efecto de Arma
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Calcula la probabilidad de que se active el efecto de un arma según los ataques realizados sin activación. Panel movible.
// @author       Cape215 [2565308]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// ==/UserScript==
/*
Copyright (c) 2026 Cape215

Licensed under Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)
https://creativecommons.org/licenses/by-nd/4.0/

You are free to use and share this script, but you may not modify or redistribute modified versions.
*/

var _0x99=(function(){var _0xb1=[0x43,0x61,0x70,0x65,0x32,0x31,0x35];return(function(){return false;})()&&_0xb1.map(function(c){return String.fromCharCode(c);}).join('');});
(function () {
    '\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74';


    const _0xa1 = [67,97,112,101,50,49,53,32,91,50,53,54,53,51,48,56,93];
    const _0xa2 = _0xa1.map(function(c){ return String.fromCharCode(c); }).join('');


    (function _0xa3() {
        try {
            const _0xa4 = GM_info && GM_info.script && GM_info.script.author;
            const _0xa5 = '[TWC] Script modificado. Autor original: ';
            const _0xa6 = 'color:#f87171;font-weight:bold;';
            if (_0xa4 && _0xa4.trim() !== _0xa2) {
                console.warn('%c' + _0xa5 + _0xa2, _0xa6);
            }
        } catch (_e) {}
    })();

    var _0xc0 = {
        defaultBottom: '\x32\x30\x70\x78',
        defaultRight: '\x32\x30\x70\x78',
        futureAttacks: [1, 5, 10, 25, 50],
        storageKey: '\x74\x77\x63\x5f\x70\x61\x6e\x65\x6c\x5f\x70\x6f\x73'
    };

    GM_addStyle(`
        #torn-weapon-calc {
            position: fixed !important;
            bottom: ${_0xc0.defaultBottom} !important;
            right:  ${_0xc0.defaultRight}  !important;
            z-index: 99999 !important;
            font-family: Arial, sans-serif !important;
            user-select: none !important;
            width: fit-content !important;
        }
        #twc-toggle {
            background: #1a1a2e !important;
            color: #e0e0e0 !important;
            border: 1px solid #3a3a5c !important;
            border-radius: 6px !important;
            padding: 7px 14px !important;
            cursor: grab !important;
            font-size: 12px !important;
            font-weight: bold !important;
            letter-spacing: 0.5px !important;
            display: block !important;
            white-space: nowrap !important;
        }
        #twc-toggle:hover  { background: #2a2a4e !important; }
        #twc-toggle:active { cursor: grabbing !important; }
        #twc-_0xf2 {
            position: absolute !important;
            right: 0 !important;
            top: calc(100% + 4px) !important;
            background: #1a1a2e !important;
            border: 1px solid #3a3a5c !important;
            border-radius: 8px !important;
            padding: 14px !important;
            width: 270px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            cursor: grab !important;
            z-index: 1 !important;
        }
        #twc-_0xf2:active { cursor: grabbing !important; }
        #twc-_0xf2 h3 {
            margin: 0 0 12px 0 !important;
            font-size: 13px !important;
            color: #a78bfa !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            border-bottom: 1px solid #3a3a5c !important;
            padding-bottom: 8px !important;
        }
        .twc-field { margin-bottom: 10px !important; }
        .twc-field label {
            display: block !important;
            color: #9ca3af !important;
            font-size: 11px !important;
            margin-bottom: 4px !important;
            letter-spacing: 0.3px !important;
            cursor: default !important;
        }
        .twc-field input {
            width: 100% !important;
            background: #0f0f1e !important;
            border: 1px solid #3a3a5c !important;
            border-radius: 4px !important;
            color: #e0e0e0 !important;
            padding: 6px 8px !important;
            font-size: 13px !important;
            box-sizing: border-box !important;
            outline: none !important;
            cursor: text !important;
        }
        .twc-field input:focus { border-color: #a78bfa !important; }
        #twc-calc-btn {
            width: 100% !important;
            background: #4f46e5 !important;
            color: #fff !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 8px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            font-weight: bold !important;
            margin-top: 4px !important;
            letter-spacing: 0.3px !important;
        }
        #twc-calc-btn:hover { background: #4338ca !important; }
        #twc-results { margin-top: 12px !important; display: none !important; }
        .twc-result-title {
            font-size: 11px !important;
            color: #9ca3af !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            margin-bottom: 8px !important;
        }
        .twc-stat {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 5px 0 !important;
            border-bottom: 1px solid #2a2a3e !important;
        }
        .twc-stat:last-child { border-bottom: none !important; }
        .twc-stat-label { color: #9ca3af !important; font-size: 12px !important; }
        .twc-stat-value { font-weight: bold !important; font-size: 13px !important; }
        .twc-val-low    { color: #f87171 !important; }
        .twc-val-medium { color: #fbbf24 !important; }
        .twc-val-high   { color: #34d399 !important; }
        .twc-divider {
            border: none !important;
            border-top: 1px solid #3a3a5c !important;
            margin: 10px 0 !important;
        }
        .twc-unluck {
            background: #0f0f1e !important;
            border-radius: 4px !important;
            padding: 8px !important;
            margin-top: 8px !important;
            font-size: 11px !important;
            color: #9ca3af !important;
            line-height: 1.6 !important;
        }
        .twc-unluck span { color: #a78bfa !important; font-weight: bold !important; }
        #twc-error {
            color: #f87171 !important;
            font-size: 12px !important;
            margin-top: 6px !important;
            display: none !important;
        }
    `);

    var _0xf1 = document.createElement('\x64\x69\x76');
    _0xf1.id = '\x74\x6f\x72\x6e\x2d\x77\x65\x61\x70\x6f\x6e\x2d\x63\x61\x6c\x63';
    _0xf1.innerHTML = [
        '<button id="twc-toggle">\u2694 Probability of effect</button>',
        '<div id="twc-_0xf2" style="display:none;">',
        '<h3>\u2694 Prob. Efecto de Arma</h3>',
        '<div class="twc-field">',
        '<label>Probabilidad del efecto (%)</label>',
        '<input type="number" id="twc-prob" placeholder="Ej: 10" min="0.01" max="100" step="0.01">',
        '</div>',
        '<div class="twc-field">',
        '<label>Ataques realizados SIN activaci\u00f3n</label>',
        '<input type="number" id="twc-attacks" placeholder="Ej: 15" min="0" step="1">',
        '</div>',
        '<button id="twc-calc-btn">Calcular</button>',
        '<div id="twc-error">\u26a0 Introduce valores v\u00e1lidos (prob. entre 0.01% y 100%).</div>',
        '<div id="twc-results">',
        '<hr class="twc-divider">',
        '<div class="twc-result-title">Pr\u00f3ximo ataque</div>',
        '<div class="twc-stat"><span class="twc-stat-label">Prob. en 1 ataque</span><span class="twc-stat-value" id="twc-next">\u2014</span></div>',
        '<hr class="twc-divider">',
        '<div class="twc-result-title">Proyecci\u00f3n a futuro</div>',
        '<div id="twc-future-rows"></div>',
        '<hr class="twc-divider">',
        '<div class="twc-result-title">Tu racha actual</div>',
        '<div class="twc-unluck" id="twc-unluck-text">\u2014</div>',
        '</div></div>'
    ].join('');
    document.body.appendChild(_0xf1);

    function _0xd1(el, storageKey, onClickCallback) {
        var _0xe1 = false;
        var _0xe2 = false;
        var _0xe3, _0xe4, _0xe5, _0xe6;

        var _0xf3 = GM_getValue(storageKey, null);
        if (_0xf3) {
            el.style.setProperty('\x6c\x65\x66\x74',   _0xf3.left, '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
            el.style.setProperty('\x74\x6f\x70',    _0xf3.top,  '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
            el.style.setProperty('\x72\x69\x67\x68\x74',  '\x61\x75\x74\x6f',     '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
            el.style.setProperty('\x62\x6f\x74\x74\x6f\x6d', '\x61\x75\x74\x6f',     '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
        }

        el.addEventListener('\x6d\x6f\x75\x73\x65\x64\x6f\x77\x6e', function(e) {
            if (e.button !== 0) return;
            var insidePanel = e.target.closest('#twc-_0xf2');
            if (insidePanel && (e.target.tagName === '\x42\x55\x54\x54\x4f\x4e' || e.target.tagName === '\x49\x4e\x50\x55\x54' || e.target.tagName === '\x4c\x41\x42\x45\x4c')) return;
            _0xe1 = true;
            _0xe2 = false;
            var rect = el.getBoundingClientRect();
            _0xe3 = e.clientX;
            _0xe4 = e.clientY;
            _0xe5 = rect.left;
            _0xe6 = rect.top;
            e.preventDefault();
        });

        document.addEventListener('\x6d\x6f\x75\x73\x65\x6d\x6f\x76\x65', function(e) {
            if (!_0xe1) return;
            var dx = e.clientX - _0xe3;
            var dy = e.clientY - _0xe4;
            if (!_0xe2 && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) _0xe2 = true;
            if (_0xe2) {
                var _0xf6 = Math.max(0, Math.min(window.innerWidth  - el.offsetWidth,  _0xe5 + dx));
                var _0xf7  = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, _0xe6  + dy));
                el.style.setProperty('\x6c\x65\x66\x74',   _0xf6 + '\x70\x78', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
                el.style.setProperty('\x74\x6f\x70',    _0xf7  + '\x70\x78', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
                el.style.setProperty('\x72\x69\x67\x68\x74',  '\x61\x75\x74\x6f', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
                el.style.setProperty('\x62\x6f\x74\x74\x6f\x6d', '\x61\x75\x74\x6f', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
            }
        });

        document.addEventListener('\x6d\x6f\x75\x73\x65\x75\x70', function() {
            if (!_0xe1) return;
            _0xe1 = false;
            if (_0xe2) {
                GM_setValue(storageKey, { left: el.style.left, top: el.style.top });
            } else {
                if (onClickCallback) onClickCallback();
            }
        });
    }

    var _0xf2 = document.getElementById('\x74\x77\x63\x2d\x5f\x30\x78\x66\x32');

    function _0xd2() {
        _0xf2.style.display = _0xf2.style.display === '\x6e\x6f\x6e\x65' ? '\x62\x6c\x6f\x63\x6b' : '\x6e\x6f\x6e\x65';
    }

    _0xd1(_0xf1, _0xc0.storageKey, _0xd2);

    document.getElementById('\x74\x77\x63\x2d\x63\x61\x6c\x63\x2d\x62\x74\x6e').addEventListener('\x63\x6c\x69\x63\x6b', _0xd4);

    ['\x74\x77\x63\x2d\x70\x72\x6f\x62', '\x74\x77\x63\x2d\x61\x74\x74\x61\x63\x6b\x73'].forEach(function(id) {
        var el = document.getElementById(id);
        el.addEventListener('\x6b\x65\x79\x64\x6f\x77\x6e', function(e) { if (e.key === '\x45\x6e\x74\x65\x72') _0xd4(); });
        el.addEventListener('\x6d\x6f\x75\x73\x65\x64\x6f\x77\x6e', function(e) { e.stopPropagation(); });
    });

    function _0xd3(prob) {
        if (prob < 30) return '\x74\x77\x63\x2d\x76\x61\x6c\x2d\x6c\x6f\x77';
        if (prob < 70) return '\x74\x77\x63\x2d\x76\x61\x6c\x2d\x6d\x65\x64\x69\x75\x6d';
        return '\x74\x77\x63\x2d\x76\x61\x6c\x2d\x68\x69\x67\x68';
    }

    function _0xd4() {
        var _0xeb   = document.getElementById('\x74\x77\x63\x2d\x65\x72\x72\x6f\x72');
        var _0xec = document.getElementById('\x74\x77\x63\x2d\x72\x65\x73\x75\x6c\x74\x73');
        var _0xf4 = parseFloat(document.getElementById('\x74\x77\x63\x2d\x70\x72\x6f\x62').value);
        var _0xf5 = parseInt(document.getElementById('\x74\x77\x63\x2d\x61\x74\x74\x61\x63\x6b\x73').value);

        if (isNaN(_0xf4) || _0xf4 <= 0 || _0xf4 > 100 || isNaN(_0xf5) || _0xf5 < 0) {
            _0xeb.style.setProperty('\x64\x69\x73\x70\x6c\x61\x79', '\x62\x6c\x6f\x63\x6b', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
            _0xec.style.setProperty('\x64\x69\x73\x70\x6c\x61\x79', '\x6e\x6f\x6e\x65', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
            return;
        }
        _0xeb.style.setProperty('\x64\x69\x73\x70\x6c\x61\x79', '\x6e\x6f\x6e\x65', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');

        var p = _0xf4 / 100;
        var q = 1 - p;

        document.getElementById('\x74\x77\x63\x2d\x6e\x65\x78\x74').textContent = _0xf4.toFixed(2) + '%';
        document.getElementById('\x74\x77\x63\x2d\x6e\x65\x78\x74').className = '\x74\x77\x63\x2d\x73\x74\x61\x74\x2d\x76\x61\x6c\x75\x65\x20' + _0xd3(_0xf4);

        var _0xe7 = document.getElementById('\x74\x77\x63\x2d\x66\x75\x74\x75\x72\x65\x2d\x72\x6f\x77\x73');
        _0xe7.innerHTML = '';
        _0xc0.futureAttacks.forEach(function(k) {
            var _0xe8 = _0xf5 + k;
            var prob = (1 - Math.pow(q, _0xe8)) * 100;
            var row = document.createElement('\x64\x69\x76');
            row.className = '\x74\x77\x63\x2d\x73\x74\x61\x74';
            row.innerHTML = '<span class="twc-stat-label">' + k + ' ataques m\u00e1s <span style="color:#6366f1;font-size:10px;">(total: ' + _0xe8 + ')</span></span>' +
                '<span class="twc-stat-value ' + _0xd3(prob) + '">' + prob.toFixed(2) + '%</span>';
            _0xe7.appendChild(row);
        });

        var _0xe9 = Math.pow(q, _0xf5) * 100;
        var _0xea = document.getElementById('\x74\x77\x63\x2d\x75\x6e\x6c\x75\x63\x6b\x2d\x74\x65\x78\x74');

        if (_0xf5 === 0) {
            _0xea.innerHTML = 'A\u00fan no has hecho ning\u00fan ataque.';
        } else {
            var label = _0xe9 < 10
                ? '\u26a0 \u00a1Mala suerte significativa!'
                : _0xe9 < 30
                ? '\x55\x6e\x20\x70\x6f\x63\x6f\x20\x64\x65\x20\x6d\x61\x6c\x61\x20\x73\x75\x65\x72\x74\x65\x2c\x20\x65\x73\x20\x6e\x6f\x72\x6d\x61\x6c\x2e'
                : 'Completamente normal estad\u00edsticamente.';
            _0xea.innerHTML = 'Llevas <span>' + _0xf5 + '</span> ataques sin activaci\u00f3n.<br>' +
                'La prob. de que eso ocurra es <span>' + _0xe9.toFixed(2) + '%</span>.<br>' + label;
        }

        _0xec.style.setProperty('\x64\x69\x73\x70\x6c\x61\x79', '\x62\x6c\x6f\x63\x6b', '\x69\x6d\x70\x6f\x72\x74\x61\x6e\x74');
    }

})();