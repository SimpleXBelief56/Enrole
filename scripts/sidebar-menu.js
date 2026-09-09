(function () {
  var HIDE_ITEMS = [
    "instructorListing.jsp",
    "logout.jsp",
    "calendar.jsp"
  ];

  var MENU_ITEMS = [
    {
      href: "index.jsp",
      exclude: "categoryId",
      icon: "fa-solid fa-book-open",
      label: "Browse Courses",
    },
    {
      href: "categoryId=C6B87DC8",
      icon: "fa-solid fa-location-dot",
      label: "Courses by Location",
    },
    {
      href: "cart.jsp",
      icon: "fa-solid fa-cart-shopping",
      label: "Registration Cart",
    },
    {
      href: "categoryId=87C83B68",
      icon: "fa-solid fa-award",
      label: "Credential Programs",
    },
    {
      href: "categoryId=87C950C0",
      icon: "fa-solid fa-laptop",
      label: "Partner Online Courses",
    },
    {
      href: "categoryId=87C9A6B0",
      icon: "fa-solid fa-briefcase",
      label: "Bergen for Business",
    },
    {
      href: "login.jsp",
      icon: "fa-solid fa-user",
      label: "Sign in/Create user profile",
    },
    {
      href: "myaccount.jsp",
      icon: "fa-solid fa-user",
      label: "My Account",
    }
  ];

  function init() {
    // Drop ALL sub-menus (Level01+) before we merge anything. We never want
    // sub-menus to render — even when the platform auto-expands a parent
    // category on its own landing page (e.g. Business and Technology at
    // 8A026C40, where Real Estate's children would otherwise show up).
    var subMenus = document.querySelectorAll(
      "ul.Level01, ul.Level02, ul.Level03"
    );
    for (var i = 0; i < subMenus.length; i++) {
      var sub = subMenus[i];
      if (sub.parentNode) sub.parentNode.removeChild(sub);
    }

    var leftMenus = document.querySelectorAll(".leftMenu");
    if (leftMenus.length < 1) return;

    // Capture whether the platform rendered a second (category) menu before
    // we merge and remove its wrapper. Used later to decide whether to show
    // the "Find Your Program" section header.
    var hadSecondMenu = leftMenus.length >= 2;

    var targetUl = leftMenus[0].querySelector("ul");
    if (!targetUl) return;

    // Move all <li> children from every additional .leftMenu into the first ul.
    // Skip if there's only one .leftMenu (the merge is a no-op but we still
    // proceed to filtering, sorting, and mobile-toggle creation below).
    for (var m = 1; m < leftMenus.length; m++) {
      var uls = leftMenus[m].querySelectorAll("ul");
      for (var u = 0; u < uls.length; u++) {
        while (uls[u].children.length) {
          targetUl.appendChild(uls[u].children[0]);
        }
      }
    }

    // Remove the now-empty wrappers
    for (var k = leftMenus.length - 1; k > 0; k--) {
      leftMenus[k].parentNode.removeChild(leftMenus[k]);
    }

    // Only filter on minimal pages (index, cart, login, myaccount)
    var path = location.pathname;
    var search = location.search;
    var isMinimal = /(index|cart|login|myaccount)\.jsp$/.test(path);
    if (
      path.indexOf("index.jsp") !== -1 &&
      search.indexOf("categoryId") !== -1
    ) {
      isMinimal = false;
    }

    var allLis = targetUl.querySelectorAll("li");
    var matchedByIndex = [];
    var unmatched = [];
    var used = [];

    for (var i = 0; i < allLis.length; i++) {
      var li = allLis[i];
      var a = li.querySelector("a");
      if (!a) continue;

      var href = a.getAttribute("href") || "";

      // Always hide items matching HIDE_ITEMS
      var hide = false;
      for (var hi = 0; hi < HIDE_ITEMS.length; hi++) {
        if (href.indexOf(HIDE_ITEMS[hi]) !== -1) {
          hide = true;
          break;
        }
      }
      if (hide) {
        li.style.display = "none";
        continue;
      }

      var match = null;
      for (var j = 0; j < MENU_ITEMS.length; j++) {
        var entry = MENU_ITEMS[j];
        if (href.indexOf(entry.href) !== -1) {
          if (entry.exclude && href.indexOf(entry.exclude) !== -1) continue;
          if (used.indexOf(j) !== -1) continue;
          match = entry;
          used.push(j);
          break;
        }
      }

      if (match) {
        var oldIcon = a.querySelector("i");
        if (oldIcon) oldIcon.parentNode.removeChild(oldIcon);
        a.innerHTML = "";
        var icon = document.createElement("i");
        icon.className = match.icon;
        a.appendChild(icon);
        a.appendChild(document.createTextNode(match.label));
        matchedByIndex.push({ li: li, idx: j });
      } else {
        var otherIcons = a.querySelectorAll("i");
        for (var oi = 0; oi < otherIcons.length; oi++) {
          otherIcons[oi].parentNode.removeChild(otherIcons[oi]);
        }
        if (isMinimal) li.style.display = "none";
        unmatched.push(li);
      }
    }

    // Sort matched items by MENU_ITEMS index, then rebuild ul
    matchedByIndex.sort(function (a, b) { return a.idx - b.idx; });
    targetUl.innerHTML = "";
    for (var mi = 0; mi < matchedByIndex.length; mi++) {
      targetUl.appendChild(matchedByIndex[mi].li);
    }
    // Insert a non-clickable "Find Your Program" header between the matched
    // nav items and the unmatched category list — but only when there were
    // multiple .leftMenu blocks on the page (i.e. the second/category menu
    // was present and its items were merged in). On pages with only one
    // .leftMenu, unmatched items like "Search by Instructor" would
    // incorrectly trigger the header.
    if (unmatched.length > 0 && hadSecondMenu && !isMinimal) {
      var headerLi = document.createElement("li");
      headerLi.className = "cf-menu-section-header";
      headerLi.textContent = "Find Your Program";
      targetUl.appendChild(headerLi);
    }
    for (var ui = 0; ui < unmatched.length; ui++) {
      targetUl.appendChild(unmatched[ui]);
    }

    // Mark current page as active
    var currentPath = location.pathname;
    var currentSearch = location.search;
    var catMatch = currentSearch.match(/categoryId=([^&]+)/);
    var links = targetUl.querySelectorAll("a");
    for (var l = 0; l < links.length; l++) {
      var linkHref = links[l].getAttribute("href") || "";
      var isMatch = false;
      if (catMatch) {
        isMatch = linkHref.indexOf("categoryId=" + catMatch[1]) !== -1;
      } else {
        var jsp = currentPath.match(/\/([^/]+\.jsp)$/);
        if (jsp) isMatch = linkHref.indexOf(jsp[1]) !== -1 && linkHref.indexOf("categoryId") === -1;
      }
      if (isMatch) {
        links[l].classList.add("active");
        break;
      }
    }

    // Insert a mobile-only toggle button before the merged <ul>. On desktop
    // the button is hidden via CSS. On mobile it collapses the long merged
    // list so the user isn't confronted with a wall of 15+ items.
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "cf-mobile-menu-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "cf-merged-menu");
    toggle.innerHTML =
      '<span class="cf-mobile-menu-toggle-icon" aria-hidden="true">☰</span>' +
      '<span class="cf-mobile-menu-toggle-label">Menu</span>';
    targetUl.id = "cf-merged-menu";
    targetUl.parentNode.insertBefore(toggle, targetUl);

    var labelEl = toggle.querySelector(".cf-mobile-menu-toggle-label");

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      labelEl.textContent = open ? "Menu" : "Close";
      targetUl.classList.toggle("cf-mobile-open", !open);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();