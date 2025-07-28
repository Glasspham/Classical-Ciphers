// Cipher Disk implementation
const CipherDisk = {
  outerDisk: "AWCDEUGILMNOPQRSTVXY12KH",
  innerDisk: "DLGAZENBOSFCHTYQIXKVP&MR",
  canvas: null,
  ctx: null,
  step: 0, // For drawing specific steps
  indexChar: "K", // The reference character on the INNER disk

  init: function () {
    this.canvas = document.getElementById("cipher-disk");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.setupEventListeners();
    this.updateFromInputs();
    this.draw(0);
  },

  updateFromInputs: function () {
    this.outerDisk = document.getElementById("outer-disk").value || "AWCDEUGILMNOPQRSTVXY12KH";
    this.innerDisk = document.getElementById("inner-disk").value || "DLGAZENBOSFCHTYQIXKVP&MR";
    this.indexChar = (document.getElementById("_index").value || "K").toUpperCase();
  },

  setupEventListeners: function () {
    document.getElementById("outer-disk").addEventListener("input", () => {
      this.updateFromInputs();
      this.draw(this.step);
    });
    document.getElementById("inner-disk").addEventListener("input", () => {
      this.updateFromInputs();
      this.draw(this.step);
    });
    document.getElementById("keyword").addEventListener("input", () => {
      this.updateFromInputs();
      this.draw(this.step);
    });
    document.getElementById("_index").addEventListener("input", () => {
      this.updateFromInputs();
      this.draw(this.step);
    });
    // Assuming a slider exists for stepping through the visualization
    const slider = document.getElementById("step-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.step = parseInt(e.target.value);
        this.draw(this.step);
      });
    }
  },

  draw: function (drawStep = 0) {
    // ===== CÁC BIẾN CẤU HÌNH KÍCH THƯỚC =====
    const CANVAS_SIZE = 300; // Kích thước canvas
    const CENTER_X = 150; // Tọa độ X của tâm
    const CENTER_Y = 150; // Tọa độ Y của tâm
    const OUTER_RADIUS = 145; // Bán kính vòng ngoài
    const INNER_RADIUS = 100; // Bán kính vòng trong
    const OUTER_TEXT_RADIUS = 120; // Bán kính đặt chữ vòng ngoài
    const INNER_TEXT_RADIUS = 80; // Bán kính đặt chữ vòng trong
    const FONT_SIZE = "bold 12px Arial"; // Font chữ
    const LINE_WIDTH = 1; // Độ dày đường kẻ
    const CENTER_DOT_SIZE = 3; // Kích thước chấm trung tâm

    // ===== CÁC BIẾN MÀU SẮC =====
    const COLOR_BACKGROUND = "#ffffff"; // Màu nền
    const COLOR_BORDER = "#000000"; // Màu viền
    const COLOR_TEXT = "#000000"; // Màu chữ thường
    const COLOR_HIGHLIGHT = "#ff6600"; // Màu chữ được highlight

    const ctx = this.ctx;
    const outerChars = this.outerDisk.length;
    const innerChars = this.innerDisk.length;
    const keyword = (document.getElementById("keyword").value || "KM21").toUpperCase();

    // Reference point on the outer disk is the current keyword character
    const keywordChar = keyword[drawStep % keyword.length];
    const alignmentOffset = this.outerDisk.indexOf(keywordChar);

    // Reference point on the inner disk is the index character
    const indexPosInInner = this.innerDisk.indexOf(this.indexChar);

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw outer disk background
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.strokeStyle = COLOR_BORDER;
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, OUTER_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw inner disk background
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.strokeStyle = COLOR_BORDER;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, INNER_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw dividing lines for outer disk
    ctx.strokeStyle = COLOR_BORDER;
    ctx.lineWidth = LINE_WIDTH;
    for (let i = 0; i < outerChars; i++) {
      const angle = (((i * 360) / outerChars - 90) * Math.PI) / 180;
      const x1 = CENTER_X + Math.cos(angle) * INNER_RADIUS;
      const y1 = CENTER_Y + Math.sin(angle) * INNER_RADIUS;
      const x2 = CENTER_X + Math.cos(angle) * OUTER_RADIUS;
      const y2 = CENTER_Y + Math.sin(angle) * OUTER_RADIUS;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw dividing lines for inner disk
    for (let i = 0; i < innerChars; i++) {
      const angle = (((i * 360) / innerChars - 90) * Math.PI) / 180;
      const x1 = CENTER_X;
      const y1 = CENTER_Y;
      const x2 = CENTER_X + Math.cos(angle) * INNER_RADIUS;
      const y2 = CENTER_Y + Math.sin(angle) * INNER_RADIUS;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw outer letters (uppercase)
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = FONT_SIZE;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < outerChars; i++) {
      // Calculate angle for the middle of each segment
      const segmentAngle = 360 / outerChars;
      const angle = ((i * segmentAngle + segmentAngle / 2 - 90) * Math.PI) / 180;
      const x = CENTER_X + Math.cos(angle) * OUTER_TEXT_RADIUS;
      const y = CENTER_Y + Math.sin(angle) * OUTER_TEXT_RADIUS;
      // Highlight the keyword character on the outer ring
      if (i === alignmentOffset) {
        ctx.fillStyle = COLOR_HIGHLIGHT;
        ctx.font = FONT_SIZE;
      } else {
        ctx.fillStyle = COLOR_TEXT;
        ctx.font = FONT_SIZE;
      }
      ctx.fillText(this.outerDisk[i], x, y);
    }

    // Draw inner letters (lowercase), rotated
    ctx.font = FONT_SIZE;
    for (let i = 0; i < innerChars; i++) {
      // Rotate inner disk so indexChar aligns with keywordChar
      const adjustedPos = (i - indexPosInInner + alignmentOffset + innerChars) % innerChars;
      // Calculate angle for the middle of each segment
      const segmentAngle = 360 / innerChars;
      const angle = ((adjustedPos * segmentAngle + segmentAngle / 2 - 90) * Math.PI) / 180;
      const x = CENTER_X + Math.cos(angle) * INNER_TEXT_RADIUS;
      const y = CENTER_Y + Math.sin(angle) * INNER_TEXT_RADIUS;
      // Highlight the index character on the inner ring
      if (i === indexPosInInner) {
        ctx.fillStyle = COLOR_HIGHLIGHT;
        ctx.font = FONT_SIZE;
      } else {
        ctx.fillStyle = COLOR_TEXT;
        ctx.font = FONT_SIZE;
      }
      ctx.fillText(this.innerDisk[i], x, y);
    }

    // Draw center dot
    ctx.fillStyle = COLOR_BORDER;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, CENTER_DOT_SIZE, 0, 2 * Math.PI);
    ctx.fill();
  },

  encrypt: function (text) {
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9&]/g, "");
    const keyword = (document.getElementById("keyword").value || "KM21").toUpperCase();
    const indexChar = (document.getElementById("_index").value || "K").toUpperCase();

    let result = "";
    const indexPosInInner = this.innerDisk.indexOf(indexChar);

    if (indexPosInInner === -1) return text; // Index char not in inner disk

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const keywordChar = keyword[i % keyword.length];

      const keywordPosInOuter = this.outerDisk.indexOf(keywordChar);
      const outerCharPos = this.outerDisk.indexOf(char);

      if (outerCharPos !== -1 && keywordPosInOuter !== -1) {
        const relativePos = outerCharPos - keywordPosInOuter;
        const innerIndex = (indexPosInInner + relativePos + this.innerDisk.length) % this.innerDisk.length;
        result += this.innerDisk[innerIndex];
      } else {
        result += char; // Keep character if not found in disk
      }
    }
    return result;
  },

  decrypt: function (text) {
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9&]/g, "");
    const keyword = (document.getElementById("keyword").value || "KM21").toUpperCase();
    const indexChar = (document.getElementById("_index").value || "K").toUpperCase();

    let result = "";
    const indexPosInInner = this.innerDisk.indexOf(indexChar);

    if (indexPosInInner === -1) return text;

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const keywordChar = keyword[i % keyword.length];

      const keywordPosInOuter = this.outerDisk.indexOf(keywordChar);
      const innerCharPos = this.innerDisk.indexOf(char);

      if (innerCharPos !== -1 && keywordPosInOuter !== -1) {
        const relativePos = innerCharPos - indexPosInInner;
        const outerIndex = (keywordPosInOuter + relativePos + this.outerDisk.length) % this.outerDisk.length;
        result += this.outerDisk[outerIndex];
      } else {
        result += char;
      }
    }
    return result;
  },
};

