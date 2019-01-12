
window.addEventListener('load', function(){
    var up = document.getElementById('up')
    var down = document.getElementById('down')
    var left = document.getElementById('left')
    var right = document.getElementById('right')
    var yeniOyun = document.getElementById('buton')
    var muzikAc = document.getElementById('buton_music')
    //var statusdiv = document.getElementById('statusdiv')
    var startx = 0;
    up.addEventListener('touchstart', dokunma_tespiti, false)
    down.addEventListener('touchstart', dokunma_tespiti, false)
    left.addEventListener('touchstart', dokunma_tespiti, false)
    right.addEventListener('touchstart', dokunma_tespiti, false)
    yeniOyun.addEventListener('click', resetGame, false)
    muzikAc.addEventListener('click', playMusic, false)
}, false)

function dokunma_tespiti(e){
    var touchobj = e.changedTouches[0];
    startx = parseInt(touchobj.clientX);
    //statusdiv.innerHTML = 'Status: touchstart<br> ClientX: ' + startx + 'px';
    butona_basildi(this.id);
    e.preventDefault();
}

window.addEventListener("keydown", hareket_kaydi, false);


var muzikBool = false
var muzik_loop = document.getElementById("loopAudio");
var muzik_sert = document.getElementById("sertAudio");
var muzik_sakin = document.getElementById("sakinAudio");
var cerceve = document.getElementById("cerceve");
var hareketler_html = document.getElementById("Hareketler");
var puan_durumu = document.getElementById('Puan');
var hiz_durumu = document.getElementById('Hiz');
//var zehir_durumu = document.getElementById('Zehirler');
//var yem_durumu = document.getElementById('Yemler');
var seviye_durumu = document.getElementById('Seviye');
var pos_yemler = document.getElementById("PosYem");
var pos_yilan = document.getElementById("PosYilan");
var en_yakin_nokta = 0;
var hareket_genel;
var hareketler = [];
var toplanan_puan = 0;
var seviye_puan = 0;
var seviye = 1;
var hiz = 20;
var hiz_puani = hiz;
var yenilgi = false;
var zehirci = 0;
var zehir_sure_sayaci = 0;
var yem_sayaci = 0;
var yem_zehirli_mi = false;
var bitti = false;
var sabit_hız = 60;
var yonler = {
    sol : 37,
    sag : 39,
    asagi : 40,
    yukari : 38,
};
var zehirSayaciSabiti = 40;
var hareket_yonu = yonler.sag;
var replayButonPressed = false;

var stringToPrint;

var yilanImage = new Image();
yilanImage.addEventListener("load", gameLoop);
yilanImage.src = "images/karak.png";

var yemImage = new Image();
yemImage.addEventListener("load", gameLoop);
yemImage.src = "images/coin_nano.png";

var canvas = document.getElementById("yem");
canvas.width = cerceve.offsetWidth;
canvas.height = cerceve.offsetHeight;

var yem = sprite({
    context: canvas.getContext("2d"),
    width: 250,
    height: 25,
    image: yemImage,
    numberOfFrames: 10,
    ticksPerFrame: 4,
    stateOfItem:0,
    loop: true,
    scaleRatio: 1,
});

var yilan = sprite({
    context: canvas.getContext("2d"),
    width: 200,
    height: 50,
    image: yilanImage,
    numberOfFrames: 4,
    stateOfItem:0,
    ticksPerFrame: 15,
    loop: true,
    scaleRatio: 1,
});

var en_uc_nokta = cerceve.offsetHeight-50;
zehirRandom();
//zehir_durumu.textContent = 'Zehirler : ' + zehirci;
yilan.y = en_yakin_nokta;
yilan.x = en_yakin_nokta;

window.onload = function(){
    yem_ata();
    //muzik_sakin.play();
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
        document.getElementById("left").style.display = "inline";
        document.getElementById("up").style.display = "inline";
        document.getElementById("right").style.display = "inline";
        document.getElementById("down").style.display = "inline";
    }
};

