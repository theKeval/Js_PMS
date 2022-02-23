function showModal(titleHtml, contentHtml, buttons) {
  
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
          <div class="modal--inner">
              <div class="modal--top">
                  <div class="modal--title">${titleHtml}</div>
                  <button class="modal--close" title="Close">
                    <i class="fa fa-close fa-lg"></i>
                  </button>
              </div>
              <div class="modal--content">${contentHtml}</div>
              <div class="modal--bottom"></div>
          </div>
      `;
    // console.log(modal.innerHTML)
    for (const button of buttons) {
      const element = document.createElement("button");
  
      element.setAttribute("type", "button");
      element.classList.add("modal--button");
      if(button.type == 'close'){
        element.classList.add('close')
      }
      element.textContent = button.label;
      element.addEventListener("click", () => {
        if (button.triggerClose) {
          document.body.removeChild(modal, );
        }
        button.onClick(modal);
      });
  
      modal.querySelector(".modal--bottom").appendChild(element);
    }
  
    modal.querySelector(".modal--close").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  
    document.body.appendChild(modal);
  }

// Form Input methods 
function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function setInputSuccess(inputElement) {
  inputElement.classList.add("form__input--success");
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}
