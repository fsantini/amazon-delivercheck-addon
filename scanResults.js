var SHIPMENT_STATUS = {
  UNDEFINED: 'UNDEFINED',
  YES: 'OK',
  NO: 'NO'
}

var isFF = (navigator.userAgent.search("Firefox") >= 0);

var blackAndWhite = undefined;

function checkDisplayPreferenceFF()
{
  function setCurrentChoice(result) {
    try {
        blackAndWhite = result.amazon_delivercheck_useBW;
    } catch(err)
    {
        blackAndWhite = false;
    }
        
  }

  function onError(error) {
    //console.log(`Error: ${error}`);
    blackandWhite = false;
  }

  var getting = browser.storage.local.get("amazon_delivercheck_useBW");
  getting.then(setCurrentChoice, onError);
}

function checkDisplayPreferenceChrome() {
  function setCurrentChoice(result) {
    try {
        blackAndWhite = result.amazon_delivercheck_useBW;
    } catch(err)
    {
        blackAndWhite = false;
    }
        
  }

  var getting = chrome.storage.sync.get("amazon_delivercheck_useBW", setCurrentChoice);
}

function checkDisplayPreference() {
    if (isFF)
    {
        console.log("Firefox");
        checkDisplayPreferenceFF();
    }
    else
    {
        console.log("Chrome");
        checkDisplayPreferenceChrome();
    }
}

function setShipInfo($objDiv, status)
{
  if (blackAndWhite)
  {
    switch(status)
    {
        case SHIPMENT_STATUS.YES:
        $objDiv.css("border", "4px solid black");
        break;
        case SHIPMENT_STATUS.NO:
        $objDiv.css("border", "4px dotted black");
        break;
        case SHIPMENT_STATUS.UNDEFINED:
        default:
        $objDiv.css("border", "4px dashed black");
    }
  } else
  {
    switch(status)
    {
        case SHIPMENT_STATUS.YES:
        $objDiv.css("border", "2px solid green");
        break;
        case SHIPMENT_STATUS.NO:
        $objDiv.css("border", "2px solid red");
        break;
        case SHIPMENT_STATUS.UNDEFINED:
        default:
        $objDiv.css("border", "2px solid yellow");
    }
  }
}

checkDisplayPreference();

function runScan()
{
  //console.log("Running scan");
  $(".s-item-container,.productContainer,.sx-table-item").each(function(i) {
    var $thisObject = $(this);
    
    if ($thisObject.prop("amazon-delivery-addon-checked") == true)
    {
      //console.log("div already checked");
      return;
    }
    
    $thisObject.prop("amazon-delivery-addon-checked", true); // don't check this multiple times
    
    //var lnk = $thisObject.find("a.s-access-detail-page").attr("href");
    var lnk = $thisObject.find("a").attr("href");
    
    if (lnk == null) return;
    //console.log(lnk);
    if (lnk.startsWith("/")) // relative url
    {
      lnk = window.location.protocol + "//" + window.location.host + lnk;
    }
    
    
    setShipInfo($thisObject, SHIPMENT_STATUS.UNDEFINED);
      
    $.get(lnk, function(data) {
        
        //data = parser.sanitize(data, parser.SanitizerAllowStyle);
      
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(data, "text/html");
        //console.log(htmlDoc);
        
        if (window.location.host.toLowerCase().indexOf("amazon.com") > -1)
        {
          // this is the .com website, it's a bit different than the international sites
          var deliveryInfo = htmlDoc.getElementById("fast-track-message");
          
          if (deliveryInfo.innerHTML.indexOf("does not ship") > -1)
          {
              //console.log("No delivery");
              setShipInfo($thisObject, SHIPMENT_STATUS.NO);
          } else if (deliveryInfo.innerHTML.indexOf("ships to") > -1)
          {
              //console.log("Delivery ok");
              setShipInfo($thisObject, SHIPMENT_STATUS.YES);
          }
        } else
        {
          var deliveryInfo = htmlDoc.getElementById("ddmDeliveryMessage");
          if (deliveryInfo == null)
          {
              //console.log("No deliveryInfo");
          }
          else
          {
              var noDelivery = deliveryInfo.getElementsByClassName("a-color-error");
              if (noDelivery.length > 0)
              {
                  //console.log("No delivery");
                setShipInfo($thisObject, SHIPMENT_STATUS.NO);
                  
              }
              else
              {
                  //console.log("Delivery ok");
                  setShipInfo($thisObject, SHIPMENT_STATUS.YES);
              }
          }
        }
    });
  });
}

setInterval(runScan, 1000); // run the script every second to catch ajax changes
//runScan()