// Page functions
function encryptDisk() {
  CipherDisk.updateFromInputs();
  CipherDisk.draw(0); // Reset view to the first step
  const plaintext = document.getElementById("plaintext").value;
  if (!plaintext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần mã hóa!", false);
    document.getElementById("show-details-btn").disabled = true;
    return;
  }
  const result = CipherDisk.encrypt(plaintext);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Mã hóa thành công!", true);
  updatemappingtable();
  document.getElementById("show-details-btn").disabled = false;
}

function decryptDisk() {
  CipherDisk.updateFromInputs();
  CipherDisk.draw(0); // Reset view to the first step
  const ciphertext = document.getElementById("plaintext").value;
  if (!ciphertext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần giải mã!", false);
    document.getElementById("show-details-btn").disabled = true;
    return;
  }
  const result = CipherDisk.decrypt(ciphertext);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Giải mã thành công!", true);
  updatemappingtable();
  document.getElementById("show-details-btn").disabled = false;
}

// Helper functions
function getMappedRotatedInnerDisk(keywordChar, indexChar, outerDisk, innerDisk) {
  const keywordPosInOuter = outerDisk.indexOf(keywordChar);
  const indexPosInInner = innerDisk.indexOf(indexChar);
  if (keywordPosInOuter === -1 || indexPosInInner === -1) return innerDisk;
  let mapped = '';
  for (let i = 0; i < outerDisk.length; i++) {
    // outerDisk[i] là ký tự vòng ngoài tại vị trí i
    const relativePos = i - keywordPosInOuter;
    const innerIndex = (indexPosInInner + relativePos + innerDisk.length) % innerDisk.length;
    mapped += innerDisk[innerIndex];
  }
  return mapped;
}

