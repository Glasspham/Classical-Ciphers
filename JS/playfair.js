// Playfair Cipher implementation
const PlayfairCipher = {
  createMatrix: function (keyword) {
    // Remove duplicates and J, convert to uppercase
    const cleanKey = keyword
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .replace(/J/g, "I");
    const uniqueKey = [...new Set(cleanKey)].join("");

    // Create alphabet without J
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let matrix = uniqueKey;

    // Add remaining letters
    for (let char of alphabet) {
      if (!matrix.includes(char)) {
        matrix += char;
      }
    }

    // Convert to 5x5 array
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push(matrix.slice(i * 5, (i + 1) * 5).split(""));
    }

    return result;
  },

  findPosition: function (matrix, char) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (matrix[row][col] === char) {
          return { row, col };
        }
      }
    }
    return null;
  },

  preparePlaintext: function (text) {
    let prepared = text
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .replace(/J/g, "I");
    let result = "";

    // Add X between duplicate letters and make pairs
    for (let i = 0; i < prepared.length; i += 2) {
      result += prepared[i];
      if (i + 1 < prepared.length) {
        if (prepared[i] === prepared[i + 1]) {
          result += "X";
          i--; // Process the duplicate letter in next iteration
        } else {
          result += prepared[i + 1];
        }
      } else {
        result += "X"; // Add X if odd length
      }
    }

    return result;
  },

  encrypt: function (text, keyword) {
    const matrix = this.createMatrix(keyword);
    const prepared = this.preparePlaintext(text);
    let result = "";

    for (let i = 0; i < prepared.length; i += 2) {
      const char1 = prepared[i];
      const char2 = prepared[i + 1];

      const pos1 = this.findPosition(matrix, char1);
      const pos2 = this.findPosition(matrix, char2);

      if (pos1.row === pos2.row) {
        // Same row - move right
        result += matrix[pos1.row][(pos1.col + 1) % 5];
        result += matrix[pos2.row][(pos2.col + 1) % 5];
      } else if (pos1.col === pos2.col) {
        // Same column - move down
        result += matrix[(pos1.row + 1) % 5][pos1.col];
        result += matrix[(pos2.row + 1) % 5][pos2.col];
      } else {
        // Rectangle - swap columns
        result += matrix[pos1.row][pos2.col];
        result += matrix[pos2.row][pos1.col];
      }
    }

    return CipherUtils.formatOutput(result);
  },

  decrypt: function (text, keyword) {
    const matrix = this.createMatrix(keyword);
    const cleanText = text.replace(/[^A-Z]/g, "");
    let result = "";

    for (let i = 0; i < cleanText.length; i += 2) {
      const char1 = cleanText[i];
      const char2 = cleanText[i + 1];

      const pos1 = this.findPosition(matrix, char1);
      const pos2 = this.findPosition(matrix, char2);

      if (pos1.row === pos2.row) {
        // Same row - move left
        result += matrix[pos1.row][(pos1.col + 4) % 5];
        result += matrix[pos2.row][(pos2.col + 4) % 5];
      } else if (pos1.col === pos2.col) {
        // Same column - move up
        result += matrix[(pos1.row + 4) % 5][pos1.col];
        result += matrix[(pos2.row + 4) % 5][pos2.col];
      } else {
        // Rectangle - swap columns
        result += matrix[pos1.row][pos2.col];
        result += matrix[pos2.row][pos1.col];
      }
    }

    return CipherUtils.formatOutput(result);
  },

  generateMatrixTable: function (keyword) {
    const matrix = this.createMatrix(keyword);
    const table = document.createElement("table");
    table.className = "cipher-table";

    for (let row = 0; row < 5; row++) {
      const tr = table.insertRow();
      for (let col = 0; col < 5; col++) {
        const cell = tr.insertCell();
        cell.textContent = matrix[row][col];
        if (matrix[row][col] === "I") {
          cell.title = "I/J";
        }
      }
    }

    return table;
  },
};

// Page functions
function encryptPlayfair() {
  const plaintext = document.getElementById("plaintext").value;
  const keyword = document.getElementById("keyword").value;

  if (!plaintext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần mã hóa!", false);
    return;
  }

  if (!keyword.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập từ khóa!", false);
    return;
  }

  const result = PlayfairCipher.encrypt(plaintext, keyword);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Mã hóa thành công!", true);
  updateDigraphProcessing();
}

function decryptPlayfair() {
  const ciphertext = document.getElementById("plaintext").value;
  const keyword = document.getElementById("keyword").value;

  if (!ciphertext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần giải mã!", false);
    return;
  }

  if (!keyword.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập từ khóa!", false);
    return;
  }

  const result = PlayfairCipher.decrypt(ciphertext, keyword);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Giải mã thành công!", true);
  updateDigraphProcessing();
}

function clearAll() {
  document.getElementById("plaintext").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("keyword").value = "MONARCHY";
  document.getElementById("result-message").style.display = "none";
  updateMatrix();
  updateDigraphProcessing();
}

function copyResult() {
  const result = document.getElementById("ciphertext").value;
  if (result) {
    CipherUtils.copyToClipboard(result);
  } else {
    CipherUtils.showToast("Không có kết quả để sao chép!", "error");
  }
}

function updateMatrix() {
  const keyword = document.getElementById("keyword").value || "MONARCHY";
  const table = PlayfairCipher.generateMatrixTable(keyword);
  document.getElementById("playfair-matrix").innerHTML = "";
  document.getElementById("playfair-matrix").appendChild(table);
}

function updateDigraphProcessing() {
  const text = document.getElementById("plaintext").value;
  const keyword = document.getElementById("keyword").value;

  if (!text.trim() || !keyword.trim()) {
    document.getElementById("digraph-processing").innerHTML = '<p class="text-muted">Nhập văn bản và từ khóa để xem quá trình xử lý...</p>';
    return;
  }

  const prepared = PlayfairCipher.preparePlaintext(text);
  let html = "<h6>Xử lý văn bản:</h6>";
  html += `<p><strong>Gốc:</strong> ${text}</p>`;
  html += `<p><strong>Chuẩn hóa:</strong> ${prepared}</p>`;
  html += "<p><strong>Cặp ký tự:</strong> ";

  for (let i = 0; i < prepared.length; i += 2) {
    html += `<span class="badge bg-secondary me-1">${prepared.slice(i, i + 2)}</span>`;
  }
  html += "</p>";

  document.getElementById("digraph-processing").innerHTML = html;
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  updateMatrix();
  updateDigraphProcessing();

  // Update matrix when keyword changes
  document.getElementById("keyword").addEventListener("input", function () {
    updateMatrix();
    updateDigraphProcessing();
  });

  // Update digraph processing when text changes
  document.getElementById("plaintext").addEventListener("input", updateDigraphProcessing);
});
