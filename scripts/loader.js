// Script and CSS manifest. Edit this file to add or remove assets —
// it is always fetched at a pinned SHA so no CDN purge is ever needed.
(function () {
	var scripts = [
		'nav.js',
		'footer.js',
		'sidebar-menu.js',
		// 'category-loader.js',
		'utils.js',
		'register.js',
		'subHeader.js'
	];

	var cssFiles = [
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
		'style.css'
	];

	var ownSrc = document.currentScript ? document.currentScript.src : '';
	var match = ownSrc.match(/Enrole@([^/]+)\//);
	var sha = match ? match[1] : (window.cf_jsdelivr_sha || 'main');
	window.cf_jsdelivr_sha = sha;
	var base = 'https://cdn.jsdelivr.net/gh/SimpleXBelief56/Enrole@' + sha + '/';
	loadAll(base + 'scripts/', base);

	function loadAll(scriptBase, cssBase) {
		cssFiles.forEach(function (href) {
			var l = document.createElement('link');
			l.rel = 'stylesheet';
			l.href = /^https?:\/\//.test(href) ? href : cssBase + href;
			document.head.appendChild(l);
		});
		scripts.forEach(function (src) {
			var s = document.createElement('script');
			s.src = /^https?:\/\//.test(src) ? src : scriptBase + src;
			document.head.appendChild(s);
		});
	}
})();
