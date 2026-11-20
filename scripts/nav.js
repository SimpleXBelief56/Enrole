(function () {
	function init() {
		document.querySelector('#header_title a').setAttribute('href', 'index.jsp');


		// var headerTitle = document.getElementById('header_title');
		// if (headerTitle && !headerTitle.querySelector('.cf_header_subtitle')) {
		// 	var span = document.createElement('span');
		// 	span.className = 'cf_header_subtitle';
		// 	span.textContent = 'CONTINUING EDUCATION AND WORKFORCE DEVELOPMENT';
		// 	headerTitle.appendChild(span);
		// }

		if ((location.pathname + location.search).endsWith('index.jsp')){
			if(document.getElementById("testBanner")) return;

			var header = document.getElementById("header");
			if(!header) return;

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

		var breadcrumbs = document.getElementById('breadcrumbTop');
		breadcrumbs.className = '';
		if (breadcrumbs.children.length > 1) {
			breadcrumbs.style.visibility = 'visible';
		}

		if (typeof jQuery !== 'undefined') {
			jQuery('td.tableheading:contains(Schedule:)').next('td:contains(Self-paced)').closest('table').find('td.tableheading:contains(Times:)').closest('tr').css('display', 'none');
		}

		// if (location.pathname.startsWith('/testcebergen/')) {
		// 	var test_links = document.querySelectorAll('a[data-test-href]');
		// 	for (var i = test_links.length - 1; i >= 0; i--) {
		// 		test_links[i].setAttribute('href', test_links[i].getAttribute('data-test-href'));
		// 	}
		// }
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
