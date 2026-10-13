import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MAX_SLEEP_MINUTES, buildRange, durationMinutes, formatDay, formatTime } from '../lib/sleep';
import { colors, serifFont } from '../theme';
import { SleepEntry } from '../types';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: SleepEntry) => void;
};

type Field = 'date' | 'sleep' | 'wake';

export function AddEntrySheet({ visible, onClose, onSave }: Props) {
  const [date, setDate] = useState(() => new Date());
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [wakeTime, setWakeTime] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [picking, setPicking] = useState<Field | null>(null);

  const range = sleepTime && wakeTime ? buildRange(date, sleepTime, wakeTime) : null;
  let error: string | null = null;
  if (range && sleepTime && wakeTime) {
    if (sleepTime.getHours() === wakeTime.getHours() && sleepTime.getMinutes() === wakeTime.getMinutes()) {
      error = 'Wake time must differ from sleep time';
    } else if (range.start > new Date()) {
      error = "Sleep start can't be in the future";
    } else if (durationMinutes(range) > MAX_SLEEP_MINUTES) {
      error = 'Sleep can be at most 16 hours';
    }
  }
  const canSave = range !== null && error === null;

  const reset = () => {
    setDate(new Date());
    setSleepTime(null);
    setWakeTime(null);
    setNote('');
    setPicking(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const save = () => {
    if (!range || error) return;
    onSave({
      id: String(Date.now()),
      start: range.start,
      end: range.end,
      note: note.trim() || undefined,
    });
    reset();
  };

  const open = (field: Field) => {
    if (picking === field) {
      setPicking(null);
      return;
    }
    // iOS spinner only fires onChange on movement, so seed the shown value.
    if (Platform.OS === 'ios') {
      if (field === 'sleep' && !sleepTime) setSleepTime(new Date());
      if (field === 'wake' && !wakeTime) setWakeTime(new Date());
    }
    setPicking(field);
  };

  const onPick = (field: Field) => (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setPicking(null);
    if (event.type !== 'set' || !selected) return;
    if (field === 'date') setDate(selected);
    if (field === 'sleep') setSleepTime(selected);
    if (field === 'wake') setWakeTime(selected);
  };

  const renderPicker = (field: Field, value: Date, mode: 'date' | 'time') =>
    picking === field ? (
      <DateTimePicker
        value={value}
        mode={mode}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        maximumDate={field === 'date' ? new Date() : undefined}
        onChange={onPick(field)}
      />
    ) : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable
          style={styles.backdrop}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.title} accessibilityRole="header">
              Add Sleep Entry
            </Text>

            <Text style={styles.label}>DATE</Text>
            <Pressable
              style={[styles.field, picking === 'date' && styles.fieldActive]}
              onPress={() => open('date')}
              accessibilityRole="button"
              accessibilityLabel={`Date, ${formatDay(date)}`}
            >
              <Text style={styles.value}>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              <Text style={styles.chevron}>▾</Text>
            </Pressable>
            {renderPicker('date', date, 'date')}

            <Text style={styles.label}>SLEEP TIME</Text>
            <Pressable
              style={[styles.field, picking === 'sleep' && styles.fieldActive]}
              onPress={() => open('sleep')}
              accessibilityRole="button"
              accessibilityLabel={`Sleep time, ${sleepTime ? formatTime(sleepTime) : 'not set'}`}
            >
              <Text style={sleepTime ? styles.value : styles.placeholder}>
                {sleepTime ? formatTime(sleepTime) : 'Select time'}
              </Text>
              <Text style={styles.chevron}>▾</Text>
            </Pressable>
            {renderPicker('sleep', sleepTime ?? new Date(), 'time')}

            <Text style={styles.label}>WAKE TIME</Text>
            <Pressable
              style={[styles.field, picking === 'wake' && styles.fieldActive]}
              onPress={() => open('wake')}
              accessibilityRole="button"
              accessibilityLabel={`Wake time, ${wakeTime ? formatTime(wakeTime) : 'not set'}`}
            >
              <Text style={wakeTime ? styles.value : styles.placeholder}>
                {wakeTime ? formatTime(wakeTime) : 'Select time'}
              </Text>
              <Text style={styles.chevron}>▾</Text>
            </Pressable>
            {renderPicker('wake', wakeTime ?? new Date(), 'time')}

            <Text style={styles.label}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. woke once at 3am…"
              placeholderTextColor={colors.muted}
              accessibilityLabel="Notes, optional"
            />

            {error ? (
              <Text style={styles.error} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}

            <Pressable
              style={[styles.save, !canSave && styles.saveDisabled]}
              onPress={save}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
            >
              <Text style={styles.saveText}>Save Entry</Text>
            </Pressable>
            <Pressable style={styles.cancel} onPress={close} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  content: { paddingBottom: 32 },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontFamily: serifFont, color: colors.text, marginBottom: 8 },
  label: { fontSize: 11, color: colors.muted, letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  fieldActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  value: { fontSize: 14, color: colors.text },
  placeholder: { fontSize: 14, color: colors.muted },
  chevron: { fontSize: 12, color: colors.muted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  error: { color: colors.error, fontSize: 13, marginTop: 12 },
  save: {
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveDisabled: { opacity: 0.4 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cancel: { paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: colors.muted, fontSize: 14 },
});
