var scene, camera, renderer, cube, intersectingPlane;

var darkLineMaterial = new THREE.LineBasicMaterial({linewidth: 10, color: 0x333333, transparent: true});
var lightLineMaterial = new THREE.LineBasicMaterial({linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true});

var font;
var clock = new THREE.Clock();

var speed = 0.2;
var direction = 1;

var intersectionCut = null;

/**
 * Visualizing intersection of a cube with a diagonal moving plane.
 * Plane specifics:
 * * Normal: [sqrt(3) / 3; sqrt(3) / 3; sqrt(3) / 3] ^ T.
 * * Inline point: [l; l; l] ^ T.
 *
 * The problem is to find intersections between the plane and the cube's edges.
 *
 */

/**
 * Vector3 pointing to the center of the cube.
 */
var center = new THREE.Vector3(0.5, 0.5, 0.5);

/**
 * Main Intersection plane normal.
 */
var na = new THREE.Vector3(1.0, 1.0, 1.0).normalize();

/**
 * 3rd basis vector orthogonal to na and nb, derived by their cross product.
 */
var nb = new THREE.Vector3(-Math.sqrt(6.0) / 6.0, Math.sqrt(6.0) / 3.0, -Math.sqrt(6.0) / 6.0);

/**
 * 2nd basis vector orthogonal to na and looking to the right (y=0).
 */
var nc = new THREE.Vector3(-Math.sqrt(2.0) / 2.0, 0.0, Math.sqrt(2.0) / 2.0);

var createArrows = function () {

    var dir1 = na.clone();
    var dir2 = nb.clone();
    var dir3 = nc.clone();

    var arrow1 = new THREE.ArrowHelper(
        dir1,
        new THREE.Vector3(0.5, 0.5, 0.5),
        1,
        0xFF0000
    );

    var arrow2 = new THREE.ArrowHelper(
        dir2,
        new THREE.Vector3(0.5, 0.5, 0.5),
        1,
        0xFFF000
    );

    var arrow3 = new THREE.ArrowHelper(
        dir3,
        new THREE.Vector3(0.5, 0.5, 0.5),
        1,
        0xFFFF00
    );

    var group = new THREE.Group();
    group.add(arrow1);
    group.add(arrow2);
    group.add(arrow3);

    return group;
};

/**
 * Consume a set of randomly located points.
 * Transform them into fan-triangulated shape mesh.
 */
var PointProcessor = function() {};

PointProcessor.prototype = {

    /**
     * Material used for drawing the cut mesh itself.
     */
    cutMaterial: new THREE.MeshPhongMaterial({
        color: 0xEE33EE,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    }),

    /**
     * Material used for drawing labels for the cut mesh points.
     */
    cutLabelMaterial: new THREE.MeshBasicMaterial({
        color: 0xEE33EE,
        wireframe: true
    }),

    /**
     * Create a cut mesh point label, based on data used while drawing cut mesh.
     * @param points Array of the cut shape points.
     * @param angles Array of calculated angles of the cut shape points relatively to the cut plane.
     * @param i Current point index in the drawing cycle.
     */
    createCutLabel: function(points, angles, i) {
        var label = new THREE.Mesh(
            new THREE.TextGeometry(i + ',' + angles[i], {font: font, size: 0.05, height: 0.01, curveSegments: 2}),
            this.cutLabelMaterial
        );
        label.geometry.computeBoundingBox();

        var offset = points[i].clone().add(new THREE.Vector3(
            -0.5 * (label.geometry.boundingBox.max.x - label.geometry.boundingBox.min.x),
            -0.5 * (label.geometry.boundingBox.max.y - label.geometry.boundingBox.min.y),
            -0.5 * (label.geometry.boundingBox.max.z - label.geometry.boundingBox.min.z)
        ));

        label.position.copy(offset);
        return label;
    },

    /**
     * Flag to draw or not to draw cut points labels.
     */
    isDrawCutLabels: false,

    /**
     * @param points Non-empty array of Vector3.
     * Contract: points order is not guaranteed, so the method should perform sorting of them.
     */
    processPoints: function(plane, points) {

        var angles = this.sortPoints(plane, points)

        var group = new THREE.Group();

        var geometry = new THREE.Geometry();
        for (var i = 0; i < points.length; i++) {
            geometry.vertices.push(points[i]);
            if (this.isDrawCutLabels) {
                group.add(this.createCutLabel(points, angles, i));
            }
        }
        for (var i = 0; i < points.length - 2; i++) {
            geometry.faces.push(new THREE.Face3(0, 1 + i, 2 + i, na.clone()));
        }

        var mesh = new THREE.Mesh(geometry, this.cutMaterial);
        group.add(mesh);
        return group;
    },
    /**
     * Sort points in the order going by round around a particular point (@center).
     */
    sortPoints: function(plane, points) {
        var angles = [];

        var planifier = new THREE.Quaternion();
        planifier.setFromUnitVectors(na, new THREE.Vector3(0.0, 0.0, 1.0));

        // calculating polar angles
        for (var i = 0; i < points.length; i++) {

            // projection of the point to the plane, resulting to have redundant z coordinate
            var rel = points[i].clone().sub(plane.position);
            rel.applyQuaternion(planifier);

            // TODO! handle division by zero case
            var angle = Math.atan(rel.y / rel.x);
            // js Math.atan supports only [-pi/2; pi/2] values
            if (rel.x <= 0) {
                angle += Math.PI;
            }
            angles.push(angle);
        }

        // Bubble!
        for (var j = 1; j <= points.length - 1; j++) {
            var order = true;
            for (var i = 0; i <= points.length - j; i++) {
                if (angles[i] > angles[i+1]) {
                    // swapping angles & points
                    var tmp = angles[i];
                    angles[i] = angles[i+1];
                    angles[i+1] = tmp;

                    tmp = points[i];
                    points[i] = points[i+1];
                    points[i+1] = tmp;

                    order = false;
                }
            }
            if (order) {
                break;
            }
        }
        // for debug purposes
        return angles;
    }
};

