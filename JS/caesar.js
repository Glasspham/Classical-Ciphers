// Tra cứu từng từ với Caesar Cipher
function lookupWord() {
  const word = document.getElementById("lookup-word").value.trim();
  const shift = parseInt(document.getElementById("shift").value, 10);
  if (!word || isNaN(shift) || shift < 1 || shift > 25) {
    showLookupResult("Vui lòng nhập từ và độ dịch chuyển hợp lệ.", true);
    return;
  }
  let encrypted = "";
  for (let i = 0; i < word.length; i++) {
    let c = word[i];
    if (c.match(/[A-Za-z]/)) {
      let code = c.charCodeAt(0);
      let base = code >= 97 ? 97 : 65;
      encrypted += String.fromCharCode(((code - base + shift) % 26) + base);
    } else {
      encrypted += c;
    }
  }
  showLookupResult(`<strong>Kết quả mã hóa:</strong> <span class='text-primary'>${encrypted}</span>`, false);
}

function showLookupResult(msg, isError) {
  const resultDiv = document.getElementById("lookup-result");
  resultDiv.style.display = "block";
  resultDiv.className = isError ? "alert alert-danger" : "alert alert-info";
  resultDiv.innerHTML = msg;
}
// Caesar Cipher implementation
const CaesarCipher = {
  // Encrypt text using Caesar cipher
  encrypt: function (text, shift) {
    if (!text || isNaN(shift)) return "";

    shift = ((shift % 26) + 26) % 26; // Normalize shift
    return this.processText(text, shift);
  },

  // Decrypt text using Caesar cipher
  decrypt: function (text, shift) {
    if (!text || isNaN(shift)) return "";

    shift = ((shift % 26) + 26) % 26; // Normalize shift
    return this.processText(text, -shift);
  },

  // Process text with given shift
  processText: function (text, shift) {
    let result = "";

    for (let char of text) {
      if (char.match(/[A-Z]/)) {
        // Uppercase letters
        let code = char.charCodeAt(0) - 65;
        code = (code + shift + 26) % 26;
        result += String.fromCharCode(code + 65);
      } else if (char.match(/[a-z]/)) {
        // Lowercase letters
        let code = char.charCodeAt(0) - 97;
        code = (code + shift + 26) % 26;
        result += String.fromCharCode(code + 97);
      } else {
        // Non-alphabetic characters remain unchanged
        result += char;
      }
    }

    return result;
  },

  // Generate visual shift table
  generateTable: function (shift) {
    const table = document.createElement("table");
    table.className = "table table-sm table-bordered mx-auto";
    table.style.maxWidth = "100%";
    table.style.fontSize = "0.9em";

    // Create alphabet arrays
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const shifted = alphabet.map((char) => {
      let code = char.charCodeAt(0) - 65;
      code = (code + shift) % 26;
      return String.fromCharCode(code + 65);
    });

    // Create header row (original alphabet)
    const headerRow = table.insertRow();
    headerRow.className = "bg-primary text-white";

    const headerLabel = headerRow.insertCell();
    headerLabel.textContent = "Gốc";
    headerLabel.className = "text-center fw-bold";

    alphabet.forEach((char) => {
      const cell = headerRow.insertCell();
      cell.textContent = char;
      cell.className = "text-center fw-bold";
    });

    // Create cipher row (shifted alphabet)
    const cipherRow = table.insertRow();
    cipherRow.className = "bg-success text-white";

    const cipherLabel = cipherRow.insertCell();
    cipherLabel.textContent = "Mã";
    cipherLabel.className = "text-center fw-bold";

    shifted.forEach((char) => {
      const cell = cipherRow.insertCell();
      cell.textContent = char;
      cell.className = "text-center fw-bold";
    });

    return table;
  },
};

// Page functions
function encryptCaesar() {
  const plaintext = document.getElementById("plaintext").value;
  const shift = parseInt(document.getElementById("shift").value);

  if (!plaintext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần mã hóa!", false);
    return;
  }

  if (isNaN(shift) || shift < 1 || shift > 25) {
    CipherUtils.showResult("result-message", "Độ dịch chuyển phải từ 1 đến 25!", false);
    return;
  }

  const result = CaesarCipher.encrypt(plaintext, shift);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Mã hóa thành công!", true);
}

function decryptCaesar() {
  const ciphertext = document.getElementById("plaintext").value;
  const shift = parseInt(document.getElementById("shift").value);

  if (!ciphertext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần giải mã!", false);
    return;
  }

  if (isNaN(shift) || shift < 1 || shift > 25) {
    CipherUtils.showResult("result-message", "Độ dịch chuyển phải từ 1 đến 25!", false);
    return;
  }

  const result = CaesarCipher.decrypt(ciphertext, shift);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Giải mã thành công!", true);
}

function clearAll() {
  document.getElementById("plaintext").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("shift").value = "3";
  document.getElementById("result-message").style.display = "none";
  updateShiftTable();
}

function copyResult() {
  const result = document.getElementById("ciphertext").value;
  if (result) {
    CipherUtils.copyToClipboard(result);
  } else {
    CipherUtils.showToast("Không có kết quả để sao chép!", "error");
  }
}

function updateShiftTable() {
  const shift = parseInt(document.getElementById("shift").value) || 3;
  const table = CaesarCipher.generateTable(shift);
  document.getElementById("shift-table").innerHTML = "";
  document.getElementById("shift-table").appendChild(table);
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  updateShiftTable();

  // Update table when shift changes
  document.getElementById("shift").addEventListener("input", updateShiftTable);
});
