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

  containerWOnLayout(e) { // 当这个组件布局发生变化的时候，调用这个方法
    this.containerWidth = e.nativeEvent.layout.width;
    if (this.bgViewWidth !== 0) {
      this.prepareToAnimate();
    }
  }

  bgViewWOnLayout(e) {
    this.bgViewWidth = e.nativeEvent.layout.width;
    if (this.containerWidth !== 0) {
      this.prepareToAnimate();
    }
  }

  containerHOnLayout(e) {
    this.containerHeight = e.nativeEvent.layout.height;
    if (this.bgViewHidth !== 0) {
      this.prepareToAnimate();
    }
  }

  bgViewHOnLayout(e) {
    this.bgViewHidth = e.nativeEvent.layout.height;
    if (this.containerHeight !== 0) {
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

  levelAnimated() {
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

  verticalAnimated() {
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
      children,
      text,
      bgViewStyle, // Backgound View Custom Styles
      textStyle, // Text Custom Styles

      // Text Container Width:
      // to make the text shown in one line, this value should be larger than text width
      textContainerWidth = 1000,

      // Text Container Height:
      // to make the text shown in one line, this value should be larger than text height
      // usually increase this value when text has a large font size.
      textContainerHeight = 100,

      textContainerStyle // Text Container Custom Styles, not recommended to use
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
            ...styles.textContainerStyle,
            width: textContainerWidth,
            height: textContainerHeight,
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
            {children}
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
  },

  textContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
};
