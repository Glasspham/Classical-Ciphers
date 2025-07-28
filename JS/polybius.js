// Polybius Square implementation
const PolybiusSquare = {
  // 5x5 grid for Polybius Square (I/J share the same position)
  square: [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I/J", "K"],
    ["L", "M", "N", "O", "P"],
    ["Q", "R", "S", "T", "U"],
    ["V", "W", "X", "Y", "Z"],
  ],

  // Encrypt text using Polybius Square
  encrypt: function (text) {
    if (!text) return "";

    text = text.toUpperCase().replace(/J/g, "I"); // Replace J with I
    let result = [];

    for (let char of text) {
      if (char.match(/[A-Z]/)) {
        const coordinates = this.getCoordinates(char);
        if (coordinates) {
          result.push(coordinates);
        }
      } else if (char === " ") {
        result.push(" ");
      }
    }

    return result.join(" ").replace(/\s+/g, " ").trim();
  },

  // Decrypt text using Polybius Square
  decrypt: function (text) {
    if (!text) return "";

    // Remove extra spaces and split by space
    const parts = text.trim().split(/\s+/);
    let result = [];

    for (let part of parts) {
      if (part === " ") {
        result.push(" ");
      } else if (part.match(/^\d{2}$/)) {
        // Valid coordinate (2 digits)
        const char = this.getCharacter(part);
        if (char) {
          result.push(char);
        } else {
          return null; // Invalid coordinate
        }
      } else if (part.length === 0) {
        // Skip empty parts
        continue;
      } else {
        return null; // Invalid format
      }
    }

    return result.join("");
  },

  // Get coordinates for a character
  getCoordinates: function (char) {
    char = char.toUpperCase();
    if (char === "J") char = "I";

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (this.square[row][col] === char || (this.square[row][col] === "I/J" && char === "I")) {
          return `${row + 1}${col + 1}`;
        }
      }
    }
    return null;
  },

  // Get character for coordinates
  getCharacter: function (coordinates) {
    if (coordinates.length !== 2) return null;

    const row = parseInt(coordinates[0]) - 1;
    const col = parseInt(coordinates[1]) - 1;

    if (row < 0 || row >= 5 || col < 0 || col >= 5) return null;

    let char = this.square[row][col];
    return char === "I/J" ? "I" : char;
  },

  // Generate visual table for display
  generateTable: function () {
    const table = document.createElement("table");
    table.className = "table table-bordered polybius-table mx-auto";
    table.style.maxWidth = "400px";

    // Header row with column numbers
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th class="text-center bg-primary text-white"></th>';
    for (let col = 1; col <= 5; col++) {
      headerRow.innerHTML += `<th class="text-center bg-primary text-white">${col}</th>`;
    }

    // Data rows
    for (let row = 0; row < 5; row++) {
      const tr = table.insertRow();
      // Row number
      tr.innerHTML = `<th class="text-center bg-primary text-white">${row + 1}</th>`;

      // Cells
      for (let col = 0; col < 5; col++) {
        const cell = tr.insertCell();
        cell.className = "text-center fw-bold polybius-cell";
        cell.textContent = this.square[row][col];
        cell.setAttribute("data-coordinates", `${row + 1}${col + 1}`);

        // Add hover effect
        cell.addEventListener("mouseenter", function () {
          this.classList.add("bg-light");
        });
        cell.addEventListener("mouseleave", function () {
          this.classList.remove("bg-light");
        });
      }
    }

    return table;
  },
};

// Page functions
function encryptPolybius() {
  const plaintext = document.getElementById("plaintext").value;

  if (!plaintext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần mã hóa!", false);
    return;
  }

  const result = PolybiusSquare.encrypt(plaintext);
  document.getElementById("ciphertext").value = result;
  CipherUtils.showResult("result-message", "Mã hóa thành công!", true);
}

function decryptPolybius() {
  const ciphertext = document.getElementById("plaintext").value;

  if (!ciphertext.trim()) {
    CipherUtils.showResult("result-message", "Vui lòng nhập văn bản cần giải mã!", false);
    return;
  }

  const result = PolybiusSquare.decrypt(ciphertext);
  if (result) {
    document.getElementById("ciphertext").value = result;
    CipherUtils.showResult("result-message", "Giải mã thành công!", true);
  } else {
    CipherUtils.showResult("result-message", "Định dạng không hợp lệ! Vui lòng nhập các cặp số cách nhau bởi dấu cách.", false);
  }
}

function clearAll() {
  document.getElementById("plaintext").value = "";
  document.getElementById("ciphertext").value = "";
  document.getElementById("result-message").style.display = "none";
  document.getElementById("char-lookup").value = "";
  document.getElementById("char-coordinate").value = "";
}

function copyResult() {
  const result = document.getElementById("ciphertext").value;
  if (result) {
    CipherUtils.copyToClipboard(result);
  } else {
    CipherUtils.showToast("Không có kết quả để sao chép!", "error");
  }
}

function generatePolybiusGrid() {
  const table = PolybiusSquare.generateTable();
  document.getElementById("polybius-grid").innerHTML = "";
  document.getElementById("polybius-grid").appendChild(table);
}

function findCharacterCoordinate(char) {
  if (!char) return "";

  char = char.toUpperCase();
  if (char === "J") char = "I"; // J maps to I

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (PolybiusSquare.square[row][col] === char || (PolybiusSquare.square[row][col] === "I/J" && char === "I")) {
        return `${row + 1}${col + 1}`;
      }
    }
  }
  return "";
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  generatePolybiusGrid();

  // Add character lookup functionality
  document.getElementById("char-lookup").addEventListener("input", function () {
    const char = this.value;
    const coordinate = findCharacterCoordinate(char);
    document.getElementById("char-coordinate").value = coordinate;
  });
});
