
$("div.s-item-container").each(function(i) {
  var $thisObject = $(this);
  var lnk = $thisObject.find("a.s-access-detail-page").attr("href");
  
  if (lnk == null) return;
  //console.log(lnk);
  if (lnk.startsWith("/")) // relative url
  {
    lnk = window.location.protocol + "//" + window.location.host + lnk;
  }
  
  
  $thisObject.css("border", "2px solid yellow");
    
  $.get(lnk, function(data) {
      
      if (window.location.host.toLowerCase().indexOf("amazon.com") > -1)
      {
        // this is the .com website, it's a bit different than the international sites
        var deliveryInfo = $(data).find("#fast-track-message");
        if ($(deliveryInfo).text().indexOf("does not ship") > -1)
        {
            //console.log("No delivery");
            $thisObject.css("border", "2px solid red");
        } else if ($(deliveryInfo).text().indexOf("ships to") > -1)
        {
            //console.log("Delivery ok");
            $thisObject.css("border", "2px solid green");
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
            console.log(noDelivery);
            if (noDelivery.length > 0)
            {
                //console.log("No delivery");
                $thisObject.css("border", "2px solid red");
                
            }
            else
            {
                //console.log("Delivery ok");
                $thisObject.css("border", "2px solid green");
            }
        }
      }
  });
});
