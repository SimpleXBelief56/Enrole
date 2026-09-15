/*
 * @Description: Bergen Community College footer.
 * @Usage: <script type="text/javascript" src="style.js" id="bergen-wrapper-script"></script>
 * @Attributes:
 * container-width (default: 1140px)
 * container-padding (default: 30px)
 * footer-placement
 * emergency-link, directory-link, title-ix-link, military-link, privacy-link, terms-link
 */

(function () {

	console.log('[footer.js] script loaded');

	if (document.querySelector('#custom_footer_footer')) {
		console.log('[footer.js] already injected, skipping');
		return;
	}

	var tag = document.getElementById('bergen-wrapper-script') || document.createElement('div'),
		footer_placement  = tag.getAttribute('footer-placement'),
		container_width   = tag.getAttribute('container-width')   || '1600px',
		container_padding = tag.getAttribute('container-padding') || '30px',
		separator         = tag.getAttribute('separator')      || '|';

	var campuses = [
		{
			name: 'Paramus Campus',
			address: '400 Paramus Road<br>Paramus, NJ 07652',
			phone: '201-447-7488',
			emailAddress: 'continuinged@bergen.edu',
			directions: 'https://maps.google.com/?q=400+Paramus+Road,+Paramus,+NJ+07652'
		},
		{
			name: 'Philip Ciarco Jr. Learning Center',
			address: '355 Main Street<br>Hackensack, NJ 07601',
			phone: '201-489-1551',
			directions: 'https://maps.google.com/?q=355+Main+Street,+Hackensack,+NJ+07601'
		},
		{
			name: 'Meadowlands Campus',
			address: '1280 Wall Street West<br>Lyndhurst, NJ 07071',
			phone: '201-447-7920',
			directions: 'https://maps.google.com/?q=1280+Wall+Street+West,+Lyndhurst,+NJ+07071'
		}
	];

	var resources = [
		'<a href="https://drive.google.com/file/d/1tT68skNVLUqR-Rc5gBTG5kBXLfc4zCBA/view?usp=sharing" target="_blank" rel="noopener">Staff Directory</a>',
		'<a href="https://ce.bergen.edu/continuing-education-career-services/" target="_blank" rel="noopener">CE Career Support</a>',
		'<a href="https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=010bf3a6-6a65-40e6-867b-0fdaf8595884&ccId=19000101_000001&lang=en_US" target="_blank" rel="noopener">Work at Bergen</a>',
		'<a href="https://bergen.edu/ce/teaching-opportunities-proposals/" target="_blank" rel="noopener">Propose a Class</a>'
	];

	var staff_links = [
		'<a href="https://www.enrole.com:8891/testcebergen/Enrole.html" target="_blank" rel="noopener">Staff Login</a>',
		'<a href="http://workforcenow.adp.com/" target="_blank" rel="noopener">ADP</a>',
		'<a href="https://www.aaiscloud.com/BergenCC/Calendars/DailyGridCalendar.aspx" target="_blank" rel="noopener">Ad Astra</a>'
	];


	// ── Footer host ──────────────────────────────────────────────────────────
	var footer_host = document.createElement('div');
	footer_host.style.cssText = 'clear: both;';

	footer_host.style.setProperty('--cf-container-width', container_width);
	footer_host.style.setProperty('--cf-container-padding', container_padding);

	function campusCol(c) {
		var emailHtml = '';

		if (c.emailAddress) {
			emailHtml =
				'<p class="cf_email">' +
				c.emailAddress +
				'</p>';
		}

		return '<div class="custom_footer_col">' +
				'<h3>' + c.name + '</h3>' +
				'<address>' + c.address + '</address>' +
				'<p class="cf_phone">' + c.phone + '</p>' +
				emailHtml +
				'<a href="' + c.directions + '" target="_blank" rel="noopener">Directions</a>' +
				'</div>';
	}

	function linkCol(heading, links) {
		var items = '';
		for (var i = 0; i < links.length; i++) items += '<li>' + links[i] + '</li>';
		return '<div class="custom_footer_col"><h3>' + heading + '</h3><ul>' + items + '</ul></div>';
	}

var footer_div = document.createElement('div');
	footer_div.innerHTML =
		'<footer id="custom_footer_footer" aria-label="Bergen Community College footer">' +
		'  <div id="custom_footer_links">' +
		'    <div class="custom_footer_container">' +
		'      <h1 class="cf_footer_brand">Bergen Community College</h1>' +
		'      <div id="custom_footer_columns">' +
		          campusCol(campuses[0]) +
		          campusCol(campuses[1]) +
		          campusCol(campuses[2]) +
		'        <div class="custom_footer_divider"></div>' +
		          linkCol('Resources', resources) +
		          linkCol('Staff Links', staff_links) +
		'      </div>' +
		'    </div>' +
		'  </div>' +
		'</footer>';

	footer_host.appendChild(footer_div);

	console.log('[footer.js] readyState:', document.readyState);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', inject);
	} else {
		inject();
	}

	function inject() {
		console.log('[footer.js] inject() called, footer_placement:', footer_placement);
		if (!footer_placement) {
			document.body.appendChild(footer_host);
			console.log('[footer.js] appended to body');
			return;
		}
		var parts = footer_placement.split(' ');
		var loc   = parts[parts.length - 1];
		var pos   = parts.length > 1 ? parts[0] : 'after';
		var el    = document.getElementById(loc);
		console.log('[footer.js] placement target #' + loc + ':', el);
		if (!el) { document.body.appendChild(footer_host); return; }
		switch (pos) {
			case 'before':  el.parentNode.insertBefore(footer_host, el); break;
			case 'prepend': el.insertBefore(footer_host, el.firstChild); break;
			case 'append':  el.appendChild(footer_host); break;
			default:        el.parentNode.insertBefore(footer_host, el.nextSibling);
		}
		console.log('[footer.js] injected with position "' + pos + '" relative to #' + loc);
	}

})();
