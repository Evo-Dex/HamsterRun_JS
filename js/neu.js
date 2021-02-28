function el(css) {
  return document.querySelector(css);
}

//#### Variablen ####

// Abteilung : Leben
let leben = 5;
let lebenFlag = true;
//#############

// Abteilung : Zeitmessen
let spielzeit = 55;
let restzeit = 0;
let startzeit;
//#############

// Abteilung : Einkäufe
let einkaufspunkteKlopapier = 0;
let einkaufKlopapierFlag = true;
let einkaufspunkteNudeln = 0;
let einkaufNudelnFlag = true;
let einkaufspunkteMehl = 0;
let einkaufMehlFlag = true;
let einkaufspunkteSeife = 0;
let einkaufSeifeFlag = true;
let kasse = 0;
let kasseFlag = true;
//#############

// dynamische Fensterplatzierung
let diffW = el("#leinwand").offsetLeft + 400 - 250;
let diffH = el("#leinwand").offsetTop + 260 - 200;
//#############

// allgemein
let covidSammler = [];
let regalSammler = [];
let animate; // steuert den animationframe
let gegnerpositionen = [20, 50, 100, 150, 200, 250, 300, 350];

let index = 0;

// canvas var
let co = el("#leinwand");
let ctx = el("#leinwand").getContext("2d");
let tCode = -1;
//#############

// Sounds laden
let MinusLeben = new Audio();
MinusLeben.src = "sound/503503__larakaa__meh-04.mp3";
let winner = new Audio();
winner.src = "sound/sieg.mp3";
let gameover = new Audio();
gameover.src = "sound/Wahnlache.mp3";
let zeitabgelaufen = new Audio();
zeitabgelaufen.src = "sound/kurzer_Schrei.mp3";
let menno = new Audio();
menno.src = "sound/babyweint.mp3";
let einkauf = new Audio();
einkauf.src = "sound/beep_kasse.mp3";
//#############

// Bilder laden
let klopapier = new Image();
klopapier.src = "bilder/klopapier x45.gif";
let seife = new Image();
seife.src = "bilder/seife x45.gif";
let mehl = new Image();
mehl.src = "bilder/mehl x45.gif";
let nudeln = new Image();
nudeln.src = "bilder/nudeln x45.gif";
let kasse1 = new Image();
kasse1.src = "bilder/kasse x100.gif";

let RegalWandOben = new Image();
RegalWandOben.src = "bilder/RegalWandOben2.jpg";
let RegalWandRechts = new Image();
RegalWandRechts.src = "bilder/RegalWandRechts.jpg";
let RegalWandUnten = new Image();
RegalWandUnten.src = "bilder/RegalWandUnten.jpg";

let player = new Image();
player.src = "bilder/player_hamster_40x40.gif";
let playerL = new Image();
playerL.src = "bilder/player_hamster_40x40_L.gif";
let covidImg = new Image();
covidImg.src = "bilder/covid19_hamster_40x40.gif";
//#############