// Hàm tạo vòng ngoài đã xoay tương ứng với ký tự giải mã (dùng cho giải mã chi tiết)
function getMappedRotatedOuterDisk(keywordChar, indexChar, outerDisk, innerDisk) {
  const keywordPosInOuter = outerDisk.indexOf(keywordChar);
  const indexPosInInner = innerDisk.indexOf(indexChar);
  if (keywordPosInOuter === -1 || indexPosInInner === -1) return outerDisk;
  let mapped = "";
  for (let i = 0; i < innerDisk.length; i++) {
    // innerDisk[i] là ký tự vòng trong tại vị trí i
    const relativePos = i - indexPosInInner;
    const outerIndex = (keywordPosInOuter + relativePos + outerDisk.length) % outerDisk.length;
    mapped += outerDisk[outerIndex];
  }
  return mapped;
}

function updatemappingtable() {
  const plaintext = (document.getElementById("plaintext").value || "").toUpperCase().replace(/[^A-Z0-9&]/g, "");
  const keyword = (document.getElementById("keyword").value || "KM21").toUpperCase();
  const indexChar = (document.getElementById("_index").value || "K").toUpperCase();
  const outerDisk = CipherDisk.outerDisk;
  const innerDisk = CipherDisk.innerDisk;
  const tableBody = document.getElementById("mapping-table-modal-body");
  if (!tableBody) return;

  const indexPosInInner = innerDisk.indexOf(indexChar);
  if (indexPosInInner === -1) {
    tableBody.innerHTML = '<div class="alert alert-danger">Lỗi: Ký tự khớp (index) không có trong vòng trong.</div>';
    return;
  }
  if (!plaintext) {
    tableBody.innerHTML = '<div class="alert alert-info">Chưa có văn bản để hiển thị các bước.</div>';
    return;
  }

  let html = '<div class="small">';
  const ciphertext = (document.getElementById("ciphertext")?.value || "").toUpperCase().replace(/[^A-Z0-9&]/g, "");
  const isDecryptMode = (document.activeElement && document.activeElement.id === "btn-decrypt") || (plaintext.length !== 0 && plaintext === ciphertext);

  // Nếu giải mã thì lặp qua ciphertext, còn mã hóa thì lặp qua plaintext
  const loopText = isDecryptMode ? ciphertext : plaintext;
  for (let i = 0; i < loopText.length; i++) {
    const char = loopText[i];
    const keywordChar = keyword[i % keyword.length];
    const keywordPosInOuter = outerDisk.indexOf(keywordChar);
    const mappedRotatedInner = getMappedRotatedInnerDisk(keywordChar, indexChar, outerDisk, innerDisk);
    const outerCharPos = outerDisk.indexOf(char);
    if (outerCharPos !== -1 && keywordPosInOuter !== -1) {
      const relativePos = outerCharPos - keywordPosInOuter;
      const innerIndex = (indexPosInInner + relativePos + innerDisk.length) % innerDisk.length;
      const cipherChar = innerDisk[innerIndex];
      html += `<div class="border rounded p-3 mb-3 bg-light">
        <div class="row">
          <div class="col-12">
            <h6><strong>Bước ${i + 1}:</strong> <span class="badge bg-secondary">${keywordChar}</span> (vòng ngoài) thẳng hàng với <span class="badge bg-warning text-dark">${indexChar}</span> (vòng trong)</h6>
            <div class="mb-2">
              <small class="text-muted">
                <strong>Vòng ngoài:</strong> <code class="text-primary">${outerDisk}</code><br>
                <strong>Vòng trong:</strong> <code class="text-info">${mappedRotatedInner}</code><br>
                <strong>Keyword:</strong> <code class="text-warning">${keyword}</code><br>
                <strong>Index:</strong> <code class="text-info">${indexChar}</code> (vị trí ${indexPosInInner} trong vòng trong)
              </small>
            </div>
            <div class="mb-2">
              <strong>Plain:</strong> <span class="badge bg-primary fs-6">${char}</span> → <strong>Cipher:</strong> <span class="badge bg-success fs-6">${cipherChar}</span>
            </div>
            <div class="text-dark small">
              <strong>Giải thích:</strong><br>
              • <code>${char}</code> (vị trí ${outerCharPos}) cách <code>${keywordChar}</code> (vị trí ${keywordPosInOuter}) là <strong>${relativePos}</strong> bước.<br>
              • Áp dụng vào vòng trong: Vị trí của <code>${indexChar}</code> (${indexPosInInner}) + <strong>${relativePos}</strong> = Vị trí <strong>${innerIndex}</strong>, cho ra ký tự <code>${cipherChar}</code>.
            </div>
          </div>
        </div>
      </div>`;
      } else {
        html += `<div class="border rounded p-3 mb-3 bg-light-danger">
        <h6><strong>Bước ${i + 1}:</strong> Ký tự <span class="badge bg-danger fs-6">${char}</span> không có trong vòng ngoài và được giữ nguyên.</h6>
      </div>`;
      }
  }
  html += "</div>";
  tableBody.innerHTML = html;
}

