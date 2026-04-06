import * as Blockly from "blockly";
import * as BlocklyGLSL from "../generators/glsl";

Blockly.Blocks["surfaces_generic_surface"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(false);
        this.appendDummyInput().appendField("generic surface")
        this.setOutput(true, "Surface")
        this.setStyle("surfaces_blocks");
    },
};

Blockly.Blocks["surfaces_create_surface_mutator_surface"] = { // Optional params, it just shows and hides the field row though
    init: function (this: Blockly.Block) {
    },
};
Blockly.Blocks["surfaces_create_surface"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(false);
        this.appendDummyInput().appendField("create surface")
        this.appendValueInput("COLOR").setCheck("Vector3").appendField("color:")
        this.appendValueInput("ROUGHNESS").setCheck("Number").appendField("roughness:")
        this.appendValueInput("METALLICITY").setCheck("Number").appendField("metallicity:")
        this.appendValueInput("EMISSION").setCheck("Number").appendField("emission:")
        // Option Ideas
        // Shaded
        // Opacity
        // IOR
        // Receive Shadows
        // Cast Shadows
        // Normal Map (either modify existing normals or change normal calculation entierly??)
        this.setOutput(true, "Surface")
        this.setStyle("surfaces_blocks");
    },
};

// surfaces_set_color
// surfaces_set_roughness
// surfaces_set_metallicity
// surfaces_set_emission



BlocklyGLSL.gLSLGenerator.forBlock["surfaces_generic_surface"] = function (block, generator) {
    return [`makeSurface(vec3(1.0), 1.0, 0.0, 0.0)`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["surfaces_create_surface"] = function (block, generator) {
    const COLOR = generator.valueToCode(block, "COLOR", BlocklyGLSL.Order.ATOMIC)
    const ROUGHNESS = generator.valueToCode(block, "ROUGHNESS", BlocklyGLSL.Order.ATOMIC)
    const METALLICITY = generator.valueToCode(block, "METALLICITY", BlocklyGLSL.Order.ATOMIC)
    const EMISSION = generator.valueToCode(block, "EMISSION", BlocklyGLSL.Order.ATOMIC)
    return [`makeSurface(${COLOR}, ${ROUGHNESS}, ${METALLICITY}, ${EMISSION})`, BlocklyGLSL.Order.NONE];
};
