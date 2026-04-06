import * as Blockly from "blockly";
import * as BlocklyGLSL from "../generators/glsl";
import {FieldColourHsvSliders} from '@blockly/field-colour-hsv-sliders';

import { BlockTypes, shadowMap, trueTypeMap, hexToRgb } from "../shared"

// TODO: fix set/get block not updating with init block when placed
// TODO: fix wierd duplicate name edge case when duplicating an init block after messing with the field
// TODO: fix init block position affecting where the var is declared.
// TODO: deleting a var actually deletes all uses
// TODO: delete modal/proper deletion system
// TODO: some sort of global validator to make sure there's no vars without inits, or
// vars with multiple inits
// TODO: Some sort of way to distinguish variables of different types maybe?
// TODO MINOR: breif syntax error if you change a get between variables of different types while its connected 

// Im aware of the variables field, but I dont want to use it here.
function getVariables(workspace: Blockly.WorkspaceSvg): Blockly.MenuOption[] {
    const allVars = workspace.getVariableMap().getAllVariables();
    if (allVars.length === 0) {
        return [['', '']];
    }
    return allVars.map((variable) => [variable.getName(), variable.getId()]);
}

function validateVariableName(variableName: string) {
    const hash = btoa(variableName).replace(/=/g, '');
    variableName = variableName.replace(/\s+/g, '');
    variableName = variableName.replace(/[^a-zA-Z0-9]/g, ''); // I'm aware underscores are valid, but aparently double underscores arent! 
    return `marchBlocks_${variableName}${hash}`;
}

const typeMap = {
    [BlockTypes.None]: "",
    [BlockTypes.Number]: "float",
    [BlockTypes.Vector2]: "vec2",
    [BlockTypes.Vector3]: "vec3",
    [BlockTypes.Vector4]: "vec4",
    [BlockTypes.Color]: "vec3",
    [BlockTypes.Boolean]: "bool",
    [BlockTypes.Surface]: "Surface",
    [BlockTypes.SDF]: "SDF"
}

const fieldMap: Record<BlockTypes,
    {
        create: (block: Blockly.BlockSvg) => boolean
        destroy: (block: Blockly.BlockSvg) => void
        get: (block: Blockly.BlockSvg) => string
    }
