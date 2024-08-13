import { Node, Editor, type Range } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { VueRenderer, Extension } from "@tiptap/vue-3";
import CommandsList from "./CommandsList.vue";
import type { VNode } from "vue";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, {
  type GetReferenceClientRect,
  type Instance,
  type Props,
} from "tippy.js";

export interface SuggestionItem {
  id?: string;
  label: string;
  description: string;
  icon: String | null;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}

export interface GroupSuggestions {
  key: string;
  commands: SuggestionItem[];
}
export const createSuggestionItems = (items: SuggestionItem[]) => items;

export const suggestionItems = createSuggestionItems([
  {
    id: "text",
    label: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: "i-lucide-text",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    id: "todo",
    label: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: "i-lucide-list-todo",
    command: ({ editor, range }) => {
      console.log("todo");
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    id: "heading",

    label: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: "i-lucide-heading",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    id: "heading2",
    label: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: "i-lucide-heading-2",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    id: "heading3",
    label: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: "i-lucide-heading-3",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    id: "list",
    label: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: "i-lucide-list",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    id: "orderedlist",
    label: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered", "number"],
    icon: "i-lucide-list-ordered",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    id: "quote",
    label: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: "i-lucide-quote",
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    id: "code",
    label: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: "i-lucide-code",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    id: "image",
    label: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: "i-lucide-image",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          /*        uploadFn(file, editor.view, pos); */
        }
      };
      input.click();
    },
  },
  {
    id: "youtube",
    label: "Youtube",
    description: "Embed a Youtube video.",
    searchTerms: ["video", "youtube", "embed"],
    icon: "i-lucide-youtube",
    command: ({ editor, range }) => {
      const videoLink = prompt("Please enter Youtube Video Link");
      const ytregex = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
      );

      if (ytregex.test(videoLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({
            src: videoLink,
          })
          .run();
      } else {
        if (videoLink !== null) {
          alert("Please enter a correct Youtube Video Link");
        }
      }
    },
  },
  {
    id: "twitter",
    label: "Twitter",
    description: "Embed a Tweet.",
    searchTerms: ["twitter", "embed"],
    icon: "i-lucide-twitter",
    command: ({ editor, range }) => {
      const tweetLink = prompt("Please enter Twitter Link");
      const tweetRegex = new RegExp(
        /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/
      );

      if (tweetRegex.test(tweetLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setTweet({
            src: tweetLink,
          })
          .run();
      } else {
        if (tweetLink !== null) {
          alert("Please enter a correct Twitter Link");
        }
      }
    },
  },
]);

export const handleCommandNavigation = (event: KeyboardEvent) => {
  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
    const slashCommand = document.querySelector("#slash-command");
    if (slashCommand) {
      return true;
    }
  }
};

/**
 * The plugin key for the mention plugin.
 * @default 'slashcommand'
 */
/* export const SlashCommandluginKey = new PluginKey("slashcommand");
 */
const SlashCommands = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      } as SuggestionOptions,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
const renderItems = (elementRef?: Ref<HTMLElement | null>) => {
  let component: VueRenderer | null = null;
  let popup: Instance<Props> | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new VueRenderer(CommandsList, {
        props,
        editor: props.editor,
      });
      const { selection } = props.editor.state;

      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      if (blockType === "codeBlock") {
        return false;
      }
      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => (elementRef ? elementRef.value : document.body),
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate(props: { editor: Editor; clientRect: GetReferenceClientRect }) {
      component?.updateProps(props);

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown(props: { event: KeyboardEvent }) {
      if (props.event.key === "Escape") {
        popup?.[0]?.hide();
        return true;
      }

      return component?.ref?.onKeyDown(props);
    },
    onExit() {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};
export const SlashCommandConfigured = SlashCommands.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
