/* El objeto Juego sera el encargado del control de todo el resto de los Objetos
existentes.
Le dara ordenes al Dibujante para que dibuje entidades en la pantalla. Cargara
el mapa, chequeara colisiones entre los objetos y actualizara sus movimientos
y ataques. Gran parte de su implementacion esta hecha, pero hay espacios con el
texto COMPLETAR que deben completarse segun lo indique la consigna.

El objeto Juego contiene mucho codigo. Tomate tu tiempo para leerlo tranquilo
y entender que es lo que hace en cada una de sus partes. */

var Juego = {
  // Aca se configura el tamanio del canvas del juego
  anchoCanvas: 961,
  altoCanvas: 577,
  jugador: Jugador,
  vidasInicial: Jugador.vidas,
  // Indica si el jugador gano
  ganador: false,

  obstaculosCarretera: [
    /*Aca se van a agregar los obstaculos visibles. Tenemos una valla horizontal
    de ejemplo, pero podras agregar muchos mas. */
    //sprite,x,y,ancho,alto,potencia
    new Obstaculo('imagenes/valla_horizontal.png', 70, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 100, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 130, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 160, 270, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 70, 270, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 80, 210, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 70, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 70, 460, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 500, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 530, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 560, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 830, 430, 30, 30, 1),
    new Obstaculo('imagenes/valla_horizontal.png', 790, 120, 30, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 70, 300, 30, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 500, 460, 30, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 540, 230, 30, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 280, 80, 30, 30, 1),
    new Obstaculo('imagenes/bache.png', 360, 80, 30, 30, 2),
    new Obstaculo('imagenes/bache.png', 500, 120, 30, 30, 2),
    new Obstaculo('imagenes/bache.png', 830, 240, 30, 30, 2),
    new Obstaculo('imagenes/bache.png', 360, 460, 30, 30, 2),
    new Obstaculo('imagenes/auto_verde_abajo.png', 270, 400, 15, 30, 2),
    new Obstaculo('imagenes/auto_verde_abajo.png', 760, 160, 15, 30, 2),
    new Obstaculo('imagenes/auto_verde_derecha.png', 70, 70, 30, 15, 2),
    new Obstaculo('imagenes/auto_verde_derecha.png', 90, 90, 30, 15, 2),
    new Obstaculo('imagenes/auto_verde_derecha.png', 140, 110, 30, 15, 2),    
    new Obstaculo('imagenes/auto_verde_derecha.png', 540, 470, 30, 15, 2),
    new Obstaculo('imagenes/llama.png', 540, 470, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 70, 400, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 70, 90, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 140, 60, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 350, 240, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 300, 380, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 100, 470, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 760, 120, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 400, 470, 30, 29, 3),
    new Obstaculo('imagenes/llama.png', 840, 280, 30, 29, 3),
    new Obstaculo('imagenes/bandera.jpg', 760, 550, 126, 10, 0),
  ],
  /* Estos son los bordes con los que se puede chocar, por ejemplo, la vereda.
   Ya estan ubicados en sus lugares correspondientes. Ya aparecen en el mapa, ya
   que son invisibles. No tenes que preocuparte por ellos.*/
  bordes: [
    // // Bordes
    new Obstaculo('', 0, 5, 961, 18, 0),
    new Obstaculo('', 0, 559, 961, 18, 0),
    new Obstaculo('', 0, 5, 18, 572, 0),
    new Obstaculo('', 943, 5, 18, 572, 0),
    // Veredas
    new Obstaculo('', 18, 23, 51, 536, 2),
    new Obstaculo('', 69, 507, 690, 52, 2),
    new Obstaculo('', 587, 147, 173, 360, 2),
    new Obstaculo('', 346, 147, 241, 52, 2),
    new Obstaculo('', 196, 267, 263, 112, 2),
    new Obstaculo('', 196, 23, 83, 244, 2),
    new Obstaculo('', 279, 23, 664, 56, 2),
    new Obstaculo('', 887, 79, 56, 480, 2)
  ],
  // Los enemigos se agregaran en este arreglo.
  enemigos: [
    new ZombieCaminante('imagenes/zombie1.png',180,260,10,10,1,{desdeX: 120, hastaX: 180, desdeY: 220, hastaY: 260}),
    new ZombieCaminante('imagenes/zombie2.png',100,50,10,10,1,{desdeX: 100, hastaX: 120, desdeY: 50, hastaY: 70}),
    new ZombieCaminante('imagenes/zombie3.png',140,340,10,10,1,{desdeX: 140, hastaX: 200, desdeY: 340, hastaY: 370}),
    new ZombieCaminante('imagenes/zombie3.png',170,420,10,10,1,{desdeX: 170, hastaX: 260, desdeY: 420, hastaY: 460}),
    new ZombieCaminante('imagenes/zombie4.png',310,420,10,10,1,{desdeX: 310, hastaX: 320, desdeY: 420, hastaY: 470}),
    new ZombieCaminante('imagenes/zombie4.png',460,400,10,10,1,{desdeX: 460, hastaX: 540, desdeY: 400, hastaY: 410}),
    new ZombieCaminante('imagenes/zombie2.png',470,300,10,10,1,{desdeX: 470, hastaX: 550, desdeY: 300, hastaY: 310}),
    new ZombieCaminante('imagenes/zombie4.png',600,80,10,10,1,{desdeX: 600, hastaX: 610, desdeY: 80, hastaY: 140}),
    new ZombieCaminante('imagenes/zombie3.png',800,200,10,10,1,{desdeX: 800, hastaX: 850, desdeY: 200, hastaY: 220}),
    new ZombieCaminante('imagenes/zombie1.png',790,400,10,10,1,{desdeX: 790, hastaX: 850, desdeY: 400, hastaY: 420}),
    new ZombieConductor('imagenes/tren_vertical.png',644,0,30,90,6,{desdeX: 644, hastaX: 644, desdeY: -200, hastaY: 680},'v'),
    new ZombieConductor('imagenes/tren_vertical.png',676,0,30,90,4,{desdeX: 676, hastaX: 676, desdeY: -100, hastaY: 680},'v'),
    new ZombieConductor('imagenes/tren_horizontal.png',0,322,90,30,6,{desdeX: -100, hastaX: 1000, desdeY: 322, hastaY: 322},'h'),
  ]

}

