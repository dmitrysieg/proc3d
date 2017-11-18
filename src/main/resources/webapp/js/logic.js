define([
    'logic/animationcontroller',
    'logic/arrows',
    'logic/controls',
    'logic/intersectingplane',
    'logic/geometryprocessor',
    'logic/wiredcube'
], function(
    AnimationController,
    Arrows,
    Controls,
    IntersectingPlane,
    GeometryProcessor,
    WiredCube
) {
    return {
        AnimationController: AnimationController,
        Arrows: Arrows,
        Controls: Controls,
        IntersectingPlane: IntersectingPlane,
        GeometryProcessor: GeometryProcessor,
        WiredCube: WiredCube
    };
});