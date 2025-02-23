document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-image");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");
    const trashBin = document.querySelector(".trash-bin");

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
    trashBin.addEventListener("click", removeAllElements);

    function handleDragStart(event) {
        event.dataTransfer.setData("text", event.target.src);
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
        const imageUrl = event.dataTransfer.getData("text");
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
        addDragFunctionality(newElement);
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
        let element = document.querySelector(".alien-part:last-child");
        if (element) {
            element.remove();
        }
    }

    function removeAllElements() {
        canvas.innerHTML = "";
    }

    function makeResizable(element) {
        let initialDistance = null;
        
        element.addEventListener("touchstart", function(event) {
            if (event.touches.length === 2) {
                initialDistance = getDistance(event.touches);
            }
        });

        element.addEventListener("touchmove", function(event) {
            if (event.touches.length === 2 && initialDistance) {
                let newDistance = getDistance(event.touches);
                let scale = newDistance / initialDistance;
                let size = Math.max(40, Math.min(150, element.clientWidth * scale));
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
            }
        });
    }

    function getDistance(touches) {
        let dx = touches[0].pageX - touches[1].pageX;
        let dy = touches[0].pageY - touches[1].pageY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});
