import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

const BAR_WIDTH_RATIO = 0.4;

export function LoadingState({ count }: { count: number }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-trackWidth * BAR_WIDTH_RATIO, trackWidth],
  });

  return (
    <View style={styles.container} accessible accessibilityLabel={`Analyzing ${count} entries`} accessibilityLiveRegion="polite">
      <Text style={styles.label}>ANALYZING {count} {count === 1 ? 'ENTRY' : 'ENTRIES'}…</Text>
      <View style={styles.track} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.bar, { width: trackWidth * BAR_WIDTH_RATIO, transform: [{ translateX }] }]} />
      </View>
      <View style={[styles.block, styles.summaryBlock]}>
        <View style={[styles.line, styles.dark, { width: '60%' }]} />
        <View style={[styles.line, styles.dark, { width: '95%' }]} />
        <View style={[styles.line, styles.dark, { width: '80%' }]} />
      </View>
      <View style={styles.block}>
        <View style={[styles.line, { width: '35%' }]} />
        <View style={[styles.line, styles.tall, { width: '70%' }]} />
      </View>
      <View style={styles.block}>
        <View style={[styles.line, { width: '35%' }]} />
        <View style={[styles.line, styles.tall, { width: '70%' }]} />
      </View>
      <View style={[styles.block, styles.tipBlock]}>
        <View style={[styles.line, { width: '30%' }]} />
        <View style={[styles.line, { width: '90%' }]} />
        <View style={[styles.line, { width: '95%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  label: { fontSize: 11, color: colors.muted, letterSpacing: 0.5 },
  track: { height: 3, borderRadius: 2, backgroundColor: colors.accentSoft, overflow: 'hidden' },
  bar: { height: 3, borderRadius: 2, backgroundColor: colors.accent },
  block: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, gap: 8 },
  summaryBlock: { backgroundColor: '#C9C9CF', borderColor: '#C9C9CF' },
  tipBlock: { backgroundColor: colors.tipBg, borderColor: colors.tipBorder },
  line: { height: 8, borderRadius: 4, backgroundColor: colors.skeleton },
  dark: { backgroundColor: '#E4E4E8' },
  tall: { height: 14 },
});
