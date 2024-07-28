import { Editor } from "@tiptap/core";
import { roundArrow } from "tippy.js";
import { find } from "linkifyjs";
import { postRepository } from "@/repositories/post"; // Adjust the import path as needed

type EditHyperlinkModalOptions = {
  editor: Editor;
  validate?: (url: string) => boolean;
  link: HTMLAnchorElement;
  hyperlinkModal: HTMLElement;
  tippy: any;
};

export const editHyperlinkHandler = (
  locale: string,
  options: EditHyperlinkModalOptions
) => {
  const form = document.createElement("form");
  const inputsWrapper = document.createElement("div");
  const buttonsWrapper = document.createElement("div");
  const linkTextInput = document.createElement("input");
  const hrefInput = document.createElement("input");
  const searchResults = document.createElement("div");
  const applyExternalButton = document.createElement("button");
  const applyInternalButton = document.createElement("button");

  form.classList.add(
    "flex",
    "flex-col",
    "items-stretch",
    "w-full",
    "space-y-4"
  );
  inputsWrapper.classList.add("space-y-2");
  buttonsWrapper.classList.add("flex", "justify-end", "space-x-2", "mt-2");
  searchResults.classList.add("max-h-40", "overflow-y-auto", "space-y-1");

  const inputClasses =
    "border border-gray-200 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
  linkTextInput.className = inputClasses;
  hrefInput.className = inputClasses;

  linkTextInput.type = "text";
  linkTextInput.value = options.link?.innerText || "";
  linkTextInput.placeholder = "Enter link text";

  hrefInput.type = "text";
  hrefInput.value = options.link.href;
  hrefInput.placeholder = "Enter URL or search for internal post";

  applyExternalButton.type = "button";
  applyExternalButton.classList.add(
    "rounded-md",
    "px-3",
    "py-2",
    "text-white",
    "bg-blue-500",
    "hover:bg-blue-600",
    "transition-colors",
    "duration-100"
  );
  applyExternalButton.innerText = "Apply External";

  applyInternalButton.type = "button";
  applyInternalButton.classList.add(
    "rounded-md",
    "px-3",
    "py-2",
    "text-white",
    "bg-green-500",
    "hover:bg-green-600",
    "transition-colors",
    "duration-100"
  );
  applyInternalButton.innerText = "Apply Internal";

  inputsWrapper.append(linkTextInput, hrefInput, searchResults);
  buttonsWrapper.append(applyExternalButton, applyInternalButton);
  form.append(inputsWrapper, buttonsWrapper);

  options.hyperlinkModal.innerHTML = "";
  options.hyperlinkModal.appendChild(form);

  let selectedInternalLink: any = null;

  const setInputError = (input: HTMLInputElement) => {
    input.classList.add("border-red-500", "focus:ring-red-500");
  };

  const clearInputError = (input: HTMLInputElement) => {
    input.classList.remove("border-red-500", "focus:ring-red-500");
  };

  hrefInput.addEventListener("keydown", () => clearInputError(hrefInput));
  linkTextInput.addEventListener("keydown", () =>
    clearInputError(linkTextInput)
  );

  hrefInput.addEventListener(
    "input",
    debounce(async (event) => {
      const searchTerm = (event.target as HTMLInputElement).value;
      if (searchTerm.length > 2) {
        const posts = await searchInternalPosts(locale, searchTerm);
        displaySearchResults(posts, searchResults);
      } else {
        searchResults.innerHTML = "";
      }
    }, 300)
  );

  applyExternalButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleExternalLink();
  });

  applyInternalButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleInternalLink();
  });

  function handleExternalLink() {
    const newLinkText = linkTextInput.value;
    const newHref = hrefInput.value;

    if (!newHref || !newLinkText) {
      if (!newHref) setInputError(hrefInput);
      if (!newLinkText) setInputError(linkTextInput);
      return;
    }

    const sanitizeURL = find(newHref)
      .filter((link) => link.isLink)
      .filter((link) =>
        options.validate ? options.validate(link.value) : true
      )
      .at(0);

    if (!sanitizeURL?.href) {
      setInputError(hrefInput);
      return;
    }

    applyLinkChanges(sanitizeURL.href, newLinkText);
  }

  function handleInternalLink() {
    if (!selectedInternalLink) {
      setInputError(hrefInput);
      return;
    }

    const newLinkText = linkTextInput.value || selectedInternalLink.title;
    const internalUrl = `/posts/${selectedInternalLink.slug}`;

    applyLinkChanges(internalUrl, newLinkText);
  }

  function applyLinkChanges(newURL: string, newText: string) {
    options.editor.chain().focus().extendMarkRange("hyperlink").editHyperlink({
      newURL,
      newText,
    });
    options.tippy?.hide();
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
        selectedInternalLink = post;
        hrefInput.value = post.title;
        container.innerHTML = "";
      });
      container.appendChild(postElement);
    });
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

  // Show tooltip
  options.tippy.update(options.editor.view, {
    arrow: roundArrow,
  });

  setTimeout(() => linkTextInput.focus());
};
