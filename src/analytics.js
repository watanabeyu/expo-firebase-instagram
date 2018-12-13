import { Constants } from 'expo';

/* node_modules */
import {
  Analytics as GoogleAnalytics,
  ScreenHit,
  Event,
} from 'expo-analytics';

class Analytics {
  constructor(code = null) {
    this.ga = null;
    this.code = code;
  }

  // uidにはユーザの識別子、drには参照元、cnにはキャンペーン名を渡します
  init = (uid = null, dr = null, cn = null) => {
    if (uid || dr || cn) {
      this.ga = new GoogleAnalytics(this.code, { uid, dr, cn });
    } else {
      this.ga = new GoogleAnalytics(this.code);
    }
  }

  ScreenHit = (screen = null) => {
    if (!__DEV__ && screen) {
      this.ga.hit(new ScreenHit(screen));
    }
  }

  // Analyticsのイベントを記録する関数です。categoryにはカテゴリ名、
  // actionにはアクション名、labelにはラベル名を、valueには値を渡します
  EventHit = (category = null, action = null, label = null, value = 0) => {
    if (!__DEV__ && category && action) {
      const params = [category, action];

      if (label) {
        params[2] = label;

        if (value >= 0) {
          params[3] = value;
        }
      }

      this.ga.event(new Event(...params));
    }
  }
}

export default new Analytics(Constants.manifest.extra.ga);
