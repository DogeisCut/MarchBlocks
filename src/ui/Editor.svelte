<script module lang="ts">
    export interface ProjectSettings {
        name: string,
        size: [number, number]
    }

    export interface SavedEditorState {
        preview: {
            positon: [number, number],
            size: [number, number]
        },
    }

    export interface EditorState {
        workspace: Blockly.WorkspaceSvg
        canvas: HTMLCanvasElement
        editorModalKind?: "variable" | "projectSettings" | "editorSettings" | null,
        save: {
            unsavedChanges: boolean,
            fileName: string | null
        } | null
    }
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as Blockly from "blockly";
    import { registerContinuousToolbox } from '@blockly/continuous-toolbox';
    import toolbox from "../toolbox";
    import theme from "../theme";
    import * as Compiler from "../compilier";
    import AlphaWarning from "./AlphaWarning/AlphaWarning.svelte";
    import RaymarcherPreview from "./RaymarcherPreview/RaymarcherPreview.svelte";
    import EditorTopBar from "./EditorTopBar/EditorTopBar.svelte";
    import EditorModal from "./EditorModal/EditorModal.svelte";
    import EditorModalVariable from "./EditorModal/EditorModalVariable/EditorModalVariable.svelte";

    import { BlockTypes } from "../shared"

    import.meta.glob('../blocks/*.ts', { eager: true });

    let projectSettings: ProjectSettings = $state({
        name: "Untitled Project",
        size: [1920, 1280]
    })

    let savedEditorState: SavedEditorState = $state({
        preview: {
            positon: [0, 0],
            size: [1920/2, 1280/2]
        },
    })

    let editorState: EditorState = $state({
        workspace: null,
        canvas: null,
        editorModalKind: null,
        save: null
    })

    registerContinuousToolbox();
    
    let blocklyDiv: HTMLDivElement | null = null;

    onMount(() => {
        if (!blocklyDiv) return;

        const toolboxElement = document.createElement("xml");
        toolboxElement.innerHTML = toolbox;

        editorState.workspace = Blockly.inject(blocklyDiv, {
            toolbox: { "kind": "categoryToolbox", "contents": [] },
            collapse: true,
            comments: true,
            css: true,
            disable: false,
            grid: {
                spacing: 20,
                length: 1,
                colour: '#ccc',
                snap: false,
            },
            horizontalLayout: false,
            maxBlocks: Infinity,
            maxTrashcanContents: 0,
            media: 'https://blockly-demo.appspot.com/static/media/',
            modalInputs: true,
            move: {
                scrollbars: {
                    horizontal: true,
                    vertical: true
                },
                drag: true,
                wheel: true
            },
            oneBasedIndex: false,
            plugins: {
                flyoutsVerticalToolbox: 'ContinuousFlyout',
                metricsManager: 'ContinuousMetrics',
                toolbox: 'ContinuousToolbox',
            },
            readOnly: false,
            renderer: 'zelos',
            rtl: false,
            scrollbars: true,
            sounds: true,
            theme: theme,
            toolboxPosition: 'start',
            trashcan: false,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.8,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true
            },
        });


        editorState.workspace.registerToolboxCategoryCallback("VARIABLES", function (_) {
            const xmlList = [];

            // const button = Blockly.utils.xml.createElement("button");
            // button.setAttribute("text", "Create variable");
            // button.setAttribute("callbackKey", "ADD_VARIABLE");
            // xmlList.push(button);

            const init = Blockly.utils.xml.createElement("block")
            init.setAttribute("type", "variables_init");
            xmlList.push(init);

            if (Object.keys(editorState.workspace.getVariableMap().getAllVariables()).length === 0) return xmlList;

            // const valueShadow = Blockly.utils.xml.createElement("value");
            // valueShadow.setAttribute("name", "VALUE");
            // const shadow = Blockly.utils.xml.createElement("shadow");
            // shadow.setAttribute("type", "math_number");
            // const field = Blockly.utils.xml.createElement("field");
            // field.setAttribute("name", "NUM");
            // field.textContent = "0";
            // shadow.appendChild(field);
            // valueShadow.appendChild(shadow);

            editorState.workspace.getVariableMap().getAllVariables().forEach((variable: Blockly.VariableModel) => {
                const get = Blockly.utils.xml.createElement("block");
                get.setAttribute("type", "variables_get");
                const varField = Blockly.utils.xml.createElement("field");
                varField.setAttribute("name", "VARIABLE");
                varField.textContent = variable.getId();
                get.appendChild(varField);
                xmlList.push(get);
            })

            const set = Blockly.utils.xml.createElement("block");
            set.setAttribute("type", "variables_set");
            xmlList.push(set);


            return xmlList;
        });
        editorState.workspace.registerButtonCallback("ADD_VARIABLE", () => {
            editorState.editorModalKind = "variable"
        });

        editorState.workspace.registerToolboxCategoryCallback("FUNCTIONS", function (_) {
            const xmlList = [];

            return xmlList;
        });

        editorState.workspace.updateToolbox(toolboxElement);

        const defaultWorkspaceElement = document.createElement("xml")
        defaultWorkspaceElement.innerHTML = `<block type="scene" id="scene" deletable="false" editable="false" x="0" y="0">
            <value name="CLEAR_COLOR">
            <shadow type="values_color">
                <field name="COLOR">#bae6f3</field>
            </shadow>
            </value>
            <value name="CAMERA_POSITION">
            <shadow type="values_vector3">
                <field name="X">0</field>
                <field name="Y">1</field>
                <field name="Z">-5</field>
            </shadow>
            <block type="vectors_vector3">
                <value name="X">
                <shadow type="values_float">
                    <field name="NUMBER">0</field>
                </shadow>
                <block type="operators_multiply">
                    <value name="A">
                    <shadow type="values_float">
                        <field name="NUMBER">0</field>
                    </shadow>
                    <block type="operators_trig">
                        <field name="OPERATION">sin</field>
                        <value name="NUMBER">
                        <shadow type="values_float">
                            <field name="NUMBER">0</field>
                        </shadow>
                        <block type="operators_multiply">
                            <value name="A">
                            <shadow type="values_float">
                                <field name="NUMBER">0</field>
                            </shadow>
                            <block type="sensing_timer"></block>
                            </value>
                            <value name="B">
                            <shadow type="values_float" id="9vJb7^!OtTEGM8lD!l0-">
                                <field name="NUMBER">90</field>
                            </shadow>
                            </value>
                        </block>
                        </value>
                    </block>
                    </value>
                    <value name="B">
                    <shadow type="values_float">
                        <field name="NUMBER">-5</field>
                    </shadow>
                    </value>
                </block>
                </value>
                <value name="Y">
                <shadow type="values_float">
                    <field name="NUMBER">2</field>
                </shadow>
                </value>
                <value name="Z">
                <shadow type="values_float">
                    <field name="NUMBER">0</field>
                </shadow>
                <block type="operators_multiply" id="Lj4#-n0~t?w]$,QkVAFV">
                    <value name="A">
                    <shadow type="values_float">
                        <field name="NUMBER">0</field>
                    </shadow>
                    <block type="operators_trig">
                        <field name="OPERATION">cos</field>
                        <value name="NUMBER">
                        <shadow type="values_float">
                            <field name="NUMBER">0</field>
                        </shadow>
                        <block type="operators_multiply">
                            <value name="A">
                            <shadow type="values_float">
                                <field name="NUMBER">0</field>
                            </shadow>
                            <block type="sensing_timer"></block>
                            </value>
                            <value name="B">
                            <shadow type="values_float" >
                                <field name="NUMBER">90</field>
                            </shadow>
                            </value>
                        </block>
                        </value>
                    </block>
                    </value>
                    <value name="B">
                    <shadow type="values_float">
                        <field name="NUMBER">-5</field>
                    </shadow>
                    </value>
                </block>
                </value>
            </block>
            </value>
            <value name="CAMERA_ANGLE">
            <shadow type="values_vector3">
                <field name="X">0</field>
                <field name="Y">0</field>
                <field name="Z">0</field>
            </shadow>
            <block type="vectors_vector3">
                <value name="X">
                <shadow type="values_float">
                    <field name="NUMBER">23</field>
                </shadow>
                </value>
                <value name="Y">
                <shadow type="values_float">
                    <field name="NUMBER">0</field>
                </shadow>
                <block type="operators_multiply">
                    <value name="A">
                    <shadow type="values_float">
                        <field name="NUMBER">0</field>
                    </shadow>
                    <block type="sensing_timer"></block>
                    </value>
                    <value name="B">
                    <shadow type="values_float">
                        <field name="NUMBER">90</field>
                    </shadow>
                    </value>
                </block>
                </value>
                <value name="Z">
                <shadow type="values_float">
                    <field name="NUMBER">0</field>
                </shadow>
                </value>
            </block>
            </value>
            <value name="FOV">
            <shadow type="values_positive_float">
                <field name="NUMBER">75</field>
            </shadow>
            </value>
            <value name="CONTROLS">
            <shadow type="values_boolean">
                <field name="BOOLEAN">FALSE</field>
            </shadow>
            </value>
            <statement name="SCENE">
            <block type="scene_set_scene">
                <value name="SDF">
                <shadow type="values_sdf"></shadow>
                <block type="primitives_box">
                    <value name="SURFACE">
                    <shadow type="values_surface"></shadow>
                    </value>
                    <value name="SIZE">
                    <shadow type="values_vector3">
                        <field name="X">1</field>
                        <field name="Y">1</field>
                        <field name="Z">1</field>
                    </shadow>
                    </value>
                    <value name="POSITION">
                    <shadow type="values_position"></shadow>
                    </value>
                </block>
                </value>
            </block>
            </statement>
        </block>
        `

        Blockly.Xml.domToWorkspace(defaultWorkspaceElement, editorState.workspace)

        editorState.workspace.addChangeListener(Blockly.Events.disableOrphans);

        const listener = (e: Blockly.Events.Abstract) => {
            if (
                e.isUiEvent ||
                e.type === Blockly.Events.FINISHED_LOADING ||
                editorState.workspace?.isDragging()
            )
                return;
            Compiler.compile(editorState.workspace!);
            if (editorState.save) {
                editorState.save.unsavedChanges = true
            }
        };

        editorState.workspace.addChangeListener(listener);

        onDestroy(() => {
            editorState.workspace?.removeChangeListener(listener);
            editorState.workspace?.removeChangeListener(Blockly.Events.disableOrphans);
            editorState.workspace?.dispose();
            editorState.workspace = null;
        });
    });
