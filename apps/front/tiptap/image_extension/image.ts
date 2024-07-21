import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ImageComponent from "./Image.vue";
export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

const blobToBase64 = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: {
        src?: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}
export const Image = Node.create<ImageOptions>({
  name: "image",

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline: false,
  group: "block",
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageComponent);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageDrop"),
        props: {
          handleDOMEvents: {
            drop: async (view, event) => {
              const files = event?.dataTransfer?.files;
              const file = files?.item(0);

              if (file && file.type.includes("image")) {
                const dataUrl = await blobToBase64(file);
                return this.editor.chain().setImage({ src: dataUrl }).run();
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});
