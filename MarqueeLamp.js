import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';

export default class MarqueeLabel extends Component {
  state = {
    started: false // 开始动画标识
  };

  componentWillMount() {
    this.animateAirection = this.props.animateAirection;

    if (this.animateAirection == 'level') { // 水平方向滚动
      this.levelInitStatus();
    } else if (this.animateAirection == 'vertical') { // 垂直方向滚动
      this.verticalInitStatus();
    }

    this.duration = 0;
    this.shouldFinish = false;
  }

  levelInitStatus() {
    this.animatedTransformX = new Animated.Value(0);
    this.bgVieWidth = 0;
    this.containerWidth = 0;
    this.animateAirectionLevel = true;
    this.animateType = this.animatedTransformX;
  }

  verticalInitStatus() {
    this.animatedTransformY = new Animated.Value(0);
    this.bgVieHeight = 0;
    this.containerHeight = 0;
    this.animateAirectionVertical = true;
    this.animateType = this.animatedTransformY;
  }

  componentWillUnmount() {
    this.shouldFinish = true;
  }

  containerWOnLayout(e) { // 当组件的布局发生变动的时候，会自动调用下面的方法
    this.containerWidth = e.nativeEvent.layout.width;
    if (this.bgViewWidth) {
      this.prepareToAnimate();
    }
  }

  bgViewWOnLayout(e) {
    this.bgViewWidth = e.nativeEvent.layout.width;
    if (this.containerWidth) {
      this.prepareToAnimate();
    }
  }

  containerHOnLayout(e) {
    this.containerHeight = e.nativeEvent.layout.height;
    if (this.bgViewHidth) {
      this.prepareToAnimate();
    }
  }

  bgViewHOnLayout(e) {
    this.bgViewHidth = e.nativeEvent.layout.height;
    if (this.containerHeight) {
      this.prepareToAnimate();
    }
  }

  prepareToAnimate() { // 开始动画
    const { duration, speed } = this.props; // 一次动画的持续时间 和 速度
    if (duration !== undefined) {
      this.duration = duration;
    } else if (speed !== undefined) {
      if (this.animateAirectionVertical) {
        this.duration = ((this.bgVieHeight + this.containerHeight) / speed) * 1000;
      } else if (this.animateAirectionLevel) {
        this.duration = ((this.bgVieWidth + this.containerWidth) / speed) * 1000;
      }
    }

    this.animate();
  }

  animate() {
    if (this.animateAirectionVertical) {
      this.animatedTransformY.setValue(this.bgVieHeight);
      this.verticalAnimated();
    } else if (this.animateAirectionLevel) {
      this.animatedTransformX.setValue(this.bgViewWidth);
      this.levelAnimated();
    }

    if (!this.state.started) {
      this.setState({
        started: true
      });
    }
  }

  levelAnimated() { // 水平滚动动画
    Animated.timing(this.animateType, {
      toValue: -this.containerWidth,
      duration: this.duration,
      useNativeDriver: true,
      easing: Easing.linear
    }).start(() => {
      if (!this.shouldFinish) {
        this.animate()
      }
    });
  }

  verticalAnimated() { // 垂直滚动动画
    Animated.timing(this.animateType, {
      toValue: -this.containerHeight,
      duration: this.duration,
      useNativeDriver: true,
      easing: Easing.linear
    }).start(() => {
      if (!this.shouldFinish) {
        this.animate()
      }
    });
  }

  render() {
    const {
      duration, // 一次动画的持续时间
      speed, // 滚动速度
      animateAirection, // 滚动方向
      children, // 滚动View
      text, // 滚动文本
      bgViewStyle, // 外层View 样式
      textStyle, // 如果是文本滚动，就需要文本样式 否则不需要传
      // containerWidth, // 滚动内容的宽度
      // containerHeight, // 滚动内容的高度
      containerStyle // 滚动内容样式
    } = this.props;

    const { started } = this.state;

    return (
      <View
        style={{ ...styles.bgViewStyle, ...bgViewStyle }}
        onLayout={(event) => {
          if (this.animateAirectionLevel) {
            return this.bgViewWOnLayout(event);
          } else if (this.animateAirectionVertical) {
            return this.bgViewHOnLayout(event);
          }
        }}
      >
        <View
          style={{
            ...styles.containerStyle,
            opacity: started ? 1 : 0
          }}
        >
         {
           children ? <Animated.View
            style={[
              {
                transform: this.animateAirectionLevel ? [{ translateX: this.animatedTransformX }] : [{ translateY: this.animatedTransformY }]
              }
            ]}
            onLayout={(event) => {
              if (this.animateAirectionLevel) {
                return this.containerWOnLayout(event);
              } else if (this.animateAirectionVertical) {
                return this.containerHOnLayout(event);
              }
            }}
          >
            {children}
          </Animated.View>
          : <Animated.Text
            style={[
              {
                transform: this.animateAirectionLevel ? [{ translateX: this.animatedTransformX }] : [{ translateY: this.animatedTransformY }]
              }
            ]}
            onLayout={(event) => {
              if (this.animateAirectionLevel) {
                return this.containerWOnLayout(event);
              } else if (this.animateAirectionVertical) {
                return this.containerHOnLayout(event);
              }
            }}
          >
            {text}
          </Animated.Text> }
        </View>
      </View>
    );
  }
}

const styles = {
  bgViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'scroll',
  }
};