// Hiển thị chi tiết từng bước cho mã hóa
function updatemappingtableEncrypt(plaintext, keyword, indexChar, outerDisk, innerDisk, indexPosInInner, tableBody) {
  let html = '<div class="small">';
  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext[i];
    const keywordChar = keyword[i % keyword.length];
    const keywordPosInOuter = outerDisk.indexOf(keywordChar);
    const mappedRotatedInner = getMappedRotatedInnerDisk(keywordChar, indexChar, outerDisk, innerDisk);
    const outerCharPos = outerDisk.indexOf(char);
    if (outerCharPos !== -1 && keywordPosInOuter !== -1) {
      const relativePos = outerCharPos - keywordPosInOuter;
      const innerIndex = (indexPosInInner + relativePos + innerDisk.length) % innerDisk.length;
      const cipherChar = innerDisk[innerIndex];
      html += `<div class="border rounded p-3 mb-3 bg-light">
      <div class="row">
        <div class="col-12">
          <h6><strong>Bước ${i + 1}:</strong> <span class="badge bg-secondary">${keywordChar}</span> (vòng ngoài) thẳng hàng với <span class="badge bg-warning text-dark">${indexChar}</span> (vòng trong)</h6>
          <div class="mb-2">
            <small class="text-muted">
              <strong>Vòng ngoài:</strong> <code class="text-primary">${outerDisk}</code><br>
              <strong>Vòng trong:</strong> <code class="text-info">${mappedRotatedInner}</code><br>
              <strong>Keyword:</strong> <code class="text-warning">${keyword}</code><br>
              <strong>Index:</strong> <code class="text-info">${indexChar}</code> (vị trí ${indexPosInInner} trong vòng trong)
            </small>
          </div>
          <div class="mb-2">
            <strong>Plain:</strong> <span class="badge bg-primary fs-6">${char}</span> → <strong>Cipher:</strong> <span class="badge bg-success fs-6">${cipherChar}</span>
          </div>
          <div class="text-dark small">
            <strong>Giải thích:</strong><br>
            • <code>${char}</code> (vị trí ${outerCharPos}) cách <code>${keywordChar}</code> (vị trí ${keywordPosInOuter}) là <strong>${relativePos}</strong> bước.<br>
            • Áp dụng vào vòng trong: Vị trí của <code>${indexChar}</code> (${indexPosInInner}) + <strong>${relativePos}</strong> = Vị trí <strong>${innerIndex}</strong>, cho ra ký tự <code>${cipherChar}</code>.
          </div>
        </div>
      </div>
    </div>`;
    } else {
      html += `<div class="border rounded p-3 mb-3 bg-light-danger">
      <h6><strong>Bước ${i + 1}:</strong> Ký tự <span class="badge bg-danger fs-6">${char}</span> không có trong vòng ngoài và được giữ nguyên.</h6>
    </div>`;
    }
  }
  html += "</div>";
  tableBody.innerHTML = html;
}

