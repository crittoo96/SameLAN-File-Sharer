# file-sharer

同一LAN内でファイルを共有するためのツールです。

## 使い方

node.jsがインストールされていることが前提です。

共有したいファイルをpublicフォルダに入れておきます。

nodeコマンドでindex.jsを実行します。

index.jsでは、ファイルを共有するためのサーバーを立ち上げます。

```bash
$node index.js
en0: 10.20.1.29
Server is running on http://10.20.1.29:3000/
```

---

サーバーが立ち上がったら、同一LAN上にある別のPCから`http://＜表示されたIP＞:3000`にcurlコマンドを投げます。

```bash
$curl http://10.20.1.29:3000/<publicフォルダに入れたファイル名> -o <保存先フォルダ>/<保存先ファイル名>
```

---

正常にアクセスできていれば、
サーバー側では以下のようなログが出力されます。

```bash
$node index.js
en0: 10.20.1.29
Server is running on http://10.20.1.29:3000/
Serving file: /Users/yoshikio/tutorials/file-sherer/public/agile-day1-2.mov
   to Client IP: ::ffff:10.20.1.90:60094
```

これでファイルが保存されます。
