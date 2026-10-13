import { StyleSheet, Text, View } from 'react-native';
import { colors, serifFont } from '../../theme';
import { Stat } from '../../lib/analysis';

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${stat.label}: ${stat.value}, ${stat.detail}`}>
      <Text style={styles.label}>{stat.label.toUpperCase()}</Text>
      <Text style={styles.value}>{stat.value}</Text>
      <Text style={styles.detail}>{stat.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, gap: 2 },
  label: { fontSize: 10, color: colors.muted, letterSpacing: 0.5 },
  value: { fontSize: 24, fontFamily: serifFont, color: colors.text },
  detail: { fontSize: 11, color: colors.muted },
});
