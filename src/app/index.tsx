import { useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddEntrySheet } from '../components/AddEntrySheet';
import { EmptyState } from '../components/EmptyState';
import { EntryCard } from '../components/EntryCard';
import { useEntries } from '../context/EntriesContext';
import { isThisWeek } from '../lib/sleep';
import { colors, serifFont } from '../theme';
import { SleepEntry } from '../types';

export default function LogScreen() {
  const { entries, addEntry } = useEntries();
  const [sheetOpen, setSheetOpen] = useState(false);

  const saveEntry = (entry: SleepEntry) => {
    addEntry(entry);
    setSheetOpen(false);
  };

  const sections = [
    { title: 'THIS WEEK', data: entries.filter((e) => isThisWeek(e.start)) },
    { title: 'OLDER', data: entries.filter((e) => !isThisWeek(e.start)) },
  ].filter((s) => s.data.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Sleep<Text style={styles.titleAccent}>log</Text>
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Mia · 4mo</Text>
        </View>
      </View>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(e) => e.id}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          renderItem={({ item }) => <EntryCard entry={item} highlighted={item.id === entries[0].id} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() => setSheetOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Add sleep entry"
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddEntrySheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onSave={saveEntry} />
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
  titleAccent: { color: colors.accent },
  badge: { backgroundColor: colors.accentSoft, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, color: colors.accent },
  list: { padding: 16, paddingBottom: 96 },
  sectionHeader: { fontSize: 11, color: colors.muted, letterSpacing: 0.5, marginTop: 4, marginBottom: 8 },
  separator: { height: 10 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
