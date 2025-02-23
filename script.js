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
        clone.style.left = touch.pageX + "px";
        clone.style.top = touch.pageY + "px";
        document.body.appendChild(clone);

        function moveElement(e) {
            if (e.touches.length === 1) {
                let moveTouch = e.touches[0];
                clone.style.left = moveTouch.pageX + "px";
                clone.style.top = moveTouch.pageY + "px";
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
            clone.removeEventListener("touchmove", moveElement);
            clone.removeEventListener("touchend", endMove);
        }

        clone.addEventListener("touchmove", moveElement);
        clone.addEventListener("touchend", endMove);
    }

    trashBin.addEventListener("click
