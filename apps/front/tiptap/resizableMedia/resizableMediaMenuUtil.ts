/* @unocss-include */
/* import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconFloatLeft,
  IconFloatRight,
  IconDelete,
} from "../../assets"; */

interface ResizableMediaAction {
  tooltip: string;
  icon: string;

  action?: (updateAttributes: (o: Record<string, any>) => any) => void;
  isActive?: (attrs: Record<string, any>) => boolean;
  delete?: (d: () => void) => void;
}

export const resizableMediaActions: ResizableMediaAction[] = [
  {
    tooltip: "Align left",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "left",
        dataFloat: null,
      }),
    icon: "i-svgeditor-align-left",
    isActive: (attrs) => attrs.dataAlign === "left",
  },
  {
    tooltip: "Align center",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "center",
        dataFloat: null,
      }),
    icon: "i-svgeditor-align-center",
    isActive: (attrs) => attrs.dataAlign === "center",
  },
  {
    tooltip: "Align right",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: "right",
        dataFloat: null,
      }),
    icon: "i-svgeditor-align-right",
    isActive: (attrs) => attrs.dataAlign === "right",
  },
  {
    tooltip: "Float left",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: null,
        dataFloat: "left",
      }),
    icon: "i-svgeditor-float-left",
    isActive: (attrs) => attrs.dataFloat === "left",
  },
  {
    tooltip: "Float right",
    action: (updateAttributes) =>
      updateAttributes({
        dataAlign: null,
        dataFloat: "right",
      }),
    icon: "i-svgeditor-float-right",
    isActive: (attrs) => attrs.dataFloat === "right",
  },
  {
    tooltip: "Delete",
    icon: "i-svgeditor-delete",
    delete: (deleteNode) => deleteNode(),
  },
];
