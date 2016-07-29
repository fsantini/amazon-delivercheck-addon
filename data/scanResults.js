var SHIPMENT_STATUS = {
  UNDEFINED: 'UNDEFINED',
  YES: 'OK',
  NO: 'NO'
}

function setShipInfo($objDiv, status)
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

function runScan()
{
  //console.log("Running scan");
  $("div.s-item-container").each(function(i) {
    var $thisObject = $(this);
    
    if ($thisObject.prop("amazon-delivery-addon-checked") == true)
    {
      //console.log("div already checked");
      return;
    }
    
    $thisObject.prop("amazon-delivery-addon-checked", true); // don't check this multiple times
    
    var lnk = $thisObject.find("a.s-access-detail-page").attr("href");
    
    if (lnk == null) return;
    //console.log(lnk);
    if (lnk.startsWith("/")) // relative url
    {
      lnk = window.location.protocol + "//" + window.location.host + lnk;
    }
    
    
    setShipInfo($thisObject, SHIPMENT_STATUS.UNDEFINED);
      
    $.get(lnk, function(data) {
        
        if (window.location.host.toLowerCase().indexOf("amazon.com") > -1)
        {
          // this is the .com website, it's a bit different than the international sites
          var deliveryInfo = $(data).find("#fast-track-message");
          if ($(deliveryInfo).text().indexOf("does not ship") > -1)
          {
              //console.log("No delivery");
              setShipInfo($thisObject, SHIPMENT_STATUS.NO);
          } else if ($(deliveryInfo).text().indexOf("ships to") > -1)
          {
              //console.log("Delivery ok");
              setShipInfo($thisObject, SHIPMENT_STATUS.YES);
          }
        } else
        {
          var deliveryInfo = $(data).find("#ddmDeliveryMessage");
          if (deliveryInfo.length == 0)
          {
              //console.log("No deliveryInfo");
          }
          else
          {
              var noDelivery = $(deliveryInfo).find(".a-color-error");
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
