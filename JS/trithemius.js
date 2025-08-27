// Trithemius Cipher implementation
const TrithemiusCipher = {
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  keyType: "progressive",
  customKey: "",

  generateKey: function (length, type = "progressive", customKey = "") {
    const keys = [];

    switch (type) {
      case "progressive":
        for (let i = 0; i < length; i++) {
          keys.push(i % 26);
        }
        break;

      case "squared":
        for (let i = 0; i < length; i++) {
          keys.push((i * i) % 26);
        }
        break;

      case "custom":
        if (!customKey) customKey = "SECRETKEY";
        const cleanKey = CipherUtils.cleanText(customKey);
        for (let i = 0; i < length; i++) {
          const keyChar = cleanKey[i % cleanKey.length];
          keys.push(this.alphabet.indexOf(keyChar));
        }
        break;

      default:
        // Progressive by default
        for (let i = 0; i < length; i++) {
          keys.push(i % 26);
        }
    }

    return keys;
  },

  encrypt: function (text, keyType = "progressive", customKey = "") {
    const cleanText = CipherUtils.cleanText(text);
    const keys = this.generateKey(cleanText.length, keyType, customKey);
    let result = "";

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const charIndex = this.alphabet.indexOf(char);

      if (charIndex !== -1) {
        const newIndex = (charIndex + keys[i]) % 26;
        result += this.alphabet[newIndex];
      }
    }

    return CipherUtils.formatOutput(result);
  },

  decrypt: function (text, keyType = "progressive", customKey = "") {
    const cleanText = CipherUtils.cleanText(text);
    const keys = this.generateKey(cleanText.length, keyType, customKey);
    let result = "";

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const charIndex = this.alphabet.indexOf(char);

      if (charIndex !== -1) {
        const newIndex = (charIndex - keys[i] + 26) % 26;
        result += this.alphabet[newIndex];
      }
    }

    return CipherUtils.formatOutput(result);
  },

  getStepByStep: function (text, keyType = "progressive", customKey = "", isEncrypt = true) {
    const cleanText = CipherUtils.cleanText(text);
    const keys = this.generateKey(cleanText.length, keyType, customKey);
    const steps = [];

    for (let i = 0; i < Math.min(cleanText.length, 20); i++) {
      // Limit to 20 steps for display
      const char = cleanText[i];
      const charIndex = this.alphabet.indexOf(char);

      if (charIndex !== -1) {
        let newIndex, resultChar;
        if (isEncrypt) {
          newIndex = (charIndex + keys[i]) % 26;
          resultChar = this.alphabet[newIndex];
        } else {
          newIndex = (charIndex - keys[i] + 26) % 26;
          resultChar = this.alphabet[newIndex];
        }

        steps.push({
          position: i,
          original: char,
          key: keys[i],
          keyChar: this.alphabet[keys[i]],
          result: resultChar,
          calculation: isEncrypt ? `${char}(${charIndex}) + ${keys[i]} = ${newIndex} = ${resultChar}` : `${char}(${charIndex}) - ${keys[i]} = ${newIndex} = ${resultChar}`,
        });
      }
    }

    return steps;
  },
};

// Page functions
function encryptTrithemius() {
  const plaintext = document.getElementById("plaintext").value;
  const keyType = document.getElementById("key-type").value;
  const customKey = document.getElementById("custom-key").value;

  if (!plaintext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần mã hóa!", false);
    return;
  }

  if (keyType === "custom" && !customKey.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập khóa tùy chỉnh!", false);
    return;
  }

  const result = TrithemiusCipher.encrypt(plaintext, keyType, customKey);
  document.getElementById("ciphertext").value = result;

  updateKeySequence(plaintext, keyType, customKey);
  updateStepByStep(plaintext, keyType, customKey, true);

  CipherUtils.showResult("result-message", "Mã hóa thành công!", true);
}

function decryptTrithemius() {
  const ciphertext = document.getElementById("plaintext").value;
  const keyType = document.getElementById("key-type").value;
  const customKey = document.getElementById("custom-key").value;

  if (!ciphertext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần giải mã!", false);
    return;
  }

  if (keyType === "custom" && !customKey.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập khóa tùy chỉnh!", false);
    return;
  }

  const result = TrithemiusCipher.decrypt(ciphertext, keyType, customKey);
  document.getElementById("ciphertext").value = result;

  updateKeySequence(ciphertext, keyType, customKey);
  updateStepByStep(ciphertext, keyType, customKey, false);

  CipherUtils.showResult("result-message", "Giải mã thành công!", true);
}

