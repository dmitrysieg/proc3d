define([
    'lib/three.min'
], function(THREE) {

    var IntersectingPlane = function(position, normal) {

        var material = new THREE.MeshPhongMaterial({
            color: 0x33EE33,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });

        // center at (0, 0)
        var shape = new THREE.Shape();
        shape.moveTo(-1, -1);
        shape.lineTo(-1, 1);
        shape.lineTo(1, 1);
        shape.lineTo(1, -1);
        shape.lineTo(-1, -1);

        var geometry = new THREE.ShapeBufferGeometry(shape);

        this.position = position.clone();
        this.normal = normal.clone();
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);

        // Rotating from [0, 0, 1] to the initial normal
        var v1 = new THREE.Vector3(0.0, 0.0, 1.0);
        var q = new THREE.Quaternion();
        q.setFromUnitVectors(v1, this.normal);
        this.mesh.applyQuaternion(q);

        this.mesh.visible = false;
        return this;
    };

    IntersectingPlane.prototype = {
        a1: new THREE.Vector3(1, 0, 0),
        a2: new THREE.Vector3(0, 1, 0),
        /**
         * Return a quaternion converting from the plane relative to the global.
         */
        getAxer: function(source) {
            var axer = new THREE.Quaternion();
            axer.setFromUnitVectors(source, this.getNormal());
            return axer;
        },
        getMesh: function() {
            return this.mesh;
        },
        getNormal: function() {
            return this.normal;
        },
        /**
         * Return a quaternion converting from the global to the plane relative.
         */
        getPlanifier: function() {
            var planifier = new THREE.Quaternion();
            planifier.setFromUnitVectors(this.getNormal(), new THREE.Vector3(0.0, 0.0, 1.0));
            return planifier;
        },
        getPosition: function() {
            return this.position;
        },
        rotate: function(angle) {
            var oldNormal = this.normal.clone();

            this.normal.applyAxisAngle(this.a1, angle);
            this.normal.applyAxisAngle(this.a2, angle);

            var q = new THREE.Quaternion();
            q.setFromUnitVectors(oldNormal, this.normal);
            this.getMesh().applyQuaternion(q);
        },
        setPosition: function(position) {
            this.position = position;
            this.getMesh().position.copy(position);
        }
    };

    return IntersectingPlane;
});