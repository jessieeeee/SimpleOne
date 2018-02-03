package simpleone.jessie.com.simpleone.view;

/**
 * @author JessieK
 * @date 2018/1/12 0012
 * @email lyj1246505807@gmail.com
 * @description  滚轮选择器
 */

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Paint.Align;
import android.graphics.Paint.FontMetricsInt;
import android.graphics.Paint.Style;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.os.Message;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import simpleone.jessie.com.simpleone.R;

public class WheelView extends View {

    public static final String TAG = "WheelView";

    /**
     * 自动回滚到中间的速度
     */
    public static final float SPEED = 2;

    /**
     * 除选中item外，上下各需要显示的备选项数目
     */
    public static final int SHOW_SIZE = 1;

    private Context context;

    private List<String> itemList;
    private int itemCount;

    /**
     * item高度
     */
    private int itemHeight = 50;

    /**
     * 选中的位置，这个位置是mDataList的中心位置，一直不变
     */
    private int currentItem;

    private Paint selectPaint;
    private Paint mPaint;
    // 画背景图中单独的画笔
    private Paint centerLinePaint;

    private float centerY;
    private float centerX;

    private float mLastDownY;
    /**
     * 滑动的距离
     */
    private float mMoveLen = 0;
    private boolean isInit = false;
    private SelectListener mSelectListener;
    private Timer timer;
    private MyTimerTask mTask;

