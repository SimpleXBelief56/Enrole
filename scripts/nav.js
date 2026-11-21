(function () {
	function addTestBanner() {
		if (document.getElementById("testBanner")) return;

		var header = document.getElementById("header");
		if (!header) return;

		var testBanner = document.createElement("div");
		testBanner.id = "testBanner";
		testBanner.innerHTML = '<div style="background:#e6e6e6;padding:20px 10px;text-align:center;font-family:Arial,sans-serif;">' +
			'<h1 style="color:#4d148c;font-size:36px;font-weight:700;margin:0;line-height:1.2;">' +
				'Education for Careers, Business, and Life.' +
			'</h1>' +
			'<p style="margin:18px auto 0;font-size:18px;color:#666666;font-weight:500;">' +
				'Courses • Certifications • Business Services • Personal Enrichment' +
			'</p>' +
			'</div>';
		header.insertAdjacentElement("afterend", testBanner);
	}

	function init() {
		document.querySelector('#header_title a').setAttribute('href', 'index.jsp');

		addTestBanner();

		var breadcrumbs = document.getElementById('breadcrumbTop');
		breadcrumbs.className = '';
		if (breadcrumbs.children.length > 1) {
			breadcrumbs.style.visibility = 'visible';
		}

		if (typeof jQuery !== 'undefined') {
			jQuery('td.tableheading:contains(Schedule:)').next('td:contains(Self-paced)').closest('table').find('td.tableheading:contains(Times:)').closest('tr').css('display', 'none');
		}
		
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
