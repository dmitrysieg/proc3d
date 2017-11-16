define([
    'lib/three.min'
], function(THREE) {

    var AnimationController = function(clock, scene, cube, intersectingPlane, arrows) {
        this.clock = clock;
        this.scene = scene;
        this.cube = cube;
        this.intersectingPlane = intersectingPlane;
        this.arrows = arrows;
        this.a1 = new THREE.Vector3(1, 0, 0);
        this.a2 = new THREE.Vector3(0, 1, 0);
        this.a3 = new THREE.Vector3(0, 0, 1);
    };

    AnimationController.prototype = {
        isShowArrows: false,
        isShowPlane: false,
        speed: 0.2,
        direction: 1,
        intersectionCut: null,
        tricky: true,
        animate: function() {

            var delta = this.clock.getDelta();
            var dx = delta * this.speed * this.direction;

            var position = this.intersectingPlane.getPosition();
            position.addScalar(dx);
            if (position.x > 1.0 - 0.05) {
                position.setScalar(1.0 - 0.05);
                this.direction = -this.direction;
            } else if (position.x < 0.0 + 0.05) {
                position.setScalar(0.0 + 0.05);
                this.direction = -this.direction;
            }
            // TODO: process a case with no intersection correctly

            this.intersectingPlane.setPosition(position);

            if (this.intersectionCut) {
                this.scene.remove(this.intersectionCut);
            }

            if (this.tricky) {
                this.intersectingPlane.normal.applyAxisAngle(this.a1, 0.005);
                this.intersectingPlane.normal.applyAxisAngle(this.a2, 0.005);
                this.intersectingPlane.normal.applyAxisAngle(this.a2, 0.005);
            }

            if (this.isShowArrows) {
                var axer = this.intersectingPlane.getAxer(this.arrows.axis1);
                this.arrows.rotate(axer);
                this.arrows.move(this.intersectingPlane.position);
            }

            this.intersectionCut = this.cube.findIntersections(this.intersectingPlane);
            this.scene.add(this.intersectionCut);
        },
        setShowArrows: function(value) {
            this.isShowArrows = value;
            this.arrows.getMesh().visible = value;
        },
        setShowPlane: function(value) {
            this.isShowPlane = value;
            // todo drive plane visibility
        }
    };

    return AnimationController;
});