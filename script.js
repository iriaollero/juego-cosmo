document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-image");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");

    menuItems.forEach(item => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("touchstart", handleTouchStart, { passive: false });
    });

    canvas.addEventListener("dragover", handleDragOver);
    canvas.addEventListener("drop", handleDrop);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    trashZone.addEventListener("dragover", handleDragOver);
    trashZone.addEventListener("drop", handleTrashDrop);

    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.outerHTML);
    }

    function handleTouchStart(event) {
        event.preventDefault();
        let touch = event.touches[0];
        let clone = event.target.cloneNode(true);
        clone.classList.add("alien-part");
        clone.style.position = "absolute";
        clone.style.left = touch.pageX + "px";
        clone.style.top = touch.pageY + "px";
        clone.style.transform = "scale(1)";
        document.body.appendChild(clone);
        clone.dataset.dragging = "true";
        makeResizable(clone);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const element = document.createElement("div");
        element.innerHTML = data;
        let newElement = element.firstChild;
        newElement.classList.add("alien-part");
        newElement.style.position = "absolute";
        newElement.style.left = event.offsetX + "px";
        newElement.style.top = event.offsetY + "px";
        canvas.appendChild(newElement);
        addDragFunctionality(newElement);
        makeResizable(newElement);
    }

    function handleTouchMove(event) {
        event.preventDefault();
        let touch = event.touches[0];
        let element = document.querySelector("[data-dragging='true']");
        if (element) {
            element.style.left = touch.pageX + "px";
            element.style.top = touch.pageY + "px";
        }
    }

    function handleTouchEnd(event) {
        let element = document.querySelector("[data-dragging='true']");
        if (element) {
            element.removeAttribute("data-dragging");
            canvas.appendChild(element);
        }
    }

    function handleTrashDrop(event) {
        event.preventDefault();
        const draggedElement = document.querySelector(".alien-part:last-child");
        if (draggedElement) {
            draggedElement.remove();
        }
    }

    function addDragFunctionality(element) {
        element.setAttribute("draggable", true);
        element.addEventListener("dragstart", handleDragStart);
    }

    function makeResizable(element) {
        element.addEventListener("wheel", function(event) {
            event.preventDefault();
            let scale = parseFloat(element.style.transform.replace("scale(", "").replace(")", "")) || 1;
            scale += event.deltaY * -0.01;
            scale = Math.min(Math.max(0.5, scale), 2);
            element.style.transform = `scale(${scale})`;
        });
    }
});
