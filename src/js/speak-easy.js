window.onload = init;

function init() {
  if (window.location.href.match(/\#/)) {
    window.location = '/';
  }

  var alcoholContainerHoverOverlays = document.getElementsByClassName('alcohol-container');

  for (var j = 0;j < alcoholContainerHoverOverlays.length;j++) {
    // MOUSE-OVER ALCOHOL
    alcoholContainerHoverOverlays[j].addEventListener('mouseover', function(e) {
      if (e.target.attributes.id) {
        var alcoholType = e.target.attributes.id.nodeValue;
        var recipesToShow = null;
        var alcoholContainerMaskToBlur = null;

        if (alcoholType.match('whisky')) {
            recipesToShow = 'whisky-recipe';
            alcoholContainerMaskToBlur = 'whisky-mask';
        } else if (alcoholType.match('gin')) {
            recipesToShow = 'gin-recipe';
            alcoholContainerMaskToBlur = 'gin-mask';
        } else if (alcoholType.match('rum')) {
            recipesToShow = 'rum-recipe';
            alcoholContainerMaskToBlur = 'rum-mask';
        }

        if (recipesToShow !== null) {
          var recipeElems = document.getElementsByClassName(recipesToShow);

          var targetDistanceFromLeft = e.target.getBoundingClientRect().left;
          for (var l = 0;l < recipeElems.length;l++) {
            recipeElems[l].style.display = 'block';
            recipeElems[l].style.top = '2800px';
            recipeElems[l].style.left = targetDistanceFromLeft + 'px';
          }

          document.getElementById(alcoholContainerMaskToBlur).className = 'alcohol-container-mask on';
        }
      }
    });

    // MOUSE-LEAVE ALCOHOL
    alcoholContainerHoverOverlays[j].addEventListener('mouseout', function(e) {
      var newTargetClassName = e.relatedTarget.className;

      if (!newTargetClassName.match('whisky') && !newTargetClassName.match('gin') &&
        !newTargetClassName.match('rum')) {
        turnOffAlcoholContainers();
      }
    });
  }


  // FORM SUBMIT HANDLER
  document.getElementById('door-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var enteredVal = document.getElementById('door-pass').value.replace(/\s+/gi, '').toLowerCase();
    var correctVal = 'cephalopod';

    if (enteredVal === correctVal) {
      document.getElementById('ask-password').style.display = 'none';
      document.getElementById('wrong-password').style.display = 'none';
      document.getElementById('correct-password').style.display = 'block';
      setTimeout(function() {
        openDoor();
      }, 500);
    } else {
      document.getElementById('ask-password').style.display = 'none';
      document.getElementById('wrong-password').style.display = 'block';
      document.getElementById('correct-password').style.display = 'none';
    }
  });

  // CLICK HANDLER TO OPEN DOOR SLIDER
  document.getElementById("speakeasy-slider").addEventListener("click", function() {
    openDoorSlider();
    showSpeechBubble();
  });

  // CLICK HANDLER TO OPEN/CLOSE DOOR SLIDER
  document.getElementById('speakeasy-stopper').addEventListener('click', function() {
    var doorSliderElem = document.getElementById("speakeasy-slider");

    if (doorSliderElem.className === 'open') {
      hideSpeechBubble();
      closeDoorSlider();
    } else {
      openDoorSlider();
      showSpeechBubble();
    }
  });

  // INITIALIZE SMOOTH SCROLL
  smoothScroll.init();
};

function turnOffAlcoholContainers() {
  var alcoholContainerMasks = document.getElementsByClassName('alcohol-container-mask');
  var recipeElems = document.getElementsByClassName('alcohol-container-text');

  for (var l = 0;l < recipeElems.length;l++) {
    recipeElems[l].style.display = 'none';
  }

  for (var j = 0;j < alcoholContainerMasks.length;j++) {
    alcoholContainerMasks[j].className = 'alcohol-container-mask';
  }
};

function showSpeechBubble() {
  document.getElementById('speach-bubble').style.display = 'block';
};

function hideSpeechBubble() {
  document.getElementById('speach-bubble').style.display = 'none';
};

function openDoorSlider() {
  document.getElementById("speakeasy-slider").className = 'open';
  document.getElementById('door-entry-input-container').style.display = 'block';
};

function closeDoorSlider() {
  document.getElementById("speakeasy-slider").className = '';
  document.getElementById('door-entry-input-container').style.display = 'none';
  document.getElementById('door-pass').value = '';
};

function openDoor() {
  setTimeout(function() {
    document.getElementById('door-form').style.display = 'none';
    document.getElementById("door-closed").className = 'open-animation';
    window.scrollTo(0, 0);

    setTimeout(function() {
      document.getElementById("door-closed").style.display = 'none';
      document.getElementById("door-open").style.display = 'block';
      
      setTimeout(function() {
        document.getElementById("people-group").className = 'visible';

        var anchorElems = document.getElementsByTagName('a');
        for (var i = 0;i < anchorElems.length;i++){
          anchorElems[i].className  = 'no-glow'; 
        }
      }, 100);
    }, 1000);
  }, 500);
};
