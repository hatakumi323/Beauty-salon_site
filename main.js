
$(document).ready(function(){
  //URLのハッシュ値を取得
  var urlHash = location.hash;
  //ハッシュ値があればページ内スクロール
  if(urlHash) {
    //スクロールを0に戻す
    $('body,html').stop().scrollTop(0);
    setTimeout(function () {
      //ロード時の処理を待ち、時間差でスクロール実行
      scrollToAnker(urlHash) ;
    });
  }

  //通常のクリック時
  $('a[href^="#"]').click(function() {
    //ページ内リンク先を取得
    var href= $(this).attr("href");
    //リンク先が#か空だったらhtmlに
    var hash = href == "#" || href == "" ? 'html' : href;
    //スクロール実行
    scrollToAnker(hash);
    //リンク無効化
    return false;
  });

  // 関数：スムーススクロール
  // 指定したアンカー(#ID)へアニメーションでスクロール
  function scrollToAnker(hash) {
    var target = $(hash);
    var position = target.offset().top;
    $('body,html').stop().animate({scrollTop:position}, 300);
  }
})

// お問合せ
Vue.filter('number_format', function(val) {
    return val.toLocaleString();
  });
  
  // 自動見積コンポーネント
  var app = new Vue({
    el: '#app',
    data: {
      // 消費税率
      taxRate: 0.10,
      // 制作したいムービー
      movieType: '余興ムービー',
      // 基本料金（税抜き）
      basePrice: 0,
      // オプション料金（税抜き）
      optPrice: 0,
      // 合計金額（税抜き）
      totalPrice: 0,
      // 挙式日（日付）
      wedding_date: '',
      // DVD仕上がり予定日（日付）
      delivery_date: '',
      // オプション「BGM手配」
      opt1_use: false,              // true：利用する、false：利用しない
      opt1_price: 8000,             // 料金（税抜き）
      // オプション「撮影」
      opt2_use: false,              // true：利用する、false：利用しない
      opt2_price: 4000,             // 料金（税抜き）
      // オプション「DVD盤面印刷」
      opt3_use: false,              // true：利用する、false：利用しない
      opt3_price: 15000,             // 料金（税抜き）
      // オプション「写真スキャニング」
      opt4_use: false,                  // 利用枚数
      opt4_price: 18000,              // 料金（税抜き）
    },
    methods: {
      // 税抜金額を税込金額に変換するメソッド
      incTax: function(untaxed) {
        return Math.floor(untaxed * (1 + this.taxRate));
      },
      // 日付の差を求めるメソッド
      getDateDiff: function(dateString1, dateString2) {
        // 日付を表す文字列から日付オブジェクトを生成
        var date1 = new Date(dateString1);
        var date2 = new Date(dateString2);
        // 2つの日付の差分（ミリ秒）を計算
        var msDiff  = date1.getTime() - date2.getTime();
        // 求めた差分（ミリ秒）を日付に変換
        // 差分÷(1000ミリ秒×60秒×60分×24時間)
        return Math.ceil(msDiff / (1000 * 60 * 60 *24));
      },
      // 日付をYYYY-MM-DDの書式で返すメソッド
      formatDate: function(dt) {
        var y = dt.getFullYear();
        var m = ('00' + (dt.getMonth()+1)).slice(-2);
        var d = ('00' + dt.getDate()).slice(-2);
        return (y + '-' + m + '-' + d);
      }
    },
    computed: {
      taxedOpt1: function() {
        return this.incTax(this.opt1_price);
      },
      taxedOpt2: function() {
        return this.incTax(this.opt2_price);
      },
      taxedOpt3: function() {
        return this.incTax(this.opt3_price);
      },
      taxedOpt4: function() {
        return this.incTax(this.opt4_price);
      },
      // 基本料金（税込）を返す算出プロパティ
      taxedBasePrice: function() {
        // 割増料金
        var addPrice = 0;
        // 納期までの残り日数を計算
        var dateDiff = this.getDateDiff(this.delivery_date, (new Date()).toLocaleString());
        
        // 基本料金（税込）を返す
        return this.incTax(this.basePrice + addPrice);
      },
      // オプション料金（税込）を返す算出プロパティ
      taxedOptPrice: function() {
        // オプション料金
        var optPrice = 0;
        // カット
        if (this.opt1_use) { optPrice += this.opt1_price; }
        // カラー
        if (this.opt2_use) { optPrice += this.opt2_price; }
        // カット＋カラー
        if (this.opt3_use) { optPrice += this.opt3_price; }
        // カット＋カラー＋パーマ
        if (this.opt4_use) { optPrice += this.opt4_price; }
        // オプション料金（税込）を返す
        return this.incTax(optPrice);
      },
      // 合計金額（税込）を返す算出プロパティ
      taxedTotalPrice: function() {
        // 基本料金（税込）とオプション料金（税込）の合計を返す
        return (this.taxedBasePrice + this.taxedOptPrice);
      },
      // 明日の日付をYYYY-MM-DDの書式で返す算出プロパティ
      tommorow: function() {
        var dt = new Date();
        dt.setDate(dt.getDate() + 1);
        return this.formatDate(dt);
      }
    },
    created: function() {
      // 今日の日付を取得
      var dt = new Date();
      // 2ヵ月後の日付を設定
      dt.setMonth(dt.getMonth() + 2);
      this.wedding_date = this.formatDate(dt);
    }
  });
  