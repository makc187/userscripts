// ==UserScript==
// @name          Custom UI Navigation Panel
// @description   example script to alert "Hello world!" on every page
// @include       *
// @exclude       http://diveintogreasemonkey.org/*
// @exclude       http://www.diveintogreasemonkey.org/*
// @exclude       *.gastronovi.com/*
// @grant         none
// ==/UserScript==


if(true) {
   // ...:
  //alert('Hello world3!');
  var css = 'body { padding-bottom: 60px !important; /*max-width: 100% !important; overflow-x: hidden !important;*/ }',
  head = document.head || document.getElementsById('head')[0],
  style = document.createElement('style');
  head.appendChild(style);
  style.type = 'text/css';
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  
  //<meta name="viewport" content="width=device-width, initial-scale=1.0">
  let metaElem = document.createElement('meta');
  metaElem.setAttribute('name', 'viewport');
  metaElem.setAttribute('content', 'width=device-width, initial-scale=1.0');
  //document.head.prepend(metaElem);
  
  // custom per page mods:
  if(false) {
      var elem = document.querySelector(".c-page-header-navigation__flyout");
      if(elem) {
          elem.style = "display: none;";
      }
  }
}

function canNavigateForward() {
    const currentState = history.state;

    // Call history.forward() and check if it changes the state
    history.forward();
    const newState = history.state;

    // Restore the state
    history.back();

    // If the new state is different from the current state, navigation forward is possible
    var can = newState !== currentState;
    
    if(!can) {
        history.forward();
    }
    
    return can;
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function flaotingDiv(){

    //How much the screen has been zoomed.
    var zoomLevel = ((screen.width)/(window.innerWidth));
    //By what factor we must scale the div for it to look the same.
    var inverseZoom = ((window.innerWidth)/(screen.width));
    //The div whose size we want to remain constant.
    var h = document.getElementById("fixed-panel");

    //This ensures that the div stays at the top of the screen at all times. For some reason, the top value is affected by the zoom level of the Div. So we need to multiple the top value by the zoom level for it to adjust to the zoom. 
    h.style.top = (((window.pageYOffset) + 5) * zoomLevel).toString() + "px";

    //This ensures that the window stays on the right side of the screen at all times. Once again, we multiply by the zoom level so that the div's padding scales up.
    h.style.paddingLeft = ((((window.pageXOffset) + 5) * zoomLevel).toString()) + "px";

    //Finally, we shrink the div on a scale of inverseZoom.
    h.style.zoom = inverseZoom;
}

function displayWindowSize(){
        // Get width and height of the window excluding scrollbars
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        
        // Display result inside a div element
        window.alert("Width: " + w + ", " + "Height: " + h);
}

(function() {
    'use strict';
    
    if(false) {
        return;
    }
    
    if(inIframe()) {
        return;
    }

    var createPanel = function() {
    // Create a div for the fixed panel
    const panelDiv = document.createElement('div');
    panelDiv.className = 'fixed-panel';
    panelDiv.setAttribute("id", "fixed-panel");
    
    const panel = document.createElement('div');
    panel.className = 'pan';
    panelDiv.appendChild(panel);

    // Add buttons to the panel
    const buttonLabels = [
        '×', 
        '&rsaquo;', 
        '&lsaquo;', 
        '&lsaquo;', 
        '&rsaquo;'
    ];
    const buttonDisabled = [
        false,
        false, 
        false, 
        /*history.state != null*/
        false,
        /*canNavigateForward()*/
        false
    ];
    const buttonStyles = [
        'scale: 0.75; font-weight: 500;',
        'rotate: 90deg; translate: 0px 1px;',
        'rotate: 90deg; translate: 0px 1px;',
        buttonDisabled[2] ? 'color: gray !important;' : '',
        buttonDisabled[3] ? 'color: gray !important;' : ''
    ];
    const buttonActions = [
        () => document.querySelector('#fixed-panel').style.display = 'none',
        () => window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: "smooth",
        }),  // Scroll to bottom
        () => window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                }),                             // Scroll to top
        () => history.back(),                                    // History back
        () => {
            var nextbutton = document.querySelector(".beitrags_navigation .next a");
            if(!nextbutton) {
                nextbutton = document.querySelector(".paginierung a");
            }
            if(nextbutton) {
                nextbutton.click();
            } else {
                history.forward();
            }
        }                       
        // History forward
    ];

    for (let i = 0; i < buttonLabels.length; i++) {
        const button = document.createElement(/*'button'*/'div');
        button.innerHTML = buttonLabels[i];
        button.onclick = (e) => {
            //var evt = e ? e : window.event;
            //evt.preventDefault();
            //evt.stopPropagation(); 
            buttonActions[i]();
        }
        //button.ontouchstart = () => alert(event);
        button.style = buttonStyles[i];
        button.setAttribute("class", "bttn");
        panel.appendChild(button);
    }
    return panelDiv;
    }

    const currentUrl = window.location.href;

    // Check if the URL contains url, where the panel should not be shown. exit in that cases
    if (currentUrl.includes("vercel.com")) {
       return;
    }

    document.body.appendChild(createPanel());
    /*setInterval(() => {
        var fp = document.querySelector("#fixed-panel");
        if(fp) {
            fp.parentNode.removeChild(fp);
        }
        document.body.appendChild(createPanel());
    }, 5000);*/
    // Append the panel to the body
    //document.body.appendChild(panelDiv);
    //document.documentElement.appendChild(panelDiv);

    // Add styles for the panel and buttons
    const style = document.createElement('style');
    style.textContent = `
        .fixed-panel {
            position: fixed;
            bottom: 0px;
            margin-bottom: 8px;
            /*position: absolute;*/
            width: calc(50vw - 0px);
            height: calc(30px - 0px);
            right: 0;
            /*transform: translateX(-50%);*/
            background-color: 
            /*rgba(8, 8, 8,0.95)*/ 
            rgba(40,40,40,0.8)
            /*rgba(128,128,128,0.8)*/
            !important;
            -webkit-backdrop-filter: /*saturate(100%) blur(25px);*/ saturate(280%) blur(20px);
            z-index: 100000;
            -webkit-user-select: none;
            overflow: hidden;
            /*transform: translateZ(20000px);*/
            border-radius: 15px;
            margin-right: 25vw;
        }
        
        .pan {
            /*background-color: rgba(32, 32, 32, 0.55);
            mix-blend-mode: darken;*/
            width: calc(100% - 0.5px);
            height: calc(100% - 0.5px);
            display: flex;
            justify-content: space-around;
            align-items: center;
            border: gray solid 1px;
            -webkit-user-select: none;
            border-radius: 15px;
        }

        .fixed-panel .bttn/*button*/ {
            padding: 5px 10px;
            margin-top: -3px;
            font-size: 16px !important;
            font-family: 'verdana' !important;
            /*color: rgba(64,156,255,1) !important;*/
            color: rgba(255,255,255,1) !important;
            background-color: transparent;
            border: none;
            
            cursor: pointer;
            transform: scale(2) !important;
            -webkit-user-select: none;
            /*background-color: rgba(72, 72, 72, 0.0);*/
            background-color: rgba(128, 128, 128, 0.0);
            /*-webkit-tap-highlight-color: rgba(64,156,255,1) !important;/*
            /*-webkit-tap-highlight-color: rgba(0,0,0,0) !important;*/
            -webkit-backface-visibility: hidden !important;
            -webkit-tap-highlight-color: transparent !important;
            tap-highlight-color: transparent !important;
        }
        
        /** {
            -webkit-backface-visibility: hidden !important;
            -webkit-tap-highlight-color: transparent !important;
            tap-highlight-color: transparent !important;
        }*/
        
        /* ---page custom css--- */
        /* or better?: listen on elems which are getting sticked and add them a 60px to the buttom, or by transform/translate.. */
        /* welt.de */
        .c-page-header-navigation__flyout {
            display: none;
        }
        .c-social-bar--is-sticky,
        ul.c-social-bar__list.is-sticking-to-bottom
        {
            /*bottom: 60px;*/
        }
        /* focus.de */
        section#main {
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    
    //window.onscroll = flaotingDiv;
    //displayWindowSize();
    //window.addEventListener("resize", displayWindowSize);
    //alert('before redirect');
    
    // Function to adjust bottom value of an element
    function adjustBottomValue(element) {
      const style = window.getComputedStyle(element);
      const position = style.position;
    
      // Check if the position is static, fixed, or sticky
      if (position === 'static' || position === 'fixed' || position === 'sticky') {
        // Parse the current 'bottom' value or set it to 0 if not specified
        const currentBottom = parseFloat(style.bottom) || 0;
    
        // Set the 'bottom' value to 60px (if it's not already set to 60px)
        element.style.bottom = (currentBottom + 60)+'px';
      }
    }
    
    // Function to handle newly added nodes
    function handleNewNodes(nodes) {
      nodes.forEach((node) => {
        // Only handle element nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          adjustBottomValue(node);
        }
    
        // Check all children of the added element for any matching elements
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          node.querySelectorAll('*').forEach(adjustBottomValue);
        }
      });
    }
    
    // Set up the MutationObserver to listen for added nodes in the DOM
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          handleNewNodes(mutation.addedNodes);
        }
      });
    });
    
    // Start observing the document body for childList changes (new elements)
    /*observer.observe(document.body, {
      childList: true, // Observe addition or removal of child elements
      subtree: true    // Also observe all descendants of the target
    });*/
    
     function maintainFixedSize() {
         const viewportScale = window.visualViewport ? window.visualViewport.scale : 1;
         const zoomFactor = 1 / viewportScale;
     
         const fixedSizeDiv = document.querySelector('.fixed-panel');
         fixedSizeDiv.style.transform = `scale(${zoomFactor})`;
         
         if(window.visualViewport) {
             const bottomOffset = window.visualViewport.height - window.visualViewport.offsetTop - window.innerHeight;
             const rightOffset = (window.visualViewport.width - window.visualViewport.offsetLeft - window.innerWidth)*zoomFactor*2;
             //console.log("rightOffset:", rightOffset);
             
             /*fixedSizeDiv.style.left = `${window.visualViewport.offsetLeft}px`;*/
             fixedSizeDiv.style.right = `${(window.visualViewport.offsetLeft + (rightOffset))}px`;
             fixedSizeDiv.style.bottom = `${-2+0*Math.max(0, -window.visualViewport.offsetTop + bottomOffset)}px`;
             
         }
       }
     
       // Attach listeners to update when the viewport changes
       window.addEventListener('resize', maintainFixedSize);
       window.visualViewport.addEventListener('resize', maintainFixedSize);
       window.visualViewport.addEventListener('scroll', maintainFixedSize);
     
       // Initialize on page load
       window.addEventListener('DOMContentLoaded', maintainFixedSize);
    
})();































