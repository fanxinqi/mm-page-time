# 用户活跃停留时长统计（time on page）

**页面停留时间（Time on Page)**  简称 TP 是分析用户粘性的重要指标之一
停留时长也可以侧面反映出网站的用户体验。平均访问时长越短，说明网站对用户的吸引力越差，可用内容信息越少。

<div>
  <img style="border-radius: 40px;
    border: 0.5px solid brown;" src="https://github.com/fanxinqi/mm-page-time/blob/main/doc/time-on-page.jpeg"  height="400" />
<div>

## 兼容性

- [x] pc、mobile 主流浏览器
- [ ] 目前不支持 app，app 一般是 native 实现停留时长即可

## 功能支持

- [x] 支持统计多页面应用
- [x] 支持统计单页面应用
  - [x] 支持 hash router
  - [x] 支持 history router
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

## 测试

```javascript
npm run test

```
- hash demo 访问地址：http://127.0.0.1:8000/test/hash
- history demo 访问地址：http://127.0.0.1:8000/test/history
- 多页面 应用demo 访问地址：http://10.6.1.165:8000/test/multi-page/