// Hiển thị chi tiết từng bước cho giải mã
function updatemappingtableDecrypt(ciphertext, keyword, indexChar, outerDisk, innerDisk, indexPosInInner, tableBody) {
  let html = '<div class="small">';
  for (let i = 0; i < ciphertext.length; i++) {
    const char = ciphertext[i];
    const keywordChar = keyword[i % keyword.length];
    const keywordPosInOuter = outerDisk.indexOf(keywordChar);
    const mappedRotatedOuter = getMappedRotatedOuterDisk(keywordChar, indexChar, outerDisk, innerDisk);
    const innerCharPos = innerDisk.indexOf(char);
    if (innerCharPos !== -1 && keywordPosInOuter !== -1) {
      const relativePos = innerCharPos - indexPosInInner;
      const outerIndex = (keywordPosInOuter + relativePos + outerDisk.length) % outerDisk.length;
      const plainChar = outerDisk[outerIndex];
      html += `<div class="border rounded p-3 mb-3 bg-light">
      <div class="row">
        <div class="col-12">
          <h6><strong>Bước ${i + 1} (Giải mã):</strong> <span class="badge bg-secondary">${keywordChar}</span> (vòng ngoài) thẳng hàng với <span class="badge bg-warning text-dark">${indexChar}</span> (vòng trong)</h6>
          <div class="mb-2">
            <small class="text-muted">
              <strong>Vòng ngoài (xoay):</strong> <code class="text-primary">${mappedRotatedOuter}</code><br>
              <strong>Vòng trong:</strong> <code class="text-info">${innerDisk}</code><br>
              <strong>Keyword:</strong> <code class="text-warning">${keyword}</code><br>
              <strong>Index:</strong> <code class="text-info">${indexChar}</code> (vị trí ${indexPosInInner} trong vòng trong)
            </small>
          </div>
          <div class="mb-2">
            <strong>Cipher:</strong> <span class="badge bg-success fs-6">${char}</span> → <strong>Plain:</strong> <span class="badge bg-primary fs-6">${plainChar}</span>
          </div>
          <div class="text-dark small">
            <strong>Giải thích:</strong><br>
            • <code>${char}</code> (vị trí ${innerCharPos} vòng trong) cách <code>${indexChar}</code> (vị trí ${indexPosInInner}) là <strong>${relativePos}</strong> bước.<br>
            • Áp dụng vào vòng ngoài: Vị trí của <code>${keywordChar}</code> (${keywordPosInOuter}) + <strong>${relativePos}</strong> = Vị trí <strong>${outerIndex}</strong>, cho ra ký tự <code>${plainChar}</code>.
          </div>
        </div>
      </div>
    </div>`;
    } else {
      html += `<div class="border rounded p-3 mb-3 bg-light-danger">
      <h6><strong>Bước ${i + 1} (Giải mã):</strong> Ký tự <span class="badge bg-danger fs-6">${char}</span> không có trong vòng trong và được giữ nguyên.</h6>
    </div>`;
    }
  }
  html += "</div>";
  tableBody.innerHTML = html;
}

