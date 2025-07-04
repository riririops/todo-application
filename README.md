# ToDoアプリ

このアプリはReactで作成されたシンプルなToDoリストです。  
**ローカルストレージ**を利用しているため、誰でもGitHub連携なしで利用できます。

## 主な機能

- タスクの追加・編集・削除
- カテゴリ（仕事・勉強・プライベート）での絞り込み
- キーワード検索
- 締切日付きタスク管理
- 完了チェック
- 締切が近いタスクの通知（ブラウザ通知許可が必要）

## 使い方

1. このリポジトリをクローン  
   ```
   git clone <このリポジトリのURL>
   cd todo-app-main/vite-demo
   ```

2. 依存パッケージをインストール  
   ```
   npm install
   ```

3. 開発サーバーを起動  
   ```
   npm run dev
   ```

4. ブラウザで `http://localhost:5173` などにアクセス

## 注意

- タスクデータは**各ブラウザのローカルストレージ**に保存されます。他のPCやブラウザではデータは共有されません。
- GitHub連携機能は使っていません。どなたでもそのまま動かせます。

## カスタマイズ

- スタイルは `App.css` で調整できます。
- カテゴリは `App.tsx` の `CATEGORIES` 配列で変更できます。

---

##自己紹介  

皆様お久しぶりです。せぱたです。  
今回はReact学習用のToDoリストを作ってみました。  
次にToDoリストを作ることがあればFirebase AuthenticationとFirestoreを使ってログイン機能・リアルタイム保存を実現してしてみようと思います。  
拙いコードではありますが、ご意見・ご感想等あれば、ぜひIssueやPull Requestでお知らせください！

