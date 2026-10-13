import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function AnalysisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Analysis coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  text: { color: colors.muted },
});