    Handler updateHandler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            if (Math.abs(mMoveLen) < SPEED) {
                // 如果偏移量少于最少偏移量
                mMoveLen = 0;
                if (null != timer) {
                    timer.cancel();
                    timer.purge();
                    timer = null;
                }
                if (mTask != null) {
                    mTask.cancel();
                    mTask = null;
                    performSelect();
                }
            } else {
                // 这里mMoveLen / Math.abs(mMoveLen)是为了保有mMoveLen的正负号，以实现上滚或下滚
                mMoveLen = mMoveLen - mMoveLen / Math.abs(mMoveLen) * SPEED;
            }
            invalidate();
        }

    };

    public WheelView(Context context) {
        super(context);
        init(context);
    }

    public WheelView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public void setOnSelectListener(SelectListener listener) {
        mSelectListener = listener;
    }

    public void setWheelStyle(int style) {
        itemList = WheelStyle.getItemList(context, style);
        if (itemList != null) {
            itemCount = itemList.size();
            resetCurrentSelect();
            invalidate();
        } else {
            Log.i(TAG, "item is null");
        }
    }

    public void setWheelItemList(List<String> itemList) {
        this.itemList = itemList;
        if (itemList != null) {
            itemCount = itemList.size();
            resetCurrentSelect();
        } else {
            Log.i(TAG, "item is null");
        }
    }

    private void resetCurrentSelect() {
        if (currentItem < 0) {
            currentItem = 0;
        }
        while (currentItem >= itemCount) {
            currentItem--;
        }
        if (currentItem >= 0 && currentItem < itemCount) {
            invalidate();
        } else {
            Log.i(TAG, "current item is invalid");
        }
    }

    public int getItemCount() {
        return itemCount;
    }

    /**
     * 选择选中的item的index
     */
    public void setCurrentItem(String selected) {
        for(int i=0; i<itemList.size();i++){
            String item=itemList.get(i);
            if(item.equals(selected)){
                currentItem = i;
                break;
            }
        }

        resetCurrentSelect();
    }

    public int getCurrentItem() {
        return currentItem;
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int mViewHeight = getMeasuredHeight();
        int mViewWidth = getMeasuredWidth();
        centerX = (float) (mViewWidth / 2.0);
        centerY = (float) (mViewHeight / 2.0);

        isInit = true;
        invalidate();
    }


    private void init(Context context) {
        this.context = context;

        timer = new Timer();
        itemList = new ArrayList<>();

        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setStyle(Style.FILL);
        mPaint.setTextAlign(Align.CENTER);
        mPaint.setColor(getResources().getColor(R.color.wheel_unselect_text));
        mPaint.setTextSize(SizeConvertUtil.spTopx(context, 15));

        selectPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        selectPaint.setStyle(Style.FILL);
        selectPaint.setTextAlign(Align.CENTER);
        selectPaint.setColor(getResources().getColor(R.color.wheel_select));
        selectPaint.setTextSize(SizeConvertUtil.spTopx(context, 17));

        centerLinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        centerLinePaint.setStyle(Style.FILL);
        centerLinePaint.setTextAlign(Align.CENTER);
        centerLinePaint.setColor(getResources().getColor(R.color.wheel_unselect_text));

        // 绘制背景
        setBackground(null);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (isInit) {
            drawData(canvas);
        }
    }

    private void drawData(Canvas canvas) {
        // 先绘制选中的text再往上往下绘制其余的text
        if (!itemList.isEmpty()) {
            // 绘制中间data
            drawCenterText(canvas);
            // 绘制上方data
            for (int i = 1; i < SHOW_SIZE + 1; i++) {
                drawOtherText(canvas, i, -1);
            }
            // 绘制下方data
            for (int i = 1; i < SHOW_SIZE + 1; i++) {
                drawOtherText(canvas, i, 1);
            }
        }
    }

    private void drawCenterText(Canvas canvas) {
        // text居中绘制，注意baseline的计算才能达到居中，y值是text中心坐标
        float y = centerY + mMoveLen;
        FontMetricsInt fmi = selectPaint.getFontMetricsInt();
        float baseline = (float) (y - (fmi.bottom / 2.0 + fmi.top / 2.0));
        canvas.drawText(itemList.get(currentItem), centerX, baseline, selectPaint);
    }

    /**
     * @param canvas   画布
     * @param position 距离mCurrentSelected的差值
     * @param type     1表示向下绘制，-1表示向上绘制
     */
    private void drawOtherText(Canvas canvas, int position, int type) {
        int index = currentItem + type * position;
        if (index >= itemCount) {
            index = index - itemCount;
        }
        if (index < 0) {
            index = index + itemCount;
        }
        String text = itemList.get(index);

        int itemHeight = getHeight() / (SHOW_SIZE * 2 + 1);
        float d = itemHeight * position + type * mMoveLen;
        float y = centerY + type * d;

        FontMetricsInt fmi = mPaint.getFontMetricsInt();
        float baseline = (float) (y - (fmi.bottom / 2.0 + fmi.top / 2.0));
        canvas.drawText(text, centerX, baseline, mPaint);
    }

    @Override
    public void setBackground(Drawable background) {
        background = new Drawable() {
            @Override
            public void draw(Canvas canvas) {
//                itemHeight = getHeight() / (SHOW_SIZE * 2 + 1);
//                int width = getWidth();
//
//                canvas.drawLine(0, itemHeight, width, itemHeight, centerLinePaint);
//                canvas.drawLine(0, itemHeight * 2, width, itemHeight * 2, centerLinePaint);
//
//                centerLinePaint.setColor(getResources().getColor(R.color.wheel_bg));
//                Rect topRect = new Rect(0, 0, width, itemHeight);
//                canvas.drawRect(topRect, centerLinePaint);
//                Rect bottomRect = new Rect(0, itemHeight * 2, width, itemHeight * 3);
//                canvas.drawRect(bottomRect, centerLinePaint);
            }

            @Override
            public void setAlpha(int alpha) {

            }

            @Override
            public void setColorFilter(ColorFilter cf) {

            }

            @Override
            public int getOpacity() {
                return 0;
            }
        };
        super.setBackground(background);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                doDown(event);
                break;
            case MotionEvent.ACTION_MOVE:
                doMove(event);
                break;
            case MotionEvent.ACTION_UP:
                doUp();
                break;
            default:
                break;
        }
        return true;
    }

    private void doDown(MotionEvent event) {
        if (mTask != null) {
            mTask.cancel();
            mTask = null;
        }
        mLastDownY = event.getY();
    }

    private void doMove(MotionEvent event) {

        mMoveLen += (event.getY() - mLastDownY);

        if (mMoveLen > itemHeight / 2) {
            // 往下滑超过离开距离
            mMoveLen = mMoveLen - itemHeight;
            currentItem--;
            if (currentItem < 0) {
                currentItem = itemCount - 1;
            }
        } else if (mMoveLen < -itemHeight / 2) {
            // 往上滑超过离开距离
            mMoveLen = mMoveLen + itemHeight;
            currentItem++;
            if (currentItem >= itemCount) {
                currentItem = 0;
            }
        }

        mLastDownY = event.getY();
        invalidate();
    }

    private void doUp() {
        // 抬起手后mCurrentSelected的位置由当前位置move到中间选中位置
        if (Math.abs(mMoveLen) < 0.0001) {
            mMoveLen = 0;
            return;
        }
        if (mTask != null) {
            mTask.cancel();
            mTask = null;
        }
        if (null == timer) {
            timer = new Timer();
        }
        mTask = new MyTimerTask(updateHandler);
        timer.schedule(mTask, 0, 10);
    }

    class MyTimerTask extends TimerTask {
        Handler handler;

        public MyTimerTask(Handler handler) {
            this.handler = handler;
        }

        @Override
        public void run() {
            handler.sendMessage(handler.obtainMessage());
        }

    }

    private void performSelect() {
        if (mSelectListener != null) {
            mSelectListener.onSelect(currentItem, itemList.get(currentItem));
        } else {
            Log.i(TAG, "null listener");
        }
    }

    public interface SelectListener {
        void onSelect(int index, String text);
    }

}