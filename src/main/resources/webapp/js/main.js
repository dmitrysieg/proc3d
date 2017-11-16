/**
 * Visualizing intersection of a cube with a diagonal moving plane.
 * Plane specifics:
 * * Normal: [sqrt(3) / 3; sqrt(3) / 3; sqrt(3) / 3] ^ T.
 * * Inline point: [l; l; l] ^ T.
 *
 * The problem is to find intersections between the plane and the cube's edges.
 *
 */

requirejs.config({
    baseUrl: 'js'
});

require([
    'lib/three.min',
    'lib/OrbitControls',
    'logic'
], function(THREE, OrbitControls, Logic) {

    var scene, camera, renderer;

    var font;

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

        var cube = new Logic.WiredCube(0, 0, 0, 1, 1, 1);
        scene.add(cube.getMesh());

        //scene.add(createArrows());

        var intersectingPlane = new Logic.IntersectingPlane(
            // initial position
            new THREE.Vector3(0.5, 0.5, 0.5),
            // initial normal
            new THREE.Vector3(1.0, 1.0, 1.0).normalize()
        );
        scene.add(intersectingPlane.getMesh());

        cube.getMesh().geometry.computeBoundingBox();
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.center = cube.getMesh().geometry.boundingBox.getCenter().clone().add(cube.getMesh().position);
        controls.userPanSpeed = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        var arrows = new Logic.Arrows();
        scene.add(arrows.getMesh());

        animationController = new Logic.AnimationController(new THREE.Clock(), scene, cube, intersectingPlane, arrows);
    }

    function animate() {
        requestAnimationFrame(animate);

        animationController.animate();

        renderer.render(scene, camera);
        controls.update();
    }
});

