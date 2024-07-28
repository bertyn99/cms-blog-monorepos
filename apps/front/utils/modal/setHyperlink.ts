import { find } from "linkifyjs";
import { postRepository } from "@/repositories/post"; // Adjust the import path as needed

let tooltip: any = undefined;

export async function setHyperlinkModal(locale: string = "en", options: any) {
  // Create the tooltip instance
  if (!tooltip) tooltip = new options.Tooltip(options);

  // Initialize the tooltip
  let { tippyModal } = tooltip!.init();

  const hyperlinkModal = document.createElement("div");
  const form = document.createElement("form");
  const inputsWrapper = document.createElement("div");
  const buttonsWrapper = document.createElement("div");

  hyperlinkModal.classList.add(
    "bg-white",
    "rounded-lg",
    "border",
    "border-gray-200",
    "flex",
    "flex-col",
    "items-center",
    "justify-between",
    "p-4",
    "shadow-md",
    "-mt-1.5",
    "w-80"
  );

  form.classList.add(
    "flex",
    "flex-col",
    "items-stretch",
    "w-full",
    "space-y-4"
  );
  inputsWrapper.classList.add("space-y-2");
  buttonsWrapper.classList.add("flex", "justify-end", "space-x-2", "mt-2");

  const urlInput = createInput("Enter URL or search for internal post");
  const searchResults = document.createElement("div");
  searchResults.classList.add("max-h-40", "overflow-y-auto", "space-y-1");

  const externalLinkButton = createButton(
    "Add External Link",
    "bg-blue-500",
    "hover:bg-blue-600"
  );
  const internalLinkButton = createButton(
    "Add Internal Link",
    "bg-green-500",
    "hover:bg-green-600"
  );

  inputsWrapper.append(urlInput, searchResults);
  buttonsWrapper.append(externalLinkButton, internalLinkButton);
  form.append(inputsWrapper, buttonsWrapper);
  hyperlinkModal.append(form);

  tippyModal.innerHTML = "";
  tippyModal.append(hyperlinkModal);
  tooltip?.update(options.editor.view, { arrow: options.roundArrow });

  setTimeout(() => urlInput.focus(), 100);

  let selectedInternalLink: any = null;

  urlInput.addEventListener(
    "input",
    debounce(async (event: any) => {
      const searchTerm = (event.target as HTMLInputElement).value;
      if (searchTerm.length > 2) {
        const posts = await searchInternalPosts(locale, searchTerm);
        displaySearchResults(posts, searchResults);
      } else {
        searchResults.innerHTML = "";
      }
    }, 300)
  );

  externalLinkButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleExternalLink(urlInput.value, options);
  });

  internalLinkButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (selectedInternalLink) {
      handleInternalLink(selectedInternalLink, options);
    }
  });

  function createInput(placeholder: string) {
    const input = document.createElement("input");
    input.classList.add(
      "border",
      "border-gray-200",
      "rounded-md",
      "py-2",
      "px-3",
      "w-full",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500"
    );
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", placeholder);
    return input;
  }

  function createButton(text: string, bgColor: string, hoverColor: string) {
    const button = document.createElement("button");
    button.classList.add(
      "rounded-md",
      "px-3",
      "py-2",
      "text-white",
      "transition-colors",
      "duration-100",
      bgColor,
      hoverColor
    );
    button.innerText = text;
    return button;
  }

  async function searchInternalPosts(locale: string, searchTerm: string) {
    const { $api } = useNuxtApp();
    const repo = postRepository($api);
    try {
      const result = await repo.getAllPostBylocal({
        params: { locale, title: searchTerm },
      });
      return result.data;
    } catch (error) {
      console.error("Error searching posts:", error);
      return [];
    }
  }

  function displaySearchResults(posts: any[], container: HTMLElement) {
    container.innerHTML = "";
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add(
        "p-2",
        "hover:bg-gray-100",
        "cursor-pointer",
        "rounded"
      );
      postElement.innerText = post.title;
      postElement.addEventListener("click", () => {
        console.log("Selected post:", post);
        selectedInternalLink = post;
        urlInput.value = post.slug;
        container.innerHTML = "";
      });
      container.appendChild(postElement);
    });
  }

  function handleExternalLink(url: string, options: any) {
    if (!url) return;

    const sanitizeURL = find(url)
      .filter((link) => link.isLink)
      .filter((link) =>
        options.validate ? options.validate(link.value) : true
      )
      .at(0);

    if (!sanitizeURL?.href) return;

    tooltip?.hide();

    return options.editor
      .chain()
      .setMark(options.extentionName, { href: sanitizeURL.href })
      .setMeta("preventautohyperlink", true)
      .run();
  }

  function handleInternalLink(post: any, options: any) {
    if (!post) return;

    const internalUrl = `/posts${post.slug}`;
    tooltip?.hide();

    return options.editor
      .chain()
      .setMark(options.extentionName, { href: internalUrl })
      .setMeta("preventautohyperlink", true)
      .run();
  }

  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
