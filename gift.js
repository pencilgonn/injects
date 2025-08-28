(async () => {
  const state = {
    imageUrl: null,
  };

  const Utils = {
    createImageUploader: () =>
      new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/gif";
        input.onchange = () => {
          const fr = new FileReader();
          fr.onload = () => resolve(fr.result);
          fr.readAsDataURL(input.files[0]);
        };
        input.click();
      }),
  };

  async function createUI() {
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const style = document.createElement("style");
    style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        #gift-window-container {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 300px;
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
          z-index: 9998;
          font-family: 'Segoe UI', Roboto, sans-serif;
          animation: slideIn 0.4s ease-out;
          overflow: hidden;
          background: #BBDCE5;
        }
        #gift-window-container.include-gift {
          background: transparent;
          box-shadow: none;
        }
        #gift-window-container.include-gift:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
          background: #BBDCE5;
        }
        .gift-header {
          padding: 12px 15px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: move;
          user-select: none;
          color: #640D5F;
          border-bottom: 1px solid #640D5F;
        }
        #gift-window-container.include-gift .gift-header {
          opacity: 0;
        }
        #gift-window-container.include-gift:hover .gift-header {
          opacity: 1;
        }
        .gift-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gift-header-controls {
          display: flex;
          gap: 10px;
        }
        .gift-content {
          padding: 16px;
        }
        #uploadBtn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: none;
          color: #640D5F;
          cursor: pointer;
        }
        .gift-wrap-image {
          display: flex;
        }
        #gift-window-container.include-gift #uploadBtn {
          opacity: 0;
        }
        #gift-window-container.include-gift:hover #uploadBtn {
          opacity: 1;
        }
      `;
    document.head.appendChild(style);
    const container = document.createElement("div");
    container.id = "gift-window-container";
    container.innerHTML = `
        <div class="gift-header">
          <div class="gift-header-title">
            <i class="fas fa-image"></i>
            <span>GIFT</span>
          </div>
        </div>
        <div class="gift-content">
          <button id="uploadBtn" class="gift-btn gift-btn-upload">
          <i class="fas fa-upload"></i>
          <span>Tải Gift lên!</span>
          </button>
        </div>
    `;

    document.body.appendChild(container);

    const header = container.querySelector(".gift-header");
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.closest(".gift-header-btn")) return;

      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      container.style.top = container.offsetTop - pos2 + "px";
      container.style.left = container.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }

    const uploadBtn = container.querySelector("#uploadBtn");

    uploadBtn.addEventListener("click", async () => {
      const imageSrc = await Utils.createImageUploader();
      state.imageUrl = imageSrc;

      const content = container.querySelector(".gift-content");
      const imageExisted = container.querySelector(".gift-wrap-image");

      if (imageExisted) {
        content.removeChild(imageExisted);
      }

      const image = document.createElement("img");
      image.src = imageSrc;
      image.style.objectFit = "contain";
      image.style.height = "100%";
      image.style.width = "100%";

      const div = document.createElement("div");
      div.className = "gift-wrap-image";
      div.appendChild(image);
      content.appendChild(div);
      container.classList.add("include-gift");
    });
  }

  await createUI();
})();
