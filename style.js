// Polyfills
if (!String.prototype.startsWith) {
	Object.defineProperty(String.prototype, 'startsWith', {
		value: function(search, rawPos) {
			pos = rawPos > 0 ? rawPos|0 : 0;
			return this.substring(pos, pos + search.length) === search;
		}
	});
}

// Resolve the latest commit SHA, then load loader.js at that SHA.
// This file itself never needs to change — all script/CSS management lives in loader.js.
(function () {
	var CDN = 'https://cdn.jsdelivr.net/gh/SimpleXBelief56/Enrole@';

	function loadLoader(sha) {
		window.cf_jsdelivr_sha = sha;
		var s = document.createElement('script');
		s.src = CDN + sha + '/scripts/loader.js';
		document.head.appendChild(s);
	}

	fetch('https://api.github.com/repos/SimpleXBelief56/Enrole/git/ref/heads/main')
		.then(function (r) { return r.json(); })
		.then(function (data) {
			loadLoader(data.object.sha.slice(0, 7));
		})
		.catch(function () {
			loadLoader('main');
		});
})();
