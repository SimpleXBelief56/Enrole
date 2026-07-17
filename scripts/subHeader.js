(function () {
	function cleanTitle(title) {
		// Drop the trailing site-name segment (after the last " - " or " | ")
		var parts = (title || '').split(/\s+[-|]\s+/);
		if (parts.length > 1) parts.pop();
		var label = parts.join(' - ').trim();
		// Drop a trailing descriptor like "courses" / "programs"
		return label.replace(/\s+(courses|programs|certificates|degrees)$/i, '').trim();
	}

	function init() {
		// Skip the platform's bare homepage: a URL whose path+search ends exactly
		// with "index.jsp" (no categoryId / query string).
		if ((location.pathname + location.search).endsWith('index.jsp')) return;

		// A page-title heading may already exist (register.js promotes the
		// platform's own "Create a Profile" heading on the registration
		// wizard) — never add a second one.
		if (document.querySelector('.subHeader--page-title')) return;

		var label = cleanTitle(document.title);
		if (!label) return;

		var mainContent = document.getElementById('maincontent');
		// Per spec: only bail on amb-page layouts, where #maincontent is absent
		// *and* div.amb-page replaces it (e.g. Manufacturing page, C6B4C890).
		// Don't bail just because div.amb-page exists — it may coexist with
		// #maincontent on some platform templates.
		if (!mainContent) return;

		var subHeader = document.createElement('h1');
		// .subHeader--page-title marks the page-title header inserted at the top;
		// other subHeaders (Explore Topics, Upcoming Courses, All X Courses) use
		// a sans-serif font — see style.css.
		subHeader.className = 'subHeader subHeader--page-title';
		subHeader.textContent = label;
		mainContent.insertBefore(subHeader, mainContent.firstChild);

		var metaDesc = document.querySelector('meta[name="description"]');
		var description = metaDesc ? (metaDesc.getAttribute('content') || '').trim() : '';
		if (description) {
			var subHeaderDesc = document.createElement('p');
			subHeaderDesc.className = 'subHeaderDescription';
			subHeaderDesc.textContent = description;
			subHeader.insertAdjacentElement('afterend', subHeaderDesc);
		}

		// Only add "Explore Topics" when there's actually a cardContainer with
		// cards inside it. On pages like FEE99BA0 and 87C83B68 the platform
		// leaves the cardContainer empty, so showing the header is misleading.
		var cardContainer = mainContent.querySelector('.cardContainer');
		if (cardContainer && cardContainer.children.length > 0) {
			var cardsHeader = document.createElement('h1');
			cardsHeader.className = 'subHeader';
			cardsHeader.textContent = 'Explore Topics';
			cardContainer.parentNode.insertBefore(cardsHeader, cardContainer);
		}

		// Rewrite the platform's "Courses" listing header to include the page
		// title. Capitalize "Courses" to match the rest of the headings.
		var headers = mainContent.querySelectorAll('h1.subHeader');
		for (var h = 0; h < headers.length; h++) {
			if (headers[h].textContent.trim() === 'Courses') {
				headers[h].textContent = 'All ' + label + ' Courses';
				break;
			}
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