> = {
    [BlockTypes.None]: {
        create: function (block: Blockly.BlockSvg): boolean {
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
        },
        get: function (block: Blockly.BlockSvg): string {
            return ""
        }
    },
    [BlockTypes.Number]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("NUMBER")) return false;
            block.appendDummyInput("NUMBER").appendField(new Blockly.FieldNumber(), "VALUE")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("NUMBER", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            return `float(${block.getFieldValue("VALUE")})`
        }
    },
    [BlockTypes.Vector2]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("VECTOR2_X_ROW")) return false;
            block.appendDummyInput("VECTOR2_X_ROW").appendField("x:").appendField(new Blockly.FieldNumber(), "X")
            block.appendDummyInput("VECTOR2_Y_ROW").appendField("y:").appendField(new Blockly.FieldNumber(), "Y")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("VECTOR2_X_ROW", true)
            block.removeInput("VECTOR2_Y_ROW", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            return `vec2(float(${block.getFieldValue("X")}), float(${block.getFieldValue("Y")}))`
        }
    },
    [BlockTypes.Vector3]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("VECTOR3_X_ROW")) return false;
            block.appendDummyInput("VECTOR3_X_ROW").appendField("x:").appendField(new Blockly.FieldNumber(), "X")
            block.appendDummyInput("VECTOR3_Y_ROW").appendField("y:").appendField(new Blockly.FieldNumber(), "Y")
            block.appendDummyInput("VECTOR3_Z_ROW").appendField("z:").appendField(new Blockly.FieldNumber(), "Z")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("VECTOR3_X_ROW", true)
            block.removeInput("VECTOR3_Y_ROW", true)
            block.removeInput("VECTOR3_Z_ROW", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            return `vec3(float(${block.getFieldValue("X")}), float(${block.getFieldValue("Y")}), float(${block.getFieldValue("Z")}))`
        }
    },
    [BlockTypes.Vector4]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("VECTOR4_X_ROW")) return false;
            block.appendDummyInput("VECTOR4_X_ROW").appendField("x:").appendField(new Blockly.FieldNumber(), "X")
            block.appendDummyInput("VECTOR4_Y_ROW").appendField("y:").appendField(new Blockly.FieldNumber(), "Y")
            block.appendDummyInput("VECTOR4_Z_ROW").appendField("z:").appendField(new Blockly.FieldNumber(), "Z")
            block.appendDummyInput("VECTOR4_W_ROW").appendField("w:").appendField(new Blockly.FieldNumber(), "W")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("VECTOR4_X_ROW", true)
            block.removeInput("VECTOR4_Y_ROW", true)
            block.removeInput("VECTOR4_Z_ROW", true)
            block.removeInput("VECTOR4_W_ROW", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            return `vec4(float(${block.getFieldValue("X")}), float(${block.getFieldValue("Y")}), float(${block.getFieldValue("Z")}), float(${block.getFieldValue("W")}))`
        }
    },
    [BlockTypes.Color]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("COLOR")) return false;
            block.appendDummyInput("COLOR").appendField(new FieldColourHsvSliders("#FF0000"), "VALUE")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("COLOR", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            const VALUE = block.getFieldValue("VALUE");
            const convertedColor = hexToRgb(VALUE) ?? { r: 0, g: 0, b: 0 }
            return `vec3(float(${convertedColor.r/255}), float(${convertedColor.g/255}), float(${convertedColor.b/255}))`
        }
    },
    [BlockTypes.Boolean]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("BOOLEAN")) return false;
            block.appendDummyInput("BOOLEAN").appendField(new Blockly.FieldDropdown(
                [
                    ["X", "FALSE"],
                    ["✓", "TRUE"]
                ]
            ), "VALUE");
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("BOOLEAN", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            return block.getFieldValue("VALUE").toLowerCase()
        }
    },
    [BlockTypes.Surface]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("SURFACE")) return false;
            // this definetly wont be annoying to keep up to date
            // also you *should* be able to put things inside here via inputs but its impossible to tell if what you are putting in is a constant value so i dont bother
            block.appendDummyInput("COLOR_ROW").appendField("color:").appendField(new FieldColourHsvSliders("#ff0000"), "COLOR")
            block.appendDummyInput("ROUGHNESS_ROW").appendField("roughness:").appendField(new Blockly.FieldNumber(1, 0, 1), "ROUGHNESS")
            block.appendDummyInput("METALLICITY_ROW").appendField("metallicity:").appendField(new Blockly.FieldNumber(0, 0, 1), "METALLICITY")
            block.appendDummyInput("EMISSION_ROW").appendField("emission:").appendField(new Blockly.FieldNumber(0, 0, 1), "EMISSION")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("COLOR_ROW", true)
            block.removeInput("ROUGHNESS_ROW", true)
            block.removeInput("METALLICITY_ROW", true)
            block.removeInput("EMISSION_ROW", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            const COLOR = block.getFieldValue("COLOR");
            const convertedColor = hexToRgb(COLOR) ?? { r: 0, g: 0, b: 0 }
            const ROUGHNESS = block.getFieldValue("ROUGHNESS");
            const METALLICITY = block.getFieldValue("METALLICITY");
            const EMISSION = block.getFieldValue("EMISSION");
            return `Surface(vec3(float(${convertedColor.r/255}), float(${convertedColor.g/255}), float(${convertedColor.b/255})), float(${ROUGHNESS}), float(${METALLICITY}), float(${EMISSION}))`
        }
    },
    [BlockTypes.SDF]: {
        create: function (block: Blockly.BlockSvg): boolean {
            if (block.getInput("SDF")) return false;
            block.appendDummyInput("SDF").appendField("sdf")
            return true
        },
        destroy: function (block: Blockly.BlockSvg): void {
            block.removeInput("SDF", true)
        },
        get: function (block: Blockly.BlockSvg): string {
            return "SDF(MAX_DIST_TO_TRAVEL, Surface(vec3(0.0), 1.0, 0.0, 0.0), 0.0)"
        }
    }
}



// I want you to have to select what type a variable returns

Blockly.Blocks["variables_mutator"] = {
    init: function (this: Blockly.Block & { type_: BlockTypes }) {
        this.setInputsInline(false);
        this.appendDummyInput().appendField("default value:").appendField(new Blockly.FieldCheckbox('TRUE'), "DEFAULT_VALUE");
        this.setStyle("variables_blocks");
        this.setDeletable(false);
        this.setMovable(false);
    },
};

