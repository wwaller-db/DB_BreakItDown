
/*
DB_BreakItDown.jsx
Copyright (c) 2019 Dripsblack, LLC. (William M. Waller II). All rights reserved.
www.dripsblack.com

Name: DB_BreakItDown
Version: 1.2

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

Now, just select two keys, place the playhead where you want the break down to be
placed, and set the slider to the value proportion you want and hit tween. .1 would
be a value close to the start key, .5 would be right in the middle, .9 would be
near the end key value.

Limitations:
This has only been tested on transform properties. I'm sure there are a lot of
other problems lurking.

Version 1.2 Updates:
The time of the breakdown is now determined by the location of the playhead.

*/

// Linear interpolation between two values (a, b) based on a proportion between the two (n)
function lin(a, b, n) {
  return (1 - n) * a + n * b;
}

// Creates the breakdown keyframe on each selected property.
function breakDown(lyr, time, val){
    //get and loop through selected props
    var props = lyr.selectedProperties;
    for (var k=0; k< props.length; k++){
        prop = props[k];
        //check that there are only two keys selected.
        if (prop.propertyType === PropertyType.PROPERTY){
          if (prop.selectedKeys.length === 2) {
              //get values and times of start and end keys
              keyStart = prop.selectedKeys[0];
              keyStartTime = prop.keyTime(keyStart);
              keyStartVal = prop.keyValue(keyStart);
              keyEnd = prop.selectedKeys[1];
              keyEndTime = prop.keyTime(keyEnd);
              keyEndVal = prop.keyValue(keyEnd);
              keyMidVal = lin(keyStartVal,keyEndVal,val);
              //create the break down key.
              if(keyStartTime < time && keyEndTime > time){
                prop.setValueAtTime(time,keyMidVal);
              } else {
                alert("Place the Playhead between selected keys where you want the breakdown to be.")
              }
          } else {
              alert("Select 2 keys per property to breakdown.");
          }
        }
    }
}

// The main control function that loops through all the selected layers and runs
// breakDown().
function tweenMain(val){
  currentComp = app.project.activeItem;
  selLyrs = currentComp.selectedLayers;
  currTime =currentComp.time;
  frameRate = currentComp.frameRate;
  if (selLyrs.length === 0) {
    alert("Select 2 keys per property to breakdown.");
  } else {
    app.beginUndoGroup("Tween")
    for (var i=0; i< selLyrs.length; i++){
      breakDown(selLyrs[i],currTime,val);
    }
    app.endUndoGroup;
  }
}

// UI Resource string
var resString =
"group{orientation:'column',alignment:['fill','fill'],\
  panel_value:Panel{orientation:'column', alignment:['fill','fill'],\
    label_value:StaticText{text:'Value'},\
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
  },\
  mainBtnGrp:Group{orientation:'column',alignChildren:['center','top'],\
    row4:Group{orientation:'row',\
      btn_Twn:Button{text:'Breakdown!',preferredSize:[75,25]},\
    },\
  },\
}";

// Create UI
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
var uiVal = UI.panel_value;

//UI Events

//Value
uiVal.incrementBtnsGrp.row1.btn_1.onClick = function() {
  uiVal.sliderValGrp.row3.sliderVal.text=0.100;
  uiVal.sliderGrp.row2.slider_1.value=.100;
};
uiVal.incrementBtnsGrp.row1.btn_25.onClick = function() {
  uiVal.sliderValGrp.row3.sliderVal.text=0.250;
  uiVal.sliderGrp.row2.slider_1.value=.250;
};
uiVal.incrementBtnsGrp.row1.btn_5.onClick = function() {
  uiVal.sliderValGrp.row3.sliderVal.text=0.500;
  uiVal.sliderGrp.row2.slider_1.value=.500;
};
uiVal.incrementBtnsGrp.row1.btn_75.onClick = function() {
  uiVal.sliderValGrp.row3.sliderVal.text=0.750;
  uiVal.sliderGrp.row2.slider_1.value=.750;
};
uiVal.incrementBtnsGrp.row1.btn_9.onClick = function() {
  uiVal.sliderValGrp.row3.sliderVal.text=0.900;
  uiVal.sliderGrp.row2.slider_1.value=.900;
};
uiVal.sliderGrp.row2.slider_1.onChanging = uiVal.sliderGrp.row2.slider_1.onChange =function (){uiVal.sliderValGrp.row3.sliderVal.text = this.value};

UI.mainBtnGrp.row4.btn_Twn.onClick = function(){
  var val = uiVal.sliderGrp.row2.slider_1.value;
  tweenMain(val);
};
