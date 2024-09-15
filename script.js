const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const colResize = document.querySelector(".resize");
const main = document.querySelector("main");

let isPaintinng = false;
let isResinzing = false;

const MIN_CANVAS_SIZE = 4;

const createElemente = (tag, className = "") => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

const setPixelColor = (pixel) => {
    pixel.style.backgroundColor = inputColor.value;
};

createPixel = () => {
    const pixel = createElemente("div", "pixel");

    pixel.addEventListener("mousedown", () => {
        setPixelColor(pixel);
    });

    pixel.addEventListener("mouseover", () => {
        if (isPaintinng) {
            setPixelColor(pixel);
        }
    });

    return pixel;
};

const loadCanvas = () => {
    const length = inputSize.value;
    canvas.innerHTML = "";

    for (let i = 0; i < length; i += 1) {
        const row = createElemente("div", "row");

        for (let j = 0; j < length; j += 1) {
            row.append(createPixel());
        }

        canvas.append(row);
    }
};

const updateCanvasSize = () => {
    if (inputSize.value >= MIN_CANVAS_SIZE) {
        loadCanvas();
    }
};

const resizeCanvas = (cursorPositionX) => {
    if (!isResinzing) return;

    const canvasOffSet = canvas.getBoundingClientRect().left;
    const width = `${cursorPositionX - canvasOffSet - 20}px`;

    canvas.style.maxWidth = width;
    colResize.style.height = width;
};

const saveCanvas = () => {
    html2canvas(canvas, {
        onrendered: (image) => {
            const img = image.toDataURL("image/png");
            const link = createElemente("a");
            link.href = img;
            link.download = "pixelArt.png";

            link.click();
        },
    });
};

const changeColor = () => {
    const button = createElemente("button", "button-color");
    const currentColor = inputColor.value;

    button.style.backgroundColor = currentColor;
    button.setAttribute("data-color", currentColor);
    button.addEventListener("click", () => (inputColor.value = currentColor));

    const savedColors = Array.from(usedColors.children);

    const check = (btn) => btn.getAttribute("data-color") != currentColor;

    if (savedColors.every(check)) {
        usedColors.append(button);
    }
};

canvas.addEventListener("mousedown", () => {
    isPaintinng = true;
});

canvas.addEventListener("mouseup", () => {
    isPaintinng = false;
});

buttonSave.addEventListener("click", saveCanvas);

colResize.addEventListener("mousedown", () => (isResinzing = true));

main.addEventListener("mouseup", () => (isResinzing = false));
main.addEventListener("mousemove", ({ clientX }) => resizeCanvas(clientX));

inputSize.addEventListener("change", updateCanvasSize);
inputColor.addEventListener("change", changeColor);

loadCanvas();
