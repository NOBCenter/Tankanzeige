(function () {
	if( typeof( Humble ) == 'undefined' ) window.Humble = {};
	Humble.Trig = {};
	Humble.Trig.init = init;

	var started = false;
	var pause = false;
	var re_init = false;
	var canvas, ctx, draw, grad, mid_point_x, mid_point_y, wave_size, wave_multiplier, tank_size, tank_filling;

	function init() {
		var can_init = true;
		try {
			var test = document.getElementById( 'divCanvas' ).clientWidth;
			test = document.getElementById( "filling" ).value;
		} catch( e ) {
			can_init = false;
		}

		if( !can_init ) {
			// wait for everything to be rendered so we can get the right size.
			console.log( "Water: waiting for renderer..." );
			setTimeout( init, 50 );
			return;
		}

		started = true;
		canvas = document.getElementById('sineCanvas');
		ctx = canvas.getContext('2d');
		canvas.width = document.getElementById( 'divCanvas' ).clientWidth;
		canvas.height = canvas.width;
		wave_size = parseInt( document.getElementById( "size" ).value );
		wave_multiplier = parseInt( document.getElementById( "length" ).value );
		tank_size = parseInt( document.getElementById( "tank" ).value );

		mid_point_x = canvas.width / 2;
		mid_point_y = canvas.height / 2;
		grad = ctx.createRadialGradient( mid_point_x, mid_point_y, mid_point_x, mid_point_x / 2 , mid_point_y / 2 , 1 );
		grad.addColorStop(0.0,'rgba(0,0,0,0.7)');
		grad.addColorStop(0.8,'rgba(0,0,0,0)');

		draw();
	}

	draw = function() {
		try {
			tank_filling = parseInt( document.getElementById( "filling" ).value );
			pause = false;
		} catch( e ) {
			//console.log( "Water: No filling!" );
			pause = true;
			re_init = true;
		}

		if( !pause && re_init ) {
			console.log( "Water: starting re-init!" );
			started = false;
			re_init = false;
			pause = false;
			setTimeout( init, 50 );
			return;
		} else {
			if( !pause ) {
				ctx.clearRect( 0, 0, canvas.width, canvas.height );
				ctx.fillStyle = 'white';
				ctx.fillRect( 0, 0, canvas.width, canvas.height );
				drawSine( draw.t );
				drawPercentage();
				drawOutline();

				draw.seconds = draw.seconds + Math.abs( Math.sin( draw.t ) * 0.1 ) + 0.07;
				draw.t = draw.seconds * Math.PI;
			}
			setTimeout( draw, 35 );
		}
	};
	draw.seconds = 0;
	draw.t = 0;

	function drawSine( t ) {
		try {
			tank_filling = parseInt( document.getElementById( "filling" ).value );
			pause = false;
		} catch (e) {
			pause = true;
		}
		if( pause ) {
			return;
		}

		if( isNaN( tank_filling ) ) {
			tank_filling = 42;
		}
		perc = Math.round( tank_filling / tank_size * 100 );


		ctx.beginPath();
		ctx.moveTo( 0, canvas.height );
		for( var i = 0; i <= canvas.width + 40; i += 40 ) {
  			var y = Math.sin( i / ( canvas.width / wave_multiplier ) + t ) * wave_size;
			var y_offset = Math.sin( i / ( canvas.width / 3 ) ) * 15;
			ctx.lineTo( i, y + canvas.height - canvas.height / 100 * perc - y_offset );
		}
		ctx.lineTo( canvas.width, canvas.height );
		ctx.lineTo( 0, canvas.height );
		ctx.closePath();
		ctx.fillStyle = "skyblue";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo( 0, canvas.height );
		for( var i = 0; i <= canvas.width + 40; i += 40 ) {
			var y = Math.sin( i / ( canvas.width / wave_multiplier ) - t * 1.1 ) * wave_size;
			var y_offset = Math.sin( i / ( canvas.width / 3 ) ) * 15;
			ctx.lineTo( i, y + canvas.height - canvas.height / 100 * perc + y_offset );
		}
		ctx.lineTo( canvas.width, canvas.height );
		ctx.lineTo( 0, canvas.height );
		ctx.closePath();
		ctx.fillStyle = "blue";
		ctx.fill();

		ctx.fillStyle = grad;
		ctx.lineWidth = 4;
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.arc( mid_point_x, mid_point_y, mid_point_x, 0 , 2*Math.PI, false );
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	function drawPercentage() {

		ctx.save();

		ctx.fillStyle = "#fff";
		ctx.font = '64px sans-serif';
		ctx.globalCompositeOperation = 'difference';
		ctx.fillText( tank_filling +" L", mid_point_x - 50, mid_point_y + 50 );

		ctx.restore();
	}

	function drawOutline() {
		var maskCanvas = document.createElement('canvas');
		maskCanvas.width = canvas.width;
		maskCanvas.height = canvas.height;
		var maskCtx = maskCanvas.getContext('2d');

		maskCtx.fillStyle = "#234";
		maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
		maskCtx.globalCompositeOperation = 'xor';
		maskCtx.arc( mid_point_x, mid_point_y, mid_point_x, 0, 2 * Math.PI);
		maskCtx.fill();

		ctx.drawImage(maskCanvas, 0, 0);

	}

	setInterval( function() {
		if( !started ) {
//			alert( "not started" );
			Humble.Trig.init();
		}
	}, 500 );
})();

