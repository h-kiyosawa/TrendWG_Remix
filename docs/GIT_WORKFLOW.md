# 🔀 Git ワークフローガイド

このドキュメントでは、Issue駆動型開発（Issue-Driven
Development）のワークフローを説明します。 TortoiseGit（GUI）とGit
Bash（CLI）の両方の手順を記載しています。

## 📋 目次

1. [ワークフロー概要](#ワークフロー概要)
2. [事前準備](#事前準備)
3. [Step 1: GitHubでIssueを作成](#step-1-githubでissueを作成)
4. [Step 2: mainブランチを最新に更新（Pull）](#step-2-mainブランチを最新に更新pull)
5. [Step 3: featureブランチを作成](#step-3-featureブランチを作成)
6. [Step 4: コーディング作業](#step-4-コーディング作業)
7. [Step 5: 変更をコミット](#step-5-変更をコミット)
8. [Step 6: リモートにプッシュ](#step-6-リモートにプッシュ)
9. [Step 7: プルリクエストを作成](#step-7-プルリクエストを作成)
10. [Step 8: レビュー・マージ後の後処理](#step-8-レビューマージ後の後処理)
11. [トラブルシューティング](#トラブルシューティング)

---

## 🔄 ワークフロー概要

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. Issue作成 → 2. Pull → 3. ブランチ作成 → 4. コーディング        │
│       ↓                                                              │
│  5. コミット → 6. プッシュ → 7. プルリクエスト → 8. マージ・後処理  │
└─────────────────────────────────────────────────────────────────────┘
```

### ブランチ命名規則

```
feature/issue_<イシュー番号>_<簡単な説明>
```

**例:**

- `feature/issue_42_add-cart-function`
- `feature/issue_15_fix-login-bug`
- `feature/issue_7_update-readme`

### なぜこのワークフローが重要？

- **追跡可能性**: Issueと作業内容が紐づく
- **コードレビュー**: 品質向上とナレッジ共有
- **履歴管理**: 誰が何をいつ変更したか明確
- **チーム協力**: 他メンバーとの衝突を防ぐ

---

## ✅ 事前準備

### 必要なツール

| ツール      | 用途               | ダウンロード             |
| ----------- | ------------------ | ------------------------ |
| Git         | バージョン管理     | https://git-scm.com/     |
| TortoiseGit | Git GUI（Windows） | https://tortoisegit.org/ |
| Git Bash    | Gitコマンドライン  | Git同梱                  |

### 初期設定（初回のみ）

#### Git Bashの場合

```bash
# ユーザー名を設定
git config --global user.name "あなたの名前"

# メールアドレスを設定（GitHubと同じものを推奨）
git config --global user.email "your-email@example.com"

# デフォルトブランチ名をmainに設定
git config --global init.defaultBranch main

# 改行コードの自動変換設定（Windows推奨）
git config --global core.autocrlf true
```

#### TortoiseGitの場合

1. タスクバーのTortoiseGitアイコンを右クリック → **Settings**
2. **Git** → **Config** で以下を設定：
   - Name: あなたの名前
   - Email: GitHubと同じメールアドレス

---

## 📝 Step 1: GitHubでIssueを作成

### 目的

作業内容を明確にし、チームに共有する。

### 手順（GitHub Webサイト）

1. **GitHubリポジトリにアクセス**
   - https://github.com/h-kiyosawa/TrendWG_Remix

2. **Issuesタブをクリック**
   - 上部メニューの「Issues」を選択

3. **「New issue」ボタンをクリック**

4. **Issueの内容を記入**

   ```markdown
   ## 概要

   カート機能に商品を追加できるようにする

   ## 詳細

   - 商品タイルに「カートに追加」ボタンを実装
   - カート内の商品数をヘッダーに表示

   ## 完了条件

   - [ ] 商品をカートに追加できる
   - [ ] カート内の商品数が表示される
   - [ ] テストが通る
   ```

5. **「Submit new issue」をクリック**

6. **Issue番号を確認・メモ**
   - 例: `#42` → Issue番号は **42**

### 💡 ベストプラクティス

- **明確なタイトル**: 何をするかが一目でわかるように
- **ラベル付け**: `bug`, `enhancement`, `documentation` など
- **担当者割り当て**: 自分をAssigneesに設定
- **マイルストーン**: リリース計画がある場合は設定

---

## 🔄 Step 2: mainブランチを最新に更新（Pull）

### 目的

リモートの最新コードをローカルに取り込む。

---

### 🖱️ TortoiseGitの場合

1. **プロジェクトフォルダを開く**
   - エクスプローラーで `TrendWG_Remix` フォルダに移動

2. **現在のブランチを確認**
   - フォルダ内で右クリック → **TortoiseGit** → **Switch/Checkout...**
   - `main` または `master` が選択されていることを確認
   - 違う場合は `main` を選択して **OK**

3. **最新を取得（Pull）**
   - フォルダ内で右クリック → **TortoiseGit** → **Pull...**
   - Remote: `origin`
   - Remote Branch: `main`（または `master`）
   - **OK** をクリック

4. **成功確認**
   - 「Success」と表示されればOK

---

### ⌨️ Git Bashの場合

```bash
# プロジェクトフォルダに移動
cd /c/Users/h-kiyosawa/trend_remix_app

# 現在のブランチを確認
git branch

# mainブランチに切り替え（必要な場合）
git checkout main

# リモートの最新を取得
git pull origin main
```

### 出力例

```
Already on 'main'
Your branch is up to date with 'origin/main'.
Already up to date.
```

---

## 🌿 Step 3: featureブランチを作成

### 目的

mainブランチを汚さずに、独立した作業空間を作る。

### ブランチ名の形式

```
feature/issue_<イシュー番号>_<簡単な説明>
```

**例**: Issue #42 の場合 → `feature/issue_42_add-cart-function`

---

### 🖱️ TortoiseGitの場合

1. **新しいブランチを作成**
   - フォルダ内で右クリック → **TortoiseGit** → **Create Branch...**

2. **ブランチ情報を入力**
   - **Name**: `feature/issue_42_add-cart-function`
   - **Base On**: `main` が選択されていることを確認
   - ✅ **Switch to new branch** にチェック

3. **OK をクリック**

4. **確認**
   - 右クリック → **TortoiseGit** → **Switch/Checkout** を選択
   - ダイアログに現在のブランチ名が表示されます
   - または、右クリック → **TortoiseGit** → **Show log**
     でログ画面上部にブランチ名が表示されます

---

### ⌨️ Git Bashの場合

```bash
# mainブランチにいることを確認
git branch

# 新しいブランチを作成して切り替え
git checkout -b feature/issue_42_add-cart-function

# ブランチが作成されたことを確認
git branch
```

### 出力例

```
Switched to a new branch 'feature/issue_42_add-cart-function'

* feature/issue_42_add-cart-function
  main
```

---

## 💻 Step 4: コーディング作業

### 目的

Issue で定義された機能を実装する。

### 作業内容

1. **VS Codeなどのエディタでコードを編集**
2. **必要なファイルを追加・変更・削除**
3. **動作確認**
   ```bash
   npm run dev
   ```

### 💡 コーディング中のベストプラクティス

- **こまめにコミット**: 大きな変更は分割する
- **動作確認**: コミット前に必ずテスト
- **コードフォーマット**: 保存時に自動整形されるよう設定

---

## 📦 Step 5: 変更をコミット

### 目的

作業内容をGitの履歴として記録する。

### コミットメッセージの形式

```
<タイプ>: <簡潔な説明> #<Issue番号>

<詳細説明（任意）>
```

**タイプの例:**

| タイプ   | 用途                                 |
| -------- | ------------------------------------ |
| feat     | 新機能追加                           |
| fix      | バグ修正                             |
| docs     | ドキュメント変更                     |
| style    | コードスタイル変更（動作に影響なし） |
| refactor | リファクタリング                     |
| test     | テスト追加・修正                     |
| chore    | ビルド・設定変更                     |

**例:**

```
feat: カート追加機能を実装 #42

- 商品タイルに追加ボタンを配置
- カートの状態管理をContextで実装
- ヘッダーにカート数を表示
```

---

### 🖱️ TortoiseGitの場合

1. **変更をステージング（追加）**
   - フォルダ内で右クリック → **TortoiseGit** → **Commit ->
     "feature/issue_42_..."**

2. **コミット画面で操作**
   - **Changes made**: 変更ファイル一覧が表示される
   - コミットしたいファイルに ✅ チェック
   - 新規ファイルがある場合は **All** をクリックしてすべて選択

3. **コミットメッセージを入力**
   ```
   feat: カート追加機能を実装 #42
   ```

4. **「Commit」ボタンをクリック**

5. **成功確認**
   - 「Success」と表示されればOK

---

### ⌨️ Git Bashの場合

```bash
# 変更されたファイルを確認
git status

# 変更をステージング（全ファイル）
git add .

# または特定ファイルのみ
git add app/components/CartButton.tsx

# ステージング内容を確認
git status

# コミット
git commit -m "feat: カート追加機能を実装 #42"
```

### 出力例

```
[feature/issue_42_add-cart-function 1a2b3c4] feat: カート追加機能を実装 #42
 3 files changed, 45 insertions(+), 5 deletions(-)
 create mode 100644 app/components/CartButton.tsx
```

### 💡 複数コミットする場合

作業が大きい場合は、意味のある単位で複数回コミットしましょう：

```bash
# 1回目: UIコンポーネント追加
git add app/components/CartButton.tsx
git commit -m "feat: CartButtonコンポーネントを追加 #42"

# 2回目: 状態管理の実装
git add app/contexts/CartContext.tsx
git commit -m "feat: カート状態管理を実装 #42"

# 3回目: 統合
git add app/routes/home.tsx
git commit -m "feat: CartButtonをホーム画面に統合 #42"
```

---

## 🚀 Step 6: リモートにプッシュ

### 目的

ローカルの変更をGitHub（リモート）に送信する。

---

### 🖱️ TortoiseGitの場合

1. **プッシュを実行**
   - フォルダ内で右クリック → **TortoiseGit** → **Push...**

2. **プッシュ設定を確認**
   - **Local**: `feature/issue_42_add-cart-function`
   - **Remote**: `origin`
   - **Remote Branch**: 空欄でOK（自動で同名ブランチが作成される）

3. **「OK」をクリック**

4. **認証（初回のみ）**
   - GitHubのユーザー名とパスワード（またはPersonal Access Token）を入力

5. **成功確認**
   - 「Success」と表示されればOK

---

### ⌨️ Git Bashの場合

```bash
# 初回プッシュ（リモートブランチを作成）
git push -u origin feature/issue_42_add-cart-function

# 2回目以降
git push
```

### 出力例

```
Enumerating objects: 10, done.
Counting objects: 100% (10/10), done.
Delta compression using up to 8 threads
Compressing objects: 100% (6/6), done.
Writing objects: 100% (6/6), 1.23 KiB | 1.23 MiB/s, done.
Total 6 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 2 local objects.
remote:
remote: Create a pull request for 'feature/issue_42_add-cart-function' on GitHub by visiting:
remote:      https://github.com/h-kiyosawa/TrendWG_Remix/pull/new/feature/issue_42_add-cart-function
remote:
To https://github.com/h-kiyosawa/TrendWG_Remix.git
 * [new branch]      feature/issue_42_add-cart-function -> feature/issue_42_add-cart-function
Branch 'feature/issue_42_add-cart-function' set up to track remote branch 'feature/issue_42_add-cart-function' from 'origin'.
```

---

## 🔃 Step 7: プルリクエストを作成

### 目的

コードレビューを依頼し、mainブランチへのマージを申請する。

### 手順（GitHub Webサイト）

1. **GitHubリポジトリにアクセス**
   - https://github.com/h-kiyosawa/TrendWG_Remix

2. **プルリクエスト作成画面を開く**
   - 方法A: プッシュ後に表示される **「Compare & pull request」**
     ボタンをクリック
   - 方法B: **「Pull requests」** タブ → **「New pull request」**

3. **ブランチを選択**
   - **base**: `main`（マージ先）
   - **compare**: `feature/issue_42_add-cart-function`（作業ブランチ）

4. **プルリクエストの内容を記入**

   ```markdown
   ## 概要

   カート追加機能を実装しました。

   ## 関連Issue

   Closes #42

   ## 変更内容

   - CartButtonコンポーネントを追加
   - CartContextで状態管理を実装
   - ホーム画面にカートボタンを配置

   ## テスト方法

   1. `npm run dev` で開発サーバーを起動
   2. 商品タイルの「+」ボタンをクリック
   3. ヘッダーのカート数が増えることを確認

   ## スクリーンショット

   （必要に応じて画像を添付）

   ## チェックリスト

   - [x] ローカルで動作確認済み
   - [x] コードフォーマット済み
   - [ ] レビュー依頼済み
   ```

5. **レビュアーを指定（推奨）**
   - 右側の **「Reviewers」** でチームメンバーを選択

6. **「Create pull request」をクリック**

### 💡 `Closes #42` の意味

プルリクエストがマージされると、自動的にIssue #42がクローズされます。

他のキーワード:

- `Fixes #42` - バグ修正の場合
- `Resolves #42` - 問題解決の場合

---

## 🧹 Step 8: レビュー・マージ後の後処理

### 目的

マージ完了後、ローカル環境を整理する。

---

### 🖱️ TortoiseGitの場合

1. **mainブランチに切り替え**
   - 右クリック → **TortoiseGit** → **Switch/Checkout...**
   - `main` を選択 → **OK**

2. **最新を取得**
   - 右クリック → **TortoiseGit** → **Pull...**

3. **使用済みブランチを削除**
   - 右クリック → **TortoiseGit** → **Browse References**
   - `feature/issue_42_add-cart-function` を右クリック
   - **Delete Branch** → 確認で **はい**

---

### ⌨️ Git Bashの場合

```bash
# mainブランチに切り替え
git checkout main

# 最新を取得
git pull origin main

# マージ済みブランチを確認
git branch --merged

# ローカルのfeatureブランチを削除
git branch -d feature/issue_42_add-cart-function

# リモートのブランチも削除（GitHub上で削除されていない場合）
git push origin --delete feature/issue_42_add-cart-function
```

---

## ❓ トラブルシューティング

### Q1: プッシュ時に「rejected」エラーが出る

**原因**: リモートブランチが更新されている

**解決方法:**

```bash
# リモートの変更を取り込んでからプッシュ
git pull origin main --rebase
git push
```

### Q2: コンフリクト（競合）が発生した

**原因**: 同じファイルが複数人で編集された

**解決方法（Git Bash）:**

```bash
# mainの最新を取り込む
git fetch origin
git merge origin/main

# コンフリクトしたファイルを手動で編集
# <<<<<<< HEAD ... ======= ... >>>>>>> の部分を修正

# 解決したファイルをステージング
git add <解決したファイル>

# マージを完了
git commit -m "Merge conflict resolved"
```

**解決方法（TortoiseGit）:**

1. 右クリック → **TortoiseGit** → **Resolve...**
2. コンフリクトしたファイルをダブルクリック
3. マージエディタで手動修正
4. 保存 → **Mark as resolved**

### Q3: 間違ったブランチにコミットしてしまった

**解決方法:**

```bash
# 直前のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# 正しいブランチに切り替え
git checkout feature/issue_XX_correct-branch

# 再度コミット
git add .
git commit -m "正しいメッセージ"
```

### Q4: コミットメッセージを間違えた

**解決方法:**

```bash
# 直前のコミットメッセージを修正
git commit --amend -m "正しいメッセージ #42"
```

### Q5: Personal Access Tokenの作成方法

1. GitHub → **Settings** → **Developer settings**
2. **Personal access tokens** → **Tokens (classic)**
3. **Generate new token**
4. Note: `TortoiseGit` など識別名を入力
5. Expiration: 期限を選択
6. Select scopes: `repo` にチェック
7. **Generate token**
8. トークンをコピーして安全な場所に保存

---

## 📚 参考リンク

- [Git公式ドキュメント](https://git-scm.com/doc)
- [GitHub Flow ガイド](https://docs.github.com/ja/get-started/quickstart/github-flow)
- [TortoiseGit マニュアル](https://tortoisegit.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/ja/)

---

**最終更新**: 2025年12月1日
