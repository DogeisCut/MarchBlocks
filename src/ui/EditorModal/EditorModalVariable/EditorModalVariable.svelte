<script lang="ts">
    import type { Snippet } from "svelte";
    import EditorModal from "../EditorModal.svelte";

    import type { EditorState } from "../../Editor.svelte"

    interface EditorModalProps {
        editorState: EditorState;
        title: string;
        id: string;
        acceptText?: string;
        cancelText?: string;
        children?: Snippet;
    }

    const props: EditorModalProps = $props();

    let variableName = $state("")
    let variableType = $state("Number")
    let canCreate = $derived(variableName.length > 0)
</script>

<EditorModal
    editorState={props.editorState}
    title={props.title}
    id={props.id}
    acceptText={props.acceptText}
    cancelText={props.cancelText}
    acceptDisabled={!canCreate}
    onAccept={function () {
        this.close()
    }}
    onCancel={function () {
        this.close()
    }}
>
    <input type="text" placeholder="Variable Name" bind:value={variableName} />
    <select bind:value={variableType}>
        <option value="Number">Number</option>
        <option value="Vector2">Vector2</option>
        <option value="Vector3">Vector3</option>
        <option value="Vector4">Vector4</option>
        <option value="Color">Color</option>
        <option value="Boolean">Boolean</option>
        <option value="Surface">Surface</option>
        <option value="SDF">SDF</option>
    </select>
    {@render props?.children()}
</EditorModal>

<style>
    input, select {
        width: 100%; 
        padding: 8px; 
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>