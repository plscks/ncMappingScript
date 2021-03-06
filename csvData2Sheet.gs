function parseCSVData() {
  /////////////////
  //  SETUP AREA //
  /////////////////

  var csvUrl = "https://github.com/plscks/ncMappingScript/raw/master/mapdata.csv"
  var csvContent = UrlFetchApp.fetch(csvUrl).getContentText();
  var csvData = Utilities.parseCsv(csvContent);
  var sheet = SpreadsheetApp.getActiveSheet();

  //////////////////
  // TESTING ZONE //
  //////////////////

  Logger.log("Testing output:")


  ////////////////////////////
  // MOSTLY FUNCTIONAL CODE //
  ////////////////////////////

  for(var i = 1; i < csvData.length; i++) {
    var base = Number(65);
    Logger.log(base);
    var x = base + Number(csvData[i][0]);
    Logger.log(x)
    if (x >= 91) {
      if (x >= 117) {
        x = x - 52;
        var X = "B" + String.fromCharCode(x);
        var y = Number(csvData[i][1]) + 1;
        var cell = X + y;
        cell = cell.replace(/\s/g, '');
        Logger.log("Cell: " + cell + " Color: " + csvData[i][3]);
        var range = sheet.getRange(cell);
        range.setBackground(csvData[i][3]);
        continue;
      }
      x = x - 26;
      var X = "A" + String.fromCharCode(x);
      var y = Number(csvData[i][1]) + 1;
      var cell = X + y;
      cell = cell.replace(/\s/g, '');
      Logger.log("Cell: " + cell + " Color: " + csvData[i][3]);
      var range = sheet.getRange(cell);
      range.setBackground(csvData[i][3]);
    } else {
      var X = String.fromCharCode(x);
      var y = Number(csvData[i][1]) + 1;
      var cell = X + y;
      cell = cell.replace(/\s/g, '');
      Logger.log("Cell: " + cell + " Color: " + csvData[i][3]);
      var range = sheet.getRange(cell);
      range.setBackground(csvData[i][3]);
    }
  }
}
