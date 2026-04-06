import * as Blockly from "blockly";
import * as BlocklyGLSL from "../generators/glsl";
import {FieldColourHsvSliders} from '@blockly/field-colour-hsv-sliders';

Blockly.Blocks["values_color"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(false);
        this.appendDummyInput().appendField(
            new FieldColourHsvSliders(),
            "COLOR"
        )
        this.setOutput(true, "Vector3");
        this.setStyle("values");
    },
};

Blockly.Blocks["values_float"] = {
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_positive_float"] = {
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, 0), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_unit_float"] = {
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, 0, 1), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_positive_integer"] = {
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0, 0, null, 1), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_vector2"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("x:").appendField(new Blockly.FieldNumber(0), "X")
        this.appendDummyInput().appendField("y:").appendField(new Blockly.FieldNumber(0), "Y")
        this.setOutput(true, "Vector2")
        this.setStyle("vector2_blocks");
    },
};

Blockly.Blocks["values_vector3"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("x:").appendField(new Blockly.FieldNumber(0), "X")
        this.appendDummyInput().appendField("y:").appendField(new Blockly.FieldNumber(0), "Y")
        this.appendDummyInput().appendField("z:").appendField(new Blockly.FieldNumber(0), "Z")
        this.setOutput(true, "Vector3")
        this.setStyle("vector3_blocks");
    },
};

Blockly.Blocks["values_vector4"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("x:").appendField(new Blockly.FieldNumber(0), "X")
        this.appendDummyInput().appendField("y:").appendField(new Blockly.FieldNumber(0), "Y")
        this.appendDummyInput().appendField("z:").appendField(new Blockly.FieldNumber(0), "Z")
        this.appendDummyInput().appendField("w:").appendField(new Blockly.FieldNumber(0), "W")
        this.setOutput(true, "Vector4")
        this.setStyle("vector4_blocks");
    },
};

Blockly.Blocks["values_surface"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("surface")
        this.setOutput(true, "Surface")
        this.setStyle("surfaces_blocks");
    },
};

Blockly.Blocks["values_sdf"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("sdf")
        this.setOutput(true, "SDF")
        this.setStyle("primitives_blocks");
    },
};

Blockly.Blocks["values_boolean"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField(new Blockly.FieldDropdown(
            [
                ["X", "FALSE"],
                ["✓", "TRUE"]
            ]
        ), "BOOLEAN");
        this.setOutput(true, "Boolean")
        this.setStyle("operators_blocks");
    },
};

Blockly.Blocks["values_position"] = {
    init: function (this: Blockly.Block) {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("position")
        this.setOutput(true, "Vector3")
        this.setStyle("transforms_blocks");
    },
};



BlocklyGLSL.gLSLGenerator.forBlock["values_color"] = function (block, generator) {
    function hexToRgb(hex: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    const COLOR = block.getFieldValue("COLOR");
    const convertedColor = hexToRgb(COLOR) ?? { r: 0, g: 0, b: 0 }
    return [`vec3(float(${convertedColor.r/255}), float(${convertedColor.g/255}), float(${convertedColor.b/255}))`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_float"] = function (block, generator) {
    const NUMBER = block.getFieldValue("NUMBER");
    return [`float(${NUMBER})`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_positive_float"] = function (block, generator) {
    const NUMBER = block.getFieldValue("NUMBER");
    return [`float(${NUMBER})`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_unit_float"] = function (block, generator) {
    const NUMBER = block.getFieldValue("NUMBER");
    return [`float(${NUMBER})`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_positive_integer"] = function (block, generator) {
    const NUMBER = block.getFieldValue("NUMBER");
    return [`${NUMBER}`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_vector2"] = function (block, generator) {
    const X = block.getFieldValue("X");
    const Y = block.getFieldValue("Y");
    return [`vec2(float(${X}), float(${Y}))`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_vector3"] = function (block, generator) {
    const X = block.getFieldValue("X");
    const Y = block.getFieldValue("Y");
    const Z = block.getFieldValue("Z");
    return [`vec3(float(${X}), float(${Y}), float(${Z}))`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_vector4"] = function (block, generator) {
    const X = block.getFieldValue("X");
    const Y = block.getFieldValue("Y");
    const Z = block.getFieldValue("Z");
    const W = block.getFieldValue("W");
    return [`vec4(float(${X}), float(${Y}), float(${Z}), float(${W}))`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_surface"] = function (block, generator) {
    return [`Surface(vec3(1.0), 1.0, 0.0, 0.0)`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_sdf"] = function (block, generator) {
    return [`SDF(MAX_DIST_TO_TRAVEL, Surface(vec3(0.0), 1.0, 0.0, 0.0), 0.0)`, BlocklyGLSL.Order.NONE]
};

BlocklyGLSL.gLSLGenerator.forBlock["values_boolean"] = function (block, generator) {
    //const X = block.getFieldValue("BOOLEAN") === "TRUE";
    const X = false
    return [`${X}`, BlocklyGLSL.Order.NONE];
};

BlocklyGLSL.gLSLGenerator.forBlock["values_position"] = function (block, generator) {
    return ['position', BlocklyGLSL.Order.NONE];
};