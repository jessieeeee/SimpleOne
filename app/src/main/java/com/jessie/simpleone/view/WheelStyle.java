package com.jessie.simpleone.view;

import android.content.Context;

import com.jessie.simpleone.R;

import java.util.ArrayList;
import java.util.List;


/**
 * @author JessieK
 * @date 2018/1/12 0012
 * @email lyj1246505807@gmail.com
 * @description 生成wheel的各种选项
 */


public class WheelStyle {

    public static final int minYear = 1980;
    public static final int maxYear = 2020;

    /**
     * Wheel Style Hour
     */
    public static final int STYLE_HOUR = 1;
    /**
     * Wheel Style Minute
     */
    public static final int STYLE_MINUTE = 2;
    /**
     * Wheel Style Year
     */
    public static final int STYLE_YEAR = 3;
    /**
     * Wheel Style Month
     */
    public static final int STYLE_MONTH = 4;
    /**
     * Wheel Style Day
     */
    public static final int STYLE_DAY = 5;
    /**
     * Wheel Style Light Time
     */
    public static final int STYLE_LIGHT_TIME = 7;

    private WheelStyle() {
    }

    public static List<String> getItemList(Context context, int Style) {
        if (Style == STYLE_HOUR) {
            return createHourString();
        } else if (Style == STYLE_MINUTE) {
            return createMinuteString();
        } else if (Style == STYLE_YEAR) {
            return createYearString();
        } else if (Style == STYLE_MONTH) {
            return createMonthString();
        } else if (Style == STYLE_DAY) {
            return createDayString();
        } else if (Style == STYLE_LIGHT_TIME) {
            return createWeekString(context);
        } else {
            throw new IllegalArgumentException("style is illegal");
        }
    }

    private static List<String> createHourString() {
        List<String> wheelString = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            wheelString.add(String.format("%02d", i));
        }
        return wheelString;
    }

    private static List<String> createMinuteString() {
        List<String> wheelString = new ArrayList<>();
        for (int i = 0; i < 60; i++) {
            wheelString.add(String.format("%02d", i));
        }
        return wheelString;
    }

    private static List<String> createYearString() {
        List<String> wheelString = new ArrayList<>();
        for (int i = minYear; i <= maxYear; i++) {
            wheelString.add(Integer.toString(i)+'年');
        }
        return wheelString;
    }

    private static List<String> createMonthString() {
        List<String> wheelString = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            wheelString.add(String.format("%02d", i)+'月');
        }
        return wheelString;
    }

    private static List<String> createDayString() {
        List<String> wheelString = new ArrayList<>();
        for (int i = 1; i <= 31; i++) {
            wheelString.add(String.format("%02d", i));
        }
        return wheelString;
    }

    private static List<String> createWeekString(Context context) {
        List<String> wheelString = new ArrayList<>();
        String[] timeString = context.getResources().getStringArray(R.array.weeks);
        for (String week : timeString) {
            wheelString.add(week);
        }
        return wheelString;
    }

    public static List<String> createDayString(int year, int month) {
        List<String> wheelString = new ArrayList<>();
        int size;
        if (isLeapMonth(month)) {
            size = 31;
        } else if (month == 2) {
            if (isLeapYear(year)) {
                size = 29;
            } else {
                size = 28;
            }
        } else {
            size = 30;
        }

        for (int i = 1; i <= size; i++) {
            wheelString.add(String.format("%02d", i));
        }
        return wheelString;
    }

    /**
     * 计算闰月
     *
     * @param month
     * @return
     */
    private static boolean isLeapMonth(int month) {
        return month == 1 || month == 3 || month == 5 || month == 7
                || month == 8 || month == 10 || month == 12;
    }

    /**
     * 计算闰年
     *
     * @param year
     * @return
     */
    private static boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

}