/* Se cargan los recursos de las imagenes, para tener un facil acceso
a ellos. No hace falta comprender esta parte. Pero si queres agregar tus propies
imagenes tendras que poner su ruta en la lista para que pueda ser precargada como
todas las demas. */
Juego.iniciarRecursos = function() {
  Resources.load([
    'imagenes/mapa.png',
    'imagenes/mensaje_gameover.png',
    'imagenes/Mensaje1.png',
    'imagenes/Mensaje2.png',
    'imagenes/Splash.png',
    'imagenes/bache.png',
    'imagenes/tren_horizontal.png',
    'imagenes/tren_vertical.png',
    'imagenes/valla_horizontal.png',
    'imagenes/valla_vertical.png',
    'imagenes/zombie1.png',
    'imagenes/zombie2.png',
    'imagenes/zombie3.png',
    'imagenes/zombie4.png',
    'imagenes/auto_rojo_abajo.png',
    'imagenes/auto_rojo_arriba.png',
    'imagenes/auto_rojo_derecha.png',
    'imagenes/auto_rojo_izquierda.png',
    'imagenes/auto_verde_abajo.png',
    'imagenes/auto_verde_derecha.png',
    'imagenes/llama.png',
    'imagenes/bandera.jpg',
  ]);
  Resources.onReady(this.comenzar.bind(Juego));
};

// Agrega los bordes de las veredas a los obstaculos de la carretera
Juego.obstaculos = function() {
  return this.obstaculosCarretera.concat(this.bordes);
};