function playMusic(){
  if(!muzikBool){
    muzik_loop.play();
    muzikBool = true
  }
  else{
    muzik_loop.pause();
    muzikBool = false
  }
}


function resetGame(){
  replayButonPressed = true;
  //alert("Yeni oyun başlıyor!\nPuanın : " + toplanan_puan);
  //show_prompt();
}

function gameLoop(){
    window.requestAnimationFrame(gameLoop);
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
    //  pos_yemler.textContent = yem.x + ' ' + yem.y + ' ' ;
    //  pos_yilan.textContent = yilan.x + ' ' + yilan.y + ' ';
    yem.update();
    yem.render();
    yilan.update();
    yilan.render();
    if (yenilgi) return;
};

function butona_basildi(clicked_id){
    if (clicked_id == 'left') clicked_id = 37;
    else if (clicked_id == 'up') clicked_id = 38;
    else if (clicked_id == 'right') clicked_id = 39;
    else clicked_id = 40;
    if ( hareketler.length > 1) hareketler.pop();
    if ((clicked_id == 37 || clicked_id == 38 || clicked_id == 39 || clicked_id == 40) &&
        (( clicked_id == 39 && hareket_yonu != yonler.sol) ||
         (clicked_id == 37 && hareket_yonu != yonler.sag) ||
         (clicked_id == 40 && hareket_yonu != yonler.yukari ) ||
         (clicked_id == 38 && hareket_yonu != yonler.asagi)))
         hareketler.unshift(clicked_id);
    else return;
    //hareketler_html.textContent = hareketler;
    hareket_yonu = hareketler[0];
    hareket();
}

function hareket_kaydi(e){
    if ( hareketler.length > 1) hareketler.pop();
    if ((e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) &&
        (( e.keyCode == 39 && hareket_yonu != yonler.sol) ||
         (e.keyCode == 37 && hareket_yonu != yonler.sag) ||
         (e.keyCode == 40 && hareket_yonu != yonler.yukari ) ||
         (e.keyCode == 38 && hareket_yonu != yonler.asagi)))
         hareketler.unshift(e.keyCode);
    else return;
    //hareketler_html.textContent = hareketler;
    hareket_yonu = hareketler[0];
    hareket();
    //hareket_test();
}

function show_prompt() {
    var name = prompt(string+'\nEnter your name...','Mr. Snake');
    if (name != null && name != "") {
        //window.location.reload(); //
    }
    refreshValues();
    yem_ata();
}

function zehirRandom(){
    zehirci = Math.floor(Math.random()*10+1);
}
var zehirInterval;
function zehirli_yem(){
    if( yem_sayaci%zehirci == 0 && seviye > 1 ){
        var git_gel = false;
        //muzik_sakin.pause();
        //muzik_sert.play();
        yem_zehirli_mi = true;
        yem.stateOfItem = 1;
        zehirRandom();
        //zehir_durumu.textContent = 'Zehirler : ' + zehirci;
        zehirInterval = setInterval(zehir_dindir, sabit_hız);
        function zehir_dindir(){
            if ( zehir_sure_sayaci == zehirSayaciSabiti){
                zehir_sure_sayaci = 0;
                yem_zehirli_mi = false;
                yem.stateOfItem = 0;
                cerceve.style.background = '#F5F5F5';
                zehirRandom();
                //zehir_durumu.textContent = 'Zehirler : ' + zehirci;
                clearInterval(zehirInterval);
            } else{
                zehir_sure_sayaci++;
                cerceve.style.background = (git_gel)?('#DDFF00'):('#2EFE2E');
                git_gel = (git_gel)?false:true;
            }
        };
    }else{
        //muzik_sert.pause();
        //muzik_sakin.play();
        yem_zehirli_mi = false;
        yem.stateOfItem = 0;
        cerceve.style.background = '#F5F5F5';
    }
}

