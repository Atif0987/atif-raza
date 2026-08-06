document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".custom-product-popup-overlay");

  document.querySelectorAll(".custom-product-grid__item").forEach((item) => {

    const hotspot = item.querySelector(".custom-product-grid__hotspot");
    const popup = item.querySelector(".custom-product-popup");
    const close = popup.querySelector(".custom-product-popup__close");
    const addButton = popup.querySelector(".custom-product-popup__add");

    hotspot.addEventListener("click", () => {
      popup.classList.add("is-active");
      overlay.classList.add("is-active");
      document.body.style.overflow = "hidden";
    });

    function closePopup() {
      popup.classList.remove("is-active");
      overlay.classList.remove("is-active");
      document.body.style.overflow = "";
    }

    close.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);

    popup.querySelectorAll(".custom-product-popup__value").forEach((btn) => {

      btn.addEventListener("click", () => {

        const optionIndex = btn.dataset.optionIndex;

        popup
          .querySelectorAll(
            `.custom-product-popup__value[data-option-index="${optionIndex}"]`
          )
          .forEach((b) => b.classList.remove("is-active"));

        btn.classList.add("is-active");

        updateVariant();
      });

    });

    popup.querySelectorAll(".custom-product-popup__select").forEach((select) => {
      select.addEventListener("change", updateVariant);
    });

    function updateVariant() {

      const variants = JSON.parse(
        popup.querySelector(".custom-product-popup__variants").textContent
      );

      const selectedOptions = [];

      const optionCount = variants[0].options.length;

      for (let i = 0; i < optionCount; i++) {

        const activeButton = popup.querySelector(
          `.custom-product-popup__value.is-active[data-option-index="${i}"]`
        );

        const select = popup.querySelector(
          `.custom-product-popup__select[data-option-index="${i}"]`
        );

        if (activeButton) {
          selectedOptions.push(activeButton.dataset.value);
        } else if (select) {
          selectedOptions.push(select.value);
        } else {
          selectedOptions.push("");
        }
      }

      const matchedVariant = variants.find((variant) =>
        variant.options.every((option, index) => option === selectedOptions[index])
      );

      if (matchedVariant) {
        popup.querySelector(".custom-product-popup__variant-id").value =
          matchedVariant.id;
      }
    }

    /* ==========================
       AJAX Add To Cart
    ========================== */

    addButton.addEventListener("click", async () => {

      const variantId = popup.querySelector(".custom-product-popup__variant-id").value;

      if (!variantId) {
        alert("Please select all options.");
        return;
      }

      addButton.disabled = true;
      addButton.querySelector("span").textContent = "ADDING...";

      try {

        const response = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: Number(variantId),
            quantity: 1
          })
        });

        if (!response.ok) {
          throw new Error("Unable to add product.");
        }

        addButton.querySelector("span").textContent = "ADDED ✓";

        setTimeout(() => {
          closePopup();

          addButton.disabled = false;
          addButton.querySelector("span").textContent = "ADD TO CART";
        }, 800);

      } catch (error) {
        console.error(error);

        addButton.disabled = false;
        addButton.querySelector("span").textContent = "ADD TO CART";

        alert("Something went wrong.");
      }

    });

  });

});