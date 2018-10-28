import React from 'react';
import { View } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

/* from app */
import styles from './styles';

export const HomeTabIcon = ({ tintColor }) => <Ionicons name="md-home" size={26} style={styles.icon} color={tintColor} />;
export const SearchTabIcon = ({ tintColor }) => <Ionicons name="md-search" size={26} style={styles.icon} color={tintColor} />;
export const NotificationTabIcon = ({ tintColor }) => <Ionicons name="md-heart" size={26} style={styles.icon} color={tintColor} />;
export const MeTabIcon = ({ tintColor }) => <Ionicons name="md-person" size={26} style={styles.icon} color={tintColor} />;
export const TakeTabIcon = ({ tintColor }) => (
  <View style={styles.takeTab}>
    <View style={[styles.takeTabRounded, { borderColor: tintColor }]}>
      <Ionicons name="md-add" size={18} style={styles.takeTabIcon} color={tintColor} />
    </View>
  </View>
);

export const TabBar = BottomTabBar;
