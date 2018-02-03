package simpleone.jessie.com.simpleone.view;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import java.util.Calendar;

import simpleone.jessie.com.simpleone.R;


/**
 * @author JessieKate
 * @date 14/01/2018
 * @email lyj1246505807@gmail.com
 * @describe 日期选择控件
        */

public class PickDateView extends LinearLayout {

    private static final String TAG = "PickDateView原生Tag";
    CallBack callBack;
    WheelView yearWheel;
    WheelView monthWheel;
    public interface CallBack{
        void changeYear(int year);
        void changeMonth(int month);
        void onSure(int year, int month, long time);
    }

    public void setCallBack(CallBack callBack) {
        this.callBack = callBack;
    }

    public PickDateView(Context context) {
        super(context);
       addCustomLayout(context);
    }


    public void setYear(String year){
        yearWheel.setCurrentItem(year);
    }

    public void setMonth(String month){
        monthWheel.setCurrentItem(month);
    }

    private void addCustomLayout(Context context){
        LayoutInflater mInflater = LayoutInflater.from(context);
        View contentView = mInflater.inflate(R.layout.wheel_select_date, null);
        yearWheel = (WheelView) contentView.findViewById(R.id.select_date_wheel_year_wheel);
        monthWheel = (WheelView) contentView.findViewById(R.id.select_date_month_wheel);

        yearWheel.setWheelStyle(WheelStyle.STYLE_YEAR);
        yearWheel.setOnSelectListener(new WheelView.SelectListener() {

            @Override
            public void onSelect(int index, String text) {
                int selectYear = index + WheelStyle.minYear;

                if (callBack != null) {
                    callBack.changeYear(selectYear);
                }
            }
        });

        monthWheel.setWheelStyle(WheelStyle.STYLE_MONTH);
        monthWheel.setOnSelectListener(new WheelView.SelectListener() {
            @Override
            public void onSelect(int index, String text) {
                int selectMonth = index + 1;
                if (callBack != null) {
                    callBack.changeMonth(selectMonth);
                }
            }
        });


        Button sureBt = (Button) contentView.findViewById(R.id.select_date_sure);
        sureBt.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                int year = yearWheel.getCurrentItem() + WheelStyle.minYear;
                int month = monthWheel.getCurrentItem();

                Calendar calendar = Calendar.getInstance();
                calendar.set(Calendar.YEAR, year);
                calendar.set(Calendar.MONTH, month);

                long setTime = calendar.getTimeInMillis();

                if (callBack != null) {
                    callBack.onSure(year, month, setTime);
                }
            }
        });

        addView(contentView);
    }
}
