import { useState, useEffect } from 'react';
import {
  PlannedMoment,
  loadPlannedMoments,
  savePlannedMoment,
  getPlannedMomentsForDate,
  getDatesWithMoments,
  getDateSegmentColors,
  getSortedDatesWithMoments,
  subscribeToStorageChanges,
} from '../utils/plannedMomentsStorage';

export function usePlannedMoments(selectedDate: Date | null) {
  const [moments, setMoments] = useState<PlannedMoment[]>([]);
  const [datesWithMoments, setDatesWithMoments] = useState<Set<string>>(new Set());
  const [dateSegmentColors, setDateSegmentColors] = useState<Map<string, string[]>>(new Map());
  const [sortedDates, setSortedDates] = useState<string[]>([]);

  const refreshData = () => {
    setDatesWithMoments(getDatesWithMoments());
    setDateSegmentColors(getDateSegmentColors());
    setSortedDates(getSortedDatesWithMoments());
    if (selectedDate) {
      setMoments(getPlannedMomentsForDate(selectedDate));
    }
  };

  useEffect(() => {
    // Initial load
    refreshData();

    // Subscribe to storage changes
    const unsubscribe = subscribeToStorageChanges(refreshData);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setMoments(getPlannedMomentsForDate(selectedDate));
    } else {
      setMoments([]);
    }
  }, [selectedDate]);

  const addMoment = (moment: Omit<PlannedMoment, 'id' | 'createdAt'>) => {
    const newMoment = savePlannedMoment(moment);
    // Data will be refreshed automatically via storage change subscription
  };

  return {
    moments,
    datesWithMoments,
    dateSegmentColors,
    sortedDates,
    addMoment,
  };
}
