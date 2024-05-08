import {
  ForwardRefRenderFunction,
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  ControlledTreeEnvironment,
  DraggingPosition,
  Tree,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";
import { useGroupStore } from "./store/useGroupStore";
import { useTreeRef } from "./provider/TreeRefProvider";
import { v4 as uuid } from "uuid";
import { findParentGroup } from "./util/findParentGroup";
import "react-complex-tree/lib/style-modern.css";
import { GroupsType } from "@lib/formContext";
import { Item } from "./Item";
import { autoSetNextAction } from "./util/setNextAction";
import { Tooltip } from "@formBuilder/components/shared/Tooltip";
import { AddIcon, SortIcon } from "@serverComponents/icons";
import { toast } from "../../Toast";
import { handleCanDropAt } from "./handlers/handleCanDropAt";
import { handleOnDrop } from "./handlers/handleOnDrop";

export interface TreeDataProviderProps {
  children?: ReactElement;
  addItem: (id: string) => void;
  // addGroup: (id: string) => void;
  updateItem: (id: string, value: string) => void;
  // removeItem: (id: string) => void;
  // openSection?: (id: string) => void;
}

const ControlledTree: ForwardRefRenderFunction<unknown, TreeDataProviderProps> = (
  { children },
  ref
) => {
  // export const TreeView = () => {
  const {
    getTreeData,
    getGroups,
    addGroup,
    setId,
    updateGroupName,
    replaceGroups,
    updateElementTitle,
  } = useGroupStore((s) => {
    return {
      getTreeData: s.getTreeData,
      getGroups: s.getGroups,
      replaceGroups: s.replaceGroups,
      addGroup: s.addGroup,
      setId: s.setId,
      updateGroupName: s.updateGroupName,
      updateElementTitle: s.updateElementTitle,
    };
  });

  const { tree, environment } = useTreeRef();
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex | undefined>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const autoFlow = () => {
    const groups = getGroups() as GroupsType;
    const newGroups = autoSetNextAction({ ...groups }, true); // forces overwrite of existing next actions
    replaceGroups(newGroups);
    toast.success("Auto flow applied");
  };

  const addSection = () => {
    const id = uuid();
    addGroup(id, "New section");
    setSelectedItems([id]);
    setExpandedItems([id]);
    setId(id);
  };

  useImperativeHandle(ref, () => ({
    addItem: async (id: string) => {
      const parent = findParentGroup(getTreeData(), id);
      setExpandedItems([parent?.index as TreeItemIndex]);
      setSelectedItems([id]);
    },
    updateItem: (id: string) => {
      const parent = findParentGroup(getTreeData(), id);
      setExpandedItems([parent?.index as TreeItemIndex]);
      setSelectedItems([id]);
    },
  }));

  return (
    <ControlledTreeEnvironment
      ref={environment}
      items={getTreeData()}
      getItemTitle={(item) => item.data}
      renderItem={({ title, arrow, context, children }) => {
        return (
          <Item title={title} arrow={arrow} context={context}>
            {children}
          </Item>
        );
      }}
      renderItemTitle={({ title }) => <Item.Title title={title} />}
      renderItemArrow={({ item, context }) => <Item.Arrow item={item} context={context} />}
      renderLiveDescriptorContainer={() => null}
      viewState={{
        ["default"]: {
          focusedItem,
          expandedItems,
          selectedItems,
        },
      }}
      canDragAndDrop={true}
      canReorderItems={true}
      canDrag={(items: TreeItem[]) => {
        return items.some((item) => {
          return (
            item.data !== "Start" &&
            item.data !== "Introduction" &&
            item.data !== "Policy" &&
            item.data !== "Review" &&
            item.data !== "End" &&
            item.data !== "Confirmation"
          );
        });
      }}
      canDropAt={(items, target) => handleCanDropAt(items, target, getGroups)}
      onRenameItem={(item, name) => {
        item.isFolder && updateGroupName({ id: String(item.index), name });

        // Rename the element
        !item.isFolder &&
          updateElementTitle({
            id: Number(item.index),
            text: name,
          });

        setSelectedItems([item.index]);
      }}
      onDrop={async (items: TreeItem[], target: DraggingPosition) =>
        handleOnDrop(items, target, getGroups, replaceGroups, setSelectedItems, getTreeData)
      }
      onFocusItem={(item) => {
        setFocusedItem(item.index);
        const parent = findParentGroup(getTreeData(), String(item.index));
        setId(item.isFolder ? String(item.index) : String(parent?.index));
      }}
      onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
      onCollapseItem={(item) =>
        setExpandedItems(
          expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index)
        )
      }
      onSelectItems={(items) => setSelectedItems(items)}
    >
      <div className="mb-4 flex justify-between align-middle">
        <label>
          New section
          <button className="ml-2 mt-2 rounded-md border border-slate-500 p-1" onClick={addSection}>
            <AddIcon title="Add section" />
          </button>
        </label>

        <label>
          Auto flow
          <button className="ml-2 mt-2 rounded-md border border-slate-500 p-1" onClick={autoFlow}>
            <SortIcon title="Auto flow" />
          </button>
          <Tooltip.Info
            side="top"
            triggerClassName="align-middle ml-1"
            tooltipClassName="font-normal whitespace-normal"
          >
            <strong>Auto flow</strong>
            <p>
              Auto flow will automatically set a linear flow for your sections, overriding any
              existing rules.
            </p>
          </Tooltip.Info>
        </label>
      </div>

      <Tree treeId="default" rootItem="root" treeLabel="GC Forms sections" ref={tree} />
      <>{children}</>
    </ControlledTreeEnvironment>
  );
};

export const TreeView = forwardRef(ControlledTree);
