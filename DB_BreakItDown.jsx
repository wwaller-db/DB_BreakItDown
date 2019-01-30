
/*
DB_BreakItDown.jsx
Copyright (c) 2019 Dripsblack, LLC. (William M. Waller II). All rights reserved.
www.dripsblack.com

Name: DB_BreakItDown
Version: 1.0

Description:
This idea was inspired by Justin Barrett's tweenMachine script for Maya. I've
Always believed that good animation comes from good key moments, but really great
animation happens in the breakdowns. This tool is about getting those breakdowns
started in the right place.

Let's say you have a key pose at frame 10, and the next at frame 30. You want to
create a breakdown pose that is physically in between those frames but you want
to happen on frame 15 (25% of the time between frame 10 and 30). This would mean
your animation would move quickly to its midpoint and then slow into the second
pose. Manually you'd have to find the exact midpoint of your motion, create
keyframes on all the associated properties, then move the keys back to frame 15.
With BreakItDown, you just have to select your keys and hit the .25 button! Done.

Limitations:
There are a lot.
*/

function lin(a, b, n) {
  return (1 - n) * a + n * b;
}

function breakDown(lyr, midpoint, snap){
    var props = lyr.selectedProperties;
    for (var k=0; k< props.length; k++){
        prop = props[k];
        if (prop.selectedKeys.length === 2) {
            keyStart = prop.selectedKeys[0];
            keyStartTime = prop.keyTime(keyStart);
            keyStartVal = prop.keyValue(keyStart);
            keyEnd = prop.selectedKeys[1];
            keyEndTime = prop.keyTime(keyEnd);
            keyEndVal = prop.keyValue(keyEnd);
            keyMidVal = (keyStartVal + keyEndVal)/2;
            keyMidTime = lin(keyStartTime,keyEndTime,midpoint);
            keyMidFrame = keyMidTime*frameRate;
            if (snap==true){
              keyMidFrame = Math.round(keyMidFrame);
              keyMidTime = keyMidFrame/frameRate;
            }
            prop.setValueAtTime(keyMidTime,keyMidVal);

        } else {
            alert("Select 2 keys per property to breakdown.");
        }
    }
}

function tweenMain(midPoint,snap){
  currentComp = app.project.activeItem;
  selLyrs = currentComp.selectedLayers;
  currTime =currentComp.time;
  frameRate = currentComp.frameRate;
  if (selLyrs.length === 0) {
    alert("Select 2 keys per property to breakdown.");
  } else {
    app.beginUndoGroup("Tween")
    for (var i=0; i< selLyrs.length; i++){
      breakDown(selLyrs[i],midPoint,snap);
    }
    app.endUndoGroup;
  }
}


var resString =
"group{orientation:'column',alignment:['fill','fill']\
  incrementBtnsGrp:Group{orientation:'column',alignChildren:['center','top'],\
    row1:Group{orientation:'row',\
      btn_1:Button{text:'.10',preferredSize:[30,25]},\
      btn_25:Button{text:'.25',preferredSize:[30,25]},\
      btn_5:Button{text:'.50',preferredSize:[30,25]},\
      btn_75:Button{text:'.75',preferredSize:[30,25]},\
      btn_9:Button{text:'.90',preferredSize:[30,25]},\
    },\
  },\
  sliderGrp:Group{orientation:'column',alignChildren:['center','top'],\
    row2:Group{orientation:'row',\
      slider_1:Slider{text:'my slider', value:.5, minvalue:.1, maxvalue:.9,preferredSize:[180,25]},\
    },\
  },\
  sliderValGrp:Group{orientation:'column',alignChildren:['center','top'],\
    row3:Group{orientation:'row',\
      sliderVal:StaticText{text:'0.500', },\
    },\
  },\
  mainBtnGrp:Group{orientation:'column',alignChildren:['center','top'],\
    row4:Group{orientation:'row',\
      btn_Twn:Button{text:'Tween!',preferredSize:[60,25]},\
      check_snap:Checkbox{text:'Snap', value:true, helpTip:'Turn on to snap your breakdown to a whole frame.', preferredSize:[60,25]},\
    },\
  },\
}";

function createUserInterface (thisObj, userInterfaceString, scriptName){
  var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable: true});
  if (pal == null) return pal;

  var UI = pal.add(userInterfaceString);

  pal.layout.layout(true);
  pal.layout.resize();
  pal.onResizing = pal.onResize = function () {
    this.layout.resize();
  }
  if ((pal != null) && (pal instanceof Window)){
    pal.show();
  }
  return UI;
};

var UI = createUserInterface(this,resString, "DB Break It Down");
UI.incrementBtnsGrp.row1.btn_1.onClick = function() {
  var snap = UI.mainBtnGrp.row4.check_snap.value;
  tweenMain(.1,snap);
  UI.sliderValGrp.row3.sliderVal.text=0.100;
  UI.sliderGrp.row2.slider_1.value=.100;
};
UI.incrementBtnsGrp.row1.btn_25.onClick = function() {
  var snap = UI.mainBtnGrp.row4.check_snap.value;
  tweenMain(.25,snap);
  UI.sliderValGrp.row3.sliderVal.text=0.250;
  UI.sliderGrp.row2.slider_1.value=.250;
};
UI.incrementBtnsGrp.row1.btn_5.onClick = function() {
  var snap = UI.mainBtnGrp.row4.check_snap.value;
  tweenMain(.5,snap);
  UI.sliderValGrp.row3.sliderVal.text=0.500;
  UI.sliderGrp.row2.slider_1.value=.500;
};
UI.incrementBtnsGrp.row1.btn_75.onClick = function() {
  var snap = UI.mainBtnGrp.row4.check_snap.value;
  tweenMain(.75,snap);
  UI.sliderValGrp.row3.sliderVal.text=0.750;
  UI.sliderGrp.row2.slider_1.value=.750;
};
UI.incrementBtnsGrp.row1.btn_9.onClick = function() {
  var snap = UI.mainBtnGrp.row4.check_snap.value;
  tweenMain(.9,snap);
  UI.sliderValGrp.row3.sliderVal.text=0.900;
  UI.sliderGrp.row2.slider_1.value=.900;
};
UI.sliderGrp.row2.slider_1.onChanging = UI.sliderGrp.row2.slider_1.onChange =function (){UI.sliderValGrp.row3.sliderVal.text = this.value};
UI.mainBtnGrp.row4.btn_Twn.onClick = function(){
  var midPoint = UI.sliderGrp.row2.slider_1.value;
  var snap = UI.mainBtnGrp.row4.check_snap.value;
  tweenMain(midPoint,snap);
};
