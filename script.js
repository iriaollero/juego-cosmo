document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-image");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");

    menuItems.forEach(item => {
        item.setAttribute("draggable", true);
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
        event.dataTransfer.setData("text/plain", event.target.src);
    }

    function handleTouchStart(event) {
        event.preventDefault();
        let touch = event.touches[0];
        let clone = event.target.cloneNode(true);
        clone.classList.add("alien-part");
        clone.style.position = "absolute";
        clone.style.left = touch.pageX + "px";
        clone.style.top = touch.pageY + "px";
        clone.style.width = "80px";
        clone.style.height = "80px";
        document.body.appendChild(clone);
        clone.dataset.dragging = "true";
        makeResizable(clone);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const imageUrl = event.dataTransfer.getData("text/plain");
        let newElement = document.createElement("img");
        newElement.src = imageUrl;
        newElement.classList.add("alien-part");
        newElement.style.position = "absolute";
        newElement.style.left = event.offsetX + "px";
        newElement.style.top = event.offsetY + "px";
        newElement.style.width = "80px";
        newElement.style.height = "80px";
        canvas.appendChild(newElement);
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

    function makeResizable(element) {
        element.addEventListener("wheel", function(event) {
            event.preventDefault();
            let scale = parseFloat(element.style.width.replace("px", "")) || 80;
            scale += event.deltaY * -1;
            scale = Math.min(Math.max(40, scale), 150);
            element.style.width = `${scale}px`;
            element.style.height = `${scale}px`;
        });
    }
});
