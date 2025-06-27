## プロジェクト概要
Next.js 15 (App Router)、React 19、TypeScript、Tailwind CSS v4で構築された習慣記録フロントエンドアプリケーション。アプリ名は「Habit Log」。英語と日本語の国際化対応機能あり。

## 必須コマンド
```bash
# 開発
pnpm run dev # Turbopackで開発サーバーを起動 http://localhost:3000

# ビルド & 本番環境
pnpm run build # 最適化された本番ビルドを作成
pnpm run start # 本番サーバーを起動

# コード品質
pnpm lint # コードベース全体をリント
pnpm format # コードベース全体をリント・フォーマット
pnpm tsc --noEmit # TypeScriptのエラーチェック

# テスト
pnpm test # Jestでテストを実行
```

## アーキテクチャ & 主要パターン

### ディレクトリ構造
プロジェクトは機能ベースアーキテクチャを採用:
- `/src/app/`: Next.js App Routerのページとレイアウト
- `/src/config/`: アプリケーション設定
- `/src/features/`: 機能ベースモジュール
  - `/i18n/`: 国際化機能（設定、メッセージ、テスト）
  - `/landing-page/`: ランディングページ機能とそのコンポーネント
- `/src/hooks/`: カスタムReactフック
- `/src/lib/`: ユーティリティ関数と共有コード
- `/src/styles/`: グローバルスタイル
- `/src/ui/`: UIコンポーネントライブラリ（shadcn/ui）
- `/types/`: グローバルTypeScript型定義
- `/__mocks__/`: テスト用モックファイル
- `/docs/`: プロジェクトドキュメント
- `/public/`: 静的アセット（PWAアイコン等）
- `@/*`: パスエイリアスは `/src/*` にマップ

### スタイリング & UIコンポーネント
- スタイリングにTailwind CSS v4を使用
- コンポーネントは基本的に`shadcn/ui`を利用
- コンポーネントのバリアントは `class-variance-authority` (cva) で管理
- アイコンは `lucide-react` を利用
- ユーティリティクラスは `clsx` とカスタム `cn()` ヘルパーで結合

### フォーム処理
- フォームは `@conform-to/react` と `@conform-to/zod` でバリデーション
- サーバーアクションがフォーム送信を処理
- Zodスキーマによる型安全なフォーム処理

### 国際化 (i18n)
- サーバー側とクライアント側の翻訳に `next-intl` を使用
- サポートロケール: `en-US` (英語) と `ja-JP` (日本語)
- デフォルトロケール: `ja-JP`
- メッセージは `/src/features/i18n/messages/{locale}.json` に保存
- サーバーアクションはロケール設定をクッキーで永続化
- コンポーネントは `useTranslations` フックで翻訳にアクセス可能

## 開発手順
- 常にContext7 MCPを使って最新の公式ドキュメントを参照する
- コーディングルールは`docs/coding-rule.md`に従う
- Unit Testルールは`docs/unit-test-rule.md`に従う
- 実装後はPlaywright MCPで実装した機能を一通り試してエラーがないか確認する

## 重要な技術的詳細
- **React Server Components**: デフォルトのコンポーネントはサーバーコンポーネント; クライアントコンポーネントには `"use client"` ディレクティブを使用
- **TypeScript**: strictモードが有効; すべてのコードに適切な型付けを確保
- **Next.js設定**: `next.config.ts` のカスタム設定にはi18nプラグイン設定を含む
- **環境**: pnpmパッケージマネージャーでの開発をサポート