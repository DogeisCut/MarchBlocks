export enum BlockTypes {
    None = '',
    Number = "Number",
    Vector2 = "Vector2",
    Vector3 = "Vector3",
    Vector4 = "Vector4",
    Color = "Color",
    Boolean = "Boolean",
    Surface = "Surface",
    SDF = "SDF"
}

export const shadowMap: Record<BlockTypes, string | null> = {
    [BlockTypes.None]: null,
    [BlockTypes.Number]: "values_float",
    [BlockTypes.Vector2]: "values_vector2",
    [BlockTypes.Vector3]: "values_vector3",
    [BlockTypes.Vector4]: "values_vector4",
    [BlockTypes.Color]: "values_color",
    [BlockTypes.Boolean]: "values_boolean",
    [BlockTypes.Surface]: "values_surface",
    [BlockTypes.SDF]: "values_sdf"
}

export const trueTypeMap: Record<BlockTypes, string | string[]> = {
    [BlockTypes.None]: [],
    [BlockTypes.Number]: "Number",
    [BlockTypes.Vector2]: "Vector2",
    [BlockTypes.Vector3]: "Vector3",
    [BlockTypes.Vector4]: "Vector4",
    [BlockTypes.Color]: "Vector3",
    [BlockTypes.Boolean]: "Boolean",
    [BlockTypes.Surface]: "Surface",
    [BlockTypes.SDF]: "SDF"
}

export function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}