学生向け掲示板アプリ（MVP）

## Getting Started

### セットアップ

- **環境変数**: `.env.example` を `.env.local` にコピーして、Clerkキーを設定
- **起動**:

```bash
npm i
npm run dev
```

### ルーティング（現時点）

- **`/`**: ランディング
- **`/sign-up`**: 大学ドメイン選択 → メールコード認証のカスタム登録
- **`/sign-in`**: Clerk標準サインイン
- **`/profile/setup`**: 認証後のプロフィール作成（次タスクでDB保存を実装）
- **`/boards` `/circles` `/jobs`**: 画面の土台（次タスクでDB/APIと接続）

### 大学ドメイン

`src/lib/universities.ts` の `UNIVERSITIES` を編集して追加できます（後でDB化します）。

## Dev Notes

Next.js(App Router, TypeScript) + Tailwind + shadcn/ui + Clerk を前提にしています。
