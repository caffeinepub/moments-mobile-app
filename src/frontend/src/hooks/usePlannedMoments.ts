import { useState, useEffect } from 'react';
import {
  PlannedMoment,
  loadPlannedMoments,
  savePlannedMoment,
  getPlannedMomentsForDate,
  getDatesWithMoments,
  getDateColorMap,
} from '../utils/plannedMomentsStorage';

export function usePlannedMoments(selectedDate: Date | null) {
  const [moments, setMoments] = useState<PlannedMoment[]>([]);
  const [datesWithMoments, setDatesWithMoments] = useState<Set<string>>(new Set());
  const [dateColorMap, setDateColorMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    // Load dates with moments and color map
    setDatesWithMoments(getDatesWithMoments());
    setDateColorMap(getDateColorMap());
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
    setMoments(prev => [...prev, newMoment].sort((a, b) => a.time.localeCompare(b.time)));
    setDatesWithMoments(getDatesWithMoments());
    setDateColorMap(getDateColorMap());
  };

  return {
    moments,
    datesWithMoments,
    dateColorMap,
    addMoment,
  };
}
