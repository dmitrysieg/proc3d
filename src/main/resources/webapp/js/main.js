/**
 * Visualizing intersection of a convex geometry with a diagonal moving plane.
 * Plane specifics:
 * * Normal: [sqrt(3) / 3; sqrt(3) / 3; sqrt(3) / 3] ^ T.
 * * Inline point: [l; l; l] ^ T.
 *
 * The problem is to find intersections between the plane and the geometry's edges.
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
            initInterface();
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

    function initInterface() {
        var uiControlsEl = document.createElement("div");
        uiControlsEl.id = "div-info";
        document.body.appendChild(uiControlsEl);
        var graphEl = document.createElement("div");
        graphEl.id = "graph-el";
        document.body.appendChild(graphEl);
    }

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

        var geometry = new Logic.WiredCube(0, 0, 0, 1, 1, 1);
        //var geometry = new Logic.Icosahedron(1);
        scene.add(geometry.getMesh());

        var intersectingPlane = new Logic.IntersectingPlane(
            // initial position
            new THREE.Vector3(0.5, 0.5, 0.5),
            // initial normal
            new THREE.Vector3(1.0, 1.0, 1.0).normalize()
        );
        scene.add(intersectingPlane.getMesh());

        geometry.getMesh().geometry.computeBoundingBox();
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.center = geometry.getMesh().geometry.boundingBox.getCenter().clone().add(geometry.getMesh().position);
        controls.userPanSpeed = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        var arrows = new Logic.Arrows();
        arrows.getMesh().visible = false;
        scene.add(arrows.getMesh());

        animationController = new Logic.AnimationController(new THREE.Clock(), scene, geometry, intersectingPlane, arrows);
        var uiControls = new Logic.Controls.UIControls(animationController).append(document.getElementById("div-info"));
        var graphControl = new Logic.Controls.UIGraph().append(document.getElementById("graph-el"));
        animationController.graph = graphControl;
    }

    function animate() {
        requestAnimationFrame(animate);

        animationController.animate();

        renderer.render(scene, camera);
        controls.update();
    }
});