// and its default value at the start of the shader
// also gotta make sure there's only one of these per var
// also it may be best to just use fields for every type because initialized values have to be a constant value
interface VaribalesInitBlockSvg extends Blockly.BlockSvg {
    defaultValue_: boolean;
    variableId_: string | null;
    updateShape_: () => void;
    updateType_: (newType: BlockTypes) => void;
    updateVariableSync_: (name: string, type: string) => void;
}
Blockly.Blocks["variables_init"] = {
    

    init: function (this: VaribalesInitBlockSvg) {
        this.setInputsInline(true);
        this.appendDummyInput("VARIABLE_ROW").appendField("initialize").appendField(new Blockly.FieldDropdown([
            ["Number", "Number"],
            ["Vector2", "Vector2"],
            ["Vector3", "Vector3"],
            ["Vector4", "Vector4"],
            ["Color", "Color"],
            ["Boolean", "Boolean"],
            ["Surface", "Surface"],
            ["SDF", "SDF"],
        ], (newValue: string) => {
            this.updateType_(newValue as BlockTypes);
            this.updateVariableSync_(this.getFieldValue("NAME"), newValue);
            return newValue
        }), "TYPE").appendField("variable").appendField(new Blockly.FieldTextInput(Blockly.Variables.generateUniqueName(this.workspace), (newName: string) => {
            // this.workspace.getVariableMap().getVariable(newName) did not work
            if (this.workspace.getVariableMap().getAllVariables().find((variable) => variable.getName() == newName)) {
                return null;
            }
            this.updateVariableSync_(newName, this.getFieldValue("TYPE"));
            return newName;
        }), "NAME");
        this.setStyle("variables_blocks");
        this.setMutator(new Blockly.icons.MutatorIcon([], this));
        this.defaultValue_ = true;
        this.variableId_ = null;
        this.updateShape_();
    },

    onchange: function (this: VaribalesInitBlockSvg, e: Blockly.Events.Abstract) {
        if (!this.workspace || this.workspace.isFlyout) return;
        
        if (!this.variableId_) {
            this.updateVariableSync_(this.getFieldValue("NAME"), this.getFieldValue("TYPE"));
        }
    },

    updateVariableSync_: function (this: VaribalesInitBlockSvg, name: string, type: string) {
        if (!this.workspace || this.workspace.isFlyout) return;

        const variableMap = this.workspace.getVariableMap();
        let variable = this.variableId_ ? variableMap.getVariableById(this.variableId_) : null;

        if (!variable) {
            variable = variableMap.createVariable(name, type);
            this.variableId_ = variable.getId();
        } else {
            if (variable.getName() !== name || variable.getType() !== type) {
                const variable = variableMap.getVariableById(this.variableId_)
                variableMap.renameVariable(variable, name);
                variableMap.changeVariableType(variable, type);
            }
        }
    },

    dispose: function (this: any) {
        if (this.variableId_ && this.workspace) {
            const name = this.getFieldValue("NAME") || "";
            // this isnt perfect as it doesnt use our modal components
            // and it can activate when Blockly itself deletes the block for any reason, not just the user.
            if (!confirm(`Delete all uses of variable "${name}"?`)) {
                return;
            }
            Blockly.Variables.deleteVariable(this.workspace, this.workspace.getVariableMap().getVariableById(this.variableId_));
        }
        Blockly.BlockSvg.prototype.dispose.call(this);
    },

    mutationToDom: function (this: VaribalesInitBlockSvg) {
        const container = Blockly.utils.xml.createElement("mutation");
        container.setAttribute("defaultValue", this.defaultValue_ ? 'TRUE' : 'FALSE');
        return container;
    },

    domToMutation: function (this: VaribalesInitBlockSvg, xmlElement: Element) {
        this.defaultValue_ = (xmlElement.getAttribute("defaultValue") === 'TRUE');
        this.updateShape_();
    },

    saveExtraState: function () {
        return {
            defaultValue: this.defaultValue_
        }
    },

    loadExtraState: function (state) {
        this.defaultValue_ = state.defaultValue || true;
        this.updateShape_();
    },

    compose: function (this: VaribalesInitBlockSvg, topBlock: Blockly.BlockSvg) {
        this.defaultValue_ = (topBlock.getFieldValue("DEFAULT_VALUE") === 'TRUE')
        this.updateShape_();
    },

    decompose: function (this: VaribalesInitBlockSvg, workspace: Blockly.WorkspaceSvg) {
        const containerBlock = workspace.newBlock('variables_mutator');
        containerBlock.initSvg();
        containerBlock.setFieldValue(this.defaultValue_ ? 'TRUE' : 'FALSE', "DEFAULT_VALUE");
        return containerBlock
    },

    updateShape_: function (this: VaribalesInitBlockSvg) {
        if (this.defaultValue_) {
            if (!this.getInput("TO")) {
                this.appendDummyInput("TO").appendField("to")
                this.updateType_(this.getFieldValue("TYPE"))
            }
        } else {
            this.removeInput("TO", true)
            this.updateType_(this.getFieldValue("TYPE"))
        }
    },

    updateType_: function (newType: BlockTypes) {
        const oldType = this.getFieldValue("TYPE")
        if (this.defaultValue_) {
            fieldMap[oldType].destroy(this)
            fieldMap[newType].create(this)
        } else {
            fieldMap[newType].destroy(this)
        }
    }
};

