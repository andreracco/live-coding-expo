import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

export function TipCard({ tip }: { tip: string }) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`Tip. ${tip}`}>
      <Text style={styles.label}>TIP</Text>
      <Text style={styles.text}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tipBg,
    borderWidth: 1,
    borderColor: colors.tipBorder,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  label: { fontSize: 11, color: colors.tipLabel, letterSpacing: 0.5 },
  text: { fontSize: 14, lineHeight: 20, color: colors.text },
});
