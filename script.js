document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");
    const clearAllBtn = document.getElementById("clear-all");

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
        newElement.innerHTML = `<img src="${element.src}" style="width: 100%; height: 100%;">`;
        canvas.appendChild(newElement);
        makeElementDraggable(newElement);
    }

    function makeElementDraggable(element) {
        let startX, startY, initialX, initialY;
        let scale = 1;

        element.addEventListener("touchstart", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
        });

        element.addEventListener("touchmove", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            let moveX = touch.clientX - startX;
            let moveY = touch.clientY - startY;
            element.style.left = initialX + moveX + "px";
            element.style.top = initialY + moveY + "px";
        });

        element.addEventListener("gesturechange", (e) => {
            e.preventDefault();
            scale *= e.scale;
            element.style.transform = `scale(${scale})`;
        });
    }

    trashZone.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("alien-part")) {
            e.target.remove();
        }
    });

    clearAllBtn.addEventListener("click", () => {
        canvas.innerHTML = "";
    });
});
