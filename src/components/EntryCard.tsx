import { StyleSheet, Text, View } from 'react-native';
import { colors, serifFont } from '../theme';
import { MAX_SLEEP_MINUTES, durationMinutes, formatDay, formatDuration, formatTime } from '../lib/sleep';
import { SleepEntry } from '../types';

type Props = {
  entry: SleepEntry;
  highlighted?: boolean;
};

export function EntryCard({ entry, highlighted = false }: Props) {
  const minutes = durationMinutes(entry);
  const range = `${formatTime(entry.start)} → ${formatTime(entry.end)}`;
  const duration = formatDuration(minutes);
  const fill = Math.min(minutes / MAX_SLEEP_MINUTES, 1) * 100;

  return (
    <View
      style={[styles.card, highlighted && styles.highlighted]}
      accessible
      accessibilityLabel={`${formatDay(entry.start)}, ${formatTime(entry.start)} to ${formatTime(entry.end)}, ${duration}${
        entry.note ? `, ${entry.note}` : ''
      }`}
    >
      <Text style={styles.day}>{formatDay(entry.start)}</Text>
      <View style={styles.row}>
        <Text style={styles.range}>{range}</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{duration}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fill}%` }]} />
      </View>
      {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    backgroundColor: colors.background,
  },
  highlighted: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  day: { fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  range: { fontSize: 18, fontFamily: serifFont, color: colors.text },
  pill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillText: { fontSize: 12, color: colors.accent },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.track, overflow: 'hidden' },
  fill: { height: 4, backgroundColor: colors.accent },
  note: { fontSize: 12, color: colors.muted },
});
