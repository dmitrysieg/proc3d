define([
    'logic/animationcontroller',
    'logic/arrows',
    'logic/controls',
    'logic/intersectingplane',
    'logic/pointprocessor',
    'logic/wiredcube'
], function(
    AnimationController,
    Arrows,
    Controls,
    IntersectingPlane,
    PointProcessor,
    WiredCube
) {
    return {
        AnimationController: AnimationController,
        Arrows: Arrows,
        Controls: Controls,
        IntersectingPlane: IntersectingPlane,
        PointProcessor: PointProcessor,
        WiredCube: WiredCube
    };
});