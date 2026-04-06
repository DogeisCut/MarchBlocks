import theme from "./theme";

function block(type: string, ...extra: string[]): string {
    return `<block type="${type}">${extra?.join?.("")}</block>`;
}
function value(name: string, ...extra: string[]): string {
    return `<value name="${name}">${extra?.join?.("")}</value>`;
}
function shadow(type: string, ...extra: string[]): string {
    return `<shadow type="${type}">${extra?.join?.("")}</shadow>`;
}
function sep(sep: number = 30): string {
    return `<sep gap="${sep}"></sep>`;
}
function shadowFloat(value: number = 10): string {
    return `<shadow type="values_float"><field name="NUMBER">${value}</field></shadow>`;
}
function shadowUnitFloat(value: number = 0.5): string {
    return `<shadow type="values_unit_float"><field name="NUMBER">${value}</field></shadow>`;
}
function shadowPositiveInteger(value: number = 0.5): string {
    return `<shadow type="values_positive_integer"><field name="NUMBER">${value}</field></shadow>`;
}
function shadowVector2(x: number = 0, y: number = 0): string {
    return `<shadow type="values_vector2"><field name="X">${x}</field><field name="Y">${y}</field></shadow>`;
}
function shadowVector3(x: number = 0, y: number = 0, z: number = 0): string {
    return `<shadow type="values_vector3"><field name="X">${x}</field><field name="Y">${y}</field><field name="Z">${z}</field></shadow>`;
}
function shadowVector4(x: number = 0, y: number = 0, z: number = 0, w: number = 0): string {
    return `<shadow type="values_vector4"><field name="X">${x}</field><field name="Y">${y}</field><field name="Z">${z}</field><field name="W">${w}</field></shadow>`;
}
function shadowBoolean(/*value: boolean = false*/): string {
    return `<shadow type="values_boolean"></shadow>`;
    //return `<shadow type="values_boolean"><field name="BOOLEAN">${value ? 'TRUE' : 'FALSE'}</field></shadow>`;
}
function shadowColor(color: string = "#ff0000"): string {
    return `<shadow type="values_color"><field name="COLOR">${color}</field></shadow>`;
}
const c = theme.blockStyles
const toolbox = `
    <category name="Scene" colour="${c.scene_blocks.colourPrimary}">
        ${block("scene_set_scene", value("SDF", shadow("values_sdf")))}
        ${block("scene_append_to_scene", value("SDF", shadow("values_sdf")))}
        ${block("scene_current_scene")}
    </category>

    <category name="Surfaces" colour="${c.surfaces_blocks.colourPrimary}">
        ${block("surfaces_generic_surface")}
        ${block("surfaces_create_surface", value("COLOR", shadowColor("#ffffff")), value("ROUGHNESS", shadowUnitFloat(1)), value("METALLICITY", shadowUnitFloat(0)), value("EMISSION", shadowUnitFloat(0)))}
    </category>

    <category name="Primitives" colour="${c.primitives_blocks.colourPrimary}">
        ${block("primitives_nothing")}
        ${block("primitives_sphere", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADIUS", shadowFloat(1)))}
        ${block("primitives_box", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("SIZE", shadowVector3(1, 1, 1)))}
        ${block("primitives_round_box", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("SIZE", shadowVector3(1, 1, 1)), value("RADIUS", shadowFloat(0.1)))}
        ${block("primitives_box_frame", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("SIZE", shadowVector3(1, 1, 1)), value("THICKNESS", shadowFloat(0.1)))}
        ${block("primitives_torus", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADII", shadowVector2(1, 0.2)))}
        ${block("primitives_capped_torus", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADII", shadowVector2(1, 0.2)), value("START", shadowFloat(0)), value("END", shadowFloat(180)))}
        ${block("primitives_link", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("LENGTH", shadowFloat(0.5)), value("RADIUS1", shadowFloat(0.2)), value("RADIUS2", shadowFloat(0.1)))}
        ${block("primitives_infinite_cylinder", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADIUS", shadowFloat(1)))}
        ${block("primitives_cone", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("ANGLE", shadowFloat(45)), value("HEIGHT", shadowFloat(1)))}
        ${block("primitives_infinite_cone", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("ANGLE", shadowFloat(45)))}
        ${block("primitives_plane", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("NORMAL", shadowVector3(0, 1, 0)), value("HEIGHT", shadowFloat(0)))}
        ${block("primitives_hexagonal_prism", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("EXTENT", shadowVector2(1, 1)))}
        ${block("primitives_capsule", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(0, -1, 0)), value("POINT_B", shadowVector3(0, 1, 0)), value("RADIUS", shadowFloat(0.5)))}
        ${block("primitives_vertical_capsule", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("HEIGHT", shadowFloat(1)), value("RADIUS", shadowFloat(0.5)))}
        ${block("primitives_vertical_capped_cylinder", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("HEIGHT", shadowFloat(1)), value("RADIUS", shadowFloat(0.5)))}
        ${block("primitives_arbitrary_capped_cylinder", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(0, -1, 0)), value("POINT_B", shadowVector3(0, 1, 0)), value("RADIUS", shadowFloat(0.5)))}
        ${block("primitives_rounded_cylinder", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADIUS", shadowFloat(0.5)), value("CORNER_RADIUS", shadowFloat(0.1)), value("HEIGHT", shadowFloat(1)))}
        ${block("primitives_simple_capped_cone", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("HEIGHT", shadowFloat(1)), value("RADIUS1", shadowFloat(0.5)), value("RADIUS2", shadowFloat(0.2)))}
        ${block("primitives_capped_cone", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(0,-1,0)), value("POINT_B", shadowVector3(0,1,0)), value("RADIUS1", shadowFloat(0.5)), value("RADIUS2", shadowFloat(0.2)))}
        ${block("primitives_solid_angle", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("ANGLE", shadowFloat(45)), value("RADIUS", shadowFloat(1)))}
        ${block("primitives_cut_sphere", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADIUS", shadowFloat(1)), value("CUT_HEIGHT", shadowFloat(0)))}
        ${block("primitives_cut_hollow_sphere", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADIUS", shadowFloat(1)), value("CUT_HEIGHT", shadowFloat(0)), value("THICKNESS", shadowFloat(0.1)))}
        ${block("primitives_pitted_sphere", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADIUS", shadowFloat(1)), value("PIT_RADIUS", shadowFloat(0.5)), value("PIT_DEPTH", shadowFloat(0.1)))}
        ${block("primitives_simple_round_cone", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("HEIGHT", shadowFloat(1)), value("RADIUS1", shadowFloat(0.5)), value("RADIUS2", shadowFloat(0.2)))}
        ${block("primitives_round_cone", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(0,-1,0)), value("POINT_B", shadowVector3(0,1,0)), value("RADIUS1", shadowFloat(0.5)), value("RADIUS2", shadowFloat(0.2)))}
        ${block("primitives_vesica_segment", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(0,-1,0)), value("POINT_B", shadowVector3(0,1,0)), value("WIDTH", shadowFloat(0.5)))}
        ${block("primitives_rhombus", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("LA", shadowFloat(1)), value("LB", shadowFloat(1)), value("HEIGHT", shadowFloat(0.1)), value("RADIUS", shadowFloat(0.01)))}
        ${block("primitives_octahedron", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("SIZE", shadowFloat(1)))}
        ${block("primitives_pyramid", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("HEIGHT", shadowFloat(1)))}
        ${block("primitives_triangle", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(0,1,0)), value("POINT_B", shadowVector3(-1,-1,0)), value("POINT_C", shadowVector3(1,-1,0)))}
        ${block("primitives_quad", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("POINT_A", shadowVector3(-1,1,0)), value("POINT_B", shadowVector3(1,1,0)), value("POINT_C", shadowVector3(1,-1,0)), value("POINT_D", shadowVector3(-1,-1,0)))}
        ${block("primitives_ellipsoid", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("RADII", shadowVector3(1, 0.5, 0.5)))}
        ${block("primitives_triangular_prism", value("SURFACE", shadow("values_surface")), value("POSITION", shadow("values_position")), value("EXTENT", shadowVector2(1, 1)))}
    </category>

    <category name="Combiners" colour="${c.combiners_blocks.colourPrimary}">
        ${block("combiners_union", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")))}
        ${block("combiners_smooth_union", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")), value("AMOUNT", shadowFloat(2)))}
        ${block("combiners_subtract", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")))}
        ${block("combiners_smooth_subtract", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")), value("AMOUNT", shadowFloat(2)))}
        ${block("combiners_intersect", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")))}
        ${block("combiners_smooth_intersect", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")), value("AMOUNT", shadowFloat(2)))}
        ${block("combiners_paint", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")))}
        ${block("combiners_smooth_paint", value("A", shadow("values_sdf")), value("B", shadow("values_sdf")), value("AMOUNT", shadowFloat(2)))}
    </category>

    <category name="Transforms" colour="${c.transforms_blocks.colourPrimary}">
        ${block("transforms_current_position")}
        ${block("transforms_set", value("VECTOR", shadow("values_position")))}
        ${sep(50)}
        ${block("transforms_translate", value("BY", shadowVector3()), value("POSITION", shadow("values_position")))}
        ${block("transforms_rotate_around_axis", value("AXIS", shadowVector3(0,1,0)), value("ANGLE", shadowFloat(45)), value("POSITION", shadow("values_position")))}
        ${block("transforms_mirror")}
        ${block("transforms_repeat")}
        ${block("transforms_twist")}
        ${block("transforms_bend")}
    </category>

    <category name="Color" colour="${c.color_blocks.colourPrimary}">
        ${block("color_color")}
        ${block("color_r_g_b", value("R", shadowUnitFloat(1)), value("G", shadowUnitFloat(0)), value("B", shadowUnitFloat(0)))}
        ${block("color_h_s_v", value("H", shadowUnitFloat(0)), value("S", shadowUnitFloat(1)), value("V", shadowUnitFloat(1)))}
        ${block("color_hex")}
    </category>

    <category name="Vectors" colour="${c.vectors_blocks.colourPrimary}">
        ${block("vectors_vector2", value("X", shadowFloat(0)), value("Y", shadowFloat(0)))}
        ${block("vectors_vector3", value("X", shadowFloat(0)), value("Y", shadowFloat(0)), value("Z", shadowFloat(0)))}
        ${block("vectors_vector4", value("X", shadowFloat(0)), value("Y", shadowFloat(0)), value("Z", shadowFloat(0)), value("W", shadowFloat(0)))}
        ${sep(50)}
        ${block("vectors_x_of", value("VECTOR", shadowVector2()))}
        ${block("vectors_y_of", value("VECTOR", shadowVector2()))}
        ${block("vectors_z_of", value("VECTOR", shadowVector3()))}
        ${block("vectors_w_of", value("VECTOR", shadowVector4()))}
        ${sep(50)}
        ${block("vectors_vector2_z")}
        ${block("vectors_vector3_w")}
        ${sep(50)}
        ${block("vectors_components2")}
        ${block("vectors_components3")}
        ${block("vectors_components4")}
        ${sep(50)}
        ${block("vectors_length_of")}
    </category>

    <category name="Control" colour="${c.control_blocks.colourPrimary}">
        ${block("control_if", value("CONDITION", shadowBoolean()))}
        ${block("control_if_else", value("CONDITION", shadowBoolean()))}
        ${sep(50)}
        ${block("control_repeat", value("TIMES", shadowPositiveInteger(0)))}
        ${block("control_while", value("CONDITION", shadowBoolean()))}
        ${block("control_do_while", value("CONDITION", shadowBoolean()))}
        ${block("control_loop_index")}
        ${sep(50)}
        ${block("control_continue")}
        ${block("control_break")}
        ${block("control_discard")}
    </category>

    <category name="Operators" colour="${c.operators_blocks.colourPrimary}">
        ${block("operators_add", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_subtract", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_multiply", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_divide", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_power", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_modulus", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${sep(50)}
        ${block("operators_rounding", value("NUMBER", shadowFloat(0)))}
        ${block("operators_trig", value("NUMBER", shadowFloat(0)))}
        ${block("operators_unary", value("NUMBER", shadowFloat(0)))}
        ${sep(50)}
        ${block("operators_mix", value("A", shadowFloat(0)), value("B", shadowFloat(0)), value("BY", shadowFloat(0)))}
        ${sep(50)}
        ${block("operators_bounds", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_clamp", value("NUMBER", shadowFloat(0)), value("MIN", shadowFloat(0)), value("MAX", shadowFloat(0)))}
        ${sep(50)}
        ${block("operators_true")}
        ${block("operators_false")}
        ${sep(50)}
        ${block("operators_equals", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_not_equals", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_less_than", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_less_than_or_equal", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_greater_than", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${block("operators_greater_than_or_equal", value("A", shadowFloat(0)), value("B", shadowFloat(0)))}
        ${sep(50)}
        ${block("operators_and", value("A", shadowBoolean()), value("B", shadowBoolean()))}
        ${block("operators_or", value("A", shadowBoolean()), value("B", shadowBoolean()))}
        ${block("operators_not", value("BOOLEAN", shadowBoolean()))}
        ${sep(50)}
        ${block("operators_tenary", value("CONDITION", shadowBoolean()), value("TRUE", shadowFloat(0)), value("FALSE", shadowFloat(0)))}
    </category>

    <category name="Sensing" colour="${c.sensing_blocks.colourPrimary}">
        ${block("sensing_timer")}
        ${sep(50)}
        ${block("sensing_camera_position")}
        ${block("sensing_camera_angle")}
        ${sep(50)}
        ${block("sensing_resolution")}
        ${sep(50)}
        ${block("sensing_fragment_coord")}
    </category>

    <category name="Labeling" colour="${c.labeling_blocks.colourPrimary}">
        ${block("labeling_label")}
    </category>

    <category name="Variables" colour="${c.variables_blocks.colourPrimary}" custom="VARIABLES">
    </category>

    <category name="Functions" colour="${c.functions_blocks.colourPrimary}" custom="FUNCTIONS">
    </category>
`;

export default toolbox;