Juego.comenzar = function() {
  // Inicializar el canvas del juego
  Dibujante.inicializarCanvas(this.anchoCanvas, this.altoCanvas);
  /* El bucle principal del juego se llamara continuamente para actualizar
  los movimientos y el pintado de la pantalla. Sera el encargado de calcular los
  ataques, colisiones, etc*/
  this.buclePrincipal();
};

Juego.buclePrincipal = function() {

  // Con update se actualiza la logica del juego, tanto ataques como movimientos
  this.update();
  // Funcion que dibuja por cada fotograma a los objetos en pantalla.
  this.dibujar();
  // Esto es una forma de llamar a la funcion Juego.buclePrincipal() repetidas veces
  window.requestAnimationFrame(this.buclePrincipal.bind(this));
};

Juego.update = function() {
  this.calcularAtaques();
  this.moverEnemigos();
}
// Captura las teclas y si coincide con alguna de las flechas tiene que
// hacer que el jugador principal se mueva
Juego.capturarMovimiento = function(tecla) {
  var movX = 0;
  var movY = 0;
  var velocidad = this.jugador.velocidad;

  // El movimiento esta determinado por la velocidad del jugador
  if (tecla == 'izq') {
    movX = -velocidad;
  }
  if (tecla == 'arriba') {
    movY = -velocidad;
  }
  if (tecla == 'der') {
    movX = velocidad;
  }
  if (tecla == 'abajo') {
    movY = velocidad;
  }

  // Si se puede mover hacia esa posicion hay que hacer efectivo este movimiento
  if (this.chequearColisiones(movX + this.jugador.x, movY + this.jugador.y)) {
    /* Aca tiene que estar la logica para mover al jugador invocando alguno
    de sus metodos  */    
    /* COMPLETAR */
    Jugador.mover(movX,movY);

    if (tecla == 'izq') {
      Juego.jugador.sprite='imagenes/auto_rojo_izquierda.png'
      Jugador.ancho= 30;
      Jugador.alto= 15;
    }
    if (tecla == 'arriba') {
      Juego.jugador.sprite='imagenes/auto_rojo_arriba.png'
      Jugador.ancho= 15;
      Jugador.alto= 30;
    }
    if (tecla == 'der') {
      Juego.jugador.sprite='imagenes/auto_rojo_derecha.png'
      Jugador.ancho= 30;
      Jugador.alto= 15;
    }
    if (tecla == 'abajo') {
      Juego.jugador.sprite='imagenes/auto_rojo_abajo.png'
      Jugador.ancho= 15;
      Jugador.alto= 30;
    }
  }
};

Juego.dibujar = function() {
  // Borrar el fotograma actual
  Dibujante.borrarAreaDeJuego();
  //Se pinta la imagen de fondo segun el estado del juego
  this.dibujarFondo();

  if(this.terminoJuego() || this.ganoJuego()) return;
  /* Aca hay que agregar la logica para poder dibujar al jugador principal
  utilizando al dibujante y los metodos que nos brinda.
  "Dibujante dibuja al jugador" */
  /* Completar */
  Dibujante.dibujarEntidad(Jugador);


  // Se recorren los obstaculos de la carretera pintandolos
  this.obstaculosCarretera.forEach(function(obstaculo) {
    Dibujante.dibujarEntidad(obstaculo);
  });

  // Se recorren los enemigos pintandolos
  this.enemigos.forEach(function(enemigo) {
    /* Completar */
    Dibujante.dibujarEntidad(enemigo);
  });

  // El dibujante dibuja las vidas del jugador
  var tamanio = this.anchoCanvas / this.vidasInicial;
  Dibujante.dibujarRectangulo('white', 0, 0, this.anchoCanvas, 8);
  for (var i = 0; i < this.jugador.vidas; i++) {
    var x = tamanio * i
    Dibujante.dibujarRectangulo('red', x, 0, tamanio, 8);
  }
};



