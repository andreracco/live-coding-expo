import { StyleSheet, Text, View } from 'react-native';
import { colors, serifFont } from '../theme';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon} accessibilityElementsHidden importantForAccessibility="no">
          🌙
        </Text>
      </View>
      <Text style={styles.title}>No entries yet</Text>
      <Text style={styles.subtitle}>Tap + to log your first sleep</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 24 },
  title: { fontSize: 20, fontFamily: serifFont, color: colors.text },
  subtitle: { fontSize: 13, color: colors.muted },
});
