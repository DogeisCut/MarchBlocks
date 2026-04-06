<script lang="ts">
    import EditorTopBarDropdown from "./EditorTopBarDropdown/EditorTopBarDropdown.svelte";
    import EditorTopBarLogo from "./EditorTopBarLogo/EditorTopBarLogo.svelte";
    import EditorTopBarDropdownContentOption from "./EditorTopBarDropdown/EditorTopBarDropdownContentOption/EditorTopBarDropdownContentOption.svelte";
    import EditorTopBarDropdownContentSeparator from "./EditorTopBarDropdownContentSeparator/EditorTopBarDropdownContentSeparator.svelte";

    import * as Serializer from "../../serializer"

    import type { EditorState, EditorFunctions, ProjectSettings } from "../Editor.svelte"

    interface EditorTopBarProps {
        projectSettings: ProjectSettings,
        editorState: EditorState
        editorFunctions: EditorFunctions
    }

    const props: EditorTopBarProps = $props()
</script>

<header>
    <div class="header-left">
        <EditorTopBarLogo />

        <EditorTopBarDropdown text="File">
            <EditorTopBarDropdownContentOption onclick={() => {}}>New</EditorTopBarDropdownContentOption>
            <EditorTopBarDropdownContentSeparator />
            <EditorTopBarDropdownContentOption onclick={() => {}}>Load form Computer</EditorTopBarDropdownContentOption>
            <EditorTopBarDropdownContentSeparator />
            <EditorTopBarDropdownContentOption onclick={() => {

            }}>Save as...</EditorTopBarDropdownContentOption>
            <EditorTopBarDropdownContentOption onclick={async () => {
                const file = await Serializer.createFile(
                    props.editorState.workspace, 
                    props.projectSettings.name, 
                    props.editorState.canvas
                );

                const url = URL.createObjectURL(file);
                const a = document.createElement('a');

                a.href = url;
                a.download = file.name;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }}>Save to seperate file</EditorTopBarDropdownContentOption>
        </EditorTopBarDropdown>

        <EditorTopBarDropdown text="Edit">
            <EditorTopBarDropdownContentOption onclick={() => {}}>Undo</EditorTopBarDropdownContentOption>
            <EditorTopBarDropdownContentOption onclick={() => {}}>Redo</EditorTopBarDropdownContentOption>
        </EditorTopBarDropdown>

        <EditorTopBarDropdown text="Settings">
            <EditorTopBarDropdownContentOption 
                onclick={() => props.editorFunctions.openModal("editorSettings")}
            >Editor Settings</EditorTopBarDropdownContentOption>
            <EditorTopBarDropdownContentOption 
                onclick={() => props.editorFunctions.openModal("projectSettings")}
            >Project Settings</EditorTopBarDropdownContentOption>
        </EditorTopBarDropdown>

        <div class="header-seperator"></div>

        <input type="text" id="projectName" bind:value={props.projectSettings.name} />

        <div class="header-seperator"></div>

        <a href="examples.html" target="_blank" class="text-button">See Examples</a>
    </div>

    <div class="header-right">
        {#if props.editorState.save}
            {#if props.editorState.save.fileName}
                <div class="text-button">Save as {props.editorState.save.fileName}</div>  
            {:else}
                <div class="text-button">Save to your computer</div>  
            {/if}
        {/if}
        
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        background-color: #4C97FF;
        padding: 0 12px;
        color: white;
        z-index: 100;
    }

    .header-left, .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .header-seperator {
        width: 1px;
        height: 24px;
        background-color: rgba(255, 255, 255, 0.3);
        margin: 0 8px;
    }

    #projectName {
        background-color: rgba(0, 0, 0, 0.1);
        border: 1px dashed rgba(255, 255, 255, 0.5);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;
        width: 250px;
        transition: all 0.1s;
    }
    #projectName:focus {
        outline: none;
        background-color: white;
        color: #333;
        border: 1px solid white;
    }

    .text-button {
        color: white;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.1s;
    }
    .text-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
        text-decoration: underline;
    }
</style>