document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-image");
    const canvas = document.getElementById("canvas");
    const trashBin = document.getElementById("trash-bin");

    menuItems.forEach(item => {
        item.addEventListener("touchstart", handleTouchStart, { passive: false });
    });

    function handleTouchStart(event) {
        event.preventDefault();
        let touch = event.touches[0];
        let clone = event.target.cloneNode(true);
        clone.classList.add("alien-part");
        clone.style.position = "absolute";
        clone.style.width = "80px";
        clone.style.height = "80px";
        document.body.appendChild(clone);

        function moveElement(e) {
            if (e.touches.length === 1) {
                let moveTouch = e.touches[0];
                clone.style.left = moveTouch.pageX - 40 + "px";
                clone.style.top = moveTouch.pageY - 40 + "px";
            }
        }

        function endMove(e) {
            let dropTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if (dropTarget && (dropTarget.id === "canvas" || dropTarget.closest("#canvas"))) {
                canvas.appendChild(clone);
                clone.style.position = "absolute";
                makeResizable(clone);
            } else {
                clone.remove();
            }
            document.removeEventListener("touchmove", moveElement);
            document.removeEventListener("touchend", endMove);
        }

        document.addEventListener("touchmove", moveElement, { passive: false });
        document.addEventListener("touchend", endMove);
    }

    trashBin.addEventListener("click", removeAllElements);

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