</script>

<div id="appContainer">
    <EditorTopBar 
        projectSettings={projectSettings}
        editorState={editorState}
    />
    <div id="pageContainer">
        <div bind:this={blocklyDiv} id="blocklyDiv"></div>
        <RaymarcherPreview 
            {editorState}
            {projectSettings}
            {savedEditorState}
        />
    </div>
    <!-- i spent time on this variabel modal only to realise i wont need it :/ -->
    {#if editorState.editorModalKind === "variable"}
        <EditorModalVariable
            title="Create a Variable"
            acceptText="Create"
            cancelText="Cancel"
            {editorState}
        ></EditorModalVariable>
    {:else if editorState.editorModalKind === "editorSettings"}
        <EditorModal
            title="Editor Settings"
            acceptText="Accept"
            cancelText="Cancel"
            onAccept={() => {}}
            onCancel={() => {editorState.editorModalKind = null}}
        ></EditorModal>
    {:else if editorState.editorModalKind === "projectSettings"}
        <EditorModal
            title="Project Settings"
            acceptText="Accept"
            cancelText="Cancel"
            onAccept={() => {}}
            onCancel={() => {editorState.editorModalKind = null}}
        ></EditorModal>
    {/if}
</div>
<AlphaWarning />

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    #appContainer {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    #pageContainer {
        position: relative;
        flex: 1;
        width: 100%;
        overflow: hidden;
    }

    #blocklyDiv {
        width: 100%;
        height: 100%;
    }
</style>
