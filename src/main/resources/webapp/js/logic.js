define([
    'logic/animationcontroller',
    'logic/arrows',
    'logic/intersectingplane',
    'logic/pointprocessor',
    'logic/wiredcube'
], function(
    AnimationController,
    Arrows,
    IntersectingPlane,
    PointProcessor,
    WiredCube
) {
    return {
        AnimationController: AnimationController,
        Arrows: Arrows,
        IntersectingPlane: IntersectingPlane,
        PointProcessor: PointProcessor,
        WiredCube: WiredCube
    };
});