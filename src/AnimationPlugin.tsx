import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import PluginTools from './plugins';
import Animated from 'react-native-reanimated';

const styles = StyleSheet.create({
  full: {
    height: '100%',
    width: '100%',
  },
});

type AnimationPluginProps = {};

const AnimationPlugin: any = (props: {
  config: AnimationPluginProps;
  isVisible: boolean;
}) => {
  const {isVisible} = props;

  const openness = useDerivedValue(
    () => withSpring(isVisible ? 0 : -400),
    [isVisible],
  );

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: openness.value,
      },
    ],
  }));

  return (
    <>
      <PluginTools.BackdropWrapper>
        {({content}) => content}
      </PluginTools.BackdropWrapper>
      <PluginTools.ContentWrapper>
        {({content}) => {
          console.log('got called with some content', content);
          return (
            <Animated.View style={[animatedStyles, styles.full]}>
              {content}
            </Animated.View>
          );
        }}
      </PluginTools.ContentWrapper>
    </>
  );
};

AnimationPlugin.displayName = 'AnimationPlugin';

export default AnimationPlugin;
