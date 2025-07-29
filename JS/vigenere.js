// Vigenère Cipher - Logic and DOM Manipulation

const VigenereCipher = {
  ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

  // Clean and prepare the keyword
  prepareKeyword: function (keyword) {
    return keyword.replace(/[^A-Za-z]/g, "").toUpperCase();
  },

  // Core logic for Vigenère process
  process: function (text, keyword, isEncrypt = true) {
    const cleanText = CipherUtils.cleanText(text);
    const preparedKeyword = this.prepareKeyword(keyword);

    if (!cleanText.length) {
      CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần xử lý!", false);
      return "";
    }
    if (!preparedKeyword.length) {
      CipherUtils.showResult("result-message", "Vui lòng nhập từ khóa hợp lệ!", false);
      return "";
    }

    let result = "";
    let keywordIndex = 0;

    for (let i = 0; i < cleanText.length; i++) {
      const textChar = cleanText[i];
      const textIndex = this.ALPHABET.indexOf(textChar);

      if (textIndex !== -1) {
        const keyChar = preparedKeyword[keywordIndex % preparedKeyword.length];
        const keyIndex = this.ALPHABET.indexOf(keyChar);
        keywordIndex++;

        let resultIndex;
        if (isEncrypt) {
          resultIndex = (textIndex + keyIndex) % 26;
        } else {
          resultIndex = (textIndex - keyIndex + 26) % 26;
        }
        result += this.ALPHABET[resultIndex];
      } else {
        // This part is unlikely to be reached due to cleanText, but it's good practice
        result += textChar;
      }
    }
    return result;
  },

  // Generate the Vigenère square for visualization
  generateVigenereTable: function () {
    const container = document.getElementById("vigenere-table-container");
    if (!container) return;

    let tableHtml = '<table class="table small table-sm text-center ">';
    
    // Header Row
    tableHtml += '<thead><tr><th class="bg-light"></th>';
    for (const char of this.ALPHABET) {
      tableHtml += `<th class="bg-light">${char}</th>`;
    }
    tableHtml += '</tr></thead>';
    
    // Body Rows
    tableHtml += '<tbody>';
    for (let i = 0; i < this.ALPHABET.length; i++) {
      const keyChar = this.ALPHABET[i];
      tableHtml += `<tr><th class="bg-light">${keyChar}</th>`;
      for (let j = 0; j < this.ALPHABET.length; j++) {
        const shiftedChar = this.ALPHABET[(i + j) % 26];
        tableHtml += `<td>${shiftedChar}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';
    
    container.innerHTML = tableHtml;
  },

  // Update the details modal with the step-by-step process
  updateMappingTable: function (text, keyword, isEncrypt = true) {
    const tableBody = document.getElementById("mapping-table-modal-body");
    if (!tableBody) return;

    const cleanText = CipherUtils.cleanText(text);
    const preparedKeyword = this.prepareKeyword(keyword);
    let html = '<div class="vigenere-steps">';

    let keywordIndex = 0;
    for (let i = 0; i < cleanText.length; i++) {
      const plainChar = cleanText[i];
      const plainIndex = this.ALPHABET.indexOf(plainChar);
      const keyChar = preparedKeyword[keywordIndex % preparedKeyword.length];
      const keyIndex = this.ALPHABET.indexOf(keyChar);
      keywordIndex++;

      let resultIndex, resultChar, formula, explanation;
      if (isEncrypt) {
        resultIndex = (plainIndex + keyIndex) % 26;
        resultChar = this.ALPHABET[resultIndex];
        formula = `(${plainIndex} + ${keyIndex}) mod 26 = ${resultIndex}`;
        explanation = `<strong>Plain:</strong> <span class="badge bg-primary">${plainChar}</span> → <strong>Cipher:</strong> <span class="badge bg-success">${resultChar}</span>`;
      } else {
        resultIndex = (plainIndex - keyIndex + 26) % 26;
        resultChar = this.ALPHABET[resultIndex];
        formula = `(${plainIndex} - ${keyIndex} + 26) mod 26 = ${resultIndex}`;
        explanation = `<strong>Cipher:</strong> <span class="badge bg-success">${plainChar}</span> → <strong>Plain:</strong> <span class="badge bg-primary">${resultChar}</span>`;
      }

      html += `<div class="border rounded p-3 mb-3 bg-solution-detail">
          <div class="row">
            <div class="col-12">
              <h6><strong>Bước ${i + 1}:</strong></h6>
              <div class="mb-2">${explanation}</div>
              <div class="text-dark">
                <strong>Tính toán:</strong><br>
                • Ký tự văn bản: <code>${plainChar}</code> (vị trí ${plainIndex})<br>
                • Ký tự khóa: <code>${keyChar}</code> (vị trí ${keyIndex})<br>
                • Công thức: <code>${formula}</code><br>
                • Ký tự kết quả: <code>${resultChar}</code>
              </div>
            </div>
          </div>
        </div>`;
    }

    html += '</div>';
    tableBody.innerHTML = html;
  }
};

// --- DOM Event Functions ---

function encryptVigenere() {
  const plaintext = document.getElementById("plaintext").value;
  const keyword = document.getElementById("keyword").value;
  
  const result = VigenereCipher.process(plaintext, keyword, true);
  
  if (result) {
    document.getElementById("ciphertext").value = result;
    CipherUtils.showResult("result-message", "Mã hóa thành công!", true);
    document.getElementById("show-details-btn").disabled = false;
    VigenereCipher.updateMappingTable(plaintext, keyword, true);
    document.getElementById('process-title').textContent = 'Quá trình Mã hóa';
  }
}

function decryptVigenere() {
  const ciphertext = document.getElementById("plaintext").value;
  const keyword = document.getElementById("keyword").value;

  const result = VigenereCipher.process(ciphertext, keyword, false);

  if (result) {
    document.getElementById("ciphertext").value = result;
    CipherUtils.showResult("result-message", "Giải mã thành công!", true);
    document.getElementById("show-details-btn").disabled = false;
    VigenereCipher.updateMappingTable(ciphertext, keyword, false);
    document.getElementById('process-title').textContent = 'Quá trình Giải mã';
  }
}

function clearAll() {
  document.getElementById("plaintext").value = "";
  document.getElementById("keyword").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("result-message").style.display = "none";
  document.getElementById("show-details-btn").disabled = true;
  CipherUtils.showToast("Đã xóa các trường.", "success");
}

function copyResult() {
  const result = document.getElementById("ciphertext").value;
  if (result) {
    CipherUtils.copyToClipboard(result);
  } else {
    CipherUtils.showToast("Không có kết quả để sao chép!", "error");
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  VigenereCipher.generateVigenereTable();
});
