var consoleTableData = [];
function printLog(platformType, isDebug, pageRecord) {
  function ConsoleInfo(id, page, duration, startTime, endTime) {
    this["id"] = id;
    this["页面"] = page;
    this["停留时长"] = duration;
    this["开始时间"] = startTime;
    this["结束时间"] = endTime;
  }

  function getfriendTime(timestamp) {
    return (
      Math.floor(timestamp / 1000 / 60) +
      "分" +
      ((timestamp / 1000) % 60) +
      "秒"
    );
  }
  function debugConsole(pageRecord) {
    console.clear();
    console.log("原始数据:", pageRecord);
    // console.log('window.voyager====', window.voyager);
    consoleTableData.push(
      new ConsoleInfo(
        pageRecord.id,
        pageRecord.location ? pageRecord.location.href : window.location.href,
        getfriendTime(pageRecord.duration),
        pageRecord.startTime
          ? moment(pageRecord.startTime).format("YYYY-MM-DD hh:mm:ss a")
          : "",
        pageRecord.endTime
          ? moment(pageRecord.endTime).format("YYYY-MM-DD hh:mm:ss a")
          : ""
      )
    );
    console.table(consoleTableData);
  }

  debugConsole(pageRecord);
}
