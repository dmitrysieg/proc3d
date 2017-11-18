define([
    'lib/three.min'
], function(THREE) {

    var IcosahedronGeometry = function(unitSize) {

        this.material = new THREE.LineBasicMaterial({linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true});

        this.one = unitSize;
        this.phi = 0.5 * unitSize * (1.0 + Math.sqrt(5.0));

        this.vertices = [
            // X golden rect
            new THREE.Vector3(0, -this.one, -this.phi), // 0
            new THREE.Vector3(0, -this.one, +this.phi), // 1
            new THREE.Vector3(0, +this.one, -this.phi), // 2
            new THREE.Vector3(0, +this.one, +this.phi), // 3

            // Z golden rect
            new THREE.Vector3(-this.one, -this.phi, 0), // 4
            new THREE.Vector3(-this.one, +this.phi, 0), // 5
            new THREE.Vector3(+this.one, -this.phi, 0), // 6
            new THREE.Vector3(+this.one, +this.phi, 0), // 7

            // Y golden rect
            new THREE.Vector3(-this.phi, 0, -this.one), // 8
            new THREE.Vector3(+this.phi, 0, -this.one), // 9
            new THREE.Vector3(-this.phi, 0, +this.one), // 10
            new THREE.Vector3(+this.phi, 0, +this.one), // 11
        ];

        /**
         * For each golden rectangle:
         * 1x edge for both short rect edges * 2 = 2x.
         * 4x edges for both long rect edges * 2 = 8x.
         * 10x * 3 rectangles = 30 edges.
         */
        this.segments = [
            // X golden rect
            // short (altering "one" side)
            [0, 2],
            [1, 3],
            // long (vertices where coord = one, connecting to another golden rect where this coord = phi)
            [2, 5],
            [2, 7],
            [3, 5],
            [3, 7],
            [0, 4],
            [0, 6],
            [1, 4],
            [1, 6],

            // Z golden rect
            // short
            [4, 6],
            [5, 7],
            // long
            [4, 8],
            [4, 10],
            [5, 8],
            [5, 10],
            [6, 9],
            [6, 11],
            [7, 9],
            [7, 11],

            // Y golden rect
            // short
            [8, 10],
            [9, 11],
            // long
            [8, 0],
            [8, 2],
            [9, 0],
            [9, 2],
            [10, 1],
            [10, 3],
            [11, 1],
            [11, 3]
        ];

        this.geometry = new THREE.Geometry();
        for (var i = 0; i < this.segments.length; i++) {
            var vertex0 = this.vertices[this.segments[i][0]];
            var vertex1 = this.vertices[this.segments[i][1]];
            this.geometry.vertices.push(vertex0, vertex1);
        }

        this.mesh = new THREE.LineSegments(this.geometry, this.material);
        return this;
    };

    IcosahedronGeometry.prototype = {
        getMesh: function() {
            return this.mesh;
        }
    };

    return IcosahedronGeometry;
});