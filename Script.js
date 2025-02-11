document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('art-canvas');
    const ctx = canvas.getContext('2d');

    // Control elements
    const numShapesInput = document.getElementById('num-shapes');
    const shapeSizeInput = document.getElementById('shape-size');
    const shapeTypeSelect = document.getElementById('shape-type');
    const colorPaletteSelect = document.getElementById('color-palette');
    const customColorInput = document.getElementById('custom-color');
    const backgroundColorInput = document.getElementById('background-color');
    const gradientCheckbox = document.getElementById('gradient');
    const patternCheckbox = document.getElementById('pattern');
    const generateButton = document.getElementById('generate-button');
    const saveButton = document.getElementById('save-button');
    const savePresetButton = document.getElementById('save-preset-button');
    const loadPresetButton = document.getElementById('load-preset-button');

    // Enable/disable custom color based on palette selection
    colorPaletteSelect.addEventListener('change', () => {
        customColorInput.disabled = (colorPaletteSelect.value !== 'custom');
    });

    function getRandomColor(palette = 'random') {
        switch (palette) {
            case 'warm':
                const warmColors = ['#FF5733', '#FFC300', '#FF7F50', '#E74C3C', '#D35400'];
                return warmColors[Math.floor(Math.random() * warmColors.length)];
            case 'cool':
                const coolColors = ['#3498DB', '#2ECC71', '#9B59B6', '#34495E', '#2980B9'];
                return coolColors[Math.floor(Math.random() * coolColors.length)];
            case 'custom':
                return customColorInput.value;
            default:
                return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    }

    function drawShape(x, y, size, shapeType, color) {
        ctx.fillStyle = color;
        ctx.beginPath();

        switch (shapeType) {
            case 'rectangle':
                ctx.fillRect(x, y, size, size);
                break;
            case 'circle':
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'triangle':
                ctx.moveTo(x + size / 2, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                ctx.fill();
                break;
            case 'line':
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y + size);
                ctx.stroke();
                break;
        }
    }

    function drawGradient(x, y, size, shapeType, color1, color2) {
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size); // Diagonal gradient
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.beginPath();

        switch (shapeType) {
            case 'rectangle':
                ctx.fillRect(x, y, size, size);
                break;
            case 'circle':
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'triangle':
                ctx.moveTo(x + size / 2, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                ctx.fill();
                break;
            case 'line':
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y + size);
                ctx.stroke();
                break;
        }
    }

    function drawPattern() {
        const cellSize = parseInt(shapeSizeInput.value) * 2; //Make the cells a bit bigger
        const numShapes = parseInt(numShapesInput.value); //reuse this for shape count in cells

        for (let row = 0; row < canvas.height / cellSize; row++) {
            for (let col = 0; col < canvas.width / cellSize; col++) {
                const x = col * cellSize;
                const y = row * cellSize;

                //Draw a few shapes inside each grid cell
                for (let i = 0; i < numShapes; i++) {
                  const shapeX = x + Math.random() * cellSize;
                  const shapeY = y + Math.random() * cellSize;
                  const shapeSize = cellSize / 4; //make them smaller than the cell
                  const color = getRandomColor(colorPaletteSelect.value);

                  drawShape(shapeX, shapeY, shapeSize, shapeTypeSelect.value, color);
                }
            }
        }
    }

    function draw() {
        const numShapes = parseInt(numShapesInput.value);
        const shapeSize = parseInt(shapeSizeInput.value);
        const shapeType = shapeTypeSelect.value;
        const colorPalette = colorPaletteSelect.value;
        const backgroundColor = backgroundColorInput.value;
        const useGradient = gradientCheckbox.checked;
        const usePattern = patternCheckbox.checked;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor; // Set background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (usePattern) {
            drawPattern();
        } else {
            for (let i = 0; i < numShapes; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const color = getRandomColor(colorPalette);

                if (useGradient) {
                    const color2 = getRandomColor(colorPalette);
                    drawGradient(x, y, shapeSize, shapeType, color, color2);
                } else {
                    drawShape(x, y, shapeSize, shapeType, color);
                }
            }
        }
    }

    function savePreset() {
        const preset = {
            numShapes: numShapesInput.value,
            shapeSize: shapeSizeInput.value,
            shapeType: shapeTypeSelect.value,
            colorPalette: colorPaletteSelect.value,
            customColor: customColorInput.value,
            backgroundColor: backgroundColorInput.value,
            gradient: gradientCheckbox.checked,
            pattern: patternCheckbox.checked,
        };
        localStorage.setItem('artPreset', JSON.stringify(preset));
        alert('Preset saved!');
    }

    function loadPreset() {
        const presetString = localStorage.getItem('artPreset');
        if (presetString) {
            const preset = JSON.parse(presetString);
            numShapesInput.value = preset.numShapes;
            shapeSizeInput.value = preset.shapeSize;
            shapeTypeSelect.value = preset.shapeType;
            colorPaletteSelect.value = preset.colorPalette;
            customColorInput.value = preset.customColor;
            backgroundColorInput.value = preset.backgroundColor;
            gradientCheckbox.checked = preset.gradient;
            patternCheckbox.checked = preset.pattern;
            draw(); // Redraw after loading
            alert('Preset loaded!');
        } else {
            alert('No preset saved.');
        }
    }

    generateButton.addEventListener('click', draw);
    saveButton.addEventListener('click', () => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'generative_art.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    savePresetButton.addEventListener('click', savePreset);
    loadPresetButton.addEventListener('click', loadPreset);

    draw(); // Initial draw
});