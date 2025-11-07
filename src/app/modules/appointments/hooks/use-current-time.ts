"use client";

import { useEffect, useState } from "react";
import {
  endOfWeek,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  differenceInMinutes,
} from "date-fns";
import { EndHour, StartHour } from "../constants";

export function useCurrentTimeIndicator(
  currentDate: Date,
  view: "day" | "week"
) {
  const [currentTimePosition, setCurrentTimePosition] = useState(0);
  const [currentTimeVisible, setCurrentTimeVisible] = useState(false);

  useEffect(() => {
    const calculateTimePosition = () => {
      const now = new Date();

      // rango total del día (en minutos) basado en las horas configuradas
      const start = new Date(now);
      start.setHours(StartHour, 0, 0, 0);

      const end = new Date(now);
      end.setHours(EndHour, 0, 0, 0);

      // diferencia total de minutos del rango diario
      const totalRangeMinutes = differenceInMinutes(end, start);
      const elapsedMinutes = differenceInMinutes(now, start);

      // porcentaje de progreso del día
      const position = (elapsedMinutes / totalRangeMinutes) * 100;

      // visibilidad según la vista
      let visible = false;
      if (view === "day") {
        visible = isSameDay(now, currentDate);
      } else {
        visible = isWithinInterval(now, {
          start: startOfWeek(currentDate, { weekStartsOn: 0 }),
          end: endOfWeek(currentDate, { weekStartsOn: 0 }),
        });
      }

      setCurrentTimePosition(Math.max(0, Math.min(position, 100)));
      setCurrentTimeVisible(visible);
    };

    calculateTimePosition();
    const interval = setInterval(calculateTimePosition, 60000);
    return () => clearInterval(interval);
  }, [currentDate, view]);

  return { currentTimePosition, currentTimeVisible };
}
