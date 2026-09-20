const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAYS_SHORT_ID = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function getTodayDateString(): string {
  const now = new Date();
  return formatDateToISO(now);
}

export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateToISO(d);
}

export function get30DaysAgoString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return formatDateToISO(d);
}

export function get30DaysForwardString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return formatDateToISO(d);
}

export function get30DaysAgoTimestamp(): number {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.getTime();
}

export function getDayAfterTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return formatDateToISO(d);
}

export function formatDateIndonesian(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return 'Hari Ini';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;

  const d = new Date(year, month - 1, day);
  if (isNaN(d.getTime())) return dateStr;

  const dayName = DAYS_ID[d.getDay()] || 'Hari';
  const monthShort = MONTHS_ID[d.getMonth()]?.substring(0, 3) || '';
  return `${dayName}, ${day} ${monthShort}`;
}

export function formatTime(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return '00:00';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '00:00';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatMonthYear(year: number, month: number): string {
  const monthName = MONTHS_ID[month] || '';
  return `${monthName.toUpperCase()} ${year}`;
}

export interface DayInfo {
  dateString: string;
  dayNumber: number;
  dayShort: string;
  isToday: boolean;
  isSelected: boolean;
}

export function getWeekDays(centerDateStr: string): DayInfo[] {
  const validCenter = centerDateStr && /^\d{4}-\d{2}-\d{2}$/.test(centerDateStr) 
    ? centerDateStr 
    : getTodayDateString();
  const [year, month, day] = validCenter.split('-').map(Number);
  const current = new Date(year, month - 1, day);
  const dayOfWeek = current.getDay(); // 0 is Sunday
  
  // Start week on Monday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const todayStr = getTodayDateString();
  const days: DayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateString = formatDateToISO(d);
    days.push({
      dateString,
      dayNumber: d.getDate(),
      dayShort: DAYS_SHORT_ID[d.getDay()],
      isToday: dateString === todayStr,
      isSelected: dateString === validCenter,
    });
  }

  return days;
}

export function getCalendarGrid(year: number, month: number): { dayNumber: number | null; dateString: string }[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // 0 = Sunday, 1 = Monday, ...
  let startOffset = firstDay.getDay() - 1;
  if (startOffset === -1) startOffset = 6; // Sunday becomes index 6

  const grid: { dayNumber: number | null; dateString: string }[] = [];

  // Padding days before 1st of month
  for (let i = 0; i < startOffset; i++) {
    grid.push({ dayNumber: null, dateString: '' });
  }

  for (let day = 1; day <= totalDays; day++) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    grid.push({
      dayNumber: day,
      dateString: `${year}-${m}-${d}`,
    });
  }

  return grid;
}