function generateExample() {
  const examples = ["ATTACKATDAWN", "HELLOWORLDTEST", "CRYPTOGRAPHYISFUN", "SECRETMESSAGE"];

  const randomExample = examples[Math.floor(Math.random() * examples.length)];
  document.getElementById("plaintext").value = randomExample;

  const keyTypes = ["progressive", "squared"];
  const randomKeyType = keyTypes[Math.floor(Math.random() * keyTypes.length)];
  document.getElementById("key-type").value = randomKeyType;

  updateKeyType();
  encryptTrithemius();

  CipherUtils.showToast(`Đã tạo ví dụ với khóa ${randomKeyType}!`);
}

function clearAll() {
  document.getElementById("plaintext").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("custom-key").value = "";
  document.getElementById("key-type").value = "progressive";
  document.getElementById("result-message").style.display = "none";
  updateKeyType();
  document.getElementById("key-sequence").innerHTML = "";
  document.getElementById("step-by-step").innerHTML = "";
}

function copyResult() {
  const result = document.getElementById("ciphertext").value;
  if (result) {
    CipherUtils.copyToClipboard(result);
  } else {
    CipherUtils.showToast("Không có kết quả để sao chép!", "error");
  }
}

function updateKeyType() {
  const keyType = document.getElementById("key-type").value;
  const customKeyGroup = document.getElementById("custom-key-group");

  if (keyType === "custom") {
    customKeyGroup.style.display = "block";
  } else {
    customKeyGroup.style.display = "none";
  }
}

function updateKeySequence(text, keyType, customKey) {
  const cleanText = CipherUtils.cleanText(text);
  const keys = TrithemiusCipher.generateKey(cleanText.length, keyType, customKey);

  let html = '<div class="row">';
  const displayLength = Math.min(keys.length, 20); // Limit display

  for (let i = 0; i < displayLength; i++) {
    const keyChar = TrithemiusCipher.alphabet[keys[i]];
    html += `<div class="col-1 text-center mb-1">
            <div class="font-height d-flex flex-column align-items-center">
                <div>${i}</div>
                <div class="badge bg-info" style="margin: 0.6rem 0rem">${keys[i]}</div>
                <div>${keyChar}</div>
            </div>
        </div>`;
  }

  if (keys.length > 20) {
    html += '<div class="col-12 text-center"><small class="text-muted">... và tiếp tục</small></div>';
  }

  html += "</div>";
  document.getElementById("key-sequence").innerHTML = html;
}

function updateStepByStep(text, keyType, customKey, isEncrypt) {
  const steps = TrithemiusCipher.getStepByStep(text, keyType, customKey, isEncrypt);

  if (steps.length === 0) {
    document.getElementById("step-by-step").innerHTML = '<p class="text-muted">Nhập văn bản để xem quá trình từng bước</p>';
    return;
  }

  let html = `<div class="table-responsive">
        <table class="table table-sm font-height" style="border: 1px solid black; border-collapse: collapse;">
            <thead>
                <tr>
                    <th class="header-table">Vị trí</th>
                    <th class="header-table">Ký tự</th>
                    <th class="header-table">Khóa</th>
                    <th class="header-table">Tính toán</th>
                    <th class="header-table">Kết quả</th>
                </tr>
            </thead>
            <tbody>`;

  for (const step of steps) {
    html += `<tr>
            <td><strong>${step.position}</strong></td>
            <td><span class="badge bg-secondary">${step.original}</span></td>
            <td><span class="badge bg-info">${step.key}</span></td>
            <td><strong>${step.calculation}</strong></td>
            <td><span class="badge bg-success">${step.result}</span></td>
        </tr>`;
  }

  html += "</tbody></table></div>";
  document.getElementById("step-by-step").innerHTML = html;
}

function generateTabulaRecta() {
  const alphabet = TrithemiusCipher.alphabet;
  let html = "<thead><tr><th></th>";

  // Header row
  for (let i = 0; i < 26; i++) {
    html += `<th>${i + 1}</th>`;
  }
  html += "</tr></thead><tbody>";

  // Body rows
  for (let row = 0; row < 26; row++) {
    html += `<tr><th>${row}</th>`;
    for (let col = 0; col < 26; col++) {
      const shiftedChar = alphabet[(col + row) % 26];
      html += `<td>${shiftedChar}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody>";
  document.getElementById("tabula-recta").innerHTML = html;
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  updateKeyType();
  generateTabulaRecta();
});
