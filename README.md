# MarqueeLamp
react-native 跑马灯 支持text View 和 左右 上下滚动

#参数： 
duration 一次动画的持续时间
speed 速度
animateAirection level 水平滚动 vertical垂直滚动
text 文本
children View
。。。

#如何用
<MarqueeLabel
  duration={8000}
  text={'This is a Marquee Label.'} 或 children = {<View><Text>View</Text></View>}
  textStyle={{ fontSize: 13, color: 'white' }}
/>
