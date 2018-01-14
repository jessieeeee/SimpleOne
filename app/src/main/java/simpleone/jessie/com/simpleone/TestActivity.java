package simpleone.jessie.com.simpleone;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.widget.Button;

/**
 * @author JessieK
 * @date 2018/1/12 0012
 * @email lyj1246505807@gmail.com
 * @description 测试activity
 */


public class TestActivity extends Activity {


    private Button btn;




    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);
        btn = (Button) findViewById(R.id.button);

    }

}
