/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { type DimensionValue, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const ShimmerPlaceholder = ({
  height,
  width,
  borderRadius,
}: {
  height: DimensionValue;
  width: DimensionValue;
  borderRadius: number;
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      true,
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 1],
      ['#e0e0e0', '#f5f5f5'], // shimmer-like effect
    );
    return { backgroundColor };
  });

  return (
    <AnimatedView
      style={{
        height,
        width,
        borderRadius,
        overflow: 'hidden',
      }}
      animatedProps={animatedStyle as any}
    />
  );
};
