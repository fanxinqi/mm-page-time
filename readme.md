# 用户活跃停留时长统计（time on page）

**页面停留时间（Time on Page)**  简称 TP 是分析用户粘性的重要指标之一
停留时长也可以侧面反映出网站的用户体验。平均访问时长越短，说明网站对用户的吸引力越差，可用内容信息越少。

<img src="https://github.com/fanxinqi/mm-page-time/blob/main/doc/time-on-page.jpeg" width="600" height="400" align="left" />

作者：Fsn_soul
链接：https://www.jianshu.com/p/5c1805c6f0ff
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
## 兼容性

- [x] pc、mobile 主流浏览器
- [ ] 目前不支持 app，app 一般是 native 实现停留时长即可

## 功能支持

- [x] 支持统计多页面应用
- [x] 支持统计单页面应用
  - [x]支持 hash router
  - [x] 支持 history router
- [x] 支持统计单页面应用
- [x] 时长统计会去除浏览器最小化、睡眠、锁屏等无效时间

## 使用

```javascript
import MMPageTime from "mm-page-time";

const mmPageTime = new MMPageTime();
mmPageTime.init();
mmPageTime.on("pageLeave", function (pageRecord) {
  console.log("页面停留时长" + getfriendTime(pageRecord.duration));
  // send 发送逻辑
});

function getfriendTime(timestamp) {
  return (
    Math.floor(timestamp / 1000 / 60) + "分" + ((timestamp / 1000) % 60) + "秒"
  );
}
```
