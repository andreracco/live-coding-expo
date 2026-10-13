import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

type Props = { message: string; onRetry: () => void };

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Couldn't analyze sleep</Text>
      <Text style={styles.message} accessibilityRole="alert">
        {message}
      </Text>
      <Pressable style={styles.button} onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry analysis">
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  title: { fontSize: 18, color: colors.text },
  message: { fontSize: 13, color: colors.error, textAlign: 'center' },
  button: { marginTop: 8, backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
