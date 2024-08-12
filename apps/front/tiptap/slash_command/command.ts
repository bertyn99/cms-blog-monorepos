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
  title: string;
  description: string;
  icon: VNode | null;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}
export const createSuggestionItems = (items: SuggestionItem[]) => items;

const items = createSuggestionItems([
  {
    title: "Heading 1",
    searchTerms: ["h1", "heading 1"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
    description: "",
    icon: null,
  },
  {
    title: "Bullet List",
    searchTerms: ["bullet list"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    description: "",
    icon: null,
  },
  // Add more items as needed
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

      return component?.ref?.value.onKeyDown(props);
    },
    onExit() {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};
export const SlashCommandConfigured = SlashCommands.configure({
  suggestion: {
    items: () => items,
    render: renderItems,
  },
});