Blockly.Blocks["variables_set"] = {
    init: function (this: Blockly.BlockSvg & { updateShape_: () => {} }) {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField("set")
            .appendField(new Blockly.FieldDropdown(() => getVariables(this.workspace), (newValue: string) => {
                const variable = this.workspace.getVariableMap().getVariableById(newValue);
                if (variable) {
                    if (!this.getInput("VALUE")?.connection?.targetBlock().isShadow()) {
                        this.getInput("VALUE")?.connection?.disconnect()
                    }
                    this.getInput("VALUE")?.connection?.targetBlock()?.dispose()
                    this.getInput("VALUE")?.setCheck(trueTypeMap[variable.getType()]);
                    this.getInput("VALUE")?.connection?.setShadowState({ ...this.getInput("VALUE")?.connection?.getShadowState(), type: shadowMap[variable.getType()] })
                }
                return newValue
            }), "VARIABLE")
            .appendField("to");
        this.appendValueInput("VALUE").setCheck([]);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle("variables_blocks");
        this.updateShape_()
    },
    updateShape_() {
        const id = this.getFieldValue("VARIABLE");
        const variable = this.workspace.getVariableMap().getVariableById(id);
        if (variable) {
            this.getInput("VALUE")?.setCheck(trueTypeMap[variable.getType()]);
            const currentShadow = this.getInput("VALUE")?.connection?.getShadowState() ?? {};
            this.getInput("VALUE")?.connection?.setShadowState({ ...currentShadow, type: shadowMap[variable.getType()] });
        }
    }
};

// making the executive decision to not include this block for simplicity
// maybe at some point in the future i'll properly add all the assign operators
// Blockly.Blocks["variables_change"] = {
//     init: function (this: Blockly.BlockSvg & { type_: BlocklyType }) {
//         this.setInputsInline(false);
//         this.appendDummyInput().appendField("change variable").appendField(new Blockly.FieldVariable(null, null, Object.keys(BlocklyType), BlocklyType.None), "VARIABLE")
//         this.appendValueInput("VALUE").setCheck([]).appendField("by")
//         this.setStyle("variables_blocks");
//         this.type_ = BlocklyType.None;
//     },
// };

Blockly.Blocks["variables_get"] = {
    init: function (this: Blockly.BlockSvg & { updateShape_: () => {} }) {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(() => getVariables(this.workspace), (newValue: string) => {
                this.updateShape_()
                return newValue
            }), "VARIABLE");
        this.setOutput(true);
        this.setStyle("variables_blocks");
        this.updateShape_()
    },
    updateShape_() {
        const id = this.getFieldValue("VARIABLE");
        const variable = this.workspace.getVariableMap().getVariableById(id);
        if (variable) {
            this.setOutput(true, trueTypeMap[variable.getType()]);
        }
    },
    onchange: function (this: Blockly.BlockSvg & { updateShape_: () => {} }) {
        this.updateShape_()
    }
};



BlocklyGLSL.gLSLGenerator.forBlock["variables_init"] = function (block: VaribalesInitBlockSvg, generator) {
    const TYPE: BlockTypes = block.getFieldValue("TYPE");
    const NAME = block.getFieldValue("NAME");
    if (block.defaultValue_) {
        const VALUE = fieldMap[TYPE].get(block);
        return `${typeMap[TYPE]} ${validateVariableName(NAME)} = ${VALUE};\n`;
    }
    return `${typeMap[TYPE]} ${validateVariableName(NAME)};\n`;
};

BlocklyGLSL.gLSLGenerator.forBlock["variables_get"] = function (block: Blockly.BlockSvg, generator) {
    const VARIABLE = block.getFieldValue("VARIABLE");
    return [`${validateVariableName(block.workspace.getVariableMap().getVariableById(VARIABLE).getName())}`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["variables_set"] = function (block: Blockly.BlockSvg, generator) {
    const VARIABLE = block.getFieldValue("VARIABLE");
    const VALUE = generator.valueToCode(block, "VALUE", BlocklyGLSL.Order.ATOMIC)
    return `${validateVariableName(block.workspace.getVariableMap().getVariableById(VARIABLE).getName())} = ${VALUE};`
};