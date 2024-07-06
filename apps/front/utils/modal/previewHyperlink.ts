import { editHyperlinkHandler } from "./editHyperlink";

export function previewHyperlinkModal(locale: string, options: any) {
  const href = options.link.href;
  const hyperlinkModal = document.createElement("div");
  const removeButton = document.createElement("button");
  const copyButton = document.createElement("button");
  const editButton = document.createElement("button");

  const newBubble = document.createElement("div");
  newBubble.classList.add(
    "w-50",
    "flex",
    "items-center",
    "justify-end",
    "flex-row-reverse"
  );

  const hrefTitle = document.createElement("a");
  hrefTitle.setAttribute("target", "_blank");
  hrefTitle.setAttribute("rel", "noreferrer");
  hrefTitle.setAttribute("href", href);
  hrefTitle.innerText = href;
  hrefTitle.classList.add(
    "text-sm",
    "mr-1.5",
    "whitespace-nowrap",
    "overflow-hidden",
    "overflow-ellipsis"
  );

  newBubble.append(hrefTitle);
  console.log("href url", href);
  //fetch metadata from server
  $fetch("/api/metadata", {
    method: "POST",
    body: { url: href },
  })
    .then((data: any) => {
      // Create a new bubble with the title
      hrefTitle.setAttribute("href", href);

      hrefTitle.innerText = data.title || data["og:title"] || href;
      newBubble.replaceChildren(hrefTitle);
      console.log(data);
      // Create an image element if image exists in metadata
      if (data.icon || data.image || data["og:image"]) {
        const img = document.createElement("img");
        img.src = data.icon || data.image || data["og:image"];
        img.classList.add(
          "w-6",
          "h-6",
          "aspect-square",
          "rounded-md",
          "mx-1.5"
        );
        img.alt = data.title || data["og:title"] || "hyperlink image";
        newBubble.appendChild(img);
      }
    })
    .catch((error) => {
      console.error("Error fetching metadata:", error);
    });

  hyperlinkModal.classList.add(
    "bg-white",
    "rounded-lg",
    "border",
    "border-gray-200",
    "flex",
    "items-center",
    "justify-between",
    "p-1.5",
    "shadow-md",
    "-mt-1.5"
  );

  removeButton.classList.add(
    "w-7.5",
    "h-7.5",
    "text-gray-300",
    "rounded-full",
    "mx-1",
    "flex",
    "items-center",
    "justify-center",
    "transition-colors",
    "duration-100",
    "ease-in-out",
    "hover:text-red-300"
  );
  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class=" w-6 h-6 fill-current" viewBox="0 0 16 16"><path  fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.286a1.5 1.5 0 0 0 1.492-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25m2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75zM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6m3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711" clip-rule="evenodd"/></svg>`;

  copyButton.classList.add(
    "w-7.5",
    "h-7.5",
    "rounded-full",
    "mx-1",
    "flex",
    "items-center",
    "justify-center",
    "transition-colors",
    "text-gray-300",
    "duration-100",
    "ease-in-out",
    "hover:text-primary-200"
  );
  copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class=" w-6 h-6 fill-current"><path  d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z"/></svg>`;

  editButton.classList.add(
    "w-7.5",
    "h-7.5",
    "rounded-full",
    "mx-1",
    "flex",
    "items-center",
    "justify-center",
    "text-gray-300",
    "transition-colors",
    "duration-100",
    "ease-in-out",
    "hover:text-primary-200"
  );
  //add edit svg
  editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class=" w-6 h-6 fill-current" viewBox="0 0 24 24"><path fill="currentColor" d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157l3.712 3.712l1.157-1.157a2.625 2.625 0 0 0 0-3.712Zm-2.218 5.93l-3.712-3.712l-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"/></svg>`;

  removeButton.addEventListener("click", () => {
    options.tippy?.hide();
    return options.editor.chain().focus().unsetHyperlink().run();
  });

  editButton.addEventListener("click", () =>
    editHyperlinkHandler(locale, { ...options, hyperlinkModal })
  );

  copyButton.addEventListener("click", () => {
    options.tippy?.hide();
    navigator.clipboard.writeText(href);
  });

  hyperlinkModal.append(newBubble, copyButton, editButton, removeButton);

  return hyperlinkModal;
}
