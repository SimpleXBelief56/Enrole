(function () {
	console.log('[register.js] loaded, pathname:', location.pathname);

	if (location.pathname.indexOf('addAttendee.jsp') === -1) {
		console.log('[register.js] not on addAttendee.jsp, exiting');
		return;
	}

	/**
	 * Prepare For New Feature Methodology
	 * 
	 * - [ ] Create the five Page Break UDFs in `testcebergen`.
	 * - [ ] Confirm that Enrole preserves their configured positions.
	 * - [ ] Verify that JavaScript can detect each marker.
	 * - [ ] Dynamically group registration fields into five pages.
	 * - [ ] Ensure that all Page Break UDFs remain hidden from students.
	 * - [ ] Add an ordinary registration field and verify that it appears on the correct page automatically.
	 * - [ ] Remove and rearrange fields to verify that page grouping remains functional.
	 * - [ ] Verify navigation, field validation, and registration submission.
	 */

	/*
	 * Wizard step layout (5 steps) for addAttendee.jsp?source=register.
	 *
	 * Rows are platform <tr id="row…"> elements EXCEPT the two retype fields
	 * (retypepassword, retypereminder). The platform emits those as bare <td>
	 * cells without a wrapping <tr>, so the browser foster-parents them into an
	 * anonymous row with no id. We tag those rows at runtime (see wrapRetypes)
	 * so showStep() can control them like any other row.
	 */



	// var STEPS = [
	// 	{
	// 		title: 'Your Profile',
	// 		rows: [
	// 			'rowpersonType',
	// 			'rowcompanyAdministrator',
	// 			'rowfirstName',
	// 			'rowlastName',
	// 			'rowUDTESTCEBERGENCOLLEAGUEPREFERRED',
	// 			'rowUDTESTCEBERGENCOLLEAGUEDATEOFBIRTH',
	// 			'rowgender'
	// 		]
	// 	},
	// 	{
	// 		title: 'Login & Security',
	// 		rows: [
	// 			'rowemail',
	// 			'rowusername',
	// 			'rowpassword',
	// 			'rowretypepassword',
	// 			'rowsq',
	// 			'rowreminder',
	// 			'rowretypereminder'
	// 		]
	// 	},
	// 	{
	// 		title: 'Contact',
	// 		rows: [
	// 			'rowmobilePhone',
	// 			'rowaddress1',
	// 			'rowaddress2',
	// 			'rowcity',
	// 			'rowstate',
	// 			'rowzip',
	// 			'rowcountry'
	// 		]
	// 	},
	// 	{
	// 		title: 'Emergency Contacts',
	// 		rows: [
	// 			'rowUDTESTCEBERGENKTEMERGCONTACTNAME1',
	// 			'rowUDTESTCEBERGENKTEMERGPHONE1',
	// 			'rowUDTESTCEBERGENKTEMERGCONTACTNAME2',
	// 			'rowUDTESTCEBERGENKTEMERGPHONE2'
	// 		]
	// 	},
	// 	{
	// 		title: 'About You',
	// 		rows: [
	// 			'rowUDTESTCEBERGENCITIZEN',
	// 			'rowUDTESTCEBERGENCITIZENSHIPPRIMARY',
	// 			'rowUDTESTCEBERGENCITIZENSTATUS',
	// 			'rowUDTESTCEBERGENVISATYPE',
	// 			'rowUDTESTCEBERGENGENDER',
	// 			'rowUDTESTCEBERGENCOLLEAGUEETHNICITY',
	// 			'rowUDTESTCEBERGENETHNICGROUPS',
	// 			'rowUDTESTCEBERGENTEXTMESSAGING',
	// 			'rowUDTESTCEBERGENCOLLEAGUERACES',
	// 		]
	// 	}
	// ];

	/*
	 * The platform renders retypepassword / retypereminder as bare <td> cells
	 * after rowpassword / rowreminder. The browser foster-parents them into an
	 * anonymous <tr> with no id. Walk up from the input to that anonymous <tr>
	 * and tag it so showStep() can hide/show it like any other row.
	 */
	function wrapRetypes() {
		var pairs = [
			{ input: 'retypepassword', row: 'rowretypepassword' },
			{ input: 'retypereminder', row: 'rowretypereminder' }
		];
		pairs.forEach(function (p) {
			var input = document.getElementById(p.input);
			if (!input) return;
			var tr = input.closest('tr');
			if (!tr) return;
			if (!tr.id) tr.id = p.row;
			console.log('[register.js] wrapped ' + p.input + ' into #' + p.row);
		});
	}

	/**
	 * Extracts the page number from a page-break row id, such as rowUD..PAGE_1
	 * Returns null if the row is not a recognized page-break marker
	 * 
	 */
	function getPageBreakNumber(row){
		const match = row.id.match(/^rowUD.*PAGE_(\d+)$/i);
		return match ? Number(match[1]) : null;
	}

	function getPageBreakSchema(row){
		const idMatch = row.id.match(/^rowUD.*PAGE_(\d+)$/i);
		if(!idMatch) return null;

		const label = row.querySelector("label")?.textContent.trim() || "";
		const schema = label.match(/^\(\s*(\d+)\s*,\s*(.+?)\s*\)$/);

		const number = Number(schema?.[1] ?? idMatch[1]);

		return {number, title: schema?.[2]?.trim()} || `{age ${number}`;
	}

	// Build Out Form Steps
	function getFormSteps(rows){
		var STEPS = [];
		var currentRow = [];

		rows.forEach((r, i) => {
			var pageBreakSchema = getPageBreakSchema(r);

			if(pageBreakSchema !== null){
				r.classList.add("page-break-hidden");
			}

			if(pageBreakSchema == null){
				currentRow.push(r.id);

				/**
				 * If no page break at the end of the row
				 * then push the remaining rows to the end of the
				 * stack of STEPS
				 *
				 * */
				if(i == rows.length - 1 && STEPS.length > 0){
					STEPS[STEPS.length - 1].rows.push(...currentRow);
				}
				return;
			}
			

			if(pageBreakSchema !== null){
				if(currentRow.length > 0){
					STEPS.push({
						title: pageBreakSchema.title,
						rows: [...currentRow]
					});
				}
				currentRow = [];
			}
		});

		/**
		 * Determine what would happen if page breaker doesnt exist at the end of the items
		 *  => rowUDFirstName
		 *  => rowUDLastName
		 *  => rowUDDOB
		 *  => rowUDPageBreak_1
		 *  => rowAddress
		 *  => rowCity
		 *  => rowZipCode
		 *  => rowState
		 *  (No Page Break)
		 * 
		 *  What should we do with the remaining items after PageBreak_1
		 *     => Create a temporary title (Page {x+1}) [If Page 4 before: then Page 5 next]
		 *     => Fall Back to default form, consider it broken form
		 */

		return STEPS;
	}

	function init() {
		console.log('[register.js] init() called');

		// var form = document.querySelector('form[action*="form_addAttendee"]');
		// console.log('[register.js] form found:', form);
		// if (!form) {
		// 	console.warn('[register.js] form not found — selector: form[action*="form_addAttendee"]');
		// 	return;
		// }

		// Fetch form based on action
		const form = [...document.querySelectorAll("form")].find(form => {
			const action = new URL(form.action, location.href);

			return action.pathname.endsWith('/form_addAttendee.jsp') && action.searchParams.get("source") === "register";
		});

		// If no form exists that meets the requirement, fall back to default form
		if(!form){
			throw new Error("Failed to fetch registration form");
		}

		wrapRetypes();

		// Fetch all form inputs
		const rows = [...form.querySelectorAll("tr")].filter(tr => {
			const hasFieldControl = [...tr.querySelectorAll('input, select, textarea')].some(
				el=>
					!["hidden", "submit", "button", "reset", "image"].includes(el.type)
			);

			return hasFieldControl;
		})

		var STEPS = getFormSteps(rows);

		// Platform foster-parenting means the form is extracted out of the
		// table and ends up as a sibling. Anchor everything to the table that
		// contains #rowpersonType.
		var firstRow = document.getElementById('rowpersonType');
		var formTable = firstRow ? firstRow.closest('table') : null;
		var cartOption = document.querySelector('.cartOption');
		console.log('[register.js] formTable:', formTable, '| cartOption:', cartOption);

		if (!formTable) {
			console.warn('[register.js] could not find form table via #rowpersonType');
			return;
		}

		// Tracks which missing-row ids we've already warned about, so each
		// platform UDF rename only logs once. Must be initialized before
		// validateStepConfig() and paintStep() run.
		var warnedRows = {};
		validateStepConfig(warnedRows);

		if (cartOption) cartOption.style.display = 'none';

		var currentStep = 0;

		var indicator = document.createElement('div');
		indicator.id = 'cf-wizard-steps';

		var errorBox = document.createElement('div');
		errorBox.id = 'cf-wizard-errors';
		errorBox.style.display = 'none';

		var nav = document.createElement('div');
		nav.id = 'cf-wizard-nav';

		var backBtn = document.createElement('button');
		backBtn.type = 'button';
		backBtn.className = 'cf-wizard-btn cf-wizard-back';
		backBtn.textContent = '← Back';

		var nextBtn = document.createElement('button');
		nextBtn.type = 'button';
		nextBtn.className = 'cf-wizard-btn cf-wizard-next';
		nextBtn.textContent = 'Continue →';

		var submitBtn = document.createElement('button');
		submitBtn.type = 'button';
		submitBtn.className = 'cf-wizard-btn cf-wizard-submit';
		submitBtn.textContent = 'Create Account';

		nav.appendChild(backBtn);
		nav.appendChild(nextBtn);
		nav.appendChild(submitBtn);

		// Insert indicator and error box before the table, nav after it.
		// Use formTable.parentNode since form is a sibling, not the parent.
		formTable.parentNode.insertBefore(indicator, formTable);
		formTable.parentNode.insertBefore(errorBox, formTable);
		formTable.insertAdjacentElement('afterend', nav);

		/*
		 * Single page heading: the platform's own "Create a Profile"
		 * h1.subHeader becomes the page title (Oswald style via the
		 * .subHeader--page-title class). Script load order is not
		 * deterministic, so if subHeader.js already injected its own title
		 * ("Sign Up", from document.title), drop it and its description;
		 * if it runs after us, its own guard sees the class and skips.
		 */
		var injectedTitle = document.querySelector('.subHeader--page-title');
		if (injectedTitle) {
			var injectedDesc = injectedTitle.nextElementSibling;
			if (injectedDesc && injectedDesc.classList.contains('subHeaderDescription')) {
				injectedDesc.parentNode.removeChild(injectedDesc);
			}
			injectedTitle.parentNode.removeChild(injectedTitle);
		}
		var pageHeader = document.querySelector('#maincontent h1.subHeader');
		if (pageHeader) {
			pageHeader.classList.add('subHeader--page-title');
			pageHeader.textContent = pageHeader.textContent.trim();
		}

		/*
		 * The platform renders its intro box ("Please provide your personal
		 * information below…") as the first row of the form table, visible on
		 * every step. Move the box directly under the page heading and show
		 * it on Step 1 only. Step 5 gets its own box explaining that the
		 * demographic questions are optional.
		 */
		var introNote = formTable.querySelector('.note');
		if (introNote) {
			var introNoteRow = introNote.closest('tr');
			if (pageHeader) {
				pageHeader.insertAdjacentElement('afterend', introNote);
			} else {
				formTable.parentNode.insertBefore(introNote, indicator);
			}
			if (introNoteRow && introNoteRow.parentNode) {
				introNoteRow.parentNode.removeChild(introNoteRow);
			}
		}

		var aboutNote = document.createElement('div');
		aboutNote.className = 'note';
		aboutNote.id = 'cf-wizard-about-note';
		aboutNote.textContent = 'These questions are optional, but your responses help us better understand our community and develop programs and services that meet student needs.';
		if (introNote) {
			introNote.insertAdjacentElement('afterend', aboutNote);
		} else if (pageHeader) {
			pageHeader.insertAdjacentElement('afterend', aboutNote);
		} else {
			formTable.parentNode.insertBefore(aboutNote, indicator);
		}

		// A row is platform-hidden when the platform toggled class="hidden" on it.
		// We must not override this with our own inline style on the active step,
		// so conditional fields (e.g. citizenship details) continue to show/hide
		// correctly as the user changes their selections.
		function isPlatformHidden(row) {
			return row.classList.contains('hidden');
		}

		/*
		 * Hide every row the wizard knows about that is NOT part of the current
		 * step. This catches rows that the platform auto-renders but the user
		 * shouldn't see yet (e.g. emergency-contact rows on Step 1).
		 *
		 * It also ensures no row id in our STEPS config is silently missing —
		 * we log a warning once per missing row so future platform UDF renames
		 * surface in devtools instead of producing an invisible step.
		 */
		function paintStep(step) {
			STEPS.forEach(function (s, i) {
				s.rows.forEach(function (rowId) {
					var row = document.getElementById(rowId);
					if (!row) {
						if (!warnedRows[rowId]) {
							console.warn('[register.js] configured row not found in DOM: ' + rowId + ' (step "' + s.title + '")');
							warnedRows[rowId] = true;
						}
						return;
					}
					if (i === step) {
						// Clear our inline override — let the platform's class control
						// conditional visibility (e.g. class="hidden" toggled by the platform)
						row.style.display = '';
					} else {
						row.style.display = 'none';
					}
				});
			});
		}

		function renderIndicator() {
			indicator.innerHTML = '';
			STEPS.forEach(function (s, i) {
				var item = document.createElement('div');
				item.className = 'cf-wizard-step-item' +
					(i === currentStep ? ' active' : '') +
					(i < currentStep ? ' done' : '');

				var circle = document.createElement('span');
				circle.className = 'cf-wizard-step-circle';
				circle.textContent = i < currentStep ? '✓' : String(i + 1);

				var label = document.createElement('span');
				label.className = 'cf-wizard-step-label';
				label.textContent = s.title;

				item.appendChild(circle);
				item.appendChild(label);
				indicator.appendChild(item);

				if (i < STEPS.length - 1) {
					var line = document.createElement('div');
					line.className = 'cf-wizard-step-line' + (i < currentStep ? ' done' : '');
					indicator.appendChild(line);
				}
			});
		}

		function showStep(step) {
			currentStep = step;
			paintStep(step);
			renderIndicator();

			// Intro box on Step 1 only; optional-questions box on the last step
			if (introNote) introNote.style.display = step === 0 ? '' : 'none';
			aboutNote.style.display = step === STEPS.length - 1 ? '' : 'none';

			backBtn.style.display   = step === 0 ? 'none' : '';
			nextBtn.style.display   = step < STEPS.length - 1 ? '' : 'none';
			submitBtn.style.display = step === STEPS.length - 1 ? '' : 'none';

			clearErrors();
		}

		function clearErrors() {
			errorBox.innerHTML = '';
			errorBox.style.display = 'none';
			document.querySelectorAll('.cf-wizard-field-error').forEach(function (el) {
				el.classList.remove('cf-wizard-field-error');
			});
		}

		function validateStep() {
			clearErrors();
			var errors = [];

			STEPS[currentStep].rows.forEach(function (rowId) {
				var row = document.getElementById(rowId);
				// Skip rows hidden by the platform (conditional fields not yet applicable)
				// or force-hidden by us (shouldn't happen for current step, but guard anyway)
				if (!row || isPlatformHidden(row) || row.style.display === 'none') return;

				row.querySelectorAll('[mandatory]').forEach(function (field) {
					if (field.disabled || field.type === 'hidden') return;
					// retypepassword ships mandatory='Password is required' (no period).
					// Suppress its standalone message — we'll surface it as a mismatch
					// below if the originals differ. Otherwise users see a misleading
					// "Password is required" when only the retype box is empty.
					if (field.id === 'retypepassword' || field.id === 'retypereminder') return;

					var val = (field.value || '').trim();
					if (val === '' || val === '0') {
						errors.push(field.getAttribute('mandatory'));
						field.classList.add('cf-wizard-field-error');
					}
				});
			});

			// Match checks for password and security answer on Step 2. We skip the
			// retype fields' own mandatory attributes above (they ship a
			// duplicate "Password is required" string without a period), so
			// this is the only place those fields get validated.
			if (currentStep === 1) {
				var pw  = document.getElementById('password');
				var rpw = document.getElementById('retypepassword');
				var sa  = document.getElementById('reminder');
				var rsa = document.getElementById('retypereminder');
				if (pw && rpw && pw.value) {
					if (!rpw.value) {
						errors.push('Please re-enter your password.');
						rpw.classList.add('cf-wizard-field-error');
					} else if (rpw.value !== pw.value) {
						errors.push('Passwords do not match.');
						rpw.classList.add('cf-wizard-field-error');
					}
				}
				if (sa && rsa && sa.value) {
					if (!rsa.value) {
						errors.push('Please re-enter your security answer.');
						rsa.classList.add('cf-wizard-field-error');
					} else if (rsa.value !== sa.value) {
						errors.push('Security answers do not match.');
						rsa.classList.add('cf-wizard-field-error');
					}
				}
			}

			if (!errors.length) return true;

			var ul = document.createElement('ul');
			var seen = {};
			errors.forEach(function (msg) {
				if (msg && !seen[msg]) {
					seen[msg] = true;
					var li = document.createElement('li');
					li.textContent = msg;
					ul.appendChild(li);
				}
			});
			errorBox.appendChild(ul);
			errorBox.style.display = '';
			return false;
		}

		/*
		 * Sanity-check the STEPS config against the live DOM. Warn (once per id)
		 * about configured rows that aren't on the page so future platform
		 * renames surface in devtools. Called once after wrapRetypes().
		 */
		function validateStepConfig(warnedRows) {
			STEPS.forEach(function (s) {
				s.rows.forEach(function (rowId) {
					if (!document.getElementById(rowId) && !warnedRows[rowId]) {
						console.warn('[register.js] configured row missing in DOM: ' + rowId + ' (step "' + s.title + '")');
						warnedRows[rowId] = true;
					}
				});
			});
		}

		nextBtn.addEventListener('click', function () {
			if (validateStep()) showStep(currentStep + 1);
		});

		backBtn.addEventListener('click', function () {
			showStep(currentStep - 1);
		});

		submitBtn.addEventListener('click', function () {
			if (!validateStep()) return;
			// Run the platform's own validateRegistration via the onsubmit handler,
			// then submit if it passes.
			if (form.onsubmit) {
				if (form.onsubmit.call(form) !== false) form.submit();
			} else {
				form.submit();
			}
		});

		showStep(0);
	}

	console.log('[register.js] readyState:', document.readyState);
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();