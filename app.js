(function () {
  var STORAGE = "letterhead.v2";

  var SAMPLE = {
    name: "Marina Costa",
    title: "Owner",
    company: "Costa Air",
    phone: "(813) 555-0142",
    email: "marina@costaair.example",
    website: "costaair.example",
    address: "Tampa, FL",
    logo: "",
    photo: "",
    linkedin: "https://www.linkedin.com/",
    instagram: "",
    facebook: "",
    youtube: "",
    x: "",
    booking: "https://calendly.com/",
    bookingLabel: "Book a service call",
    extra1Label: "Request a quote",
    extra1Url: "https://costaair.example/quote",
    extra2Label: "",
    extra2Url: "",
    showCta: true,
    showDisclaimer: false,
    disclaimer:
      "This message is intended only for the person to whom it is addressed. If you received it in error, please delete it.",
    font: "Georgia, 'Times New Roman', serif",
    nameSize: "18",
    bodySize: "12",
    color: "#1F4D3A",
    layout: "letterhead"
  };

  var BLANK = {
    name: "",
    title: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    logo: "",
    photo: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
    x: "",
    booking: "",
    bookingLabel: "Book a call",
    extra1Label: "",
    extra1Url: "",
    extra2Label: "",
    extra2Url: "",
    showCta: false,
    showDisclaimer: false,
    disclaimer: SAMPLE.disclaimer,
    font: "Arial, Helvetica, sans-serif",
    nameSize: "18",
    bodySize: "12",
    color: "#1C1814",
    layout: "letterhead"
  };

  var SWATCHES = ["#1C1814", "#1F4D3A", "#1F4E6B", "#8B3D2E", "#A67C3A", "#3D2E00"];

  var FIELDS = [
    "name", "title", "company", "phone", "email", "website", "address",
    "logo", "photo", "linkedin", "instagram", "facebook", "youtube", "x",
    "extra1Label", "extra1Url", "extra2Label", "extra2Url",
    "booking", "bookingLabel", "disclaimer", "font", "nameSize", "bodySize", "color", "layout"
  ];

  var LAYOUTS = [
    { id: "letterhead", label: "Stacked" },
    { id: "split", label: "Photo left" },
    { id: "logo-left", label: "Logo left" },
    { id: "compact", label: "One line" },
    { id: "stacked-photo", label: "Name then photo" },
    { id: "banner", label: "Name bar" },
    { id: "footer", label: "Footer bar" },
    { id: "card", label: "Card" }
  ];

  function $(id) { return document.getElementById(id); }

  function esc(str) {
    var d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function escAttr(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function stripProto(url) {
    return String(url || "").replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }

  function addProto(url) {
    if (!url) return "#";
    return /^https?:\/\//i.test(url) ? url : "https://" + url;
  }

  function telHref(phone) {
    return "tel:" + String(phone).replace(/[^\d+]/g, "");
  }

  function readForm() {
    var v = {};
    FIELDS.forEach(function (k) {
      var el = $(k);
      v[k] = el ? el.value.trim() : "";
    });
    v.showCta = $("showCta").checked;
    v.showDisclaimer = $("showDisclaimer").checked;
    v.nameSize = v.nameSize || "18";
    v.bodySize = v.bodySize || "12";
    v.layout = v.layout || "letterhead";
    return v;
  }

  function writeForm(v) {
    FIELDS.forEach(function (k) {
      var el = $(k);
      if (el && v[k] != null) el.value = v[k];
    });
    $("showCta").checked = !!v.showCta;
    $("showDisclaimer").checked = !!v.showDisclaimer;
    $("colorHex").value = v.color || "#1C1814";
    document.querySelectorAll(".swatch").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-color").toLowerCase() === String(v.color || "").toLowerCase() ? "true" : "false");
    });
    $("disclaimerWrap").style.display = v.showDisclaimer ? "" : "none";
    $("ctaWrap").style.display = v.showCta ? "" : "none";
  }

  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(readForm())); } catch (e) {}
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function namePx(v) { return String(v.nameSize || "18"); }
  function bodyPx(v) { return String(v.bodySize || "12"); }
  function titlePx(v) { return String(parseInt(bodyPx(v), 10) + 1); }
  function smallPx(v) { return String(Math.max(10, parseInt(bodyPx(v), 10) - 1)); }

  function socials(v) {
    var list = [];
    if (v.linkedin) list.push({ label: "LinkedIn", url: v.linkedin });
    if (v.instagram) list.push({ label: "Instagram", url: v.instagram });
    if (v.facebook) list.push({ label: "Facebook", url: v.facebook });
    if (v.youtube) list.push({ label: "YouTube", url: v.youtube });
    if (v.x) list.push({ label: "X", url: v.x });
    return list;
  }

  function extras(v) {
    var list = [];
    function add(label, url) {
      if (!url) return;
      list.push({ label: label || stripProto(url), url: url });
    }
    add(v.extra1Label, v.extra1Url);
    add(v.extra2Label, v.extra2Url);
    return list;
  }

  function contactBits(v, f, muted) {
    var bits = [];
    if (v.phone) {
      bits.push('<a href="' + escAttr(telHref(v.phone)) + '" style="color:' + muted + ';text-decoration:none;font-family:' + f + ';">' + esc(v.phone) + "</a>");
    }
    if (v.email) {
      bits.push('<a href="mailto:' + escAttr(v.email) + '" style="color:' + muted + ';text-decoration:none;font-family:' + f + ';">' + esc(v.email) + "</a>");
    }
    if (v.website) {
      bits.push('<a href="' + escAttr(addProto(v.website)) + '" style="color:' + muted + ';text-decoration:none;font-family:' + f + ';">' + esc(stripProto(v.website)) + "</a>");
    }
    if (v.address) {
      bits.push('<span style="color:' + muted + ';font-family:' + f + ';">' + esc(v.address) + "</span>");
    }
    return bits;
  }

  function socialRow(list, f, color, size) {
    if (!list.length) return "";
    var html = '<table cellpadding="0" cellspacing="0" border="0"><tr>';
    list.forEach(function (s, i) {
      var pad = i === 0 ? "0" : "14";
      html += '<td style="padding-left:' + pad + 'px;font-family:' + f + ';font-size:' + size + 'px;letter-spacing:0.04em;text-transform:uppercase;">';
      html += '<a href="' + escAttr(addProto(s.url)) + '" style="color:' + color + ';text-decoration:none;font-family:' + f + ';">' + esc(s.label) + "</a>";
      html += "</td>";
    });
    html += "</tr></table>";
    return html;
  }

  function ctaBlock(v, f) {
    if (!v.showCta || !v.booking) return "";
    var label = v.bookingLabel || "Book a call";
    return (
      '<table cellpadding="0" cellspacing="0" border="0" style="margin:0;">' +
      "<tr><td bgcolor=\"" + escAttr(v.color) + '" style="background-color:' + escAttr(v.color) + ';padding:8px 16px;">' +
      '<a href="' + escAttr(addProto(v.booking)) + '" style="color:#ffffff;text-decoration:none;font-family:' + f + ';font-size:' + bodyPx(v) + 'px;font-weight:bold;display:inline-block;">' +
      esc(label) +
      "</a></td></tr></table>"
    );
  }

  function disclaimerBlock(v, f) {
    if (!v.showDisclaimer || !v.disclaimer) return "";
    return (
      '<p style="margin:10px 0 0 0;font-family:' + f + ';font-size:' + smallPx(v) + 'px;line-height:1.45;color:#777777;max-width:520px;">' +
      esc(v.disclaimer).replace(/\n/g, "<br>") +
      "</p>"
    );
  }

  function emptyProof() {
    return '<p class="placeholder">Add a name or company and the signature appears here, sitting under a sample email the way a client will see it.</p>';
  }

  function renderLetterhead(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var h = "";
    h += '<table cellpadding="0" cellspacing="0" border="0" width="520" style="font-family:' + f + ';max-width:520px;width:100%;">';
    if (v.logo) {
      h += '<tr><td style="padding:0 0 12px 0;">';
      h += '<img src="' + escAttr(v.logo) + '" alt="' + escAttr(v.company || v.name || "Logo") + '" width="160" style="display:block;border:0;width:160px;max-width:160px;height:auto;" />';
      h += "</td></tr>";
    } else if (v.photo) {
      h += '<tr><td style="padding:0 0 12px 0;">';
      h += '<img src="' + escAttr(v.photo) + '" alt="' + escAttr(v.name || "Photo") + '" width="72" height="72" style="display:block;border:0;width:72px;height:72px;object-fit:cover;" />';
      h += "</td></tr>";
    }
    h += '<tr><td style="border-top:2px solid ' + c + ';padding:12px 0 0 0;">';
    if (v.name) h += '<p style="margin:0;font-family:' + f + ';font-size:' + namePx(v) + 'px;line-height:1.25;font-weight:bold;color:' + c + ';">' + esc(v.name) + "</p>";
    var sub = [v.title, v.company].filter(Boolean).join("  ·  ");
    if (sub) h += '<p style="margin:4px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(sub) + "</p>";
    h += "</td></tr>";

    var bits = contactBits(v, f, muted);
    if (bits.length) {
      h += '<tr><td style="padding:10px 0 0 0;font-family:' + f + ';font-size:' + bodyPx(v) + 'px;line-height:1.5;color:' + muted + ';">';
      h += bits.join('&nbsp;&nbsp;<span style="color:#c8c1b4;">·</span>&nbsp;&nbsp;');
      h += "</td></tr>";
    }

    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<tr><td style="padding:10px 0 0 0;">' + extra + "</td></tr>";

    var cta = ctaBlock(v, f);
    if (cta) h += '<tr><td style="padding:12px 0 0 0;">' + cta + "</td></tr>";

    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<tr><td style="padding:12px 0 0 0;">' + soc + "</td></tr>";

    var disc = disclaimerBlock(v, f);
    if (disc) h += '<tr><td>' + disc + "</td></tr>";

    h += "</table>";
    return h;
  }

  function renderSplit(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var left = v.photo || v.logo;
    var h = '<table cellpadding="0" cellspacing="0" border="0" width="520" style="font-family:' + f + ';max-width:520px;">';
    h += "<tr>";
    if (left) {
      var w = v.photo ? 88 : 120;
      h += '<td valign="top" width="' + w + '" style="padding:0 16px 0 0;">';
      h += '<img src="' + escAttr(left) + '" alt="' + escAttr(v.name || v.company || "") + '" width="' + w + '" style="display:block;border:0;width:' + w + "px;max-width:" + w + 'px;height:auto;" />';
      h += "</td>";
      h += '<td width="2" style="width:2px;background-color:' + c + ';font-size:0;line-height:0;">&nbsp;</td>';
      h += '<td width="16" style="width:16px;font-size:0;">&nbsp;</td>';
    }
    h += '<td valign="top">';
    if (v.name) h += '<p style="margin:0;font-family:' + f + ';font-size:' + namePx(v) + 'px;font-weight:bold;color:' + c + ';">' + esc(v.name) + "</p>";
    if (v.title) h += '<p style="margin:3px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(v.title) + "</p>";
    if (v.company) h += '<p style="margin:2px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(v.company) + "</p>";

    var rows = [];
    if (v.phone) rows.push({ href: telHref(v.phone), text: v.phone });
    if (v.email) rows.push({ href: "mailto:" + v.email, text: v.email });
    if (v.website) rows.push({ href: addProto(v.website), text: stripProto(v.website) });
    if (v.address) rows.push({ href: "", text: v.address });
    if (rows.length) {
      h += '<table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">';
      rows.forEach(function (r, i) {
        var pb = i === rows.length - 1 ? "0" : "3";
        h += "<tr>";
        h += '<td style="padding:0 0 ' + pb + "px 0;font-family:" + f + ";font-size:" + bodyPx(v) + "px;color:" + muted + ';">';
        if (r.href) {
          h += '<a href="' + escAttr(r.href) + '" style="color:' + muted + ";text-decoration:none;font-family:" + f + ';">' + esc(r.text) + "</a>";
        } else {
          h += esc(r.text);
        }
        h += "</td></tr>";
      });
      h += "</table>";
    }

    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<div style="padding-top:10px;">' + extra + "</div>";
    var cta = ctaBlock(v, f);
    if (cta) h += '<div style="padding-top:12px;">' + cta + "</div>";
    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<div style="padding-top:12px;">' + soc + "</div>";
    var disc = disclaimerBlock(v, f);
    if (disc) h += disc;
    h += "</td></tr></table>";
    return h;
  }

  function renderCompact(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var h = '<table cellpadding="0" cellspacing="0" border="0" width="480" style="font-family:' + f + ';max-width:480px;">';
    h += "<tr><td>";
    if (v.name) h += '<span style="font-family:' + f + ";font-size:" + namePx(v) + "px;font-weight:bold;color:" + c + ';">' + esc(v.name) + "</span>";
    var sub = [v.title, v.company].filter(Boolean).join(" · ");
    if (sub) h += '<span style="font-family:' + f + ";font-size:" + titlePx(v) + "px;color:" + muted + ';">' + (v.name ? "&nbsp;&nbsp;|&nbsp;&nbsp;" : "") + esc(sub) + "</span>";
    h += "</td></tr>";
    var bits = contactBits(v, f, muted);
    if (bits.length) {
      h += '<tr><td style="padding-top:4px;font-family:' + f + ';font-size:' + bodyPx(v) + 'px;">' + bits.join("&nbsp;&nbsp;·&nbsp;&nbsp;") + "</td></tr>";
    }
    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<tr><td style="padding-top:8px;">' + extra + "</td></tr>";
    var cta = ctaBlock(v, f);
    if (cta) h += '<tr><td style="padding-top:10px;">' + cta + "</td></tr>";
    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<tr><td style="padding-top:8px;">' + soc + "</td></tr>";
    var disc = disclaimerBlock(v, f);
    if (disc) h += "<tr><td>" + disc + "</td></tr>";
    h += "</table>";
    return h;
  }

  function renderLogoLeft(v) {
    var copy = Object.assign({}, v, { photo: "", logo: v.logo || v.photo });
    return renderSplit(copy);
  }

  function renderStackedPhoto(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var h = '<table cellpadding="0" cellspacing="0" border="0" width="520" style="font-family:' + f + ';max-width:520px;">';
    h += "<tr><td>";
    if (v.name) h += '<p style="margin:0;font-family:' + f + ';font-size:' + namePx(v) + 'px;font-weight:bold;color:' + c + ';">' + esc(v.name) + "</p>";
    var sub = [v.title, v.company].filter(Boolean).join(" · ");
    if (sub) h += '<p style="margin:4px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(sub) + "</p>";
    if (v.photo || v.logo) {
      var src = v.photo || v.logo;
      var w = v.photo ? 72 : 140;
      h += '<div style="padding-top:10px;"><img src="' + escAttr(src) + '" alt="" width="' + w + '" style="display:block;border:0;width:' + w + 'px;max-width:' + w + 'px;height:auto;" /></div>';
    }
    var bits = contactBits(v, f, muted);
    if (bits.length) h += '<p style="margin:10px 0 0 0;font-family:' + f + ';font-size:' + bodyPx(v) + 'px;color:' + muted + ';">' + bits.join("&nbsp;&nbsp;·&nbsp;&nbsp;") + "</p>";
    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<div style="padding-top:8px;">' + extra + "</div>";
    var cta = ctaBlock(v, f);
    if (cta) h += '<div style="padding-top:10px;">' + cta + "</div>";
    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<div style="padding-top:8px;">' + soc + "</div>";
    var disc = disclaimerBlock(v, f);
    if (disc) h += disc;
    h += "</td></tr></table>";
    return h;
  }

  function renderBanner(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var h = '<table cellpadding="0" cellspacing="0" border="0" width="520" style="font-family:' + f + ';max-width:520px;">';
    h += '<tr><td bgcolor="' + escAttr(c) + '" style="background-color:' + escAttr(c) + ';padding:10px 14px;">';
    if (v.name) h += '<span style="font-family:' + f + ';font-size:' + namePx(v) + 'px;font-weight:bold;color:#ffffff;">' + esc(v.name) + "</span>";
    var sub = [v.title, v.company].filter(Boolean).join(" · ");
    if (sub) h += '<span style="font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:#ffffff;">' + (v.name ? "&nbsp;&nbsp;·&nbsp;&nbsp;" : "") + esc(sub) + "</span>";
    h += "</td></tr><tr><td style=\"padding:12px 0 0 0;\">";
    if (v.photo) h += '<img src="' + escAttr(v.photo) + '" alt="" width="56" height="56" style="display:block;border:0;width:56px;height:56px;margin:0 0 10px 0;" />';
    var bits = contactBits(v, f, muted);
    if (bits.length) h += '<p style="margin:0;font-family:' + f + ';font-size:' + bodyPx(v) + 'px;color:' + muted + ';">' + bits.join("&nbsp;&nbsp;·&nbsp;&nbsp;") + "</p>";
    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<div style="padding-top:8px;">' + extra + "</div>";
    var cta = ctaBlock(v, f);
    if (cta) h += '<div style="padding-top:10px;">' + cta + "</div>";
    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<div style="padding-top:8px;">' + soc + "</div>";
    var disc = disclaimerBlock(v, f);
    if (disc) h += disc;
    h += "</td></tr></table>";
    return h;
  }

  function renderFooter(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var h = '<table cellpadding="0" cellspacing="0" border="0" width="520" style="font-family:' + f + ';max-width:520px;">';
    h += "<tr><td>";
    if (v.logo) h += '<img src="' + escAttr(v.logo) + '" alt="" width="120" style="display:block;border:0;width:120px;max-width:120px;height:auto;margin:0 0 10px 0;" />';
    if (v.name) h += '<p style="margin:0;font-family:' + f + ';font-size:' + namePx(v) + 'px;font-weight:bold;color:' + c + ';">' + esc(v.name) + "</p>";
    var sub = [v.title, v.company].filter(Boolean).join(" · ");
    if (sub) h += '<p style="margin:4px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(sub) + "</p>";
    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<div style="padding-top:8px;">' + extra + "</div>";
    var cta = ctaBlock(v, f);
    if (cta) h += '<div style="padding-top:10px;">' + cta + "</div>";
    h += "</td></tr>";
    var bits = contactBits(v, f, "#ffffff");
    if (bits.length) {
      h += '<tr><td bgcolor="' + escAttr(c) + '" style="background-color:' + escAttr(c) + ';padding:8px 12px;margin-top:10px;">';
      h += '<span style="font-family:' + f + ';font-size:' + bodyPx(v) + 'px;color:#ffffff;">' + bits.join("&nbsp;&nbsp;·&nbsp;&nbsp;") + "</span>";
      h += "</td></tr>";
    }
    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<tr><td style="padding-top:8px;">' + soc + "</td></tr>";
    var disc = disclaimerBlock(v, f);
    if (disc) h += "<tr><td>" + disc + "</td></tr>";
    h += "</table>";
    return h;
  }

  function renderCard(v) {
    var f = v.font;
    var c = v.color;
    var muted = "#555555";
    var left = v.photo || v.logo;
    var h = '<table cellpadding="0" cellspacing="0" border="0" width="520" style="font-family:' + f + ';max-width:520px;">';
    h += "<tr>";
    if (left) {
      h += '<td valign="middle" width="80" style="padding:0 14px 0 0;">';
      h += '<img src="' + escAttr(left) + '" alt="" width="72" height="72" style="display:block;border:0;width:72px;height:72px;" />';
      h += "</td>";
    }
    h += '<td valign="middle">';
    if (v.name) h += '<p style="margin:0;font-family:' + f + ';font-size:' + namePx(v) + 'px;font-weight:bold;color:' + c + ';">' + esc(v.name) + "</p>";
    if (v.title) h += '<p style="margin:3px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(v.title) + "</p>";
    if (v.company) h += '<p style="margin:2px 0 0 0;font-family:' + f + ';font-size:' + titlePx(v) + 'px;color:' + muted + ';">' + esc(v.company) + "</p>";
    h += "</td></tr>";
    var bits = contactBits(v, f, muted);
    if (bits.length) h += '<tr><td colspan="2" style="padding-top:10px;font-family:' + f + ';font-size:' + bodyPx(v) + 'px;color:' + muted + ';">' + bits.join("&nbsp;&nbsp;·&nbsp;&nbsp;") + "</td></tr>";
    var extra = socialRow(extras(v), f, c, bodyPx(v));
    if (extra) h += '<tr><td colspan="2" style="padding-top:8px;">' + extra + "</td></tr>";
    var cta = ctaBlock(v, f);
    if (cta) h += '<tr><td colspan="2" style="padding-top:10px;">' + cta + "</td></tr>";
    var soc = socialRow(socials(v), f, c, smallPx(v));
    if (soc) h += '<tr><td colspan="2" style="padding-top:8px;">' + soc + "</td></tr>";
    var disc = disclaimerBlock(v, f);
    if (disc) h += '<tr><td colspan="2">' + disc + "</td></tr>";
    h += "</table>";
    return h;
  }

  function hasContent(v) {
    return !!(v.name || v.title || v.company || v.phone || v.email || v.website || v.logo || v.photo);
  }

  function renderHtml(v, layout) {
    if (!hasContent(v)) return "";
    var L = layout || v.layout;
    if (L === "split") return renderSplit(v);
    if (L === "compact") return renderCompact(v);
    if (L === "logo-left") return renderLogoLeft(v);
    if (L === "stacked-photo") return renderStackedPhoto(v);
    if (L === "banner") return renderBanner(v);
    if (L === "footer") return renderFooter(v);
    if (L === "card") return renderCard(v);
    return renderLetterhead(v);
  }

  function layoutLabel(id) {
    var found = LAYOUTS.filter(function (L) { return L.id === id; })[0];
    return found ? found.label : "Stacked";
  }

  function setLayout(id) {
    $("layout").value = id;
    if ($("tplName")) $("tplName").textContent = layoutLabel(id);
    paint();
  }

  function previewData() {
    var v = readForm();
    return hasContent(v) ? v : SAMPLE;
  }

  function paintGallery() {
    var grid = $("tplGrid");
    if (!grid) return;
    var v = previewData();
    var current = $("layout").value || "letterhead";
    grid.innerHTML = "";
    LAYOUTS.forEach(function (L) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tpl-card" + (L.id === current ? " on" : "");
      btn.setAttribute("data-layout", L.id);
      btn.innerHTML =
        '<span class="tpl-label">' + esc(L.label) + "</span>" +
        '<span class="tpl-frame"><span class="tpl-scale">' + (renderHtml(v, L.id) || emptyProof()) + "</span></span>";
      btn.addEventListener("click", function () {
        setLayout(L.id);
        $("tplDialog").close();
      });
      grid.appendChild(btn);
    });
  }

  function paint() {
    var v = readForm();
    $("disclaimerWrap").style.display = v.showDisclaimer ? "" : "none";
    $("ctaWrap").style.display = v.showCta ? "" : "none";
    if ($("tplName")) $("tplName").textContent = layoutLabel(v.layout);
    var html = renderHtml(v);
    $("sigPreview").innerHTML = html || emptyProof();
    var fromName = v.name || "Your name";
    var fromEmail = v.email || "you@company.com";
    $("letterFrom").textContent = fromName + " <" + fromEmail + ">";
    save();
  }

  function flash(btn, label) {
    var original = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", original);
    btn.textContent = label;
    btn.classList.add("ok");
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove("ok");
    }, 1600);
  }

  function showPane(id) {
    document.querySelectorAll(".pane").forEach(function (p) {
      p.classList.toggle("on", p.getAttribute("data-pane") === id);
    });
    document.querySelectorAll("[data-pane-go]").forEach(function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-pane-go") === id ? "true" : "false");
    });
  }

  async function copyRich(btn) {
    btn = btn || $("copyRich");
    var html = $("sigPreview").innerHTML;
    if (!html || $("sigPreview").querySelector(".placeholder")) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([$("sigPreview").innerText], { type: "text/plain" })
          })
        ]);
        flash(btn, "Copied");
        return;
      }
    } catch (e) {}
    var temp = document.createElement("div");
    temp.style.position = "fixed";
    temp.style.left = "-10000px";
    temp.innerHTML = html;
    document.body.appendChild(temp);
    var range = document.createRange();
    range.selectNode(temp);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      document.execCommand("copy");
      flash(btn, "Copied");
    } catch (e2) {
      alert("Copy failed. Select the signature in the preview and copy it yourself.");
    }
    sel.removeAllRanges();
    document.body.removeChild(temp);
  }

  async function copySource() {
    var html = $("sigPreview").innerHTML;
    if (!html || $("sigPreview").querySelector(".placeholder")) return;
    try {
      await navigator.clipboard.writeText(html);
      flash($("copyHtml"), "Copied");
    } catch (e) {
      var ta = document.createElement("textarea");
      ta.value = html;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flash($("copyHtml"), "Copied");
    }
  }

  function bindUpload(fileId, targetId) {
    $(fileId).addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        $(targetId).value = ev.target.result;
        paint();
      };
      reader.readAsDataURL(file);
    });
  }

  function initSwatches() {
    var box = $("swatches");
    SWATCHES.forEach(function (hex) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.setAttribute("data-color", hex);
      b.style.background = hex;
      b.title = hex;
      b.addEventListener("click", function () {
        $("color").value = hex;
        $("colorHex").value = hex;
        paint();
      });
      box.appendChild(b);
    });
  }

  function init() {
    initSwatches();
    var saved = loadSaved();
    writeForm(saved || SAMPLE);
    paint();

    FIELDS.forEach(function (k) {
      var el = $(k);
      if (!el) return;
      el.addEventListener("input", paint);
      el.addEventListener("change", paint);
    });
    $("showCta").addEventListener("change", paint);
    $("showDisclaimer").addEventListener("change", paint);

    $("color").addEventListener("input", function () {
      $("colorHex").value = $("color").value;
      paint();
    });
    $("colorHex").addEventListener("input", function () {
      var hex = $("colorHex").value;
      if (/^#[0-9a-fA-F]{6}$/.test(hex)) $("color").value = hex;
      paint();
    });

    $("openTpl").addEventListener("click", function () {
      paintGallery();
      $("tplDialog").showModal();
    });
    $("closeTpl").addEventListener("click", function () {
      $("tplDialog").close();
    });
    $("tplDialog").addEventListener("click", function (e) {
      if (e.target === $("tplDialog")) $("tplDialog").close();
    });

    bindUpload("logoFile", "logo");
    bindUpload("photoFile", "photo");

    $("copyRich").addEventListener("click", function () { copyRich($("copyRich")); });
    $("copyRichProof").addEventListener("click", function () { copyRich($("copyRichProof")); });
    $("jumpPaste").addEventListener("click", function () { showPane("paste"); });
    $("copyHtml").addEventListener("click", copySource);
    $("loadSample").addEventListener("click", function () {
      writeForm(SAMPLE);
      paint();
    });
    $("startBlank").addEventListener("click", function () {
      try { localStorage.removeItem(STORAGE); } catch (e) {}
      writeForm(BLANK);
      paint();
    });

    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-tab");
        document.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-selected", t === tab ? "true" : "false"); });
        document.querySelectorAll(".guide").forEach(function (g) {
          g.classList.toggle("on", g.getAttribute("data-tab") === id);
        });
      });
    });

    document.querySelectorAll("[data-pane-go]").forEach(function (b) {
      b.addEventListener("click", function () {
        showPane(b.getAttribute("data-pane-go"));
      });
    });

    showPane("layout");

    document.querySelectorAll(".mode button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".mode button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        $("letter").classList.toggle("dark", btn.getAttribute("data-mode") === "dark");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