// Helper functions
function loadExample() {
  document.getElementById("outer-disk").value = "AWCDEUGILMNOPQRSTVXY12KH";
  document.getElementById("inner-disk").value = "DLGAZENBOSFCHTYQIXKVP&MR";
  document.getElementById("keyword").value = "KM21";
  document.getElementById("_index").value = "K";
  document.getElementById("plaintext").value = "ALL YOU WILL PASS THE EXAME";
  CipherDisk.updateFromInputs();
  CipherDisk.draw(0);
  CipherUtils.showToast("Đã tải ví dụ mẫu!");
}

function generateFromKeyword() {
  const keyword = document.getElementById("keyword").value || "KM21";
  const outerDisk = "AWCDEUGILMNOPQRSTVXY12KH";
  const innerDisk = "DLGAZENBOSFCHTYQIXKVP&MR";

  document.getElementById("outer-disk").value = outerDisk;
  document.getElementById("inner-disk").value = innerDisk;
  document.getElementById("_index").value = keyword.charAt(0);

  CipherDisk.updateFromInputs();
  CipherDisk.draw(0);
  CipherUtils.showToast(`Đã tạo từ keyword: ${keyword}`);
}

function resetDisks() {
  document.getElementById("outer-disk").value = "AWCDEUGILMNOPQRSTVXY12KH";
  document.getElementById("inner-disk").value = "DLGAZENBOSFCHTYQIXKVP&MR";
  document.getElementById("keyword").value = "KM21";
  document.getElementById("_index").value = "K";
  CipherDisk.updateFromInputs();
  CipherDisk.draw(0);
  CipherUtils.showToast("Đã reset về cấu hình mặc định!");
}

function clearAll() {
  document.getElementById("plaintext").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("result-message").style.display = "none";
  document.getElementById("show-details-btn").disabled = true;
  CipherUtils.showToast("Đã xóa tất cả!");
}

function copyResult() {
  const result = document.getElementById("ciphertext").value;
  if (result.trim()) {
    CipherUtils.copyToClipboard(result);
  } else {
    CipherUtils.showToast("Không có kết quả để sao chép!", "error");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  CipherDisk.init();
});
