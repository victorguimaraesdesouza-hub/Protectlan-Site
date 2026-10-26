(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = document.getElementById("contact-status");
  var emailButton = form.querySelector("[data-send-email]");
  var fields = {
    name: form.elements.name,
    company: form.elements.company,
    email: form.elements.email,
    phone: form.elements.phone,
    subject: form.elements.subject,
    message: form.elements.message
  };

  var subjects = {
    suporte: "Suporte técnico",
    planos: "Planos e proposta",
    antivirus: "Produto: antivírus",
    backup: "Produto: backup em nuvem",
    componentes: "Produto: componentes físicos",
    acesso: "Acesso remoto",
    outro: "Outro assunto"
  };

  var params = new URLSearchParams(window.location.search);
  var prefill = params.get("assunto");
  if (prefill && subjects[prefill]) {
    fields.subject.value = prefill;
  }

  var showError = function (field, on) {
    if (!field) return;
    var error = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", on ? "true" : "false");
    if (error) error.classList.toggle("is-on", on);
  };

  var validate = function () {
    var invalid = [];

    var name = fields.name.value.trim();
    var nameOk = name.length >= 2;
    showError(fields.name, !nameOk);
    if (!nameOk) invalid.push(fields.name);

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.value.trim());
    showError(fields.email, !emailOk);
    if (!emailOk) invalid.push(fields.email);

    var subjectOk = Boolean(fields.subject.value);
    showError(fields.subject, !subjectOk);
    if (!subjectOk) invalid.push(fields.subject);

    var message = fields.message.value.trim();
    var messageOk = message.length >= 10;
    showError(fields.message, !messageOk);
    if (!messageOk) invalid.push(fields.message);

    if (invalid.length) {
      invalid[0].focus();
      return false;
    }
    return true;
  };

  var buildBody = function () {
    var lines = [
      "Contato pelo site — Protectlan",
      "",
      "Nome: " + fields.name.value.trim()
    ];
    if (fields.company.value.trim()) lines.push("Empresa: " + fields.company.value.trim());
    lines.push("E-mail: " + fields.email.value.trim());
    if (fields.phone.value.trim()) lines.push("Telefone: " + fields.phone.value.trim());
    lines.push("Assunto: " + (subjects[fields.subject.value] || fields.subject.value));
    lines.push("");
    lines.push("Mensagem:");
    lines.push(fields.message.value.trim());
    return lines.join("\n");
  };

  var setStatus = function (channel, url) {
    if (!status) return;
    status.hidden = false;
    status.textContent = "";
    var text = channel === "email"
      ? "Abrimos seu aplicativo de e-mail com a mensagem pronta. Se nada abrir, "
      : "Abrimos o WhatsApp em uma nova aba com a mensagem pronta. Se a janela não abrir, ";
    status.appendChild(document.createTextNode(text));
    var link = document.createElement("a");
    link.href = url;
    link.target = channel === "email" ? "_self" : "_blank";
    link.rel = "noopener";
    link.textContent = channel === "email" ? "envie por este link" : "use este link";
    status.appendChild(link);
    status.appendChild(document.createTextNode("."));
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;
    var body = buildBody();
    var url = "https://wa.me/5511943445125?text=" + encodeURIComponent(body);
    window.open(url, "_blank", "noopener");
    setStatus("whatsapp", url);
  });

  if (emailButton) {
    emailButton.addEventListener("click", function () {
      if (!validate()) return;
      var body = buildBody();
      var subject = "Contato pelo site — " + (subjects[fields.subject.value] || fields.subject.value);
      var url = "mailto:comercial@protectlan.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      setStatus("email", url);
      window.location.href = url;
    });
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    if (!field) return;
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") showError(field, false);
    });
    field.addEventListener("change", function () {
      if (field.getAttribute("aria-invalid") === "true") showError(field, false);
    });
  });
})();
