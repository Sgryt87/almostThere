/* function Wave() {
		// The current dimensions of the screen (updated on resize)
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		// Wave settings
		var DENSITY = .05; 				//.50
		var FRICTION = 1.05; // 1.07
		var MOUSE_PULL = 0.085; // 0.0085 The strength at which the mouse pulls particles within the AOE
		var AOE = 20; // 200 Area of effect for mouse pull
		var DETAIL = Math.round( WIDTH / 8 ); // 30 The number of particles used to build up the wave
		var WATER_DENSITY = 1; // 1.07
		var AIR_DENSITY = 1; // 10.2
		var TWITCH_INTERVAL = 300; // The interval between random impulses being inserted into the wave to keep it moving
		
		var ms = {x:0, y:0}; // Mouse speed
		var mp = {x:0, y:0}; // Mouse position
		
		var canvas, context, particles;
		
		var timeUpdateInterval, twitchInterval;

		this.Initialize = function( canvasID ) {
			canvas = document.getElementById( canvasID );
			
			if (canvas && canvas.getContext) {
				context = canvas.getContext('2d');
				particles = [];
			
				// Generate our wave particles
				for( var i = 0; i < DETAIL+1; i++ ) {
					particles.push( { 
						x: WIDTH / (DETAIL-4) * (i-2), // Pad by two particles on each side
						y: HEIGHT*.5,
						original: {x: 0, y: HEIGHT * .5},
						velocity: {x: .1, y: .1}, // Random for some initial movement in the wave
						force: {x: 0, y: 0},
						mass: 9.8 //change to 2 for sillyness 40 for serious thickness
					} );
				}
				$(canvas).mousemove(MouseMove);
				$(canvas).mousedown(MouseDown);
				$(canvas).mouseup(MouseUp);
				$(window).resize(ResizeCanvas);
				timeUpdateInterval = setInterval( TimeUpdate, 15); // basically framerate
				twitchInterval = setInterval( Twitch, TWITCH_INTERVAL );
				ResizeCanvas();
			}
		};

		function Twitch() {
			if( ms.x < 3 || ms.y < 3 ) {
				var forceRange = 5; // -value to +value
				InsertImpulse( Math.random() * WIDTH, (Math.random()*(forceRange*2)-forceRange ) );
			}
		}
		//Inserts an impulse in the wave at a specific position. @param positionX the x coordinate where the impulse should be inserted @param forceY the force to insert
		function InsertImpulse( positionX, forceY ) {
			var particle = particles[Math.round( positionX / WIDTH * particles.length )];
			if( particle ) {
				particle.force.y += forceY;
			}
		}

		function TimeUpdate(e) {
			var gradientFill = context.createLinearGradient(WIDTH*.5,HEIGHT*.2,WIDTH*.5,HEIGHT);
			// Use this to color the wave
			gradientFill.addColorStop(0,'#222222');
			gradientFill.addColorStop(1,'#111111');
			context.clearRect(0, 0, WIDTH, HEIGHT);
			context.fillStyle = gradientFill;
			context.beginPath();
			context.moveTo(particles[0].x, particles[0].y);
			
			var len = particles.length;
			var i;
			var current, previous, next;
			
			for( i = 0; i < len; i++ ) {
				current = particles[i];
				previous = particles[i-1];
				next = particles[i+1];
				if (previous && next) {
					var forceY = 0;
					forceY += -DENSITY * ( previous.y - current.y );
					forceY += DENSITY * ( current.y - next.y );
					forceY += DENSITY * ( current.y - current.original.y );
					current.velocity.y += - ( forceY / current.mass ) + current.force.y;
					current.velocity.y /= FRICTION;
					current.force.y /= FRICTION;
					current.y += current.velocity.y;
					
					var distance = DistanceBetween( mp, current );
					if( distance < AOE ) {
						var distance = DistanceBetween( mp, {x:current.original.x, y:current.original.y} );
						ms.x = ms.x * 1;
						ms.y = ms.y * 1;
						
						current.force.y += (MOUSE_PULL * ( 1 - (distance / AOE) )) * ms.y;
					}	
					// cx, cy, ax, ay
					context.quadraticCurveTo(previous.x, previous.y, previous.x + (current.x - previous.x) / 2, previous.y + (current.y - previous.y) / 2);
				}	
			}
			
			context.lineTo(particles[particles.length-1].x, particles[particles.length-1].y);
			context.lineTo(WIDTH, HEIGHT);
			context.lineTo(0, HEIGHT);
			context.lineTo(particles[0].x, particles[0].y);
			
			context.fill();
			
			len = length;
			
			context.fillStyle = "#rgba(0,200,255,0)";
			context.beginPath();
			
			context.fill();
		}
		
		function GetClosestParticle(point){
			var closestIndex = 0;
			var closestDistance = 1000;
			var len = particles.length;
			for( var i = 0; i < len; i++ ) {
				var thisDistance = DistanceBetween( particles[i], point );		
				if( thisDistance < closestDistance ) {
					closestDistance = thisDistance;
					closestIndex = i;
				}
			}
			
			return particles[closestIndex];
		}
		function MouseMove(e) {
			ms.x = Math.max( Math.min( e.layerX - mp.x, 40 ), -40 );
			ms.y = Math.max( Math.min( e.layerY - mp.y, 40 ), -40 );
			
			mp.x = e.layerX;
			mp.y = e.layerY;
		}
		function MouseDown(e) {
			mouseIsDown = true;
			
			var closestIndex = 0;
			var closestDistance = 100;
			
			for( var i = 0; i < len; i++ ) {
				var thisDistance = DistanceBetween( mp );
				if( thisDistance < closestDistance ) {
					closestDistance = thisDistance;
					closestIndex = i;
				}
			}
		}
		function MouseUp(e) {
			mouseIsDown = false;
		} 
		
		function ResizeCanvas(e) {
			WIDTH = window.innerWidth;
			HEIGHT = window.innerHeight;
			canvas.width = WIDTH;
			canvas.height = HEIGHT;
			
			for( var i = 0; i < DETAIL+1; i++ ) {
				particles[i].x = WIDTH / (DETAIL-4) * (i-2);
				particles[i].y = HEIGHT*.5;
				particles[i].original.x = particles[i].x;
				particles[i].original.y = particles[i].y;
			}
		}
	
		function DistanceBetween(p1,p2) {
			var dx = p2.x-p1.x;
			var dy = p2.y-p1.y;
			return Math.sqrt(dx*dx + dy*dy);
		}	
	}
	var wave = new Wave();
	wave.Initialize( 'world' );*/
	
	function RainyDay(e,t,n,r,i,s){this.canvasid=e;this.canvas=document.getElementById(e);this.sourceid=t;this.img=document.getElementById(t);this.prepareBackground(s?s:20,n,r);this.w=this.canvas.width;this.h=this.canvas.height;this.prepareGlass(i?i:1);if(!this.reflection){this.reflection=this.REFLECTION_MINIATURE}if(!this.trail){this.trail=this.TRAIL_DROPS}if(!this.gravity){this.gravity=this.GRAVITY_NONE}this.VARIABLE_GRAVITY_THRESHOLD=3;this.VARIABLE_GRAVITY_ANGLE=Math.PI/2;this.VARIABLE_FPS=25;this.VARIABLE_FILL_STYLE="#8ED6FF"}function Drop(e,t,n,r,i){this.x=Math.floor(t);this.y=Math.floor(n);this.r1=Math.random()*i+r;this.rainyday=e;var s=4;this.r2=.8*this.r1;this.linepoints=e.getLinepoints(s);this.context=e.context;this.reflection=e.reflected}function BlurStack(){this.r=0;this.g=0;this.b=0;this.a=0;this.next=null}RainyDay.prototype.prepareReflections=function(){this.reflected=document.createElement("canvas");this.reflected.width=this.canvas.width;this.reflected.height=this.canvas.height;var e=this.reflected.getContext("2d");e.translate(this.reflected.width/2,this.reflected.height/2);e.rotate(Math.PI);e.drawImage(this.img,-this.reflected.width/2,-this.reflected.height/2,this.reflected.width,this.reflected.height)};RainyDay.prototype.prepareGlass=function(e){this.glass=document.createElement("canvas");this.glass.width=this.canvas.width;this.glass.height=this.canvas.height;this.glass.style.position="absolute";this.glass.style.top=this.canvas.offsetTop;this.glass.style.left=this.canvas.offsetLeft;this.glass.style.zIndex=this.canvas.style.zIndex+100;this.canvas.parentNode.appendChild(this.glass);this.context=this.glass.getContext("2d");this.glass.style.opacity=e};RainyDay.prototype.preset=function(e,t,n){return{min:e,base:t,quan:n}};RainyDay.prototype.rain=function(e,t){if(this.reflection!=this.REFLECTION_NONE){this.prepareReflections()}if(t>0){this.presets=e;this.PRIVATE_GRAVITY_FORCE_FACTOR_Y=this.VARIABLE_FPS*.005/25;this.PRIVATE_GRAVITY_FORCE_FACTOR_X=(Math.PI/2-this.VARIABLE_GRAVITY_ANGLE)*this.VARIABLE_FPS*.005/50;setInterval(function(t){return function(){var n=Math.random();var r;for(var i=0;i<e.length;i++){if(n<e[i].quan){r=e[i];break}}if(r){t.putDrop(new Drop(t,Math.random()*t.w,Math.random()*t.h,r.min,r.base))}}}(this),t)}else{for(var n=0;n<e.length;n++){var r=e[n];for(var i=0;i<r.quan;++i){this.putDrop(new Drop(this,Math.random()*this.w,Math.random()*this.h,r.min,r.base))}}}};RainyDay.prototype.putDrop=function(e){e.draw();if(this.gravity&&e.r1>this.VARIABLE_GRAVITY_THRESHOLD){e.animate()}};RainyDay.prototype.getLinepoints=function(e){var t={};t.first={x:0,y:1};var n={x:1,y:1};var r=1;var i=1;var s;var o;var u,a,f;t.first.next=n;for(var l=0;l<e;l++){s=t.first;while(s.next!=null){o=s.next;u=o.x-s.x;a=.5*(s.x+o.x);f=.5*(s.y+o.y);f+=u*(Math.random()*2-1);var c={x:a,y:f};if(f<r){r=f}else if(f>i){i=f}c.next=o;s.next=c;s=o}}if(i!=r){var h=1/(i-r);s=t.first;while(s!=null){s.y=h*(s.y-r);s=s.next}}else{s=t.first;while(s!=null){s.y=1;s=s.next}}return t};Drop.prototype.draw=function(){var e=0;var t;var n,r;var i,s;this.context.save();this.context.beginPath();t=this.linepoints.first;r=e;n=this.r2+.5*Math.random()*(this.r2-this.r1);i=this.x+n*Math.cos(r);s=this.y+n*Math.sin(r);this.context.lineTo(i,s);while(t.next!=null){t=t.next;r=Math.PI*2*t.x+e;n=this.r2+.5*Math.random()*(this.r2-this.r1);i=this.x+n*Math.cos(r);s=this.y+n*Math.sin(r);this.context.lineTo(i,s)}this.context.clip();if(this.rainyday.reflection){this.rainyday.reflection(this)}this.context.restore()};Drop.prototype.clear=function(){if(this.y-this.r1>this.rainyday.h){clearInterval(this.intid);return true}if(this.x-this.r1>this.rainyday.w||this.x+this.r1<0){clearInterval(this.intid);return true}this.context.clearRect(this.x-this.r1-1,this.y-this.r1-1,2*this.r1+2,2*this.r1+2);return false};Drop.prototype.animate=function(){this.intid=setInterval(function(e){return function(){if(e.rainyday.gravity){var t=e.rainyday.gravity(e);if(!t&&e.rainyday.trail){e.rainyday.trail(e)}}}}(this),Math.floor(1e3/this.rainyday.VARIABLE_FPS))};RainyDay.prototype.TRAIL_NONE=function(e){};RainyDay.prototype.TRAIL_DROPS=function(e){if(!e.trail_y||e.y-e.trail_y>=Math.random()*10*e.r1){e.trail_y=e.y;this.putDrop(new Drop(this,e.x,e.y-e.r1-5,0,Math.ceil(e.r1/5)))}};RainyDay.prototype.GRAVITY_NONE=function(e){return true};RainyDay.prototype.GRAVITY_LINEAR=function(e){if(e.clear()){return true}if(e.yspeed){e.yspeed+=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y*Math.floor(e.r1);e.xspeed+=this.PRIVATE_GRAVITY_FORCE_FACTOR_X*Math.floor(e.r1)}else{e.yspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;e.xspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_X}e.y+=e.yspeed;e.draw();return false};RainyDay.prototype.GRAVITY_NON_LINEAR=function(e){if(e.clear()){return true}if(!e.seed||e.seed<0){e.seed=Math.floor(Math.random()*this.VARIABLE_FPS);e.skipping=e.skipping==false?true:false;e.slowing=true}e.seed--;if(e.yspeed){if(e.slowing){e.yspeed/=1.1;e.xspeed/=1.1;if(e.yspeed<this.PRIVATE_GRAVITY_FORCE_FACTOR_Y){e.slowing=false}}else if(e.skipping){e.yspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;e.xspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_X}else{e.yspeed+=10*this.PRIVATE_GRAVITY_FORCE_FACTOR_Y*Math.floor(e.r1);e.xspeed+=10*this.PRIVATE_GRAVITY_FORCE_FACTOR_X*Math.floor(e.r1)}}else{e.yspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_Y;e.xspeed=this.PRIVATE_GRAVITY_FORCE_FACTOR_X}e.y+=e.yspeed;e.x+=e.xspeed;e.draw();return false};RainyDay.prototype.REFLECTION_NONE=function(e){this.context.fillStyle=this.VARIABLE_FILL_STYLE;this.context.fill()};RainyDay.prototype.REFLECTION_MINIATURE=function(e){this.context.drawImage(this.reflected,e.x-e.r1,e.y-e.r1,e.r1*2,e.r1*2)};var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];var shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];RainyDay.prototype.prepareBackground=function(e,t,n){if(t&&n){this.canvas.style.width=t+"px";this.canvas.style.height=n+"px";this.canvas.width=t;this.canvas.height=n}else{t=this.canvas.width;n=this.canvas.height}var r=this.canvas.getContext("2d");r.clearRect(0,0,t,n);r.drawImage(this.img,0,0,t,n);if(isNaN(e)||e<1)return;this.stackBlurCanvasRGB(0,0,t,n,e)};RainyDay.prototype.stackBlurCanvasRGB=function(e,t,n,r,i){i|=0;var s=this.canvas.getContext("2d");var o=s.getImageData(e,t,n,r);var u=o.data;var a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k;var L=i+i+1;var A=n<<2;var O=n-1;var M=r-1;var _=i+1;var D=_*(_+1)/2;var P=new BlurStack;var H=P;for(l=1;l<L;l++){H=H.next=new BlurStack;if(l==_)var B=H}H.next=P;var j=null;var F=null;d=p=0;var I=mul_table[i];var q=shg_table[i];for(f=0;f<r;f++){E=S=x=v=m=g=0;y=_*(T=u[p]);b=_*(N=u[p+1]);w=_*(C=u[p+2]);v+=D*T;m+=D*N;g+=D*C;H=P;for(l=0;l<_;l++){H.r=T;H.g=N;H.b=C;H=H.next}for(l=1;l<_;l++){c=p+((O<l?O:l)<<2);v+=(H.r=T=u[c])*(k=_-l);m+=(H.g=N=u[c+1])*k;g+=(H.b=C=u[c+2])*k;E+=T;S+=N;x+=C;H=H.next}j=P;F=B;for(a=0;a<n;a++){u[p]=v*I>>q;u[p+1]=m*I>>q;u[p+2]=g*I>>q;v-=y;m-=b;g-=w;y-=j.r;b-=j.g;w-=j.b;c=d+((c=a+i+1)<O?c:O)<<2;E+=j.r=u[c];S+=j.g=u[c+1];x+=j.b=u[c+2];v+=E;m+=S;g+=x;j=j.next;y+=T=F.r;b+=N=F.g;w+=C=F.b;E-=T;S-=N;x-=C;F=F.next;p+=4}d+=n}for(a=0;a<n;a++){S=x=E=m=g=v=0;p=a<<2;y=_*(T=u[p]);b=_*(N=u[p+1]);w=_*(C=u[p+2]);v+=D*T;m+=D*N;g+=D*C;H=P;for(l=0;l<_;l++){H.r=T;H.g=N;H.b=C;H=H.next}h=n;for(l=1;l<=i;l++){p=h+a<<2;v+=(H.r=T=u[p])*(k=_-l);m+=(H.g=N=u[p+1])*k;g+=(H.b=C=u[p+2])*k;E+=T;S+=N;x+=C;H=H.next;if(l<M){h+=n}}p=a;j=P;F=B;for(f=0;f<r;f++){c=p<<2;u[c]=v*I>>q;u[c+1]=m*I>>q;u[c+2]=g*I>>q;v-=y;m-=b;g-=w;y-=j.r;b-=j.g;w-=j.b;c=a+((c=f+_)<M?c:M)*n<<2;v+=E+=j.r=u[c];m+=S+=j.g=u[c+1];g+=x+=j.b=u[c+2];j=j.next;y+=T=F.r;b+=N=F.g;w+=C=F.b;E-=T;S-=N;x-=C;F=F.next;p+=n}}s.putImageData(o,e,t)}