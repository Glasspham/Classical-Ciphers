document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cipher-disk-viz");
  const ctx = canvas.getContext("2d");

  // Inputs
  const outerDiskInput = document.getElementById("outer-disk-input");
  const innerDiskInput = document.getElementById("inner-disk-input");
  const outerAlignInput = document.getElementById("outer-align-input");
  const innerAlignInput = document.getElementById("inner-align-input");
  const inputs = [outerDiskInput, innerDiskInput, outerAlignInput, innerAlignInput];

  // Settings
  const settingsBtn = document.getElementById("settings-btn");
  const popover = new bootstrap.Popover(settingsBtn, {
    content: function () {
      // Clone the template content
      const contentNode = document.getElementById("popover-content").content.cloneNode(true);

      // Set the state of the radio buttons before the popover is shown
      // This prevents the UI from flickering
      const rotationTargetRadios = contentNode.querySelectorAll('input[name="rotationTarget"]');
      rotationTargetRadios.forEach((radio) => {
        radio.checked = radio.value === rotationTarget;
      });

      const rotationModeRadios = contentNode.querySelectorAll('input[name="rotationMode"]');
      rotationModeRadios.forEach((radio) => {
        radio.checked = radio.value === rotationMode;
      });

      const rotationModeGroup = contentNode.querySelector("#rotation-mode-group");
      if (rotationModeGroup) {
        rotationModeGroup.style.display = rotationTarget === "none" ? "none" : "block";
      }

      return contentNode;
    },
    html: true,
    customClass: "disk-settings-popover",
    trigger: "manual", // Use manual trigger to have full control
  });

  // Toggle popover on button click
  settingsBtn.addEventListener("click", (event) => {
    // Prevent the click from bubbling up to the document listener
    event.stopPropagation();
    popover.toggle();
  });

  // Hide popover when clicking outside of it
  document.addEventListener("click", (event) => {
    const popoverEl = document.querySelector(".disk-settings-popover.show");
    const isClickInsideButton = settingsBtn.contains(event.target);

    // If the popover is visible and the click is outside both the button and the popover content
    if (popoverEl && !isClickInsideButton && !popoverEl.contains(event.target)) {
      popover.hide();
    }
  });

  // State
  let rotationTarget = "inner"; // 'inner', 'outer', 'both', or 'none'
  let rotationMode = "snap"; // 'snap' or 'free'
  let draggedRing = null; // NEW: 'inner' or 'outer', tracks the actively dragged ring
  let isDragging = false;
  let lastMouseAngle = 0;
  let outerRotation = 0;
  let innerRotation = 0;

  function getCanvasCenter() {
    return { x: canvas.width / 2, y: canvas.height / 2 };
  }

  function drawDisk() {
    const centerX = getCanvasCenter().x;
    const centerY = getCanvasCenter().y;
    const width = canvas.width;

    const outerChars = outerDiskInput.value.toUpperCase();
    const innerChars = innerDiskInput.value.toUpperCase();
    const outerAlignChar = outerAlignInput.value.toUpperCase();
    const innerAlignChar = innerAlignInput.value.toUpperCase();

    const outerRadius = width * 0.45;
    const innerRadius = width * 0.3;
    const centerHoleRadius = width * 0.15;
    const textRadius = width * 0.375;
    const innerTextRadius = width * 0.225;

    ctx.clearRect(0, 0, width, canvas.height);

    if (!isDragging) {
      const outerAlignIndex = outerChars.indexOf(outerAlignChar);
      if (outerAlignIndex !== -1) {
        outerRotation = -((2 * Math.PI) / (outerChars.length || 1)) * outerAlignIndex;
      }
      const innerAlignIndex = innerChars.indexOf(innerAlignChar);
      if (innerAlignIndex !== -1) {
        innerRotation = -((2 * Math.PI) / (innerChars.length || 1)) * innerAlignIndex;
      }
    }

    ctx.fillStyle = "#343a40";
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#495057";
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#212529";
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerHoleRadius, 0, 2 * Math.PI);
    ctx.fill();

    drawSeparators(outerChars.length, outerRadius, innerRadius, outerRotation, "#6c757d");
    drawSeparators(innerChars.length, innerRadius, centerHoleRadius, innerRotation, "#6c757d");
    drawTextOnRing(outerChars, textRadius, outerRotation, "#FFFFFF", 16);
    drawTextOnRing(innerChars, innerTextRadius, innerRotation, "#FFFFFF", 16);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - outerRadius - 5);
    ctx.lineTo(centerX - 5, centerY - outerRadius - 15);
    ctx.lineTo(centerX + 5, centerY - outerRadius - 15);
    ctx.closePath();
    ctx.fill();
  }

  function drawSeparators(count, fromRadius, toRadius, rotation, color) {
    if (count === 0) return;
    const centerX = getCanvasCenter().x;
    const centerY = getCanvasCenter().y;
    const angleStep = (2 * Math.PI) / count;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      const angle = rotation + i * angleStep - Math.PI / 2 - angleStep / 2;
      const startX = centerX + fromRadius * Math.cos(angle);
      const startY = centerY + fromRadius * Math.sin(angle);
      const endX = centerX + toRadius * Math.cos(angle);
      const endY = centerY + toRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  function drawTextOnRing(chars, radius, initialRotation, color, fontSize) {
    if (chars.length === 0) return;
    const centerX = getCanvasCenter().x;
    const centerY = getCanvasCenter().y;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const angleStep = (2 * Math.PI) / chars.length;
    for (let i = 0; i < chars.length; i++) {
      const angle = initialRotation + i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(chars[i], 0, 0);
      ctx.restore();
    }
  }

  function getMouseAngle(e) {
    const rect = canvas.getBoundingClientRect();
    const centerX = getCanvasCenter().x;
    const centerY = getCanvasCenter().y;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return Math.atan2(mouseY - centerY, mouseX - centerX);
  }

  function handleMouseDown(e) {
    if (rotationTarget === "none") return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dx = mouseX - getCanvasCenter().x;
    const dy = mouseY - getCanvasCenter().y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const outerRadius = canvas.width * 0.45;
    const innerRadius = canvas.width * 0.3;
    const centerHoleRadius = canvas.width * 0.15;

    const onInner = distance <= innerRadius && distance >= centerHoleRadius;
    const onOuter = distance <= outerRadius && distance > innerRadius;

    draggedRing = null; // Reset before checking

    if (rotationTarget === "inner" && onInner) {
      draggedRing = "inner";
    } else if (rotationTarget === "outer" && onOuter) {
      draggedRing = "outer";
    } else if (rotationTarget === "both") {
      if (onInner) draggedRing = "inner";
      else if (onOuter) draggedRing = "outer";
    }

    if (draggedRing) {
      isDragging = true;
      lastMouseAngle = getMouseAngle(e);
      canvas.style.cursor = "grabbing";
    }
  }

  function snapRing(isInner) {
    const chars = (isInner ? innerDiskInput.value : outerDiskInput.value).toUpperCase();
    if (chars.length > 0) {
      const angleStep = (2 * Math.PI) / chars.length;
      const currentRotation = isInner ? innerRotation : outerRotation;
      const snappedIndex = Math.round(-currentRotation / angleStep);
      const snappedRotation = -snappedIndex * angleStep;
      if (isInner) {
        innerRotation = snappedRotation;
      } else {
        outerRotation = snappedRotation;
      }
      updateAlignInputForRing(isInner);
    }
  }

  function snapToNearest() {
    if (rotationTarget === "inner") {
      snapRing(true);
    } else if (rotationTarget === "outer") {
      snapRing(false);
    } else if (rotationTarget === "both") {
      snapRing(true);
      snapRing(false);
    }
  }

  function handleMouseUp() {
    if (!isDragging) return;

    if (rotationMode === "snap" && draggedRing) {
      snapRing(draggedRing === "inner");
      drawDisk();
    }

    isDragging = false;
    draggedRing = null;
    canvas.style.cursor = "pointer";
  }

  function handleMouseMove(e) {
    if (!isDragging || !draggedRing) return;
    const currentMouseAngle = getMouseAngle(e);
    const deltaAngle = currentMouseAngle - lastMouseAngle;
    lastMouseAngle = currentMouseAngle;

    if (draggedRing === "inner") {
      innerRotation += deltaAngle;
    } else if (draggedRing === "outer") {
      outerRotation += deltaAngle;
    }

    updateInputFromRotation();
    drawDisk();
  }

  function updateAlignInputForRing(isInner) {
    const chars = (isInner ? innerDiskInput.value : outerDiskInput.value).toUpperCase();
    const rotation = isInner ? innerRotation : outerRotation;
    const inputField = isInner ? innerAlignInput : outerAlignInput;

    if (chars.length > 0) {
      const angleStep = (2 * Math.PI) / chars.length;
      let topIndex = Math.round(-rotation / angleStep);
      topIndex = ((topIndex % chars.length) + chars.length) % chars.length;
      const newAlignChar = chars[topIndex];
      if (inputField.value !== newAlignChar) {
        inputField.value = newAlignChar;
      }
    }
  }

  function updateInputFromRotation() {
    if (!draggedRing) return; // Only update if a ring was dragged
    updateAlignInputForRing(draggedRing === "inner");
  }

  // --- Event Listeners ---
  inputs.forEach((input) => input.addEventListener("input", drawDisk));
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseover", () => {
    if (rotationTarget !== "none") canvas.style.cursor = "pointer";
  });

  document.body.addEventListener("change", (e) => {
    const target = e.target;
    if (target.name === "rotationTarget") {
      rotationTarget = target.value;
      updateRotationControlsVisibility(); // Update button visibility
      // Find the popover this radio button is in to correctly hide/show the mode group
      const popoverBody = target.closest(".popover-body");
      if (popoverBody) {
        const rotationModeGroup = popoverBody.querySelector("#rotation-mode-group");
        if (rotationModeGroup) {
          rotationModeGroup.style.display = rotationTarget === "none" ? "none" : "block";
        }
      }
      canvas.style.cursor = rotationTarget === "none" ? "default" : "pointer";
    }
    if (target.name === "rotationMode") {
      const oldMode = rotationMode;
      rotationMode = target.value;
      // When switching from free to snap, auto-snap the disks
      if (oldMode === "free" && rotationMode === "snap") {
        snapToNearest();
        drawDisk();
      }
    }
  });

  // --- Buttons for mobile rotation ---
  const rotationButtonsContainer = document.getElementById("rotation-buttons-container");
  const genericRotationControls = document.getElementById("generic-rotation-controls");
  const bothRotationControls = document.getElementById("both-rotation-controls");

  const rotateLeftBtn = document.getElementById("rotate-left-btn");
  const rotateRightBtn = document.getElementById("rotate-right-btn");
  const innerRotateLeftBtn = document.getElementById("inner-rotate-left-btn");
  const innerRotateRightBtn = document.getElementById("inner-rotate-right-btn");
  const outerRotateLeftBtn = document.getElementById("outer-rotate-left-btn");
  const outerRotateRightBtn = document.getElementById("outer-rotate-right-btn");

  function updateRotationControlsVisibility() {
    if (rotationTarget === "none") {
      rotationButtonsContainer.classList.add("d-none");
    } else {
      rotationButtonsContainer.classList.remove("d-none");
      if (rotationTarget === "both") {
        genericRotationControls.classList.add("d-none");
        bothRotationControls.classList.remove("d-none");
      } else {
        genericRotationControls.classList.remove("d-none");
        bothRotationControls.classList.add("d-none");
      }
    }
  }

  function rotateByStep(direction, ring = null) {
    // direction: 1 for right (clockwise), -1 for left (counter-clockwise)
    // ring: 'inner', 'outer', or null to follow rotationTarget
    if (rotationTarget === "none" && ring === null) return;

    const rotateRing = (isInner) => {
      const chars = (isInner ? innerDiskInput.value : outerDiskInput.value).toUpperCase();
      const currentRotation = isInner ? innerRotation : outerRotation;

      if (chars.length === 0) return;

      const angleStep = (2 * Math.PI) / chars.length;

      // Find the current index at the top
      let currentIndex = Math.round(-currentRotation / angleStep);

      // Calculate the new index
      let newIndex = currentIndex + direction;

      // Calculate the new rotation angle
      const newRotation = -newIndex * angleStep;

      if (isInner) {
        innerRotation = newRotation;
      } else {
        outerRotation = newRotation;
      }

      // Update the alignment input field based on the new rotation
      updateAlignInputForRing(isInner);
    };

    if (ring) {
      // Specific ring rotation for 'both' mode
      rotateRing(ring === "inner");
    } else {
      // Follow the global rotationTarget
      if (rotationTarget === "inner") {
        rotateRing(true);
      } else if (rotationTarget === "outer") {
        rotateRing(false);
      }
    }

    drawDisk();
  }

  if (rotateLeftBtn && rotateRightBtn) {
    rotateLeftBtn.addEventListener("click", () => rotateByStep(1)); // -1 for left
    rotateRightBtn.addEventListener("click", () => rotateByStep(-1)); // 1 for right
  }
  if (innerRotateLeftBtn && innerRotateRightBtn) {
    innerRotateLeftBtn.addEventListener("click", () => rotateByStep(1, "inner"));
    innerRotateRightBtn.addEventListener("click", () => rotateByStep(-1, "inner"));
  }
  if (outerRotateLeftBtn && outerRotateRightBtn) {
    outerRotateLeftBtn.addEventListener("click", () => rotateByStep(1, "outer"));
    outerRotateRightBtn.addEventListener("click", () => rotateByStep(-1, "outer"));
  }

  updateRotationControlsVisibility(); // Initial setup
  drawDisk();
});
