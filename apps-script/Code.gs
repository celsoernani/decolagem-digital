var OWNER_EMAIL = "celsoernane@gmail.com";

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) { // honeypot preenchido = robô
    return json_({ ok: false, reason: "bot" });
  }
  var nome = (p.nome || "").toString().trim();
  var email = (p.email || "").toString().trim();
  if (!nome || !email) {
    return json_({ ok: false, reason: "missing" });
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("leads");
  sheet.appendRow([new Date(), nome, email]);
  try {
    MailApp.sendEmail(OWNER_EMAIL, "Novo lead — Decolagem Digital",
      "Nome: " + nome + "\nEmail: " + email);
  } catch (err) {}
  return json_({ ok: true });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
