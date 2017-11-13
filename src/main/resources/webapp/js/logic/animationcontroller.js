var AnimationController = function(scene, cube, intersectingPlane) {
    this.scene = scene;
    this.cube = cube;
    this.intersectingPlane = intersectingPlane;
    this.a1 = new THREE.Vector3(1, 0, 0);
    this.a2 = new THREE.Vector3(0, 1, 0);
    this.a3 = new THREE.Vector3(0, 0, 1);
};

AnimationController.prototype = {
    speed: 0.2,
    direction: 1,
    intersectionCut: null,
    tricky: true,
    animate: function() {

        var delta = clock.getDelta();
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
        if (this.arrows) {
            this.scene.remove(this.arrows);
        }
        this.arrows = createArrows(this.intersectingPlane);
        this.scene.add(this.arrows);
        // TODO: visual bug! fix arrows generation

        if (this.tricky) {
            this.intersectingPlane.normal.applyAxisAngle(this.a1, 0.005);
            this.intersectingPlane.normal.applyAxisAngle(this.a2, 0.005);
            this.intersectingPlane.normal.applyAxisAngle(this.a2, 0.005);
        }

        this.intersectionCut = this.cube.findIntersections(this.intersectingPlane);
        this.scene.add(this.intersectionCut);
    }
};