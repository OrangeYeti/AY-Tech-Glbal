(function () {
  const config = window.ATG_CONFIG;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function iconArrow() {
    return '<svg class="btn__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h9m0 0-4-4m4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function iconDownload() {
    return '<svg class="btn__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9m0 0 4-4m-4 4-4-4M4 15.5h12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function sectionHeader(data, titleId) {
    return `
      <div class="section__header reveal">
        <div>
          <div class="section__eyebrow">${escapeHtml(data.eyebrow)}</div>
          <h2 class="section__title" ${titleId ? `id="${escapeHtml(titleId)}"` : ""}>${escapeHtml(data.title)}</h2>
        </div>
        ${data.desc ? `<p class="section__desc">${escapeHtml(data.desc)}</p>` : ""}
      </div>
    `;
  }

  function mediaPlaceholder(data, imageSrc, extraClass = "") {
    if (imageSrc) {
      return `
        <figure class="media-frame ${extraClass}">
          <img class="media-frame__image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(data.caption)}" loading="lazy" />
        </figure>
      `;
    }

    return `
      <figure class="media-frame ${extraClass}">
        <div class="media-frame__placeholder">
          <span class="media-frame__label">${escapeHtml(data.label)}</span>
          <div class="media-lines" aria-hidden="true"><span></span><span></span><span></span></div>
          <figcaption class="media-frame__caption">${escapeHtml(data.caption)}</figcaption>
        </div>
      </figure>
    `;
  }

  function renderHeader(content, locale) {
    const header = document.getElementById("siteHeader");
    const langButtons = config.locales
      .map(
        (item) => `
          <button class="lang-switch__button ${item.code === locale ? "is-active" : ""}" type="button" data-locale="${escapeHtml(item.code)}" aria-pressed="${item.code === locale}">
            ${escapeHtml(item.label)}
          </button>
        `
      )
      .join("");

    header.innerHTML = `
      <div class="container header__inner">
        <a class="brand" href="#top" aria-label="${escapeHtml(content.brand.name)}">
          <img class="brand__logo" src="${escapeHtml(config.assets.logos.horizontal)}" alt="${escapeHtml(content.brand.name)}" width="196" height="84" decoding="async" />
        </a>

        <nav class="header__nav" aria-label="Primary">
          ${content.nav
            .map((item) => `<a class="nav__link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
            .join("")}
          <div class="nav__mobile-lang" aria-label="Mobile language switcher">${langButtons}</div>
        </nav>

        <button class="menu-button" type="button" aria-label="${escapeHtml(content.actions.menu)}" aria-expanded="false" aria-controls="siteHeader">
          <span class="menu-button__line" aria-hidden="true"></span>
        </button>

        <div class="header__actions">
          <div class="lang-switch" aria-label="Language switcher">${langButtons}</div>
        </div>
      </div>
    `;
  }

  function renderHero(content) {
    const doc = config.assets.docs.companyProfile;
    const titleMarkup = Array.isArray(content.hero.titleLines)
      ? content.hero.titleLines.map((line) => `<span class="hero__title-line">${escapeHtml(line)}</span>`).join("")
      : escapeHtml(content.hero.title);

    return `
      <section class="hero" id="top" aria-labelledby="hero-title">
        <div class="hero__visual" aria-hidden="true">
          <span class="hero__glow hero__glow--one"></span>
          <span class="hero__glow hero__glow--two"></span>
          <span class="hero__line-field"></span>
          <span class="hero__mark"></span>
        </div>
        <div class="hero__inner">
          <div class="hero__content reveal">
            <div class="hero__eyebrow">${escapeHtml(content.hero.eyebrow)}</div>
            <h1 class="hero__title" id="hero-title" aria-label="${escapeHtml(content.hero.title)}">${titleMarkup}</h1>
            <p class="hero__body">${escapeHtml(content.hero.body)}</p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="#contact">${escapeHtml(content.actions.inquiry)}${iconArrow()}</a>
              <a class="btn btn--secondary" href="${escapeHtml(doc.href)}" download="${escapeHtml(doc.fileName)}">${iconDownload()}${escapeHtml(content.actions.download)}</a>
            </div>
          </div>
          <div class="hero__meta reveal">
            <div class="chip-list">
              ${content.hero.chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("")}
            </div>
            <p class="hero__note">${escapeHtml(content.hero.note)}</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderAbout(content) {
    return `
      <section class="section about" id="about" aria-labelledby="about-title">
        <div class="container">
          ${sectionHeader({ eyebrow: content.about.eyebrow, title: content.about.title }, "about-title")}
          <div class="grid-12 about__layout">
            <div class="about__main reveal">
              <div class="stack">
                ${content.about.paragraphs.map((text) => `<p class="about__text">${escapeHtml(text)}</p>`).join("")}
              </div>
              <div class="about__timeline" aria-label="${escapeHtml(content.about.timelineTitle)}">
                <h3 class="about__block-title">${escapeHtml(content.about.timelineTitle)}</h3>
                <ol class="about__timeline-list">
                  ${content.about.timeline
                    .map(
                      (item) => `
                        <li class="about__timeline-item">
                          <span class="about__timeline-year">${escapeHtml(item.year)}</span>
                          <div>
                            <strong>${escapeHtml(item.title)}</strong>
                            <p>${escapeHtml(item.desc)}</p>
                          </div>
                        </li>
                      `
                    )
                    .join("")}
                </ol>
              </div>
              <div class="about__structure" aria-label="${escapeHtml(content.about.structureTitle)}">
                <h3 class="about__block-title">${escapeHtml(content.about.structureTitle)}</h3>
                <div class="about__structure-grid">
                  ${content.about.structure
                    .map(
                      (item) => `
                        <article class="about__structure-item">
                          <span>${escapeHtml(item.label)}</span>
                          <strong>${escapeHtml(item.title)}</strong>
                          <p>${escapeHtml(item.desc)}</p>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <aside class="about__aside reveal" aria-label="${escapeHtml(content.about.asideLabel)}">
              <article class="leader-card">
                <figure class="leader-card__photo">
                  <img src="${escapeHtml(config.assets.media.ceoProfile)}" alt="${escapeHtml(content.about.leader.photoAlt)}" loading="lazy" decoding="async" />
                </figure>
                <div class="leader-card__body">
                  <span class="leader-card__label">${escapeHtml(content.about.leader.label)}</span>
                  <h3 class="leader-card__name">${escapeHtml(content.about.leader.name)}</h3>
                  <p class="leader-card__role">${escapeHtml(content.about.leader.role)}</p>
                  <p class="leader-card__summary">${escapeHtml(content.about.leader.summary)}</p>
                  <ul class="leader-card__list">
                    ${content.about.leader.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                  </ul>
                </div>
              </article>
              <article class="about__subsidiary-note">
                <span>${escapeHtml(content.about.subsidiary.label)}</span>
                <strong>${escapeHtml(content.about.subsidiary.title)}</strong>
                <p>${escapeHtml(content.about.subsidiary.desc)}</p>
              </article>
            </aside>
          </div>
        </div>
      </section>
    `;
  }

  function renderServices(content) {
    return `
      <section class="section section--soft services" id="services" aria-labelledby="services-title">
        <div class="container">
          ${sectionHeader(content.services, "services-title")}
          <div class="grid-12 services__grid">
            ${content.services.items
              .map(
                (item, index) => `
                  <article class="card service-card reveal">
                    <div>
                      <span class="service-card__number">${String(index + 1).padStart(2, "0")}</span>
                      <h3 class="service-card__title">${escapeHtml(item.title)}</h3>
                    </div>
                    <div class="stack">
                      <div class="service-card__line" aria-hidden="true"></div>
                      <p class="service-card__desc">${escapeHtml(item.desc)}</p>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderProcess(content) {
    return `
      <section class="section process" id="process" aria-labelledby="process-title">
        <div class="container">
          ${sectionHeader(content.process, "process-title")}
          <ol class="process__list">
            ${content.process.items
              .map(
                (item, index) => `
                  <li class="process-step reveal">
                    <span class="process-step__mark">${String(index + 1).padStart(2, "0")}</span>
                    <div class="stack">
                      <h3 class="process-step__title">${escapeHtml(item.title)}</h3>
                      <p class="process-step__desc">${escapeHtml(item.desc)}</p>
                    </div>
                  </li>
                `
              )
              .join("")}
          </ol>
        </div>
      </section>
    `;
  }

  function renderCases(content) {
    const caseImages = config.assets.media.cases || [];
    return `
      <section class="section cases" id="cases" aria-labelledby="cases-title">
        <div class="container">
          ${sectionHeader(content.cases, "cases-title")}
          <div class="grid-12">
            ${content.cases.items
              .map((item, index) => {
                const image = caseImages[index];
                return `
                  <article class="case-card reveal">
                    <div class="case-card__media">
                      ${
                        image
                          ? `<img class="media-frame__image" src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" loading="lazy" />`
                          : `<div class="case-card__placeholder">
                              <span class="case-card__category">${escapeHtml(item.category)}</span>
                              <div class="case-card__geometry" aria-hidden="true"><span></span><span></span><span></span></div>
                            </div>`
                      }
                    </div>
                    <div class="case-card__body">
                      <h3 class="case-card__title">${escapeHtml(item.title)}</h3>
                      <p class="case-card__desc">${escapeHtml(item.desc)}</p>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderNetwork(content) {
    return `
      <section class="section network" id="network" aria-labelledby="network-title">
        <div class="container">
          ${sectionHeader(content.network, "network-title")}
          <div class="grid-12 network__layout">
            <div class="network__content reveal">
              <div class="network-groups">
                ${content.network.groups
                  .map(
                    (group) => `
                      <article class="network-group">
                        <h3 class="network-group__title">${escapeHtml(group.title)}</h3>
                        <p class="network-group__desc">${escapeHtml(group.desc)}</p>
                      </article>
                    `
                  )
                  .join("")}
              </div>
              <p class="network__note">${escapeHtml(content.network.note)}</p>
            </div>
            <div class="network__media reveal">
              ${mediaPlaceholder(content.network.media, config.assets.media.network, "network__media")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderContact(content) {
    const email = config.form.recipientEmail;
    return `
      <section class="section contact" id="contact" aria-labelledby="contact-title">
        <div class="container">
          <div class="grid-12 contact__layout">
            <div class="contact__intro reveal">
              <div>
                <div class="section__eyebrow">${escapeHtml(content.contact.eyebrow)}</div>
                <h2 class="section__title" id="contact-title">${escapeHtml(content.contact.title)}</h2>
              </div>
              <p class="section__desc">${escapeHtml(content.contact.lead)}</p>
              <div class="contact__email-box">
                <span class="contact__email-label">${escapeHtml(content.contact.emailLabel)}</span>
                <a class="contact__email" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
              </div>
            </div>
            <form class="contact-form reveal" id="contactForm" novalidate data-endpoint="${escapeHtml(config.form.endpoint)}">
              <div class="contact-form__grid">
                ${formField("company", content.contact.fields.company, content.contact.placeholders.company, "text", true)}
                ${formField("name", content.contact.fields.name, content.contact.placeholders.name, "text", true)}
                ${formField("email", content.contact.fields.email, content.contact.placeholders.email, "email", true)}
                ${formField("phone", content.contact.fields.phone, content.contact.placeholders.phone, "tel", false)}
                ${formField("message", content.contact.fields.message, content.contact.placeholders.message, "textarea", true, true)}
              </div>
              <div class="visually-hidden" aria-hidden="true">
                <label for="website">${escapeHtml(content.contact.fields.website)}</label>
                <input id="website" name="website" tabindex="-1" autocomplete="off" />
              </div>
              <p class="form-status" data-form-status>${escapeHtml(content.contact.status.ready)}</p>
              <button class="btn btn--primary" type="submit">${escapeHtml(content.contact.submit)}${iconArrow()}</button>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  function formField(name, label, placeholder, type, required, wide = false) {
    const id = `field-${name}`;
    const control =
      type === "textarea"
        ? `<textarea id="${id}" name="${name}" placeholder="${escapeHtml(placeholder)}" ${required ? "required" : ""}></textarea>`
        : `<input id="${id}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" ${required ? "required" : ""} />`;

    return `
      <div class="form-field ${wide ? "contact-form__wide" : ""}" data-field="${name}">
        <label for="${id}">${escapeHtml(label)}</label>
        ${control}
        <span class="field-error" data-error-for="${name}"></span>
      </div>
    `;
  }

  function renderFooter(content) {
    const footer = document.getElementById("siteFooter");
    footer.innerHTML = `
      <div class="container footer__inner">
        <div class="footer__brand">
          <div class="footer__brand-line">
            <img class="footer__logo" src="${escapeHtml(config.assets.logos.monoLight)}" alt="${escapeHtml(content.footer.name)}" loading="lazy" decoding="async" />
            <span class="footer__wordmark">AY Tech Global</span>
          </div>
          <div class="footer__legal">
            <span>${escapeHtml(content.footer.ceo)}</span>
            <span>${escapeHtml(content.footer.address)}</span>
            <span>${escapeHtml(content.footer.businessNumber)}</span>
            <span>${escapeHtml(content.footer.email)}</span>
          </div>
          <p class="footer__note">${escapeHtml(content.footer.note)}</p>
        </div>
        <div class="footer__aside">
          <a class="footer__email" href="mailto:${escapeHtml(config.form.recipientEmail)}">${escapeHtml(config.form.recipientEmail)}</a>
          <span>${escapeHtml(content.footer.copyright)}</span>
        </div>
      </div>
    `;
  }

  function renderPage(locale) {
    const content = window.ATG_CONTENT[locale] || window.ATG_CONTENT[config.defaultLocale];
    renderHeader(content, locale);

    document.getElementById("main").innerHTML = [
      renderHero(content),
      renderAbout(content),
      renderServices(content),
      renderProcess(content),
      renderCases(content),
      renderNetwork(content),
      renderContact(content)
    ].join("");

    renderFooter(content);
  }

  window.ATG_RENDER = {
    renderPage
  };
})();
