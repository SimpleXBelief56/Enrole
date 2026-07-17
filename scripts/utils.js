(function () {
	// Tag category pages (index.jsp with a categoryId other than ROOT) on
	// <html> so style.css can scope category-only tweaks (heading spacing)
	// without touching the homepage (bare index.jsp or categoryId=ROOT).
	// Runs immediately — before first paint — so the rules never flash.
	var catMatch = location.search.match(/[?&]categoryId=([^&]*)/);
	if (/index\.jsp$/.test(location.pathname) && catMatch && catMatch[1] && catMatch[1] !== 'ROOT') {
		document.documentElement.classList.add('cf-category-page');
	}

	var hiddenNavItems = [
		'FC89CDF8',
		'FD88EE78'
	];

	function addInlineRegisterButton() {
		var form = document.querySelector('form[name="register"]');
		if (!form) return;
		var priceLabel = form.querySelector('label[for="feeCode"]');
		if (!priceLabel) return;
		var priceRow = priceLabel.closest('tr');
		if (!priceRow || !priceRow.parentNode) return;
		if (priceRow.nextElementSibling && priceRow.nextElementSibling.classList.contains('cf-inline-submit-row')) return;

		var newRow = document.createElement('tr');
		newRow.className = 'cf-inline-submit-row';

		var labelCell = document.createElement('td');
		labelCell.className = 'tableheading';

		var btnCell = document.createElement('td');
		var btn = document.createElement('input');
		btn.type = 'submit';
		btn.value = 'Add to Cart';
		btn.className = 'submit';
		btnCell.appendChild(btn);

		newRow.appendChild(labelCell);
		newRow.appendChild(btnCell);
		priceRow.parentNode.insertBefore(newRow, priceRow.nextSibling);
	}

	function fitCardText() {
		var nodes = document.querySelectorAll('.cardText');
		for (var i = 0; i < nodes.length; i++) {
			var el = nodes[i];
			el.style.fontSize = '';
			var size = parseFloat(getComputedStyle(el).fontSize);
			while (el.scrollWidth > el.clientWidth && size > 8) {
				size -= 0.5;
				el.style.fontSize = size + 'px';
			}
		}
	}

	function splitUpcomingCourses() {
		var MONTHS = /(January|February|March|April|May|June|July|August|September|October|November|December)/;
		var links = document.querySelectorAll('.upcomingCourse a.upcomingCourse');
		for (var i = 0; i < links.length; i++) {
			var a = links[i];
			var text = a.textContent.trim();
			var m = text.match(MONTHS);
			if (!m) continue;
			var idx = text.indexOf(m[1]);
			a.innerHTML = '<span class="uc-name">' + text.slice(0, idx).trim().replace(/-$/, '').trim() + '</span><span class="uc-date">' + text.slice(idx).trim() + '</span>';
		}
	}

	// Checkout Summary Review: the platform emits a "Review Your Courses"
	// subheader above the course list — remove it (no HTML control, so we
	// match on the heading text).
	function removeCheckoutReviewHeader() {
		if (location.pathname.indexOf('checkout.jsp') === -1) return;
		var headings = document.querySelectorAll('h1, h2, h3, .subHeader');
		for (var i = 0; i < headings.length; i++) {
			if (headings[i].textContent.trim() === 'Review Your Courses') {
				headings[i].parentNode.removeChild(headings[i]);
			}
		}
	}

	function applyUtils() {
		hiddenNavItems.forEach(function (id) {
			var el = document.getElementById('nav' + id);
			if (el) el.parentNode.removeChild(el);
		});
		addInlineRegisterButton();
		splitUpcomingCourses();
		fitCardText();
		removeCheckoutReviewHeader();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applyUtils);
	} else {
		applyUtils();
	}

	var resizeTimer;
	window.addEventListener('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(fitCardText, 150);
	});
})();
