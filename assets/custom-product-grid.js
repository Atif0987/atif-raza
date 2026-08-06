document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".custom-product-popup-overlay");

  document.querySelectorAll(".custom-product-grid__item").forEach((item) => {

    const hotspot = item.querySelector(".custom-product-grid__hotspot");
    const popup = item.querySelector(".custom-product-popup");
    const close = popup.querySelector(".custom-product-popup__close");
    const addButton = popup.querySelector(".custom-product-popup__add");
    const addButtonLabel = addButton.querySelector("span");
    const statusMessage = popup.querySelector(".custom-product-popup__status");

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

    function setStatus(message, isError = false) {
      if (!statusMessage) return;

      statusMessage.textContent = message;
      statusMessage.classList.toggle("is-visible", Boolean(message));
      statusMessage.classList.toggle("is-error", isError);
    }

    /* ==========================
       AJAX Add To Cart
    ========================== */

    const WINTER_JACKET_VARIANT_ID = 42828416221269;
    addButton.addEventListener("click", async () => {

    const variantId = Number(
        popup.querySelector(".custom-product-popup__variant-id").value
    );

    if (!variantId) {
        alert("Please select all options.");
        return;
    }

    const variants = JSON.parse(
        popup.querySelector(".custom-product-popup__variants").textContent
    );

    const selectedVariant = variants.find(
        (variant) => variant.id === variantId
    );

    let shouldAddJacket = false;

    if (selectedVariant) {

        const size = selectedVariant.option1;
        const color = selectedVariant.option2;

        if (size === "M" && color === "Black") {
        shouldAddJacket = true;
        }
    }

    const items = [
        {
        id: variantId,
        quantity: 1
        }
    ];

    if (shouldAddJacket) {
        items.push({
        id: WINTER_JACKET_VARIANT_ID,
        quantity: 1
        });
    }

    addButton.disabled = true;
    addButtonLabel.textContent = "ADDING...";
    setStatus("Adding to your cart...");

    try {

        const response = await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items
        })
        });

        if (!response.ok) {
        throw new Error("Unable to add product.");
        }

        addButtonLabel.textContent = "ADDED TO CART";
        setStatus("Added to your cart.");

        setTimeout(() => {

        closePopup();

        addButton.disabled = false;
        addButtonLabel.textContent = "ADD TO CART";
        setStatus("");
        window.location.href = "/cart";

        }, 900);

    } catch (error) {

        console.error(error);

        addButton.disabled = false;
        addButtonLabel.textContent = "ADD TO CART";
        setStatus("Unable to add this item. Please try again.", true);

    }

    });

  });

});