define([
    'logic/animationcontroller',
    'logic/arrows',
    'logic/controls',
    'logic/intersectingplane',
    'logic/geometryprocessor',
    'logic/wiredcube',
    'logic/icosahedron'
], function(
    AnimationController,
    Arrows,
    Controls,
    IntersectingPlane,
    GeometryProcessor,
    WiredCube,
    Icosahedron
) {
    return {
        AnimationController: AnimationController,
        Arrows: Arrows,
        Controls: Controls,
        IntersectingPlane: IntersectingPlane,
        GeometryProcessor: GeometryProcessor,
        WiredCube: WiredCube,
        Icosahedron: Icosahedron
    };
});