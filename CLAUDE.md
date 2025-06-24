## プロジェクト概要
Next.js 15 (App Router)、React 19、TypeScript、Tailwind CSS v4で構築された習慣記録フロントエンドアプリケーション。アプリ名は「Habit Log」。英語と日本語の国際化対応機能あり。

## 必須コマンド
```bash
# 開発
pnpm run dev          # Turbopackで開発サーバーを起動 http://localhost:3000

# ビルド & 本番環境
pnpm run build        # 最適化された本番ビルドを作成
pnpm run start        # 本番サーバーを起動

# コード品質
pnpm biome check --write     # コードベース全体をフォーマット・リント
pnpm biome check --write <file>  # 特定のファイルをフォーマット・リント
pnpm tsc --noEmit # TypeScriptのエラーチェック

# テスト
pnpm test                    # Jestでテストを実行
```

## コード品質ツール
- **Biome**: リントとフォーマットの両方に使用
  - Lefthookのpre-commitフックでステージングされたファイルに自動実行
  - コミット前に実行してコード品質を確保
- **Jest**: JavaScript/TypeScriptテストフレームワーク
  - ユニットテストとインテグレーションテストに使用
  - `pnpm test` でテストスイートを実行

## アーキテクチャ & 主要パターン

### ディレクトリ構造
- `/src/app/`: Next.js App Routerのページとレイアウト
- `/src/actions/`: サーバーアクション（例：ロケール切り替え）
- `/src/components/`: 再利用可能なReactコンポーネント
- `/src/i18n/`: 国際化の設定とメッセージ
- `/src/lib/`: ユーティリティ関数と共有コード
- `/types/`: TypeScript型定義
- `@/*` パスエイリアスは `/src/*` にマップ

### 国際化 (i18n)
- サーバー側とクライアント側の翻訳に `next-intl` を使用
- サポートロケール: `en-US` (英語) と `ja-JP` (日本語)
- デフォルトロケール: `ja-JP`
- メッセージは `/src/i18n/messages/{locale}.json` に保存
- サーバーアクションはロケール設定をクッキーで永続化
- コンポーネントは `useTranslations` フックで翻訳にアクセス可能

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

## 開発ワークフロー
1. **作業開始前**: `pnpm install` を実行して依存関係を最新に保つ
2. **開発中**: `pnpm run dev` でホットリロードを使用
3. **コミット前**: Lefthookがステージングされたファイルに自動でBiomeを実行
4. **手動フォーマット**: ファイルやディレクトリに `pnpm biome check --write` を実行

## Git コミット規則
- **コミットメッセージは日本語で記載**
- 変更内容を簡潔かつ明確に記述
- 例: `機能追加: ユーザー認証機能の実装`、`バグ修正: ロケール切り替え時のエラーを解消`

## 重要な技術的詳細
- **React Server Components**: デフォルトのコンポーネントはサーバーコンポーネント; クライアントコンポーネントには `"use client"` ディレクティブを使用
- **TypeScript**: strictモードが有効; すべてのコードに適切な型付けを確保
- **Next.js設定**: `next.config.ts` のカスタム設定にはi18nプラグイン設定を含む
- **環境**: pnpmパッケージマネージャーでの開発をサポート