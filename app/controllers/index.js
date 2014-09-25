// APIMapper の準備
var ApiMapper = require("apiMapper").ApiMapper;

//初期設定
var selectedView,areaData,infoTypes,division_id,buttonEnable;
var scrollableView_top=50;

var y = 0;
$.scrollableView.addEventListener('touchend', function(e)
{
  y = 0;
  var value = 'touchend fired x ' + e.x + ' y ' + e.y;
  Ti.API.info(value);
  var top = $.scrollableView.getTop();

  if(top > 100 && Titanium.Network.online){
    $.scrollableView.animate({top:130, duration: 300});
    Alloy.Globals.loading.show('loading...', false);

    var apiMapper = new ApiMapper();
    //初期データ取得  
    apiMapper.allnews(
    function(){
      // 成功したとき
      var json = JSON.parse(this.responseText);
      updateTable(json);
      $.scrollableView.animate({top: scrollableView_top+"dp", duration: 100});
      Alloy.Globals.loading.hide();
    },
    function(){
       // 失敗したとき
        alert('データの取得に失敗しました。');
        $.scrollableView.animate({top: scrollableView_top+"dp", duration: 100});
        Alloy.Globals.loading.hide();
      }
    );    
  }else{
      $.scrollableView.animate({top: scrollableView_top+"dp", duration: 100});
  }
});

$.scrollableView.addEventListener('touchmove', function(e)
{
  if(y != 0 && Number(e.y) > scrollableView_top &&  Number(y) <= Number(e.y)){
    var top = 0;
    top = (Number(e.y) - Number(y))*0.1+scrollableView_top;
    Ti.API.info("top:"+String(top));
    $.scrollableView.setTop(top);
  }else if(Number(e.y) > scrollableView_top && Number(e.y) <300+scrollableView_top){
    y = e.y;
  }
});

$.index.open();
init();

function updateTable(json){
  var tableData = [];
  tableData = json.map(function(d,i){ 
    return {
      title:{text:d.title},
   };
  });
       
  var section = Ti.UI.createListSection();
  section.setItems(tableData);
  $.listView.deleteSectionAt(0);
  $.listView.setSections([section]);
}

function init(){
  Ti.API.info("初期処理");
  infoUpdate();
};

function infoUpdate(){
  Alloy.Globals.loading.show('loading...', false);

  if(!Titanium.Network.online){
    Ti.API.info("ネットワークなし");
    Alloy.Globals.loading.hide();
    setTimeout (function (){
      alert("インターネットへの接続に失敗しました。自動更新で保存されたデータを表示します。");
    }, 1000);
  }else{
    //ネットワークあり
    Ti.API.info("ネットワークあり");

    var apiMapper = new ApiMapper();
    //初期データ取得  
    apiMapper.allnews(
    function(){
      // 成功したとき
      var json = JSON.parse(this.responseText);
      Ti.API.info(json.length);
      updateTable(json);
      Alloy.Globals.loading.hide();
    },
    function(){
      // 失敗したとき
        alert('データの取得に失敗しました。');
    });
  }
}
