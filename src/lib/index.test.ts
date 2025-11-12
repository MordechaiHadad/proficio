import { describe, it, expect } from 'vitest';
import { generateCSV, type HabitExportRow } from './index';

describe('generateCSV', () => {
    it('should generate CSV with headers', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name', 'start_date', 'failure_date', 'days_lasted'];
        const rows: HabitExportRow[] = [];
        
        const result = generateCSV(headers, rows);
        
        expect(result).toBe('Habit Name,Start Date,Failure Date,Days Lasted');
    });

    it('should convert snake_case headers to Regular Case', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name', 'days_lasted'];
        const rows: HabitExportRow[] = [];
        
        const result = generateCSV(headers, rows);
        
        expect(result).toBe('Habit Name,Days Lasted');
    });

    it('should generate CSV with single row', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name', 'start_date', 'failure_date', 'days_lasted'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Smoking',
                start_date: '2024-01-01',
                failure_date: '2024-01-15',
                days_lasted: 14
            }
        ];
        
        const result = generateCSV(headers, rows);
        const lines = result.split('\n');
        
        expect(lines).toHaveLength(2);
        expect(lines[0]).toBe('Habit Name,Start Date,Failure Date,Days Lasted');
        expect(lines[1]).toBe('Smoking,2024-01-01,2024-01-15,14');
    });

    it('should generate CSV with multiple rows', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name', 'days_lasted'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Smoking',
                start_date: '2024-01-01',
                failure_date: '2024-01-15',
                days_lasted: 14
            },
            {
                habit_name: 'Drinking',
                start_date: '2024-02-01',
                failure_date: '2024-02-10',
                days_lasted: 9
            }
        ];
        
        const result = generateCSV(headers, rows);
        const lines = result.split('\n');
        
        expect(lines).toHaveLength(3);
        expect(lines[0]).toBe('Habit Name,Days Lasted');
        expect(lines[1]).toBe('Smoking,14');
        expect(lines[2]).toBe('Drinking,9');
    });

    it('should escape double quotes in cell values', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Stop "Drinking"',
                start_date: '',
                failure_date: '',
                days_lasted: 0
            }
        ];
        
        const result = generateCSV(headers, rows);
        const lines = result.split('\n');
        
        expect(lines[1]).toBe('"Stop ""Drinking"""');
    });

    it('should wrap cells with commas in quotes', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Smoking, Drinking',
                start_date: '',
                failure_date: '',
                days_lasted: 0
            }
        ];
        
        const result = generateCSV(headers, rows);
        const lines = result.split('\n');
        
        expect(lines[1]).toBe('"Smoking, Drinking"');
    });

    it('should wrap cells with newlines in quotes', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Smoking\nDrinking',
                start_date: '',
                failure_date: '',
                days_lasted: 0
            }
        ];
        
        const result = generateCSV(headers, rows);
        
        // The CSV will have the newline preserved within the quoted cell
        expect(result).toContain('"Smoking\nDrinking"');
    });

    it('should handle empty string values', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name', 'failure_date'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Smoking',
                start_date: '',
                failure_date: '',
                days_lasted: 0
            }
        ];
        
        const result = generateCSV(headers, rows);
        const lines = result.split('\n');
        
        expect(lines[1]).toBe('Smoking,');
    });

    it('should handle numeric values correctly', () => {
        const headers: (keyof HabitExportRow)[] = ['habit_name', 'days_lasted'];
        const rows: HabitExportRow[] = [
            {
                habit_name: 'Exercise',
                start_date: '',
                failure_date: '',
                days_lasted: 365
            }
        ];
        
        const result = generateCSV(headers, rows);
        const lines = result.split('\n');
        
        expect(lines[1]).toBe('Exercise,365');
    });
});
