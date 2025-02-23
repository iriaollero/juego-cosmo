document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-image");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");
    const trashBin = document.getElementById("trash-bin");

    menuItems.forEach(item => {
        item.addEventListener("touchstart", handleTouchStart, { passive: false });
    });

    canvas.addEventListener("dragover", handleDragOver);
    canvas.addEventListener("drop", handleDrop);
    trashZone.addEventListener("dragover", handleDragOver);
    trashZone.addEventListener("drop", handleTrashDrop);
    trashBin.addEventListener("click", removeAllElements);

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

        function moveElement(e) {
            if (e.touches.length === 1) {
                let moveTouch = e.touches[0];
                clone.style.left = moveTouch.pageX + "px";
                clone.style.top = moveTouch.pageY + "px";
            }
        }

        function endMove(e) {
            let dropTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if (dropTarget && dropTarget.id === "canvas") {
                canvas.appendChild(clone);
                makeResizable(clone);
            } else {
                clone.remove();
            }
            clone.removeEventListener("touchmove", moveElement);
            clone.removeEventListener("touchend", endMove);
        }

        clone.addEventListener("touchmove", moveElement);
        clone.addEventListener("touchend", endMove);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        let element = document.querySelector("[data-dragging='true']");
        if (element) {
            element.removeAttribute("data-dragging");
            canvas.appendChild(element);
        }
    }

    function handleTrashDrop(event) {
        event.preventDefault();
        let element = document.elementFromPoint(event.clientX, event.clientY);
        if (element && element.classList.contains("alien-part")) {
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
