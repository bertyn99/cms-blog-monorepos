import { Editor } from "@tiptap/core";
import { find } from "linkifyjs";

let tooltip:
  | {
      init: () => { tippyModal: any };
      update: (arg0: any, arg1: { arrow: any }) => void;
      hide: () => void;
    }
  | undefined = undefined;

export function setHyperlinkModal(options: any) {
  // Create the tooltip instance
  if (!tooltip) tooltip = new options.Tooltip(options);

  // Initialize the tooltip
  let { tippyModal } = tooltip!.init();

  const hyperlinkModal = document.createElement("div");
  const buttonsWrapper = document.createElement("div");
  const inputsWrapper = document.createElement("div");

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

  buttonsWrapper.classList.add("ml-4");
  inputsWrapper.classList.add("w-full");

  // create a form that contain url input and a button for submit
  const form = document.createElement("form");
  form.classList.add("flex", "items-end", "w-full");

  const input = document.createElement("input");
  input.classList.add(
    "border",
    "border-gray-200",
    "rounded-md",
    "py-1",
    "px-2",
    "mb-0.5",
    "w-full"
  );
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "https://example.com");

  const button = document.createElement("button");
  button.classList.add(
    "rounded-md",
    "px-3.5",
    "py-1",
    "w-17.5",
    "mb-0.5",
    "text-blue-600",
    "hover:bg-blue-50",
    "hover:text-blue-800",
    "transition-colors",
    "duration-100"
  );
  button.setAttribute("type", "submit");
  button.innerText = "Submit";

  inputsWrapper.append(input);
  buttonsWrapper.append(button);
  form.append(inputsWrapper, buttonsWrapper);

  hyperlinkModal.append(form);

  tippyModal.innerHTML = "";
  tippyModal.append(hyperlinkModal);
  tooltip.update(options.editor.view, {
    arrow: options.roundArrow,
  });

  // make sure to focus the input
  setTimeout(() => input.focus(), 100);

  // event listener for submit button
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = input.value;

    if (!url) return;

    const sanitizeURL = find(url)
      .filter((link) => link.isLink)
      .filter((link) => {
        if (options.validate) {
          return options.validate(link.value);
        }
        return true;
      })
      .at(0);

    if (!sanitizeURL?.href) return;

    tooltip?.hide();

    return options.editor
      .chain()
      .setMark(options.extentionName, { href: sanitizeURL.href })
      .setMeta("preventautohyperlink", true)
      .run();
  });
}
