

scanner.addEventListener("click", function() {
    fnScanEnable()
  
});

function fnScanEnable() { 
    EB.Barcode.enable({allDecoders:true},fnBarcodeScanned); 
     document.getElementById('scanData').value = "enabled: press HW trigger to capture.";   
}

function fnBarcodeScanned(jsonObject) {
    console.log("Barcode Scanned:{" + JSON.stringify(jsonObject) + "}");
    document.getElementById('scanData').value = "barcode: " + jsonObject.data;
  }

  function fnScanDisable() { 
    EB.Barcode.disable(); 
    document.getElementById('scanData').value = "disabled: press 'enable' to scan.";  
  }