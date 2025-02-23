document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const canvas = document.getElementById("canvas");
    const clearAllBtn = document.getElementById("clear-all");
    let zIndexCounter = 1;

    menuItems.forEach(item => {
        item.addEventListener("touchstart", (e) => {
            e.preventDefault();
            createDraggableElement(e.target);
        });
    });

    function createDraggableElement(element) {
        const newElement = document.createElement("div");
        newElement.classList.add("alien-part");
        newElement.style.position = "absolute";
        newElement.style.left = "50%";
        newElement.style.top = "50%";
        newElement.style.width = "80px";
        newElement.style.height = "80px";
        newElement.style.transformOrigin = "center center";
        newElement.style.zIndex = zIndexCounter++;
        newElement.innerHTML = `<img src="${element.src}" style="width: 100%; height: 100%;">`;
        canvas.appendChild(newElement);
        makeElementDraggable(newElement);
    }

    function makeElementDraggable(element) {
        let startX, startY, initialX, initialY;

        element.addEventListener("touchstart", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
            element.style.zIndex = zIndexCounter++;
        });

        element.addEventListener("touchmove", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            let moveX = touch.clientX - startX;
            let moveY = touch.clientY - startY;
            element.style.left = initialX + moveX + "px";
            element.style.top = initialY + moveY + "px";
        });
    }

    clearAllBtn.addEventListener("touchstart", () => {
        canvas.innerHTML = "";
    });
});