var WiredCube = function(x1, y1, z1, x2, y2, z2) {

    this.material = lightLineMaterial;

    this.segments = [
        // altering x
        [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y1, z1)],
        [new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x2, y1, z2)],
        [new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x2, y2, z1)],
        [new THREE.Vector3(x1, y2, z2), new THREE.Vector3(x2, y2, z2)],

        // altering y
        [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y2, z1)],
        [new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x1, y2, z2)],
        [new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y2, z1)],
        [new THREE.Vector3(x2, y1, z2), new THREE.Vector3(x2, y2, z2)],

        // altering z
        [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y1, z2)],
        [new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x1, y2, z2)],
        [new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y1, z2)],
        [new THREE.Vector3(x2, y2, z1), new THREE.Vector3(x2, y2, z2)]
    ];

    this.geometry = new THREE.Geometry();
    for (var i = 0; i < this.segments.length; i++) {
        this.geometry.vertices.push(this.segments[i][0], this.segments[i][1]);
    }

    this.mesh = new THREE.LineSegments(this.geometry, this.material);
    return this;
};

WiredCube.prototype = {
    /**
     * Find intersection of a set of line segments with a given plane.
     * Return a mesh ready to be added to a scene.
     */
    findIntersections: function(plane) {

        var planePoint = plane.getPosition();

        var intersectionPoints = [];

        for (var i = 0; i < this.segments.length; i++) {

            var xa = this.segments[i][0].clone().sub(planePoint.clone());
            var projection0 = xa.dot(na.clone());

            var ya = this.segments[i][1].clone().sub(planePoint.clone());
            var projection1 = ya.dot(na.clone());

            // no intersection
            if (projection0 * projection1 > 0) {
                continue;
            }
            // TODO process extreme cases (points laying on the plane)
            var intersectionPoint = this.segments[i][0].clone().add(
                this.segments[i][1].clone().sub(this.segments[i][0].clone()).multiplyScalar(
                    Math.abs(projection0) / (Math.abs(projection0) + Math.abs(projection1))
                )
            );
            intersectionPoints.push(intersectionPoint);
        }

        if (intersectionPoints.length > 0) {
            return new PointProcessor().processPoints(plane, intersectionPoints);
        } else {
            return null;
        }
    },
    getMesh: function() {
        return this.mesh;
    }
};

var IntersectingPlane = function(position) {

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
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);

    // Initial normal of the Intersecting plane
    var v1 = new THREE.Vector3(0.0, 0.0, 1.0);
    var q = new THREE.Quaternion();
    // New normal should be na
    q.setFromUnitVectors(v1, na);

    // Rotating from [0, 0, 1] to na
    this.mesh.applyQuaternion(q);
    this.mesh.visible = false;
    return this;
};

IntersectingPlane.prototype = {
    getMesh: function() {
        return this.mesh;
    },
    getPosition: function() {
        return this.position;
    },
    setPosition: function(position) {
        this.position = position;
    }
};



var fontLoader = new THREE.FontLoader();
fontLoader.load(
    'js/fonts/helvetiker_regular.typeface.json',
    function(result) {
        font = result;
        init();
        animate();
    },
    function (xhr) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (xhr) {
        console.log( 'An error happened' );
    }
);

function init() {

    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias:true
    });
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
    camera.position.set(1.7, 2.2, 2.05);
    scene.add(camera);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    renderer.setClearColor(0xEEEEEE, 1);

    var light1 = new THREE.PointLight(0xffffff);
    light1.position.set(-100, 200, 100);
    scene.add(light1);

    var light2 = new THREE.PointLight(0xffffff);
    light2.position.set(100, -200, -100);
    scene.add(light2);

    cube = new WiredCube(0, 0, 0, 1, 1, 1);
    scene.add(cube.getMesh());

    //scene.add(createArrows());

    intersectingPlane = new IntersectingPlane(center.clone());
    scene.add(intersectingPlane.getMesh());

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.center = center.clone();
    controls.userPanSpeed = 0.05;
}

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    var dx = delta * speed * direction;
    center.addScalar(dx);
    if (center.x > 1.0 - 0.05) {
        center.setScalar(1.0 - 0.05);
        direction = -direction;
    } else if (center.x < 0.0 + 0.05) {
        center.setScalar(0.0 + 0.05);
        direction = -direction;
    }
    // TODO: process a case with no intersection correctly

    intersectingPlane.setPosition(center);

    if (intersectionCut) {
        scene.remove(intersectionCut);
    }
    intersectionCut = cube.findIntersections(intersectingPlane);
    scene.add(intersectionCut);

    renderer.render(scene, camera);
    controls.update();
}