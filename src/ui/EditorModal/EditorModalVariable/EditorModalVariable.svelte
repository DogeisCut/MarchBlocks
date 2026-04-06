<script lang="ts">
    import type { Snippet } from "svelte";
    import EditorModal from "../EditorModal.svelte";

    import type { EditorState } from "../../Editor.svelte"

    interface EditorModalProps {
        title: string;
        acceptText?: string;
        cancelText?: string;
        editorState: EditorState;
        children?: Snippet;
    }

    const props: EditorModalProps = $props();

    let variableName = $state("")
    let variableType = $state("Number")
    let canCreate = $derived(variableName.length > 0)
</script>

<EditorModal
    title={props.title}
    acceptText={props.acceptText}
    cancelText={props.cancelText}
    acceptDisabled={!canCreate}
    onAccept={() => {
        
    }}
    onCancel={() => {
        props.editorState.editorModalKind = null
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