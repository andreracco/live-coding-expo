import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorState } from '../components/analysis/ErrorState';
import { LoadingState } from '../components/analysis/LoadingState';
import { StatCard } from '../components/analysis/StatCard';
import { SummaryCard } from '../components/analysis/SummaryCard';
import { TipCard } from '../components/analysis/TipCard';
import { useEntries } from '../context/EntriesContext';
import { Analysis, AnalysisError, analyzeEntries } from '../lib/analysis';
import { formatDateRange, isThisWeek } from '../lib/sleep';
import { colors, serifFont } from '../theme';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; analysis: Analysis }
  | { status: 'error'; message: string };

export default function AnalysisScreen() {
  const { entries } = useEntries();
  const [state, setState] = useState<State>({ status: 'idle' });
  const controller = useRef<AbortController | null>(null);
  const lastKey = useRef<string | null>(null);

  const weekEntries = entries.filter((e) => isThisWeek(e.start));
  const count = weekEntries.length;

  const start = useCallback(() => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;

    const week = entries.filter((e) => isThisWeek(e.start));
    if (week.length === 0) {
      lastKey.current = null;
      setState({ status: 'idle' });
      return;
    }
    const key = week.map((e) => e.id).join(',');
    if (key === lastKey.current) return;

    setState({ status: 'loading' });
    analyzeEntries(week, current.signal)
      .then((analysis) => {
        lastKey.current = key;
        setState({ status: 'success', analysis });
      })
      .catch((error: unknown) => {
        if (current.signal.aborted) return;
        setState({
          status: 'error',
          message: error instanceof AnalysisError ? error.message : 'Something went wrong. Please try again.',
        });
      });
  }, [entries]);

  useFocusEffect(
    useCallback(() => {
      start();
      return () => controller.current?.abort();
    }, [start]),
  );

  const retry = () => {
    lastKey.current = null;
    start();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Analysis
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count} {count === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
      </View>

      {count === 0 ? (
        <View style={styles.center}>
          <Text style={styles.centerTitle}>Nothing to analyze yet</Text>
          <Text style={styles.centerText}>Log a sleep this week to see your summary</Text>
        </View>
      ) : state.status === 'error' ? (
        <ErrorState message={state.message} onRetry={retry} />
      ) : state.status === 'success' ? (
        <View style={styles.result}>
          <Text style={styles.section}>SUMMARY</Text>
          <SummaryCard label={`AI · ${formatDateRange(weekEntries)}`} summary={state.analysis.summary} />
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.section}>KEY STATS</Text>
            {state.analysis.stats.map((stat, index) => (
              <StatCard key={`${index}-${stat.label}`} stat={stat} />
            ))}
            <Text style={styles.section}>TIP</Text>
            <TipCard tip={state.analysis.tip} />
          </ScrollView>
        </View>
      ) : (
        <LoadingState count={count} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 26, fontFamily: serifFont, color: colors.text },
  badge: { backgroundColor: colors.successSoft, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, color: colors.success },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  centerTitle: { fontSize: 18, fontFamily: serifFont, color: colors.text },
  centerText: { fontSize: 13, color: colors.muted },
  result: { flex: 1, padding: 16, gap: 8 },
  section: { fontSize: 11, color: colors.muted, letterSpacing: 0.5, marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { gap: 10, paddingBottom: 16 },
});
