(function () {
  "use strict";

  var STORAGE_KEY = "protectlan:tickets:v1";
  var PROFILE_KEY = "protectlan:profile:v1";
  var MAX_TICKETS = 50;
  var WA_PHONE = "5511943445125";
  var EMAIL = "comercial@protectlan.com";

  var form = document.querySelector("[data-ticket-form]");
  if (!form) return;

  var tabsRoot = document.querySelector("[data-tabs]");
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  var panels = {
    abrir: document.getElementById("panel-abrir"),
    meus: document.getElementById("panel-meus"),
    acompanhar: document.getElementById("panel-acompanhar")
  };
  var formIntro = document.querySelector("[data-form-intro]");
  var success = document.querySelector("[data-ticket-success]");
  var successProtocol = document.querySelector("[data-protocol]");
  var successWa = document.querySelector("[data-success-wa]");
  var successEmail = document.querySelector("[data-success-email]");
  var listRoot = document.querySelector("[data-ticket-list]");
  var countNodes = Array.prototype.slice.call(document.querySelectorAll("[data-ticket-count]"));
  var search = document.getElementById("ticket-search");
  var trackForm = document.querySelector("[data-track-form]");
  var trackInput = document.getElementById("track-code");
  var trackResult = document.querySelector("[data-track-result]");
  var printSheet = document.querySelector("[data-print-sheet]");

  var fields = {
    name: form.elements.name,
    company: form.elements.company,
    email: form.elements.email,
    phone: form.elements.phone,
    priority: form.elements.priority,
    equipment: form.elements.equipment,
    description: form.elements.description,
    local: form.elements.local
  };

  var currentTicket = null;
  var storageOk = testStorage();

  function testStorage() {
    try {
      var key = "__protectlan_test__";
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadTickets() {
    if (!storageOk) return [];
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (ticket) {
        return ticket && typeof ticket.protocol === "string" && typeof ticket.description === "string";
      });
    } catch (error) {
      return [];
    }
  }

  function saveTickets(tickets) {
    if (!storageOk) return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadProfile() {
    if (!storageOk) return null;
    try {
      var raw = window.localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveProfile(profile) {
    if (!storageOk) return;
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      /* storage can be full or blocked */
    }
  }

  function pad(value, size) {
    var text = String(value);
    while (text.length < size) text = "0" + text;
    return text;
  }

  function protocolDate(date) {
    return pad(date.getFullYear() % 100, 2) + pad(date.getMonth() + 1, 2) + pad(date.getDate(), 2);
  }

  function generateProtocol(tickets) {
    var stamp = protocolDate(new Date());
    var used = {};
    tickets.forEach(function (ticket) { used[ticket.protocol] = true; });
    var code;
    do {
      code = "PL-" + stamp + "-" + pad(Math.floor(Math.random() * 10000), 4);
    } while (used[code]);
    return code;
  }

  function formatDateTime(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  function ticketText(ticket) {
    var lines = [
      "*Chamado Protectlan — " + ticket.protocol + "*",
      "",
      "Solicitante: " + ticket.name
    ];
    if (ticket.company) lines.push("Empresa: " + ticket.company);
    lines.push("E-mail: " + ticket.email);
    if (ticket.phone) lines.push("Telefone: " + ticket.phone);
    lines.push("Tipo: " + ticket.type);
    lines.push("Prioridade: " + ticket.priority);
    if (ticket.equipment) lines.push("Equipamento / setor: " + ticket.equipment);
    lines.push("Aberto em: " + formatDateTime(ticket.createdAt));
    lines.push("");
    lines.push("Descrição:");
    lines.push(ticket.description);
    return lines.join("\n");
  }

  function whatsappUrl(ticket) {
    return "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(ticketText(ticket));
  }

  function mailtoUrl(ticket) {
    return "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Chamado " + ticket.protocol + " — Protectlan") +
      "&body=" + encodeURIComponent(ticketText(ticket));
  }

  function showError(field, on) {
    if (!field) return;
    var error = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", on ? "true" : "false");
    if (error) error.classList.toggle("is-on", on);
  }

  function groupError(on) {
    var error = document.getElementById("t-type-error");
    if (error) error.classList.toggle("is-on", on);
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (key) {
      showError(fields[key], false);
      if (fields[key]) fields[key].removeAttribute("aria-invalid");
    });
    groupError(false);
  }

  function validate() {
    var invalid = [];

    var nameOk = fields.name.value.trim().length >= 2;
    showError(fields.name, !nameOk);
    if (!nameOk) invalid.push(fields.name);

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.value.trim());
    showError(fields.email, !emailOk);
    if (!emailOk) invalid.push(fields.email);

    var type = form.querySelector('input[name="type"]:checked');
    groupError(!type);
    if (!type) invalid.push(form.querySelector('input[name="type"]'));

    var descriptionOk = fields.description.value.trim().length >= 15;
    showError(fields.description, !descriptionOk);
    if (!descriptionOk) invalid.push(fields.description);

    var localOk = fields.local.checked;
    showError(fields.local, !localOk);
    if (!localOk) invalid.push(fields.local);

    if (invalid.length) {
      var target = invalid[0];
      if (target) target.focus();
      return false;
    }
    return true;
  }

  function restoreProfile() {
    var profile = loadProfile();
    if (!profile) return;
    fields.name.value = profile.name || "";
    fields.company.value = profile.company || "";
    fields.email.value = profile.email || "";
    fields.phone.value = profile.phone || "";
  }

  function updateCount() {
    var total = loadTickets().length;
    countNodes.forEach(function (node) { node.textContent = String(total); });
  }

  function activateTab(name, focus) {
    if (!panels[name]) return;
    tabButtons.forEach(function (button) {
      var selected = button.getAttribute("data-tab") === name;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    Object.keys(panels).forEach(function (key) {
      panels[key].hidden = key !== name;
    });
    if (name === "meus") renderTickets();
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + name);
    }
  }

  function emptyState(title, text, actionLabel, action) {
    var box = document.createElement("div");
    box.className = "ticket-empty";
    var heading = document.createElement("h2");
    heading.textContent = title;
    var copy = document.createElement("p");
    copy.textContent = text;
    box.appendChild(heading);
    box.appendChild(copy);
    if (actionLabel) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-primary btn-sm";
      button.textContent = actionLabel;
      button.addEventListener("click", action);
      box.appendChild(button);
    }
    return box;
  }

  function metaRow(label, value) {
    var row = document.createElement("div");
    var dt = document.createElement("dt");
    dt.textContent = label;
    var dd = document.createElement("dd");
    dd.textContent = value;
    row.appendChild(dt);
    row.appendChild(dd);
    return row;
  }

  function renderTicket(ticket) {
    var details = document.createElement("details");
    details.className = "ticket";

    var summary = document.createElement("summary");
    var protocol = document.createElement("span");
    protocol.className = "ticket-protocol";
    protocol.textContent = ticket.protocol;

    var title = document.createElement("span");
    title.className = "ticket-title";
    var strong = document.createElement("b");
    strong.textContent = ticket.type + (ticket.equipment ? " · " + ticket.equipment : "");
    var small = document.createElement("small");
    small.textContent = ticket.description + " · " + formatDateTime(ticket.createdAt);
    title.appendChild(strong);
    title.appendChild(small);

    var state = document.createElement("span");
    state.className = "ticket-state";
    state.textContent = "Registrado";

    var caret = document.createElement("span");
    caret.className = "ticket-caret";
    caret.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

    summary.appendChild(protocol);
    summary.appendChild(title);
    summary.appendChild(state);
    summary.appendChild(caret);

    var body = document.createElement("div");
    body.className = "ticket-body";

    var meta = document.createElement("dl");
    meta.className = "ticket-meta";
    meta.appendChild(metaRow("Prioridade", ticket.priority));
    meta.appendChild(metaRow("Aberto em", formatDateTime(ticket.createdAt)));
    meta.appendChild(metaRow("Solicitante", ticket.name + (ticket.company ? " · " + ticket.company : "")));

    var description = document.createElement("p");
    description.className = "ticket-desc";
    description.textContent = ticket.description;

    var actions = document.createElement("div");
    actions.className = "ticket-actions";

    var wa = document.createElement("a");
    wa.className = "btn btn-ghost btn-sm";
    wa.href = whatsappUrl(ticket);
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.textContent = "Enviar no WhatsApp";

    var email = document.createElement("a");
    email.className = "btn btn-ghost btn-sm";
    email.href = mailtoUrl(ticket);
    email.textContent = "Enviar por e-mail";

    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "btn btn-ghost btn-sm";
    copy.setAttribute("data-copy-value", ticket.protocol);
    copy.textContent = "Copiar protocolo";

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn-ghost btn-sm";
    remove.textContent = "Excluir";
    remove.addEventListener("click", function () {
      var confirmed = window.confirm("Remover o chamado " + ticket.protocol + " deste navegador?");
      if (!confirmed) return;
      saveTickets(loadTickets().filter(function (item) { return item.protocol !== ticket.protocol; }));
      updateCount();
      renderTickets();
    });

    actions.appendChild(wa);
    actions.appendChild(email);
    actions.appendChild(copy);
    actions.appendChild(remove);

    body.appendChild(meta);
    body.appendChild(description);
    body.appendChild(actions);
    details.appendChild(summary);
    details.appendChild(body);
    return details;
  }

  function renderTickets() {
    if (!listRoot) return;
    var tickets = loadTickets();
    var query = search ? search.value.trim().toLowerCase() : "";
    var filtered = tickets.filter(function (ticket) {
      if (!query) return true;
      return (ticket.protocol + " " + ticket.type + " " + ticket.description + " " + (ticket.equipment || "")).toLowerCase().indexOf(query) !== -1;
    });

    listRoot.textContent = "";
    if (!tickets.length) {
      listRoot.appendChild(emptyState(
        "Nenhum chamado neste navegador",
        "Abra o primeiro chamado para gerar um protocolo. O histórico fica salvo localmente.",
        "Abrir o primeiro chamado",
        function () { activateTab("abrir", true); }
      ));
      return;
    }
    if (!filtered.length) {
      listRoot.appendChild(emptyState(
        "Nenhum chamado encontrado",
        "Tente outro protocolo, tipo de atendimento ou palavra da descrição.",
        "Limpar busca",
        function () { if (search) search.value = ""; renderTickets(); if (search) search.focus(); }
      ));
      return;
    }
    filtered.forEach(function (ticket) {
      listRoot.appendChild(renderTicket(ticket));
    });
  }

  function trackCard(ticket) {
    var card = document.createElement("div");
    card.className = "track-card";
    var heading = document.createElement("h3");
    heading.textContent = ticket.protocol;
    var type = document.createElement("p");
    type.className = "track-type";
    type.textContent = ticket.type + " · " + ticket.priority;
    var meta = document.createElement("dl");
    meta.className = "ticket-meta";
    meta.appendChild(metaRow("Aberto em", formatDateTime(ticket.createdAt)));
    meta.appendChild(metaRow("Solicitante", ticket.name));
    meta.appendChild(metaRow("Equipamento", ticket.equipment || "Não informado"));
    var description = document.createElement("p");
    description.className = "ticket-desc";
    description.textContent = ticket.description;

    var timeline = document.createElement("ul");
    timeline.className = "timeline";
    var first = document.createElement("li");
    first.className = "is-done";
    first.innerHTML = "<b>Registro criado</b><small>" + formatDateTime(ticket.createdAt) + "</small>";
    var second = document.createElement("li");
    second.className = "is-done";
    second.innerHTML = "<b>Ficha disponível para envio</b><small>WhatsApp (11) 9 4344-5125 ou comercial@protectlan.com</small>";
    var third = document.createElement("li");
    third.innerHTML = "<b>Atendimento Protectlan</b><small>Acompanhe pelo canal escolhido.</small>";
    timeline.appendChild(first);
    timeline.appendChild(second);
    timeline.appendChild(third);

    var actions = document.createElement("div");
    actions.className = "success-actions";
    var wa = document.createElement("a");
    wa.className = "btn btn-primary btn-sm";
    wa.href = whatsappUrl(ticket);
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.textContent = "Enviar no WhatsApp";
    var email = document.createElement("a");
    email.className = "btn btn-ghost btn-sm";
    email.href = mailtoUrl(ticket);
    email.textContent = "Enviar por e-mail";
    var another = document.createElement("button");
    another.type = "button";
    another.className = "btn btn-ghost btn-sm";
    another.textContent = "Abrir outro chamado";
    another.addEventListener("click", function () { activateTab("abrir", true); });
    actions.appendChild(wa);
    actions.appendChild(email);
    actions.appendChild(another);

    card.appendChild(heading);
    card.appendChild(type);
    card.appendChild(meta);
    card.appendChild(description);
    card.appendChild(timeline);
    card.appendChild(actions);
    return card;
  }

  function renderTrack(protocol) {
    if (!trackResult) return;
    trackResult.textContent = "";
    trackResult.hidden = false;
    var ticket = loadTickets().filter(function (item) { return item.protocol === protocol; })[0];
    if (!ticket) {
      var empty = document.createElement("div");
      empty.className = "track-empty";
      empty.textContent = "Protocolo não encontrado neste navegador. Confira o código ou registre um novo chamado. O histórico local não é sincronizado entre dispositivos.";
      trackResult.appendChild(empty);
      return;
    }
    trackResult.appendChild(trackCard(ticket));
  }

  function copyText(text, button) {
    var done = function () {
      var original = button.textContent;
      button.textContent = "Copiado";
      window.setTimeout(function () { button.textContent = original; }, 1600);
    };
    var fallback = function () {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy"); done(); } catch (error) { /* ignore */ }
      document.body.removeChild(area);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  function fillPrintSheet(ticket) {
    if (!printSheet) return;
    printSheet.textContent = "";
    var title = document.createElement("h1");
    title.textContent = "Protectlan — Ficha de chamado";
    var subtitle = document.createElement("p");
    subtitle.textContent = "Protocolo " + ticket.protocol + " · " + formatDateTime(ticket.createdAt);
    var dl = document.createElement("dl");
    [
      ["Solicitante", ticket.name],
      ["Empresa", ticket.company || "Não informada"],
      ["E-mail", ticket.email],
      ["Telefone", ticket.phone || "Não informado"],
      ["Tipo", ticket.type],
      ["Prioridade", ticket.priority],
      ["Equipamento / setor", ticket.equipment || "Não informado"]
    ].forEach(function (item) {
      var dt = document.createElement("dt");
      dt.textContent = item[0];
      var dd = document.createElement("dd");
      dd.textContent = item[1];
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
    var descTitle = document.createElement("h2");
    descTitle.textContent = "Descrição";
    var desc = document.createElement("p");
    desc.textContent = ticket.description;
    var footer = document.createElement("p");
    footer.textContent = "Registro local gerado no site da Protectlan. A Protectlan recebe a ficha quando ela é enviada pelo WhatsApp ou e-mail.";
    printSheet.appendChild(title);
    printSheet.appendChild(subtitle);
    printSheet.appendChild(dl);
    printSheet.appendChild(descTitle);
    printSheet.appendChild(desc);
    printSheet.appendChild(footer);
  }

  function showSuccess(ticket) {
    currentTicket = ticket;
    if (successProtocol) successProtocol.textContent = ticket.protocol;
    if (successWa) successWa.href = whatsappUrl(ticket);
    if (successEmail) successEmail.href = mailtoUrl(ticket);
    form.hidden = true;
    if (formIntro) formIntro.hidden = true;
    if (success) {
      success.hidden = false;
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
  }

  function resetForm() {
    form.reset();
    clearErrors();
    restoreProfile();
    form.hidden = false;
    if (formIntro) formIntro.hidden = false;
    if (success) success.hidden = true;
    currentTicket = null;
    fields.name.focus();
  }

  function disableForm() {
    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea, button"), function (el) {
      el.disabled = true;
    });
    var warning = document.createElement("div");
    warning.className = "security-note";
    warning.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.4-3.4 8.2-8 9-4.6-.8-8-4.6-8-9V6l8-3Z"/><path d="M12 8v5M12 16h.01"/></svg>' +
      '<span>Este navegador bloqueou o armazenamento local. Para abrir um chamado, fale diretamente pelo <a href="https://wa.me/5511943445125" target="_blank" rel="noopener">WhatsApp</a>, pelo telefone <a href="tel:+551135229896">(11) 3522-9896</a> ou por <a href="mailto:comercial@protectlan.com">comercial@protectlan.com</a>.</span>';
    form.parentNode.insertBefore(warning, form);
  }

  tabsRoot.addEventListener("click", function (event) {
    var button = event.target.closest("[data-tab]");
    if (!button) return;
    activateTab(button.getAttribute("data-tab"), false);
  });

  tabsRoot.addEventListener("keydown", function (event) {
    var keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (keys.indexOf(event.key) === -1) return;
    var index = tabButtons.indexOf(document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    var next = index;
    if (event.key === "ArrowLeft") next = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === "ArrowRight") next = (index + 1) % tabButtons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabButtons.length - 1;
    activateTab(tabButtons[next].getAttribute("data-tab"), true);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;
    var now = new Date();
    var tickets = loadTickets();
    var ticket = {
      protocol: generateProtocol(tickets),
      createdAt: now.toISOString(),
      name: fields.name.value.trim(),
      company: fields.company.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      type: form.querySelector('input[name="type"]:checked').value,
      priority: fields.priority.value,
      equipment: fields.equipment.value.trim(),
      description: fields.description.value.trim()
    };
    tickets.unshift(ticket);
    if (tickets.length > MAX_TICKETS) tickets = tickets.slice(0, MAX_TICKETS);
    saveTickets(tickets);
    saveProfile({
      name: ticket.name,
      company: ticket.company,
      email: ticket.email,
      phone: ticket.phone
    });
    updateCount();
    renderTickets();
    showSuccess(ticket);
  });

  form.addEventListener("input", function (event) {
    if (event.target.id) showError(event.target, false);
  });
  form.addEventListener("change", function (event) {
    if (event.target.name === "type") groupError(false);
    if (event.target.id) showError(event.target, false);
  });

  if (search) {
    search.addEventListener("input", renderTickets);
  }

  if (trackForm) {
    trackForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = trackInput.value.trim().toUpperCase();
      if (!value) {
        showError(trackInput, true);
        trackInput.focus();
        return;
      }
      showError(trackInput, false);
      renderTrack(value);
    });
    trackInput.addEventListener("input", function () { showError(trackInput, false); });
  }

  document.addEventListener("click", function (event) {
    var goTo = event.target.closest("[data-goto-tab]");
    if (goTo) {
      activateTab(goTo.getAttribute("data-goto-tab"), true);
      return;
    }
    var copy = event.target.closest("[data-copy-value]");
    if (copy) {
      copyText(copy.getAttribute("data-copy-value"), copy);
    }
  });

  if (success) {
    var copyButton = success.querySelector("[data-copy-protocol]");
    if (copyButton) {
      copyButton.addEventListener("click", function () {
        if (currentTicket) copyText(currentTicket.protocol, copyButton);
      });
    }
    var newButton = success.querySelector("[data-new-ticket]");
    if (newButton) newButton.addEventListener("click", resetForm);
    var printButton = success.querySelector("[data-print-ticket]");
    if (printButton) {
      printButton.addEventListener("click", function () {
        if (!currentTicket) return;
        fillPrintSheet(currentTicket);
        window.setTimeout(function () { window.print(); }, 60);
      });
    }
  }

  restoreProfile();
  updateCount();
  renderTickets();
  if (!storageOk) disableForm();

  var params = new URLSearchParams(window.location.search);
  var typeMap = {
    corporativo: "Suporte presencial",
    avulso: "Suporte presencial",
    servidores: "Servidores",
    remoto: "Suporte remoto",
    antivirus: "Produto e licença",
    backup: "Produto e licença",
    componentes: "Produto e licença"
  };
  var wantedType = typeMap[params.get("tipo") || ""];
  if (wantedType) {
    var typeRadio = form.querySelector('input[name="type"][value="' + wantedType + '"]');
    if (typeRadio) typeRadio.checked = true;
    if (!window.location.hash) activateTab("abrir", false);
  }
  var hash = window.location.hash.replace("#", "");
  if (panels[hash]) activateTab(hash, false);
  var protocol = params.get("protocolo");
  if (protocol) {
    trackInput.value = protocol;
    activateTab("acompanhar", false);
    renderTrack(protocol.trim().toUpperCase());
  }
})();
