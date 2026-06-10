import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Link href="/" asChild>
        <Pressable style={styles.tab}>
          <Text style={[styles.label, { color: colors.text }]}>Home</Text>
        </Pressable>
      </Link>

      <Link href="/explore" asChild>
        <Pressable style={styles.tab}>
          <Text style={[styles.label, { color: colors.text }]}>Explore</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