function refreshValues(){
  closestPoint = 0;
  hareketler = [];
  toplanan_puan = 0;
  seviye_puan = 0;
  seviye = 1;
  hiz = 20;
  hiz_puani = hiz;
  yenilgi = false;
  zehirci = 0;
  zehir_sure_sayaci = 0;
  yem_sayaci = 0;
  zehir_sure_sayaci = 0;
  yem_zehirli_mi = false;
  yem.stateOfItem = 0;
  cerceve.style.background = '#F5F5F5';
  zehirRandom();
  clearInterval(zehirInterval);
  bitti = false;
  puan_durumu.textContent = toplanan_puan;
  seviye_durumu.textContent = seviye;
  hareket_yonu = yonler.sag;
  yilan.y = 0;
  yilan.x = 0;
  yilan.stateOfItem = 0;
}

function yem_ata(){
    zehirli_yem();
    pos_x = yem.x;
    pos_y = yem.y;
    var elde_x = 0;
    var elde_y = 0;
    do{
        pos_x = Math.floor(Math.random()*cerceve.offsetHeight);
        pos_y = Math.floor(Math.random()*cerceve.offsetHeight);
        elde_x = Math.floor(pos_x/25)*25;
        elde_y = Math.floor(pos_y/25)*25;
        yem.x = elde_x;
        yem.y = elde_y;
    }
    while ( yem.x == yilan.x && yem.y == yilan.y);
    //yem.x = 75;
    //yem.y = 75;
    yem_sayaci++;
    //yem_durumu.textContent = 'Yem : ' + yem_sayaci;
}

function hareket(){
    if (hareket_yonu == yonler.sol) yilan.stateOfItem = 2;
    else if (hareket_yonu == yonler.sag) yilan.stateOfItem = 3;
    else if (hareket_yonu == yonler.yukari) yilan.stateOfItem = 1;
    else if (hareket_yonu == yonler.asagi) yilan.stateOfItem = 0;
    var pos_y = yilan.y;
    var pos_x = yilan.x;
    if (yilan.y == NaN){
        pos_y = 0;
        pos_x = 0;
    }
    var id = setInterval(frame, hiz);
    function frame() {
      if (replayButonPressed) {
          replayButonPressed = false;
          clearInterval(id);
          refreshValues();
          yem_ata();
          return;
      }
      switch(hareket_yonu){
          case yonler.sag:
                  if((yilan.x == en_uc_nokta)){
                      clearInterval(id);
                      yenilgi = true;
                  }else if(hareketler.length > 1) {
                      clearInterval(id);
                      hareketler.pop();
                  }else{
                      pos_x+=5;
                      yilan.x = pos_x;
                  }
                  break;
          case yonler.sol:
                  if((yilan.x == en_yakin_nokta)){
                      clearInterval(id);
                      yenilgi = true;
                  }else if(hareketler.length > 1) {
                      clearInterval(id);
                      hareketler.pop();
                  }else{
                      pos_x-=5;
                      yilan.x = pos_x;
                  }
                  break;
          case yonler.asagi:
                  if((yilan.y == en_uc_nokta )){
                      clearInterval(id);
                      yenilgi = true;
                  }else if(hareketler.length > 1) {
                      clearInterval(id);
                      hareketler.pop();
                  }else{
                      pos_y+=5;
                      yilan.y = pos_y;
                  }
                  break;
          case yonler.yukari:
                  if((yilan.y == en_yakin_nokta)){
                      clearInterval(id);
                      yenilgi = true;
                  }else if(hareketler.length > 1) {
                      clearInterval(id);
                      hareketler.pop();
                  }else{
                      pos_y-=5;
                      yilan.y = pos_y;
                  }
                  break;
        }
    // Yem yendi
        //if (yem.x == yilan.x && yem.y == yilan.y){
        if (collision(yem,yilan)){
            if ( yem_zehirli_mi ){
                //muzik_sakin.pause();
                //muzik_sert.play();
                bitti = true;
                //muzik_loop.pause();
                string = "Radioactive Gem!\nYour Score : " + toplanan_puan;
                //window.removeEventListener("keydown", hareket_kaydi, false);
                clearInterval(id);
                show_prompt();
                return;
            }
            yem_ata();
            toplanan_puan += hiz_puani;
            puan_durumu.textContent = toplanan_puan;
            seviye_puan += hiz_puani;
            //hiz_durumu.textContent = 'Hiz : ' + hiz_puani;
            if ( Math.floor(seviye_puan/hiz_puani) == 5){
                seviye++;
                seviye_durumu.textContent = seviye;
                seviye_puan = 0;
                hiz -=2;
                hiz_puani +=10;
            }
        }
        if (yenilgi && !bitti) {
            //muzik_sakin.pause();
            //muzik_sert.play();
            bitti = true;
            //muzik_loop.pause();
            string = "Ouch! You hit the wall!\nYour Score : " + toplanan_puan;
            //window.removeEventListener("keydown", hareket_kaydi, false);
            clearInterval(id);
            show_prompt();
            return;
        }
    }
}

