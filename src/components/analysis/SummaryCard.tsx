import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

type Props = { label: string; summary: string };

export function SummaryCard({ label, summary }: Props) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`Summary. ${summary}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.summaryBg, borderRadius: 16, padding: 16, gap: 8 },
  label: { fontSize: 11, color: colors.summaryLabel, letterSpacing: 0.5, fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }) },
  text: { fontSize: 15, lineHeight: 22, color: colors.summaryText },
});
