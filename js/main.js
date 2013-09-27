var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();

var objects = [];

var ray;

var ball, count = 1;

var blocker = window.document.getElementById( 'blocker' );
var instructions = window.document.getElementById( 'instructions' );
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			controls.enabled = true;

			blocker.style.display = 'none';

		} else {

			controls.enabled = false;

			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';

			instructions.style.display = '';

		}

	}

	var pointerlockerror = function ( event ) {

		instructions.style.display = '';

	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function ( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();
				}

			}

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false );

} else {

	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var light1, light2, light3, light4, light5, light6, head, body, lhand, rhand, lleg, rleg;
var headmoveright = false, headmoveleft = false, llegmove = false, rlegmove = false;
var play = true;

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( "#251d32", -100, 1000 );
	
	var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );

	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	ray = new THREE.Raycaster();
	ray.ray.direction.set( 1, -1, 10 );

	//ball
	//var ballTexture = THREE.ImageUtils.loadTexture('img/ball2.png');
	var geometry = new THREE.SphereGeometry( 100, 40, 40 );
	var material = new THREE.MeshNormalMaterial( { map: texture, overdraw: true, transparent: true } );
	//var material = new THREE.MeshBasicMaterial( { color:"#e89899", wireframe: true } );
	 
	ball = new THREE.Mesh( geometry, material );
	ball.position.y += 300;
	ball.position.z -= 400;
	scene.add( ball );

	// ground
	var texture = THREE.ImageUtils.loadTexture( "img/shine.jpg" );
	texture.repeat.set( 20, 10 );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.format = THREE.RGBFormat;
	
	var groundMaterial = new THREE.MeshPhongMaterial( { color: "#123456", ambient: 0x444444, map: texture } );
	var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 800, 400, 2, 2 ), groundMaterial );
	mesh.position.y = -5;
	mesh.rotation.x = - Math.PI / 2;
	scene.add( mesh );
	
	var texturewall = THREE.ImageUtils.loadTexture( "img/people.png" );
	texture.repeat.set( 20, 10 );
	var wallMaterial = new THREE.MeshPhongMaterial( { map: texturewall } );
	var wall = new THREE.Mesh( new THREE.PlaneGeometry( 800, 2000, 2, 2 ), wallMaterial );
	wall.position.y = 300;
	wall.position.z = -500;
	wall.rotation.z = - Math.PI / 2;
	scene.add( wall );
	
	//lights
	var intensity = 100;
	var distance = 800;
	var c1 = 0xff0040, c2 = 0x0040ff, c3 = 0x80ff80, c4 = 0xffaa00, c5 = 0x00ffaa, c6 = 0xff1100;

    scene.add( new THREE.AmbientLight( 0x111111 ) );
    
	light1 = new THREE.SpotLight( c1, intensity, distance );
	light1.position.set( 150, 50, 50 );
	scene.add( light1 );

	light2 = new THREE.SpotLight( c2, intensity, distance );
	light2.position.set( 150, 150, 50 );
	scene.add( light2 );

	light3 = new THREE.SpotLight( c3, intensity, distance );
	light3.position.set( 50, 50, 50 );
	scene.add( light3 );

	light4 = new THREE.SpotLight( c4, intensity, distance );
	scene.add( light4 );

	light5 = new THREE.SpotLight( c5, intensity, distance );
	scene.add( light5 );

	light6 = new THREE.SpotLight( c6, intensity, distance );
	scene.add( light6 );
	
	var dlight = new THREE.DirectionalLight( 0xffffff, 0.1 );
	dlight.position.set( 0.5, -1, 0 ).normalize();
	scene.add( dlight );
	
	var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );

	var l1 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) );
	l1.position = light1.position;
	scene.add( l1 );

	var l2 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) );
	l2.position = light2.position;
	scene.add( l2 );

	var l3 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) );
	l3.position = light3.position;
	scene.add( l3 );

	var l4 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) );
	l4.position = light4.position;
	scene.add( l4 );

	var l5 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) );
	l5.position = light5.position;
	scene.add( l5 );

	var l6 = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) );
	l6.position = light6.position;
	scene.add( l6 );
	
	//head
	var headmaterials = [ new THREE.MeshLambertMaterial({ color: "#030303" }),//r
		new THREE.MeshLambertMaterial({ color: "#030303" }),//l
		new THREE.MeshLambertMaterial({ color: "#030303" }),//t
		new THREE.MeshLambertMaterial({ color: "#030303" }),//bm
		new THREE.MeshLambertMaterial({ map:THREE.ImageUtils.loadTexture( "img/head.png" )}),
		new THREE.MeshLambertMaterial({ color: "#030303" })//b
	];
	var headgeometry = new THREE.CubeGeometry(15,10,10);
	var headmaterial = new THREE.MeshFaceMaterial( headmaterials );
	head = new THREE.Mesh(headgeometry, headmaterial);
	//head.rotation.x -= 1;
	//head.rotation.y -= 1;
	head.position.y += 20;
	head.position.z -= 80;
	scene.add(head);
	
	//body
	var bodygeometry = new THREE.CylinderGeometry(4,4,10);
	var bodymaterial = new THREE.MeshLambertMaterial( { color: "#030303" } );
	body = new THREE.Mesh(bodygeometry, bodymaterial);
	//head.rotation.x -= 1;
	//head.rotation.y -= 1;
	body.position.y += 10;
	body.position.z -= 80;
	scene.add(body);
	
	//left arm
	var lhandgeometry = new THREE.CylinderGeometry(1,1,10);
	var lhandmaterial = new THREE.MeshLambertMaterial( { color: "#030303" } );
	lhand = new THREE.Mesh(lhandgeometry, lhandmaterial);
	lhand.rotation.z += 1;
	//head.rotation.y -= 1;
	lhand.position.x += 4;
	lhand.position.y += 12;
	lhand.position.z -= 80;
	scene.add(lhand);
	
	//right arm
	var rhandgeometry = new THREE.CylinderGeometry(1,1,10);
	var rhandmaterial = new THREE.MeshLambertMaterial( { color: "#030303" } );
	rhand = new THREE.Mesh(rhandgeometry, rhandmaterial);
	rhand.rotation.z += -1;
	//head.rotation.y -= 1;
	rhand.position.x += -5;
	rhand.position.y += 12;
	rhand.position.z -= 80;
	scene.add(rhand);
	
	//left leg
	var lleggeometry = new THREE.CylinderGeometry(1,1,5);
	var llegmaterial = new THREE.MeshLambertMaterial( { color: "#030303" } );
	lleg = new THREE.Mesh(lleggeometry, llegmaterial);
	lleg.rotation.z += 0;
	//head.rotation.y -= 1;
	lleg.position.x += 4;
	lleg.position.y += 3;
	lleg.position.z -= 80;
	scene.add(lleg);
	
	//right leg
	var rleggeometry = new THREE.CylinderGeometry(1,1,5);
	var rlegmaterial = new THREE.MeshLambertMaterial( { color: "#030303" } );
	rleg = new THREE.Mesh(rleggeometry, rlegmaterial);
	rleg.rotation.z += 0;
	//head.rotation.y -= 1;
	rleg.position.x += -4;
	rleg.position.y += 3;
	rleg.position.z -= 80;
	scene.add(rleg);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	window.document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'keydown', onMove, false );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );
	ball.rotation.y += 0.02;

	//lights
	var d = 150;
	var vtime = Date.now() * 0.0025;
	light1.position.x = Math.sin( vtime * 0.7 ) * d;
	light1.position.z = Math.cos( vtime * 0.3 ) * d;

	light2.position.x = Math.cos( vtime * 0.3 ) * d;
	light2.position.z = Math.sin( vtime * 0.7 ) * d;

	light3.position.x = Math.sin( vtime * 0.7 ) * d;
	light3.position.z = Math.sin( vtime * 0.5 ) * d;

	light4.position.x = Math.sin( vtime * 0.3 ) * d;
	light4.position.z = Math.sin( vtime * 0.5 ) * d;

	light5.position.x = Math.cos( vtime * 0.3 ) * d;
	light5.position.z = Math.sin( vtime * 0.5 ) * d;

	light6.position.x = Math.cos( vtime * 0.7 ) * d;
	light6.position.z = Math.cos( vtime * 0.5 ) * d;


	//boxer move
	var bd = 0.5;
	lhand.rotation.x += Math.sin( vtime * 0.7 ) * bd; 
	rhand.rotation.x += Math.sin( vtime * 0.7 ) * bd; 
	
	//control move
	if (headmoveleft && vtime % 100) {
		head.rotation.z += 0.2;
		// head.rotation.z -= 10;
		headmoveleft = false;
	} else if (headmoveright && vtime % 100) {
		head.rotation.z -= 0.2;
		// head.rotation.z -= 10;
		headmoveright = false;
	} else if (llegmove) {
		llegmove = false
	} else if (rlegmove) {
		rlegmove = false;
	}
	
	controls.update( Date.now() - time );

	renderer.render( scene, camera );

	time = Date.now();

}

function onMove(event) {
	switch ( event.keyCode ) {
		
		case 85: //u
			headmoveright = true;
			break;
		case 73: // i
			headmoveleft = true;
			break;
		case 79: // o
			llegmove = true;
			break;
		case 80: // p
			rlegmove = true;
			break;
		case 77: // m
			if (play) {
				document.getElementById("music").pause();
			} else {
				document.getElementById("music").play();
			}
			play = !play;
			break;
	}
}

