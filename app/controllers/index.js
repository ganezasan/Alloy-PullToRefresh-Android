// APIMapper の準備
var ApiMapper = require("apiMapper").ApiMapper;

//初期設定
var scrollableView_top = 50;
var y = 0;

//PullView処理　Android
//スクロールが終了した際の高さが閾値以上だった場合に更新処理をする
$.scrollableView.addEventListener('touchend', function(e)
{
  y = 0;
  var value = 'touchend fired x ' + e.x + ' y ' + e.y;
  Ti.API.info(value);
  var top = $.scrollableView.getTop();

  if(top > 100 && Titanium.Network.online){
    infoUpdate("update");
  }else{
    $.scrollableView.animate({top: scrollableView_top+"dp", duration: 100});
  }
});

//スクロールした分scrollableViewの位置をずらす
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

//PullView処理　iOS
$.listView.addEventListener('pullend',function(e){
  Ti.API.info("pullend")
  infoUpdate("update");
});


//初期処理
$.index.open();
init();

function init(){
  Ti.API.info("初期処理");
  infoUpdate("init");
};

function infoUpdate(status){
  if(status == "init"){
    Alloy.Globals.loading.show('loading...', false);
  }else{
    $.pullTitle.hide();
    $.activityIndicator.show();         
    if(OS_IOS){
      $.listView.setContentInsets({top:50}, {animated:true});
    }else{
      $.scrollableView.animate({top: "100dp", duration: 100});
    }
  }

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
      if(status == "init"){
        Alloy.Globals.loading.hide();
      }else{
        $.pullTitle.show();
        $.activityIndicator.hide();         
        if(OS_IOS){
          $.listView.setContentInsets({top:0}, {animated:true});
        }else if(OS_ANDROID){
          $.scrollableView.animate({top: scrollableView_top+"dp", duration: 100});
        }
      }
    },
    function(){
      // 失敗したとき
      alert('データの取得に失敗しました。');
      if(OS_ANDROID){
        $.scrollableView.animate({top: scrollableView_top+"dp", duration: 100});
      }
    });
  }
}

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
