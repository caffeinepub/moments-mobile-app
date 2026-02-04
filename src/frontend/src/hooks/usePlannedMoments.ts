import { useState, useEffect } from 'react';
import {
  PlannedMoment,
  SaveResult,
  loadPlannedMoments,
  loadPlannedMomentsMostRecentFirst,
  savePlannedMoment,
  deletePlannedMoment,
  getPlannedMomentsForDate,
  getDatesWithMoments,
  getDateColorMap,
  subscribeToStorageChanges,
} from '../utils/plannedMomentsStorage';

export function usePlannedMoments(selectedDate: Date | null) {
  const [moments, setMoments] = useState<PlannedMoment[]>([]);
  const [allMoments, setAllMoments] = useState<PlannedMoment[]>([]);
  const [datesWithMoments, setDatesWithMoments] = useState<Set<string>>(new Set());
  const [dateColorMap, setDateColorMap] = useState<Map<string, string>>(new Map());

  const refreshData = () => {
    setAllMoments(loadPlannedMomentsMostRecentFirst());
    setDatesWithMoments(getDatesWithMoments());
    setDateColorMap(getDateColorMap());
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

  const addMoment = (moment: Omit<PlannedMoment, 'id' | 'createdAt'>): SaveResult => {
    const result = savePlannedMoment(moment);
    // Data will be refreshed automatically via storage change subscription
    return result;
  };

  const deleteMoment = (momentId: string) => {
    deletePlannedMoment(momentId);
    // Data will be refreshed automatically via storage change subscription
  };

  return {
    moments,
    allMoments,
    datesWithMoments,
    dateColorMap,
    addMoment,
    deleteMoment,
  };
}
