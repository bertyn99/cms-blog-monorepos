export class SearchUI {
  private editor: any;
  private container: HTMLElement;

  constructor(editor: any) {
    this.editor = editor;
    this.container = document.createElement("div");
    this.container.className =
      "tiptap-search-and-replace absolute top-4 right-4 bg-white shadow-lg rounded-lg p-2 z-50";
    this.render();
  }

  private render() {
    this.container.innerHTML = `
        <div class="flex items-center space-x-2">
          <input type="text" placeholder="Search..."  value="" class="flex-grow px-1.5 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <button class="search px-1.5 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"  class="w-5 h-5"><path fill="currentColor" fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06zM10.5 7a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div class="flex items-center space-x-2 mt-2">
          <button class="next px-1.5 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="w-6 h-6"><path fill="currentColor" d="m7 14l5-5l5 5z"/></svg>
          </button>
          <button class="prev px-1.5 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="w-6 h-6"><path fill="currentColor" d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"/></svg>
          </button>
          <button class="close ml-auto px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" class="w-6 h-6"><path fill="currentColor" d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94z"/></svg>
          </button>
        </div>
      `;

    const inputSearch = this.container.querySelector(
      "input"
    ) as HTMLInputElement;
    const searchButton = this.container.querySelector(
      ".search"
    ) as HTMLButtonElement;
    const nextButton = this.container.querySelector(
      ".next"
    ) as HTMLButtonElement;
    const prevButton = this.container.querySelector(
      ".prev"
    ) as HTMLButtonElement;
    const closeButton = this.container.querySelector(
      ".close"
    ) as HTMLButtonElement;

    searchButton.addEventListener("click", () => {
      this.editor.commands.setSearchTermAndSearch(input.value);
    });

    nextButton.addEventListener("click", () => {
      this.editor.commands.nextSearchResult();
    });

    prevButton.addEventListener("click", () => {
      this.editor.commands.previousSearchResult();
    });

    closeButton.addEventListener("click", () => {
      this.editor.commands.toggleSearchUI();
    });

    // Add event listener for 'Enter' key on input
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.editor.commands.setSearchTermAndSearch(input.value);
      }
    });
  }

  public getElement() {
    return this.container;
  }
}
