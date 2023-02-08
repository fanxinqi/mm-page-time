var consoleTableData = [];

function printLog(platformType, isDebug, pageRecord) {
  function ConsoleInfo(
    id,
    page,
    duration,
    startTime,
    endTime,
    referer,
    unActiveDuration,
  ) {
    this["id"] = id;
    this["页面"] = page;
    // this["停留时长"] = duration;
    // this["开始时间"] = startTime;
    // this["结束时间"] = endTime;
    this["上一个页面"] = referer;
    // this["不活跃时长"] = unActiveDuration;
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
    const unActiveDuration =
      pageRecord?.unActiveDuration?.map((item) => {
        return getfriendTime(item);
      }) || [];
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
          : "",
        pageRecord.referer,
        unActiveDuration.join(",")
      )
    );
    console.table(consoleTableData);
  }

  debugConsole(pageRecord);
}