function sprite(options){
    var that = {},
        frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;
    that.stateOfItem = options.stateOfItem;
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.loop = options.loop;
    that.scaleRatio = options.scaleRatio || 1;
    that.x = 0;
    that.y = 0;
    that.x_ekle = that.width/numberOfFrames*that.scaleRatio;
    that.y_ekle = that.height*that.scaleRatio;
    that.update = function(){
        tickCount++;
        if (tickCount > ticksPerFrame){
            tickCount = 0;
            if (frameIndex<numberOfFrames-1){ // keep in range
                frameIndex++; // go to the next frame
            }else if(that.loop) {
                frameIndex = 0;
            }
        }
    };
    that.render = function(){
        // Temizle
        //that.context.clearRect(0,0,that.width,that.height);
        //Animasyonu cizdir
        that.context.drawImage(
            that.image,
            frameIndex*that.width/numberOfFrames,
            that.height*that.stateOfItem,
            that.width/numberOfFrames,
            that.height,
            that.x,
            that.y,
            that.width/numberOfFrames*that.scaleRatio,
            that.height*that.scaleRatio);
    };

    return that;
}

function collision(nesne2,nesne1){
    var nesne1_x2 = nesne1.x+nesne1.x_ekle;
    var nesne1_y2 = nesne1.y+nesne1.y_ekle;
    var nesne1_y1 = nesne1.y;
    var nesne1_x1 = nesne1.x;
    var nesne2_x2 = nesne2.x+nesne2.x_ekle-6;
    var nesne2_y2 = nesne2.y+nesne2.y_ekle-6;
    var nesne2_y1 = nesne2.y+6;
    var nesne2_x1 = nesne2.x+6;
    //alert(nesne1_x2 + ' ' + nesne2_x2 + ' ' + nesne1_y2 + ' ' + nesne2_y2 + ' ');
    if (!(nesne2_x1 > nesne1_x2 || nesne2_x2 < nesne1_x1 ||
          nesne2_y1 > nesne1_y2 || nesne2_y2 < nesne1_y1))
          return true;
    /* Yuvarlak + Dikdortgen
    var cap = 9;
    var distX = Math.abs(nesne2.x - nesne1.x-nesne1.x_ekle/2);
    var distY = Math.abs(nesne2.y - nesne1.y-nesne1.y_ekle/2);
    if (distX > (nesne1.x_ekle/2 + cap)) { return false; }
    if (distY > (nesne1.y_ekle/2 + cap)) { return false;  }
    if (distX <= (nesne1.x_ekle/2)) { return true;  }
    if (distY <= (nesne1.y_ekle/2)) { return true;  }*/

}
