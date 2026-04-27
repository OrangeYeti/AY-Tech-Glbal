(function () {
  function getContent() {
    const locale = document.documentElement.dataset.locale || window.ATG_CONFIG.defaultLocale;
    return window.ATG_CONTENT[locale] || window.ATG_CONTENT[window.ATG_CONFIG.defaultLocale];
  }

  function setStatus(form, text, type) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = text;
    status.classList.remove("is-success", "is-error");
    if (type) status.classList.add(`is-${type}`);
  }

  function setFieldError(form, name, message) {
    const field = form.querySelector(`[data-field="${name}"]`);
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (field) field.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function validate(form, content) {
    const data = new FormData(form);
    const errors = {};
    const required = ["company", "name", "email", "message"];
    required.forEach((name) => {
      if (!String(data.get(name) || "").trim()) {
        errors[name] = content.contact.validation.required;
      }
    });

    const email = String(data.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = content.contact.validation.email;
    }

    const message = String(data.get("message") || "").trim();
    if (message && message.length < 10) {
      errors.message = content.contact.validation.message;
    }

    ["company", "name", "email", "phone", "message"].forEach((name) => {
      setFieldError(form, name, errors[name]);
    });

    return {
      valid: Object.keys(errors).length === 0,
      data
    };
  }

  function buildMailto(data, content) {
    const config = window.ATG_CONFIG;
    const company = String(data.get("company") || "").trim();
    const name = String(data.get("name") || "").trim();
    const subject = `${config.form.subjectPrefix} ${company || name}`;
    const fields = content.contact.fields;
    const body = [
      `${fields.company}: ${company}`,
      `${fields.name}: ${name}`,
      `${fields.email}: ${String(data.get("email") || "").trim()}`,
      `${fields.phone}: ${String(data.get("phone") || "").trim()}`,
      "",
      `${fields.message}:`,
      String(data.get("message") || "").trim()
    ].join("\n");

    return `mailto:${config.form.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function submitToEndpoint(form, data, content) {
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      window.location.href = buildMailto(data, content);
      setStatus(form, content.contact.status.fallback, "success");
      return;
    }

    const payload = Object.fromEntries(data.entries());
    const response = await fetch(endpoint, {
      method: window.ATG_CONFIG.form.method || "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Form endpoint responded with ${response.status}`);
    }

    form.reset();
    setStatus(form, content.contact.status.success, "success");
  }

  function init() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const content = getContent();

      if (form.website && form.website.value) {
        form.reset();
        setStatus(form, content.contact.status.success, "success");
        return;
      }

      const result = validate(form, content);
      if (!result.valid) {
        setStatus(form, content.contact.status.error, "error");
        return;
      }

      setStatus(form, content.contact.status.sending);
      try {
        await submitToEndpoint(form, result.data, content);
      } catch (error) {
        setStatus(form, content.contact.status.error, "error");
      }
    });
  }

  window.ATG_FORM = {
    init
  };
})();
