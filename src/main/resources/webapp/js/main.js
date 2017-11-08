var scene, camera, renderer;

var darkLineMaterial = new THREE.LineBasicMaterial({linewidth: 10, color: 0x333333, transparent: true});
var lightLineMaterial = new THREE.LineBasicMaterial({linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true});

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

var WiredCube = function(x1, y1, z1, x2, y2, z2) {

    this.material = lightLineMaterial;

    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(
        new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y1, z1),
        new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x2, y1, z2),
        new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x2, y2, z1),
        new THREE.Vector3(x1, y2, z2), new THREE.Vector3(x2, y2, z2),

        // altering y
        new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y2, z1),
        new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x1, y2, z2),
        new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y2, z1),
        new THREE.Vector3(x2, y1, z2), new THREE.Vector3(x2, y2, z2),

        // altering z
        new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y1, z2),
        new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x1, y2, z2),
        new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y1, z2),
        new THREE.Vector3(x2, y2, z1), new THREE.Vector3(x2, y2, z2),
    );

    this.line = new THREE.LineSegments(this.geometry, this.material);
    return this.line;
};

var IntersectingPlane = function() {

    var material = new THREE.MeshPhongMaterial({
        color: 0x33EE33,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });

    var shape = new THREE.Shape();
    shape.moveTo(-1, -1);
    shape.lineTo(-1, 1);
    shape.lineTo(1, 1);
    shape.lineTo(1, -1);
    shape.lineTo(-1, -1);

    var geometry = new THREE.ShapeBufferGeometry(shape);

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0.5, 0.5, 0.5);

    // Initial normal of the Intersecting plane
    var v1 = new THREE.Vector3(0.0, 0.0, 1.0);
    var q = new THREE.Quaternion();
    // New normal should be na
    q.setFromUnitVectors(v1, na);

    // Rotating from [0, 0, 1] to na
    mesh.applyQuaternion(q);
    return mesh;
};

var IntersectionCut = function() {

    var material = new THREE.MeshPhongMaterial({
        color: 0xEE33EE,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });

    // vertices
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0.5, 0.0, 1.0));
    geometry.vertices.push(new THREE.Vector3(0.0, 0.5, 1.0));
    geometry.vertices.push(new THREE.Vector3(0.0, 1.0, 0.5));
    geometry.vertices.push(new THREE.Vector3(0.5, 1.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(1.0, 0.5, 0.0));
    geometry.vertices.push(new THREE.Vector3(1.0, 0.0, 0.5));

    // faces
    geometry.faces.push(new THREE.Face3(0, 1, 2, na.clone()));
    geometry.faces.push(new THREE.Face3(0, 2, 3, na.clone()));
    geometry.faces.push(new THREE.Face3(0, 3, 4, na.clone()));
    geometry.faces.push(new THREE.Face3(0, 4, 5, na.clone()));

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

init();
animate();

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

    scene.add(new WiredCube(0, 0, 0, 1, 1, 1));
    scene.add(createArrows());
    scene.add(new IntersectingPlane());
    scene.add(new IntersectionCut());

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.center = new THREE.Vector3(0.5, 0.5, 0.5);
    controls.userPanSpeed = 0.05;
}


function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
}