/* Recorre los enemigos haciendo que se muevan. De la misma forma que hicimos
un recorrido por los enemigos para dibujarlos en pantalla ahora habra que hacer
una funcionalidad similar pero para que se muevan.*/
Juego.moverEnemigos = function() {
  /* COMPLETAR */
  for(var i = 0; i<Juego.enemigos.length; i++){
    this.enemigos[i].mover();
  }
};

/* Recorre los enemigos para ver cual esta colisionando con el jugador
Si colisiona empieza el ataque el zombie, si no, deja de atacar.
Para chequear las colisiones estudiar el metodo posicionValida. Alli
se ven las colisiones con los obstaculos. En este caso sera con los zombies. */
Juego.calcularAtaques = function() {
  this.enemigos.forEach(function(enemigo) {
    if (this.intersecan(enemigo, this.jugador, this.jugador.x, this.jugador.y)) {
      /* Si el enemigo colisiona debe empezar su ataque
      COMPLETAR */
      enemigo.comenzarAtaque(this.Jugador);
    } else {
      /* Sino, debe dejar de atacar
      COMPLETAR */
      enemigo.dejarDeAtacar();
    }
  }, this);
};



/* Aca se chequea si el jugador se peude mover a la posicion destino.
 Es decir, que no haya obstaculos que se interpongan. De ser asi, no podra moverse */
Juego.chequearColisiones = function(x, y) {
  var puedeMoverse = true
  this.obstaculos().forEach(function(obstaculo) {
    if (this.intersecan(obstaculo, this.jugador, x, y)) {

      /*COMPLETAR, obstaculo debe chocar al jugador*/      
      obstaculo.chocar();
      puedeMoverse = false
    }
  }, this)
  return puedeMoverse
};

/* Este metodo chequea si los elementos 1 y 2 si cruzan en x e y
 x e y representan la coordenada a la cual se quiere mover el elemento2*/
Juego.intersecan = function(elemento1, elemento2, x, y) {
  var izquierda1 = elemento1.x
  var derecha1 = izquierda1 + elemento1.ancho
  var techo1 = elemento1.y
  var piso1 = techo1 + elemento1.alto
  var izquierda2 = x
  var derecha2 = izquierda2 + elemento2.ancho
  var techo2 = y
  var piso2 = y + elemento2.alto

  return ((piso1 >= techo2) && (techo1 <= piso2) &&
    (derecha1 >= izquierda2) && (izquierda1 <= derecha2))
};

Juego.dibujarFondo = function() {
  // Si se termino el juego hay que mostrar el mensaje de game over de fondo
  if (this.terminoJuego()) {
    Dibujante.dibujarImagen('imagenes/mensaje_gameover.png', 0, 5, this.anchoCanvas, this.altoCanvas);
    document.getElementById('reiniciar').style.visibility = 'visible';
  }

  // Si se gano el juego hay que mostrar el mensaje de ganoJuego de fondo
  else if (this.ganoJuego()) {
    Dibujante.dibujarImagen('imagenes/Splash.png', 190, 113, 500, 203);
    document.getElementById('reiniciar').style.visibility = 'visible';
  } else {
    Dibujante.dibujarImagen('imagenes/mapa.png', 0, 5, this.anchoCanvas, this.altoCanvas);
  }
};

Juego.terminoJuego = function() {
  return this.jugador.vidas <= 0;
};

/* Se gana el juego si se sobre pasa cierto altura y */
Juego.ganoJuego = function() {
  return (this.jugador.y + this.jugador.alto) > 530;
};

Juego.iniciarRecursos();

// Activa las lecturas del teclado al presionar teclas
// Documentacion: https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener
document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'izq',
    38: 'arriba',
    39: 'der',
    40: 'abajo'
  };

  Juego.capturarMovimiento(allowedKeys[e.keyCode]);
});