klopapier.onload = function () {
  //#### Objekte bilden ####

  let covidProto = {
    w: 40,
    h: 40,
    x: 200,
    y: 150,
    rx: 0,
    ry: 0,
    posX: [200, 300, 400, 200, 300, 400],
    posY: [60, 121, 190, 410, 480, 550],
    cEl: 0,
    speed: 1,
    make: function () {
      this.speed = Math.ceil(Math.random() * 3) + 1;
      this.y = this.posY[index];
      this.x = this.posX[index];

      covidSammler.push(this);
      index++;
    },
    move: function () {
      // Bewegung rechts begrenzung
      if (this.x > 700) {
        this.rx = 1;
      }
      // Bewegung links begrenzung
      if (this.x < 120) {
        this.rx = 0;
      }

      if (this.rx == 0) {
        this.x += this.speed;
      }
      if (this.rx == 1) {
        this.x -= this.speed;
      }

      ctx.drawImage(covidImg, this.x, this.y);
    },
  }; // ENDE covidProto
  console.log(covidProto);

  let playerProto = {
    w: 40,
    h: 40,
    x: 20,
    y: 80,
    speed: 2,
    make: function () {
      ctx.drawImage(player, this.x, this.y);
    },
    move: function () {
      // Player mit pfeiltasten bewegen
      switch (tCode) {
        // Pfeiltaste nach unten
        case 40:
          if (this.y <= 557) {
            this.y += this.speed;
          }
          ctx.drawImage(playerL, this.x, this.y);
          break;

        // Pfeiltaste nach oben
        case 38:
          if (this.y > 47) {
            this.y -= this.speed;
          }
          ctx.drawImage(player, this.x, this.y);
          break;

        // Pfeiltaste nach links
        case 37:
          if (this.x > 65) {
            this.x -= this.speed;
          }
          ctx.drawImage(playerL, this.x, this.y);
          break;

        // Pfeiltaste nach rechts
        case 39:
          if (this.x < 715) {
            //760
            this.x += this.speed;
          }
          ctx.drawImage(player, this.x, this.y);
          break;

        case -1:
          ctx.drawImage(player, this.x, this.y);
          break;
      } //ENDE switch

      //kollision
      for (let i = 0; i < covidSammler.length; i++) {
        if (lebenFlag && kollision(this, covidSammler[i])) {
          // sound abspielen
          MinusLeben.volume = 0.3;
          MinusLeben.play();

          // Leben abziehen
          leben--;
          el("#leben").innerHTML = "Leben: " + leben;
          lebenFlag = false;
          setTimeout(function () {
            lebenFlag = true;
          }, 600);
        } else {
        } //ENDE kollision
      } // ENDE for-schleife
    }, // ENDE move
  }; // ENDE playerProto
  playerProto.make();
  console.log(playerProto);

  let klopapierProto = {
    w: 80,
    h: 60,
    x: 315,
    y: 1,
    make: function () {
      ctx.drawImage(klopapier, this.x, this.y);

      //kollision
      if (einkaufKlopapierFlag && kollision(this, playerProto)) {
        // sound abspielen
        einkauf.volume = 0.3;
        einkauf.play();
        // einkäufe addieren
        einkaufspunkteKlopapier++;
        el("#klopapierstand").innerHTML =
          "Klopapier: " + einkaufspunkteKlopapier;
        einkaufKlopapierFlag = false;
        setTimeout(function () {
          einkaufKlopapierFlag = true;
        }, 22200);
      } else {
      } //ENDE kollision
    }, // ENDE make
  }; // ENDE klopapierProto
  klopapierProto.make();
  console.log(klopapierProto);

  let nudelnProto = {
    w: 80,
    h: 60,
    x: 751.5,
    y: 50,
    make: function () {
      ctx.drawImage(nudeln, this.x, this.y);

      //kollision
      if (einkaufNudelnFlag && kollision(this, playerProto)) {
        // sound abspielen
        einkauf.volume = 0.3;
        einkauf.play();
        // einkäufe addieren
        einkaufspunkteNudeln++;
        el("#nudelnstand").innerHTML = "Nudeln: " + einkaufspunkteNudeln;
        einkaufNudelnFlag = false;
        setTimeout(function () {
          einkaufNudelnFlag = true;
        }, 22200);
      } else {
      } //ENDE kollision
    }, // ENDE make
  }; // ENDE nudelnProto
  nudelnProto.make();
  console.log(nudelnProto);

  let mehlProto = {
    w: 80,
    h: 60,
    x: 725,
    y: 597,
    make: function () {
      ctx.drawImage(mehl, this.x, this.y);

      //kollision
      if (einkaufMehlFlag && kollision(this, playerProto)) {
        // sound abspielen
        einkauf.volume = 0.3;
        einkauf.play();
        // einkäufe addieren
        einkaufspunkteMehl++;
        el("#mehlstand").innerHTML = "Mehl: " + einkaufspunkteMehl;
        einkaufMehlFlag = false;
        setTimeout(function () {
          einkaufMehlFlag = true;
        }, 22200);
      } else {
      } //ENDE kollision
    }, // ENDE make
  }; // ENDE mehlProto
  mehlProto.make();
  console.log(mehlProto);

  let seifeProto = {
    w: 80,
    h: 60,
    x: 192,
    y: 355,
    make: function () {
      ctx.drawImage(seife, this.x, this.y);

      //kollision
      if (einkaufSeifeFlag && kollision(this, playerProto)) {
        // sound abspielen
        einkauf.volume = 0.3;
        einkauf.play();
        // einkäufe addieren
        einkaufspunkteSeife++;
        el("#seifestand").innerHTML =
          "Desinfektionsseife: " + einkaufspunkteSeife;
        einkaufSeifeFlag = false;
        setTimeout(function () {
          einkaufSeifeFlag = true;
        }, 22200);
      } else {
      } //ENDE kollision
    }, // ENDE make
  }; // ENDE seifeProto
  seifeProto.make();
  console.log(seifeProto);

  let kasseProto = {
    w: 80,
    h: 60,
    x: 0,
    y: 500,
    make: function () {
      ctx.drawImage(kasse1, this.x, this.y);

      // kollision
      if (kollision(this, playerProto)) {
        checkOut();
      } else {
      } // ENDE kollision
    }, // ENDE make
  }; // ENDE kasseProto
  kasseProto.make();
  console.log(kasseProto);

  let RegalWandObenProto = {
    x: 0,
    y: 235,
    w: 565,
    h: 11,
    make: function () {
      ctx.drawImage(RegalWandOben, this.x, this.y);

      if (kollision(this, playerProto)) {
        stopMotionDown();
      } else {
      } // ENDE kollision
    }, // ENDE make
  }; // ENDE RegalWandObenProto
  RegalWandObenProto.make();
  console.log(RegalWandObenProto);

  let RegalWandRechtsProto = {
    x: 560,
    y: 244,
    w: 9,
    h: 154,
    make: function () {
      ctx.drawImage(RegalWandRechts, this.x, this.y);

      if (kollision(this, playerProto)) {
        stopMotionRight();
      } else {
      } // ENDE kollision
    }, // ENDE make
  }; // ENDE RegalWandRechtsProto
  RegalWandRechtsProto.make();
  console.log(RegalWandRechtsProto);

  let RegalWandUntenProto = {
    x: 0,
    y: 395,
    w: 563,
    h: 10,
    make: function () {
      ctx.drawImage(RegalWandUnten, this.x, this.y);

      if (kollision(this, playerProto)) {
        stopMotionUp();
      } else {
      } // ENDE kollision
    }, // ENDE make
  }; // ENDE RegalWandUntenProto
  RegalWandUntenProto.make();
  console.log(RegalWandUntenProto);

  //#### Functions ####

  function covidFabrik() {
    let klon;
    for (let i = 0; i < 6; i++) {
      klon = Object.create(covidProto);
      klon.make();
    }
  } // ENDE covidFabrik

  function render() {
    el("#intro").style.display = "none";

    animate = requestAnimationFrame(render);
    // wenn leben = 0 -> spiel anhalten
    if (leben === 0) {
      cancelAnimationFrame(animate);
      // sound abspielen
      gameover.volume = 0.2;
      gameover.play();

      el("#gameover").style.display = "block";
      el("#gameover").style.marginLeft = diffW + "px";
      el("#gameover").style.marginTop = diffH + "px";
      return;
    }
    // zeit abgelaufen -> spiel anhalten
    let aktuellezeit = new Date();
    restzeit =
      spielzeit -
      Math.floor((aktuellezeit.getTime() - startzeit.getTime()) / 1000);
    el("#spielzeit").innerHTML = "Spielzeit: " + restzeit;
    if (restzeit <= 0) {
      cancelAnimationFrame(animate);
      // sound abspielen
      zeitabgelaufen.volume = 0.2;
      zeitabgelaufen.play();

      el("#spielendeanzeige").style.display = "block";
      el("#spielendeanzeige").style.marginLeft = diffW + "px";
      el("#spielendeanzeige").style.marginTop = diffH + "px";
      return;
    }
    ctx.clearRect(0, 0, co.width, co.height);
    klopapierProto.make();
    nudelnProto.make();
    mehlProto.make();
    seifeProto.make();
    kasseProto.make();
    RegalWandObenProto.make();
    RegalWandRechtsProto.make();
    RegalWandUntenProto.make();

    // move player
    playerProto.move();
    // move covidhamster
    covidSammler.forEach(function (val) {
      val.move();
    });
  } // ENDE render

  function checkKey(e) {
    tCode = e.keyCode;
    // den browser nicht mit Tasten steuern
    e.preventDefault();
  } // ENDE checkKey

  function stopMotion() {
    tCode = -1;
  } // ENDE stopMotion

  function kollision(a, b) {
    if (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.h + a.y > b.y
    ) {
      return true;
    } else {
      return false;
    }
  } // ENDE kollision

  function checkOut() {
    if (
      einkaufspunkteSeife > 0 &&
      einkaufspunkteKlopapier > 0 &&
      einkaufspunkteMehl > 0 &&
      einkaufspunkteNudeln > 0
    ) {
      cancelAnimationFrame(animate);
      // sound abspielen
      winner.volume = 0.2;
      winner.play();

      el("#winner").style.display = "block";
      el("#winner").style.marginLeft = diffW + "px";
      el("#winner").style.marginTop = diffH + "px";
    } else {
      cancelAnimationFrame(animate);
      // sound abspielen
      menno.volume = 0.2;
      menno.play();

      el("#menno").style.display = "block";
      el("#menno").style.marginLeft = diffW + "px";
      el("#menno").style.marginTop = diffH + "px";
    }
  } // ENDE checkOut

  // Kollision mit RegalWand in der mitte -> Bewegung begrenzen
  function stopMotionDown() {
    switch (tCode) {
      // Pfeiltaste nach unten anhalten
      case 40:
        if (playerProto.y <= 335) {
          playerProto.y -= playerProto.speed;
        }
    }
  } // ENDE stopMotion

  function stopMotionRight() {
    switch (tCode) {
      // Pfeiltaste nach links anhalten
      case 37:
        if (playerProto.x > 560) {
          playerProto.x += playerProto.speed;
        }
    }
  } // ENDE stopMotionRight

  function stopMotionUp() {
    switch (tCode) {
      // Pfeiltaste nach oben anhalten
      case 38:
        if (playerProto.y < 400) {
          playerProto.y += playerProto.speed;
        }
        break;
    }
  } // ENDE stopMotionUp

  function neuStart() {
    location.reload();
  } // ENDE neuStart
  //console.log(neuStart);

  document.addEventListener("keydown", checkKey);
  document.addEventListener("keyup", stopMotion);
  el("#start1").addEventListener("click", neuStart);
  el("#start2").addEventListener("click", neuStart);
  el("#start3").addEventListener("click", neuStart);
  el("#start4").addEventListener("click", neuStart);

  // intro Fenster
  el("#intro").style.display = "block";
  el("#intro").style.marginLeft = diffW + "px";
  el("#intro").style.marginTop = diffH + "px";
  el("#startgame").addEventListener("click", startGame);

  covidFabrik();

  function startGame() {
    //cancelAnimationFrame (animate);

    if (!animate) {
      startzeit = new Date();
      render();
    }
  }

  window.addEventListener("resize", function () {
    diffW = el("#leinwand").offsetLeft + 400 - 250;
    diffH = el("#leinwand").offsetTop + 260 - 200;
    console.log(diffW);
  });
};
